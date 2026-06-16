# LinguaLab

AI communication coach for international students.
Practice high-stakes academic conversations with culturally-aware feedback.

Built for the USAII Global AI Hackathon 2026.

## What it does

- Role-play scenarios: Office Hours, Presentation Q&A, Group Project Conflict
- Get structured feedback: Language, Formality, Cultural Note
- Transparent “Why?” explanations and user control
- Guest / anonymous sessions (no external auth for MVP)

## Tech Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Supabase (client + server)
- Google Gemini API (`@google/generative-ai`)

## Setup

1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in your keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
4. Run the SQL migration `supabase/migrations/001_initial.sql` in your Supabase SQL Editor
5. `npm run dev`
6. Open `http://localhost:3000`

## Demo mode

If your Gemini API quota is exceeded during a demo, set `MOCK_CHAT=true` in `.env.local` to return deterministic mock replies and feedback.

## Project structure

- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — Reusable UI components
- `src/lib/` — Supabase clients, Gemini wrapper, prompts
- `src/types/` — Shared TypeScript types
- `supabase/migrations/` — Database schema
