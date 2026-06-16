"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatBubble } from "@/components/ChatBubble";
import { MessageInput } from "@/components/MessageInput";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { SCENARIOS } from "@/lib/prompts";
import { ChatMessage, FeedbackItem, ScenarioId } from "@/types";
import Link from "next/link";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <main className="flex h-screen items-center justify-center bg-soft-bg">
          <p className="text-soft-muted">Loading chat…</p>
        </main>
      }
    >
      <ChatPageInner />
    </Suspense>
  );
}

function ChatPageInner() {
  const searchParams = useSearchParams();
  const scenarioId = (searchParams.get("scenario") || "office_hours") as ScenarioId;
  const proficiency = searchParams.get("proficiency") || "intermediate";
  const variety = searchParams.get("variety") || "general-american";
  const sessionId = searchParams.get("session") || undefined;
  const profileId = searchParams.get("profile") || undefined;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS[scenarioId];

  // Scroll to the latest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, feedback]);

  const sendMessage = async (userMessage: string) => {
    setLoading(true);
    setError(null);

    const nextHistory: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(nextHistory);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          profile_id: profileId,
          scenario_id: scenarioId,
          proficiency,
          variety,
          message: userMessage,
          history: messages,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong");
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.assistant_message },
      ]);
      setFeedback(data.feedback || []);

      // Remember IDs returned from the server for future persistence.
      if (data.session_id) {
        localStorage.setItem("lingualab-session-id", data.session_id);
      }
      if (data.profile_id) {
        localStorage.setItem("lingualab-profile-id", data.profile_id);
      }
    } catch (err) {
      console.error("[Chat] send error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not reach the coach. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen flex-col bg-soft-bg">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-soft-border bg-white px-4 py-3 shadow-sm">
        <div>
          <h1 className="text-base font-semibold text-slate-900">
            {scenario.name}
          </h1>
          <p className="text-xs text-soft-muted">
            {scenario.role} • {proficiency} • {variety.replace("-", " ")}
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-soft-border px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Exit
        </Link>
      </header>

      {/* Scenario context */}
      <div className="bg-primary-50 px-4 py-2 text-center text-xs text-primary-900">
        {scenario.context}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-soft-muted">
              Start the conversation. The AI is playing the role of{" "}
              <span className="font-medium">{scenario.role}</span>.
            </p>
          )}
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg} />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-none bg-white px-5 py-3 text-sm text-soft-muted shadow-sm">
                The coach is thinking…
              </div>
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
              {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Feedback panel */}
      <FeedbackPanel feedback={feedback} />

      {/* Input area */}
      <div className="border-t border-soft-border bg-white">
        <MessageInput onSend={sendMessage} disabled={loading} />
      </div>
    </main>
  );
}
