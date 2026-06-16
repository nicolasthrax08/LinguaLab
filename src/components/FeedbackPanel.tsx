"use client";

import { useState } from "react";
import { FeedbackItem, FeedbackType, Severity } from "@/types";

interface FeedbackPanelProps {
  feedback: FeedbackItem[];
}

const TYPE_LABELS: Record<FeedbackType, string> = {
  language: "Language",
  formality: "Formality",
  cultural: "Cultural",
};

const SEVERITY_STYLES: Record<Severity, string> = {
  minor: "bg-slate-100 text-slate-700",
  tip: "bg-accent-100 text-amber-800",
  insight: "bg-primary-100 text-primary-800",
  important: "bg-red-100 text-red-800",
};

export function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [dismissed, setDismissed] = useState<Record<number, boolean>>({});

  if (feedback.length === 0) return null;

  return (
    <div className="border-t border-soft-border bg-soft-bg p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-soft-muted">
        Feedback
      </h3>
      <div className="mt-3 space-y-3">
        {feedback.map((item, index) => {
          if (dismissed[index]) return null;

          const isExpanded = expanded[index];

          return (
            <div
              key={index}
              className="rounded-xl border border-soft-border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_STYLES[item.severity]}`}
                    >
                      {TYPE_LABELS[item.type]}
                    </span>
                    <span className="text-xs text-soft-muted">
                      {item.severity}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-900">
                    {item.type === "language" && (
                      <>
                        <span className="line-through decoration-red-400">
                          {item.target_phrase}
                        </span>
                        {" → "}
                        <span className="font-medium text-primary-700">
                          {item.suggestion}
                        </span>
                      </>
                    )}
                    {item.type === "formality" && item.observation}
                    {item.type === "cultural" && item.note}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        [index]: !prev[index],
                      }))
                    }
                    className="rounded-md p-1 text-soft-muted transition hover:bg-slate-100"
                    aria-expanded={isExpanded}
                    aria-label="Why this suggestion?"
                    title="Why?"
                  >
                    Why?
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDismissed((prev) => ({ ...prev, [index]: true }))
                    }
                    className="rounded-md p-1 text-soft-muted transition hover:bg-slate-100"
                    aria-label="Dismiss suggestion"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 border-t border-soft-border pt-3 text-sm text-soft-muted">
                  <span className="font-medium text-slate-700">Why: </span>
                  {item.why}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
