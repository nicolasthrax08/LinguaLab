/**
 * Shared TypeScript types for LinguaLab.
 */

export type Proficiency = "beginner" | "intermediate" | "advanced";

export type EnglishVariety =
  | "general-american"
  | "british"
  | "indian"
  | "singaporean"
  | "nigerian";

export type ScenarioId = "office_hours" | "presentation_qa" | "group_conflict";

export type FeedbackType = "language" | "formality" | "cultural";
export type Severity = "minor" | "tip" | "insight" | "important";

export interface Scenario {
  id: ScenarioId;
  name: string;
  role: string;
  goal: string;
  tension: string;
  success: string;
  context: string; // 1-2 sentence setup shown before chat
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface FeedbackItem {
  type: FeedbackType;
  // language feedback
  target_phrase?: string;
  suggestion?: string;
  // formality feedback
  observation?: string;
  // cultural feedback
  note?: string;
  // common
  why: string;
  severity: Severity;
  accepted?: boolean | null;
}

export interface ChatPayload {
  session_id?: string;
  profile_id?: string;
  scenario_id: ScenarioId;
  proficiency: Proficiency;
  variety: EnglishVariety;
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  assistant_message: string;
  feedback: FeedbackItem[];
  session_id?: string;
  message_id?: string;
  profile_id?: string;
}
