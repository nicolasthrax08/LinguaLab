/**
 * OpenRouter client wrapper for LinguaLab.
 *
 * Replaces the Gemini SDK with plain fetch calls to OpenRouter's chat
 * completions endpoint. Uses the owl-alpha model by default.
 */

const API_BASE = "https://openrouter.ai/api/v1";
const MODEL_NAME = "openrouter/owl-alpha";

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }
  return key;
}

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

async function callOpenRouter(messages: OpenRouterMessage[]): Promise<string> {
  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
      // OpenRouter recommends these headers for rankings / rate-limit visibility.
      "HTTP-Referer": process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000",
      "X-Title": "LinguaLab",
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages,
      temperature: 0.7,
    }),
  });

  const data = (await res.json()) as OpenRouterResponse;

  if (!res.ok) {
    const errorMessage =
      data?.error?.message || `OpenRouter request failed (${res.status})`;
    throw new Error(errorMessage);
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenRouter returned an empty response");
  }

  return content.trim();
}

/**
 * Generate a plain-text assistant reply.
 */
export async function generateText(
  systemPrompt: string,
  messages: { role: "user" | "model"; content: string }[]
): Promise<string> {
  const openRouterMessages: OpenRouterMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    })),
  ];

  return callOpenRouter(openRouterMessages);
}

/**
 * Generate a structured JSON response and parse it.
 */
export async function generateJson<T>(
  systemPrompt: string,
  userPrompt: string
): Promise<T> {
  const openRouterMessages: OpenRouterMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const text = await callOpenRouter(openRouterMessages);

  // Strip accidental markdown fences.
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(cleaned) as T;
}
