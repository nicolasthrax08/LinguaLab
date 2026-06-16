# LinguaLab — Technical Specification

**Stack:** Next.js 14 + Tailwind CSS + Supabase + Google Gemini API + OpenRouter fallback

---

## 1. Architecture

```
User → Next.js (Vercel) → API Route
                              ├──→ Gemini API (conversation + feedback)
                              ├──→ OpenRouter (fallback)
                              └──→ Supabase (auth + data)
```

---

## 2. Data Model

### Tables

**profiles**
- `id` (uuid, PK)
- `proficiency_level` (text: beginner, intermediate, advanced)
- `english_variety` (text)
- `created_at`

**sessions**
- `id` (uuid, PK)
- `user_id` (uuid, FK)
- `scenario_id` (text)
- `scenario_name` (text)
- `created_at`

**messages**
- `id` (uuid, PK)
- `session_id` (uuid, FK)
- `role` (text: user, assistant)
- `content` (text)
- `created_at`

**feedback_items**
- `id` (uuid, PK)
- `message_id` (uuid, FK)
- `type` (text: language, formality, cultural)
- `target_phrase` (text)
- `suggestion` (text)
- `why` (text)
- `severity` (text)
- `accepted` (boolean, nullable)
- `created_at`

---

## 3. API Endpoints

### `POST /api/chat`
**Request:**
```json
{
  "session_id": "...",
  "scenario_id": "office_hours",
  "proficiency": "intermediate",
  "variety": "indian",
  "message": "I need more time for the assignment.",
  "history": [...]
}
```

**Response:**
```json
{
  "assistant_message": "...",
  "feedback": [...]
}
```

### `POST /api/rewrite`
**Request:**
```json
{
  "draft": "Hey, you didn't do your part. What's going on?",
  "tone": "soft",
  "context": "whatsapp_group"
}
```

**Response:**
```json
{
  "original": "...",
  "revised": "...",
  "changes": [...],
  "cultural_note": "..."
}
```

### `GET /api/sessions/[id]`
Retrieve session history and feedback for the dashboard.

---

## 4. Prompt Pipeline

### Chat flow
1. Build system prompt with scenario, role, proficiency, variety, and guardrails.
2. Append conversation history.
3. Call LLM for assistant reply (streaming optional, text-only for MVP).
4. Call LLM again with feedback schema to generate structured feedback.
5. Store both assistant message and feedback items in Supabase.

### Rewrite flow
1. Single prompt with draft, tone, context, and output schema.
2. Return revised text + change list + cultural note.

---

## 5. Error Handling & Fallbacks

- **Gemini rate limit / failure:** Retry once, then route to OpenRouter (Llama 3.3 70B).
- **Malformed JSON response:** Retry with stronger schema instruction; if still failing, return a friendly generic message.
- **No response from LLM:** Show a graceful offline message and prompt user to retry.

---

## 6. Deployment

- **Frontend + serverless API:** Vercel Hobby tier.
- **Database + auth:** Supabase free tier.
- **Environment variables:**
  - `GEMINI_API_KEY`
  - `OPENROUTER_API_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- **Demo URL:** Deployed by Day 6 and kept stable through judging.

---

## 7. Security & Privacy Notes

- No real PII required; email-only auth via Supabase.
- Conversation data stored in Supabase; no third-party analytics in MVP.
- Users can delete their own session history.
