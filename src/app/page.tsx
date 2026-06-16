/**
 * Landing page for LinguaLab.
 *
 * Matches DESIGN.md: calm headline, value prop, CTA to onboarding,
 * hackathon footer.
 */

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-soft-bg px-6 py-12 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Practice the conversations that matter.
        </h1>
        <p className="mt-6 text-lg text-soft-muted">
          Rehearse office hours, presentations, and group conflicts with AI
          feedback tailored to your English variety and proficiency.
        </p>
        <div className="mt-10">
          <Link
            href="/onboarding"
            className="inline-flex items-center rounded-full bg-primary-600 px-8 py-3 text-base font-medium text-white shadow-sm transition hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            Try a scenario
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-6 text-sm text-soft-muted">
        Built for the USAII Global AI Hackathon 2026.
      </footer>
    </main>
  );
}
