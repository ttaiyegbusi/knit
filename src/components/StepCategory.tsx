"use client";

import { CATEGORIES } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";
import { VibeIcon } from "./VibeIcon";

export function StepCategory({
  onPick,
}: {
  onPick: (id: CategoryId) => void;
}) {
  return (
    <section className="animate-rise">
      <p className="mb-3 text-sm text-ink-soft">Pick a vibe to get started</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => onPick(cat.id)}
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-rise group flex flex-col gap-7 rounded-2xl bg-surface-muted p-4 text-left transition hover:-translate-y-0.5 hover-shadow-soft"
          >
            <VibeIcon category={cat.id} size={36} />
            <span className="text-sm font-semibold text-ink">{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
