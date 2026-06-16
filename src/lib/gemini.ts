/**
 * Gemini client wrapper for LinguaLab.
 *
 * Uses the @google/generative-ai Node SDK. A single instance is created from
 * GEMINI_API_KEY. The model name is hard-coded to gemini-1.5-flash for the
 * free/speed tier appropriate for hackathon demos.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

// We create the client lazily so missing env vars don't crash Next.js builds.
function getGeminiClient() {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenerativeAI(apiKey);
}

const MODEL_NAME = "gemini-2.0-flash";

export async function generateText(
  systemPrompt: string,
  messages: { role: "user" | "model"; content: string }[]
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: systemPrompt,
  });

  // Gemini expects alternating user/model turns; the latest user message is
  // already in the messages array.
  const geminiHistory = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const latest = messages[messages.length - 1];
  const chat = model.startChat({
    history: geminiHistory,
  });

  const result = await chat.sendMessage(latest.content);
  const response = await result.response;
  const text = response.text();

  return text.trim();
}

export async function generateJson<T>(
  systemPrompt: string,
  userPrompt: string
): Promise<T> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(userPrompt);
  const text = (await result.response).text();

  // Strip accidental markdown fences.
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(cleaned) as T;
}
