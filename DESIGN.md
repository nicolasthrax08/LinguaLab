# LinguaLab — UI/UX Design Notes

**Design principle:** Calm, accessible, student-friendly. The interface should feel like a tutor, not a test.

---

## 1. Visual Identity

- **Colors:** Soft blue/white primary, warm accent for feedback, neutral grays for text.
- **Typography:** Clean sans-serif (Inter or system-ui), readable at 16px base.
- **Mood:** Encouraging, not clinical. Avoid red “error” styling for minor corrections; use gentle highlights.

---

## 2. Key Screens

### Landing Page
- Headline: “Practice the conversations that matter.”
- Subheadline: “Rehearse office hours, presentations, and group conflicts with AI feedback.”
- CTA: “Try a scenario” → goes to onboarding.
- Footer: “Built for the USAII Global AI Hackathon 2026.”

### Onboarding
- Step 1: Select English variety (dropdown).
- Step 2: Select proficiency level (radio buttons).
- Step 3: Choose scenario (cards with icons).
- Step 4: Brief scenario context (1–2 sentences).

### Chat Screen
- Left side: scenario context and exit button.
- Center: chat bubbles (user right, AI left).
- Bottom: text input + send button.
- Top bar: current scenario + settings.

### Feedback Panel
- Slide-in or bottom panel.
- Tabs or stacked cards: Language / Formality / Cultural.
- Each card has: target phrase, suggestion, severity badge, “Why?” expand button, accept/dismiss icons.

### Message Rewrite Screen
- Two columns on desktop, stacked on mobile:
  - Left: input draft + tone/context selectors + submit.
  - Right: revised output + change list + cultural note.
- “Copy to clipboard” button.

### Session History Dashboard
- List of past sessions with scenario name and date.
- Tap to review conversation and feedback.

---

## 3. Interaction Details

- **Feedback accept/dismiss:** Clicking dismiss grays out the card and stores the preference.
- **“Why?” expansion:** Smooth accordion; no page reload.
- **Rewrite mode:** Default tone is “balanced”; show 3 options: Direct, Neutral, Softer.
- **Mobile:** Chat input stays fixed at bottom; feedback panel becomes a bottom sheet.

---

## 4. Accessibility

- Minimum contrast ratio 4.5:1 for body text.
- All interactive elements keyboard-focusable.
- Feedback severity indicated by icon + text, not color alone.
- Buttons have clear labels (“Accept suggestion”, “Dismiss suggestion”).

---

## 5. Copy Tone

- Use “you” and “your.”
- Avoid shaming language. “Consider this alternative” beats “This is wrong.”
- Cultural notes: “In U.S. academic settings, it’s common to…” rather than “Americans always…”
