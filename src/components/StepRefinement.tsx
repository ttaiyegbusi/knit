"use client";

import { useState } from "react";
import { Shuffle, ArrowRight } from "lucide-react";
import { getCategory } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";

export function StepRefinement({
  category,
  onConfirm,
  onSkip,
}: {
  category: CategoryId;
  onConfirm: (refinement: string[]) => void;
  onSkip: () => void;
}) {
  const cat = getCategory(category);
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(option: string) {
    if (cat.refinementMultiSelect) {
      setSelected((s) =>
        s.includes(option) ? s.filter((o) => o !== option) : [...s, option],
      );
    } else {
      // Single-select confirms immediately — feels snappy, fewer taps.
      onConfirm([option]);
    }
  }

  return (
    <section className="animate-rise">
      <p className="mb-1 font-display text-lg text-ink">{cat.refinementPrompt}</p>
      <p className="mb-4 text-sm text-ink-soft">
        {cat.refinementMultiSelect
          ? "Pick any that sound good — or let us surprise you."
          : "Choose one — or let us surprise you."}
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        {cat.refinementOptions.map((opt, i) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              style={{ animationDelay: `${i * 40}ms` }}
              className={`animate-rise rounded-full border px-4 py-2 text-sm font-medium transition ${
                on
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-surface-muted text-ink hover:border-ink/20"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onSkip}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-ink/20 hover:text-ink"
        >
          <Shuffle className="h-4 w-4" />
          Surprise me
        </button>

        {cat.refinementMultiSelect && selected.length > 0 && (
          <button
            onClick={() => onConfirm(selected)}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}
