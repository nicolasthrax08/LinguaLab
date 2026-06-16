/**
 * POST /api/chat
 *
 * Handles a single practice turn:
 *  1. Generates the AI role-play reply using Gemini.
 *  2. Generates structured three-layer feedback using Gemini + JSON schema.
 *  3. Persists messages and feedback in Supabase (if configured).
 *  4. Returns { assistant_message, feedback, session_id, message_id }.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  buildAssistantSystemPrompt,
  buildFeedbackSystemPrompt,
  FALLBACK_FEEDBACK,
} from "@/lib/prompts";
import { generateJson, generateText } from "@/lib/gemini";
import { createServerClient } from "@/lib/supabase";
import {
  ChatMessage,
  ChatPayload,
  ChatResponse,
  FeedbackItem,
  ScenarioId,
} from "@/types";

export async function POST(request: NextRequest) {
  let payload: ChatPayload;

  try {
    payload = (await request.json()) as ChatPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const {
    scenario_id,
    proficiency,
    variety,
    message,
    history = [],
  } = payload;

  if (!scenario_id || !proficiency || !variety || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Optional demo/mock mode: returns a canned reply when MOCK_CHAT=true.
    // Useful for hackathon demos if the Gemini free-tier quota runs out.
    if (process.env.MOCK_CHAT === "true") {
      const mockResponse = getMockResponse(scenario_id, message);
      return NextResponse.json(mockResponse);
    }

    // 1. Build conversation history for the role-play model.
    const assistantHistory: { role: "user" | "model"; content: string }[] = [
      ...history.map((m: ChatMessage) => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const assistantSystemPrompt = buildAssistantSystemPrompt(
      scenario_id,
      proficiency,
      variety
    );

    const assistantMessage = await generateText(
      assistantSystemPrompt,
      assistantHistory
    );

    // 2. Generate structured feedback on the user's message.
    const feedbackSystemPrompt = buildFeedbackSystemPrompt(
      scenario_id,
      proficiency,
      variety
    );

    const feedbackUserPrompt = `User message:\n"""\n${message}\n"""\n\nReturn feedback JSON.`;

    let feedback: FeedbackItem[];
    try {
      const parsed = await generateJson<{ feedback: FeedbackItem[] }>(
        feedbackSystemPrompt,
        feedbackUserPrompt
      );
      feedback = Array.isArray(parsed?.feedback) ? parsed.feedback : FALLBACK_FEEDBACK;
    } catch (feedbackErr) {
      console.warn("[api/chat] Feedback parse failed, using fallback:", feedbackErr);
      feedback = FALLBACK_FEEDBACK;
    }

    // 3. Persist to Supabase when credentials are configured.
    const response: ChatResponse = {
      assistant_message: assistantMessage,
      feedback,
    };

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createServerClient();

      // Ensure profile exists (idempotent upsert for guest users).
      let profileId = payload.profile_id;
      if (!profileId) {
        const { data: profile } = await supabase
          .from("profiles")
          .insert({
            proficiency_level: proficiency,
            english_variety: variety,
          })
          .select("id")
          .single();
        profileId = profile?.id;
        response.profile_id = profileId;
      }

      // Ensure session exists.
      let sessionId = payload.session_id;
      if (!sessionId && profileId) {
        const { data: session } = await supabase
          .from("sessions")
          .insert({
            user_id: profileId,
            scenario_id,
            scenario_name: scenario_id,
          })
          .select("id")
          .single();
        sessionId = session?.id;
      }

      if (sessionId) {
        response.session_id = sessionId;

        // Store user message.
        const { data: userMsg } = await supabase
          .from("messages")
          .insert({ session_id: sessionId, role: "user", content: message })
          .select("id")
          .single();

        // Store assistant message.
        await supabase
          .from("messages")
          .insert({
            session_id: sessionId,
            role: "assistant",
            content: assistantMessage,
          });

        // Store feedback items tied to the user message.
        if (userMsg?.id && feedback.length > 0) {
          const feedbackRows = feedback.map((item) => ({
            message_id: userMsg.id,
            type: item.type,
            target_phrase: item.target_phrase || null,
            suggestion: item.suggestion || null,
            observation: item.observation || null,
            note: item.note || null,
            why: item.why,
            severity: item.severity,
            accepted: null,
          }));

          await supabase.from("feedback_items").insert(feedbackRows);
          response.message_id = userMsg.id;
        }
      }
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error("[api/chat] Error:", err);

    const message =
      err instanceof Error ? err.message : "Internal server error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * Returns a deterministic mock response for demo / offline testing.
 * Mirrors the shape returned by the live Gemini pipeline.
 */
function getMockResponse(scenarioId: ScenarioId, userMessage: string): ChatResponse {
  const lowered = userMessage.toLowerCase();

  let assistant_message = "Could you tell me a bit more about your situation?";
  if (lowered.includes("extension") || lowered.includes("more time")) {
    assistant_message =
      "I understand. When do you think you can realistically submit it?";
  } else if (lowered.includes("exam") || lowered.includes("busy")) {
    assistant_message =
      "That makes sense. Proposing a specific deadline usually helps. What date works for you?";
  } else if (lowered.includes("friday")) {
    assistant_message =
      "Friday works. Please send me a brief email confirming the new deadline.";
  }

  const feedback: FeedbackItem[] = [
    {
      type: "language",
      target_phrase: userMessage.slice(0, 40),
      suggestion: "I was wondering if I could have a bit more time.",
      why:
        "Adding 'I was wondering if' softens the request, which is common in U.S. professor interactions.",
      severity: "minor",
    },
    {
      type: "formality",
      observation:
        "Tone is appropriate for office hours but slightly urgent.",
      why:
        "Using 'need' directly can sound demanding. A modal verb like 'could' sounds more polite.",
      severity: "tip",
    },
    {
      type: "cultural",
      note:
        "In U.S. academic culture, bringing a specific plan ('I can submit by Friday') strengthens your request.",
      why:
        "Professors often respond better when the student proposes a solution rather than only asking for relief.",
      severity: "insight",
    },
  ];

  if (scenarioId === "presentation_qa") {
    assistant_message = "That's an interesting point. Can you expand on how you arrived at that conclusion?";
    feedback[2].note =
      "In Q&A settings, briefly acknowledging the questioner's perspective before answering builds rapport.";
    feedback[2].why =
      "Listeners respond well when speakers show they have considered alternative angles.";
  }

  if (scenarioId === "group_conflict") {
    assistant_message = "Sorry, things have been hectic on my end. How can we get back on track?";
    feedback[2].note =
      "In group conflicts, naming the problem and then asking for the other person's perspective keeps the door open.";
    feedback[2].why =
      "Collaborative problem-solving is usually more effective than blame in U.S. classroom culture.";
  }

  return {
    assistant_message,
    feedback,
  };
}
