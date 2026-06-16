"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ENGLISH_VARIETIES,
  PROFICIENCY_LEVELS,
  SCENARIOS,
} from "@/lib/prompts";
import { ScenarioCard } from "@/components/ScenarioCard";
import { EnglishVariety, Proficiency, ScenarioId } from "@/types";
import { createClient } from "@/lib/supabase";

const ONBOARDING_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [variety, setVariety] = useState<EnglishVariety>("general-american");
  const [proficiency, setProficiency] = useState<Proficiency>("intermediate");
  const [scenarioId, setScenarioId] = useState<ScenarioId>("office_hours");
  const [loading, setLoading] = useState(false);

  // Pre-select any saved preferences on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lingualab-onboarding");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.variety) setVariety(parsed.variety);
        if (parsed.proficiency) setProficiency(parsed.proficiency);
        if (parsed.scenarioId) setScenarioId(parsed.scenarioId);
      }
    } catch {
      // Ignore malformed localStorage.
    }
  }, []);

  const canProceed = () => {
    if (step === 1) return !!variety;
    if (step === 2) return !!proficiency;
    if (step === 3) return !!scenarioId;
    return true;
  };

  const startScenario = async () => {
    setLoading(true);

    // Persist lightweight preferences locally.
    localStorage.setItem(
      "lingualab-onboarding",
      JSON.stringify({ variety, proficiency, scenarioId })
    );

    let profileId: string | undefined =
      localStorage.getItem("lingualab-profile-id") ?? undefined;
    let sessionId: string | undefined =
      localStorage.getItem("lingualab-session-id") ?? undefined;

    try {
      const supabase = createClient();

      // Upsert anonymous profile.
      if (!profileId) {
        const { data, error } = await supabase
          .from("profiles")
          .insert({
            proficiency_level: proficiency,
            english_variety: variety,
          })
          .select("id")
          .single();

        if (error) throw error;
        profileId = data?.id;
        if (profileId) {
          localStorage.setItem("lingualab-profile-id", profileId);
        }
      } else {
        // Update existing profile preferences.
        await supabase
          .from("profiles")
          .update({
            proficiency_level: proficiency,
            english_variety: variety,
          })
          .eq("id", profileId);
      }

      // Create a new session for this practice run.
      const scenario = SCENARIOS[scenarioId];
      const { data: session, error: sessionError } = await supabase
        .from("sessions")
        .insert({
          user_id: profileId,
          scenario_id: scenarioId,
          scenario_name: scenario.name,
        })
        .select("id")
        .single();

      if (sessionError) throw sessionError;
      sessionId = session?.id;
      if (sessionId) {
        localStorage.setItem("lingualab-session-id", sessionId);
      }
    } catch (err) {
      console.error("[Onboarding] Supabase error:", err);
      // Even if persistence fails, we let the user continue locally.
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("lingualab-session-id", sessionId);
      }
    }

    // Pass selections to the chat screen via query params for simplicity.
    const params = new URLSearchParams({
      scenario: scenarioId,
      proficiency,
      variety,
      session: sessionId ?? "",
      profile: profileId ?? "",
    });

    router.push(`/chat?${params.toString()}`);
  };

  return (
    <main className="flex min-h-screen flex-col bg-soft-bg px-6 py-12">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm">
        {/* Progress bar */}
        <div className="mb-8 flex items-center justify-between">
          {Array.from({ length: ONBOARDING_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i + 1 <= step ? "bg-primary-500" : "bg-slate-200"
              } ${i > 0 ? "ml-2" : ""}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Which English variety do you use?
            </h2>
            <p className="mt-2 text-soft-muted">
              We respect World Englishes and calibrate feedback to your
              background.
            </p>
            <div className="mt-6 space-y-3">
              {ENGLISH_VARIETIES.map((v) => (
                <label
                  key={v.value}
                  className={`flex cursor-pointer items-center rounded-lg border-2 px-4 py-3 transition ${
                    variety === v.value
                      ? "border-primary-500 bg-primary-50"
                      : "border-soft-border hover:border-primary-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="variety"
                    value={v.value}
                    checked={variety === v.value}
                    onChange={() => setVariety(v.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-slate-900">{v.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              What is your current proficiency?
            </h2>
            <p className="mt-2 text-soft-muted">
              This helps us tune reply complexity and feedback detail.
            </p>
            <div className="mt-6 space-y-3">
              {PROFICIENCY_LEVELS.map((p) => (
                <label
                  key={p.value}
                  className={`flex cursor-pointer items-center rounded-lg border-2 px-4 py-3 transition ${
                    proficiency === p.value
                      ? "border-primary-500 bg-primary-50"
                      : "border-soft-border hover:border-primary-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="proficiency"
                    value={p.value}
                    checked={proficiency === p.value}
                    onChange={() => setProficiency(p.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-slate-900">{p.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Choose a scenario to practice
            </h2>
            <p className="mt-2 text-soft-muted">
              Pick the conversation that feels most useful right now.
            </p>
            <div className="mt-6 grid gap-4">
              {Object.values(SCENARIOS).map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  id={scenario.id}
                  name={scenario.name}
                  description={scenario.goal}
                  selected={scenarioId === scenario.id}
                  onSelect={setScenarioId}
                />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              {SCENARIOS[scenarioId].name}
            </h2>
            <p className="mt-2 text-soft-muted">
              {SCENARIOS[scenarioId].context}
            </p>
            <div className="mt-6 rounded-lg bg-primary-50 p-4 text-sm text-primary-900">
              <p className="font-medium">Your goal</p>
              <p className="mt-1">{SCENARIOS[scenarioId].goal}</p>
              <p className="mt-3 font-medium">What makes this tricky</p>
              <p className="mt-1">{SCENARIOS[scenarioId].tension}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="rounded-lg px-4 py-2 text-sm font-medium text-soft-muted transition hover:bg-slate-100 disabled:opacity-40"
          >
            Back
          </button>

          {step < ONBOARDING_STEPS ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={startScenario}
              disabled={loading}
              className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Starting..." : "Start practice"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
