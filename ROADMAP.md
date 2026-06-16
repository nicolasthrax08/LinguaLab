# LinguaLab — 7-Day Hackathon Roadmap

**Goal:** Ship a working, demoable MVP of a cross-cultural communication coach for international students.
**Team:** 3 students, 1 week.
**Deadline:** USAII Global AI Hackathon 2026 submission.

---

## Team Roles

| Role | Owner | Responsibility |
|------|-------|----------------|
| **AI Architect** | 1 person | Prompt engineering, API integration, feedback pipeline, guardrails |
| **Full-Stack Developer** | 1 person | Next.js frontend, API routes, Supabase schema, deployment |
| **Product / Demo Lead** | 1 person | PRD, UX copy, demo script, video, Devpost submission, QA coordination |

*Everyone reviews the PRD and AI behavior doc before writing code.*

---

## 7-Day Schedule

### Day 1 — Setup & Scope Lock
- [ ] Finalize PRD and AI behavior document (Product Lead).
- [ ] Set up Next.js 14 + Tailwind + Supabase project scaffold (Full-Stack).
- [ ] Verify Gemini API and OpenRouter free-tier access; test basic prompt calls (AI Architect).
- [ ] Define data models: user profiles, sessions, messages, feedback items (all).
- [ ] **Deliverable:** Running “hello world” web app + API test.

### Day 2 — Core Chat & Scenario Engine
- [ ] Build scenario selection screen and onboarding flow (Full-Stack).
- [ ] Implement chat UI (messages, input, history) (Full-Stack).
- [ ] Draft system prompts for 3 MVP scenarios: Office Hours, Presentation Q&A, Group Conflict (AI Architect).
- [ ] Wire frontend to backend chat endpoint (Full-Stack + AI Architect).
- [ ] **Deliverable:** User can select a scenario and have a multi-turn text conversation.

### Day 3 — Feedback Pipeline
- [ ] Implement three-layer feedback generation: language, formality, cultural note (AI Architect).
- [ ] Add “Why?” explanation expansion logic (AI Architect).
- [ ] Build feedback panel UI (Full-Stack).
- [ ] Store feedback in Supabase tied to messages (Full-Stack).
- [ ] **Deliverable:** After a conversation, user sees structured feedback with rationales.

### Day 4 — User Control & Preferences
- [ ] Add proficiency level selector (Beginner / Intermediate / Advanced) (Full-Stack).
- [ ] Add English variety selector (e.g., Indian, British, Singaporean, General American) (Full-Stack).
- [ ] Implement accept/dismiss feedback controls (Full-Stack).
- [ ] Add tone/variety instructions into prompts (AI Architect).
- [ ] **Deliverable:** Feedback respects user settings; users can override suggestions.

### Day 5 — Message Rewrite Mode & Polish
- [ ] Build “Message Rewrite” screen: paste draft, choose tone/directness, get revised version (Full-Stack).
- [ ] Implement rewrite prompts with cultural notes (AI Architect).
- [ ] Responsive design pass; mobile-first adjustments (Full-Stack).
- [ ] Add session history dashboard (Full-Stack).
- [ ] **Deliverable:** Both Practice Mode and Rewrite Mode work end-to-end.

### Day 6 — Integration, Testing & Fallbacks
- [ ] Add OpenRouter fallback if Gemini rate-limits (AI Architect).
- [ ] End-to-end testing across all 3 scenarios and rewrite mode (Product Lead).
- [ ] Fix critical bugs; optimize prompts for latency and quality (AI Architect).
- [ ] Prepare demo storyboard and record first draft video (Product Lead).
- [ ] **Deliverable:** Stable deployed URL + first draft demo video.

### Day 7 — Final Demo & Submission
- [ ] Record final 3-minute demo video (Product Lead).
- [ ] Write Devpost description, GitHub README, and screenshots (Product Lead).
- [ ] Final deployment check; verify live URL works on mobile and desktop (Full-Stack).
- [ ] Submit to Devpost before deadline (all).
- [ ] **Deliverable:** Complete submission with live app, video, repo, and docs.

---

## Daily Rituals

- **Morning standup:** 10 min sync on blockers and today’s focus.
- **End-of-day check-in:** 10 min demo of what shipped and what moved to tomorrow.
- **Shared decision log:** Any scope change is written in `DECISIONS.md` with owner and reason.

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| API rate limits | OpenRouter fallback; cache common prompts; demo with local test data if needed |
| Prompt instability | Version prompts in `AI_BEHAVIOR.md`; run 3 sample conversations before locking |
| Scope creep | Strict MVP: 3 scenarios + rewrite mode only. Anything else goes to `FUTURE.md` |
| Demo URL failure | Deploy early (Day 6); keep a recorded backup walkthrough |
| Team bandwidth imbalance | Daily standups; one person can own the demo video while others stabilize code |

---

## Definition of Done

- [ ] Live URL accessible on mobile and desktop.
- [ ] User can complete one full practice scenario with feedback.
- [ ] User can use Message Rewrite mode.
- [ ] Demo video ≤ 3 minutes covers problem, live walkthrough, and responsible AI.
- [ ] Devpost submission includes repo, screenshots, and live URL.
