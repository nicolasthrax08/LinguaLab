"use client";

import { ScenarioId } from "@/types";

interface ScenarioCardProps {
  id: ScenarioId;
  name: string;
  description: string;
  selected: boolean;
  onSelect: (id: ScenarioId) => void;
}

export function ScenarioCard({
  id,
  name,
  description,
  selected,
  onSelect,
}: ScenarioCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`flex flex-col items-start rounded-xl border-2 p-5 text-left transition ${
        selected
          ? "border-primary-500 bg-primary-50"
          : "border-soft-border bg-white hover:border-primary-300"
      }`}
      aria-pressed={selected}
    >
      <span className="text-lg font-semibold text-slate-900">{name}</span>
      <span className="mt-2 text-sm text-soft-muted">{description}</span>
    </button>
  );
}
