"use client";

import { Shuffle } from "lucide-react";
import { KnitBubble, KnitText, UserBubble } from "./ChatBubbles";
import { VibeIcon } from "./VibeIcon";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { SURPRISE_ME } from "@/lib/types";
import type { CategoryId } from "@/lib/types";
import type { useWizard } from "@/lib/useWizard";

/**
 * Presentation-only: renders the EXISTING structured wizard as a chat
 * transcript. Each answered step shows Knit's question (left) + the user's
 * answer (right pink bubble). The current step shows Knit's question with the
 * interactive options beneath it. The wizard logic is untouched — this just
 * changes how it looks.
 */
export function Conversation({
  w,
  onPickCategory,
  onConfirmRefinement,
  onSkipRefinement,
}: {
  w: ReturnType<typeof useWizard>;
  onPickCategory: (id: CategoryId) => void;
  onConfirmRefinement: (r: string[]) => void;
  onSkipRefinement: () => void;
}) {
  const { query, phase } = w;

  return (
    <div className="mx-auto flex w-[600px] max-w-full flex-col gap-6">
      {/* ── Step 1: category ─────────────────────────────────────────────
          Knit asks "Pick a vibe to get started". Either the user has answered
          (show their pick on the right) or it's the active step (show chips). */}
      <KnitBubble>
        <KnitText>Pick a vibe to get started</KnitText>
        {phase === "category" && (
          <div className="mt-1 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onPickCategory(cat.id)}
                className="flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2 text-sm font-medium text-ink ring-2 ring-transparent transition hover:ring-[#FF4275]"
              >
                <VibeIcon category={cat.id} size={22} />
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </KnitBubble>

      {query.category && <UserBubble>{getCategory(query.category).label}</UserBubble>}

      {/* ── Step 2: refinement ───────────────────────────────────────────── */}
      {query.category && (
        <RefinementTurn
          category={query.category}
          isActive={phase === "refinement"}
          answer={query.refinement}
          onConfirm={onConfirmRefinement}
          onSkip={onSkipRefinement}
        />
      )}

      {/* ── Step 3: location is handled by the existing StepLocation, shown
           as a Knit turn by the page when phase === "location". ──────────── */}
    </div>
  );
}

function RefinementTurn({
  category,
  isActive,
  answer,
  onConfirm,
  onSkip,
}: {
  category: CategoryId;
  isActive: boolean;
  answer: string[] | typeof SURPRISE_ME | undefined;
  onConfirm: (r: string[]) => void;
  onSkip: () => void;
}) {
  const cat = getCategory(category);

  return (
    <>
      <KnitBubble>
        <KnitText>{cat.refinementPrompt}</KnitText>
        {isActive && (
          <>
            <p className="px-1 text-xs text-ink-soft">
              {cat.refinementMultiSelect ? "Select cuisines" : "Select one"}
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.refinementOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => onConfirm([opt])}
                  className="rounded-lg bg-surface-muted px-3.5 py-2 text-sm font-medium text-ink ring-2 ring-transparent transition hover:ring-[#FF4275]"
                >
                  {opt}
                </button>
              ))}
              <button
                onClick={onSkip}
                className="inline-flex items-center gap-1.5 rounded-lg bg-surface-muted px-3.5 py-2 text-sm font-medium text-ink-soft ring-2 ring-transparent transition hover:ring-[#FF4275]"
              >
                <Shuffle className="h-3.5 w-3.5" />
                Surprise me
              </button>
            </div>
          </>
        )}
      </KnitBubble>

      {answer !== undefined && (
        <UserBubble>
          {answer === SURPRISE_ME ? "Surprise me" : (answer as string[]).join(", ")}
        </UserBubble>
      )}
    </>
  );
}
