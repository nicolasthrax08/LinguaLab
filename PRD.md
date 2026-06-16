# LinguaLab — Product Requirements Document (PRD)

**Status:** Draft for hackathon MVP  
**Last updated:** 2026-06-16  
**Owner:** Product / Demo Lead

---

## 1. Problem Statement

International and multilingual students often struggle with the *unwritten rules* of high-stakes academic and early-career conversations: how to ask a professor for an extension, push back in a group project, or handle a Q&A session. They know the grammar, but not the cultural tone. Existing tools (Grammarly, Duolingo, generic chatbots) focus on writing or general language, not on situated, culturally calibrated communication practice.

---

## 2. Target User

- **Primary:** International undergraduate/graduate students in English-medium or multilingual programs.
- **Secondary:** Exchange participants, peer tutors, and early-career applicants preparing for interviews or workplace communication.

**User assumptions:**
- They have solid reading/writing skills but freeze in spoken or high-stakes interactions.
- They use their phone or laptop for quick practice between classes.
- They want to understand *why* a phrasing is better, not just what is correct.

---

## 3. Value Proposition

> A low-pressure AI practice space where international students rehearse real academic and professional conversations, get structured feedback, and learn the cultural reasoning behind every suggestion.

---

## 4. MVP Features

### Must Have (MVP)
1. **Scenario selection:** 3 pre-built scenarios — Office Hours, Presentation Q&A, Group Project Conflict.
2. **Role-play chat:** Text-based conversation where the AI plays a professor, classmate, or interviewer.
3. **Three-layer feedback:** After each exchange, show:
   - Language correction / clarity note
   - Formality calibration
   - Cultural note with alternative phrasing
4. **“Why?” explanations:** Expandable rationale for every feedback point.
5. **User control:** Accept/dismiss feedback; set proficiency level and English variety.
6. **Message Rewrite mode:** Paste a draft message, choose tone/directness, get a revised version with cultural notes.
7. **Session history:** Store conversations and feedback for review.

### Should Have (if time permits)
- Export conversation transcript as text.
- One additional scenario (e.g., networking event, internship interview).
- Progress summary across sessions.

### Won’t Have (MVP)
- Real-time voice or speech-to-text.
- User accounts with social features.
- Mobile native app (responsive web only).
- Integration with LMS/calendar platforms.

---

## 5. User Stories

- As an international student, I want to practice asking my professor for an extension so I can do it confidently in real life.
- As a non-native speaker, I want to know *why* a phrasing sounds too direct so I can adapt it myself next time.
- As a student from India, I want the AI to respect my dialect while helping me communicate in a U.S. academic context.
- As a busy student, I want to rewrite a WhatsApp message to my group before sending it.

---

## 6. Responsible AI Requirements

These are **product features**, not afterthoughts.

### Bias / Fairness
- The system must not penalize valid non-native English varieties.
- Feedback must focus on *clarity in context*, not on accent or identity.
- Avoid stereotypes; cultural notes are framed as “common tendencies,” not rules.

### Transparency
- Every AI suggestion must show a “Why?” rationale.
- Feedback is labeled as correction, explanation, or cultural note.
- The AI cites the scenario context and cultural convention it is responding to.

### User Control
- All generated text is editable.
- Users can accept or dismiss any feedback item.
- Users can set proficiency level, English variety, and feedback granularity.
- The AI is never the final author; the user is.

---

## 7. Success Metrics (for hackathon)

- **Usability:** A first-time user can complete a scenario and receive feedback in under 3 minutes.
- **Demo clarity:** The 3-minute video clearly shows problem, solution, live usage, and responsible AI.
- **Technical stability:** Live URL works without crashes during the demo.
- **Responsible AI visibility:** At least one demo moment shows bias/fairness, transparency, and user control each.

---

## 8. Open Questions / Decisions

| Question | Decision | Owner | Date |
|----------|----------|-------|------|
| Which LLM provider for MVP? | Gemini primary, OpenRouter fallback | AI Architect | Day 1 |
| How many English varieties to list? | 5: General American, British, Indian, Singaporean, Nigerian | Product Lead | Day 2 |
| Do we store user data across sessions? | Yes, anonymized session history in Supabase | Full-Stack | Day 1 |
| Do we support languages other than English? | Out of scope for MVP; note future EN/FR/ZH expansion | Product Lead | Day 1 |
