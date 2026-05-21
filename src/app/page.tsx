"use client";

import { useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StepCategory } from "@/components/StepCategory";
import { StepRefinement } from "@/components/StepRefinement";
import { StepLocation } from "@/components/StepLocation";
import { Results } from "@/components/Results";
import { ChatInput } from "@/components/ChatInput";
import { ActivitiesNearYou } from "@/components/ActivitiesNearYou";
import { EventSheet } from "@/components/EventSheet";
import { useWizard } from "@/lib/useWizard";
import { parseFreeText } from "@/lib/parser";
import { getCategory } from "@/lib/categories";
import { SURPRISE_ME, type Suggestion } from "@/lib/types";

export default function Page() {
  const w = useWizard();
  const [activeEvent, setActiveEvent] = useState<Suggestion | null>(null);

  function handleChat(text: string) {
    const { query } = parseFreeText(text);
    w.applyParsedQuery(query);
  }

  const showGreeting = w.phase === "category";

  return (
    <AppShell>
      <div className="mx-auto flex min-h-full w-[600px] max-w-full flex-col pb-4">
        {/* ── Top content group ─────────────────────────────────────────── */}
        <div>
          {/* Greeting — only on the first step, like the screenshot */}
          {showGreeting && (
            <div className="mb-10 flex flex-col items-center text-center">
              <div className="knit-mark mb-3 h-12 w-12" />
              <p className="text-sm text-ink-soft">Hi, there</p>
              <h1 className="font-display text-3xl text-ink">
                What do you feel like doing?
              </h1>
            </div>
          )}

          {/* Breadcrumb of answered steps (lets you go back and edit) */}
          {!showGreeting && <AnswerTrail w={w} />}

          {/* The active step */}
          <div className="mb-8">
            {w.phase === "category" && <StepCategory onPick={w.setCategory} />}

            {w.phase === "refinement" && w.query.category && (
              <StepRefinement
                category={w.query.category}
                onConfirm={w.setRefinement}
                onSkip={w.skipRefinement}
              />
            )}

            {w.phase === "location" && <StepLocation onConfirm={w.setLocation} />}

            {w.phase === "results" && (
              <>
                {w.isLoading ? (
                  <LoadingResults />
                ) : (
                  <Results
                    suggestions={w.suggestions}
                    onCreateEvent={setActiveEvent}
                  />
                )}
              </>
            )}
          </div>

          {/* Chat shortcut — present on the first two steps as a fast path */}
          {(w.phase === "category" || w.phase === "refinement") && (
            <ChatInput onSubmit={handleChat} />
          )}

          {/* Restart */}
          {w.phase === "results" && (
            <button
              onClick={w.reset}
              className="mx-auto mt-4 block text-sm font-medium text-ink-soft hover:text-ink"
            >
              Start over
            </button>
          )}
        </div>

        {/* ── Activities Near You — anchored at the very bottom; the single
             row runs off the container's lower edge (clipped by the surface's
             overflow-hidden) and the fixed fade washes across the cut-off
             portion, signalling more on scroll. ─────────────────────────── */}
        {w.phase === "category" && (
          <div className="mt-auto -mb-7 sm:-mb-9">
            <ActivitiesNearYou />
          </div>
        )}
      </div>

      {activeEvent && (
        <EventSheet
          suggestion={activeEvent}
          onClose={() => setActiveEvent(null)}
        />
      )}
    </AppShell>
  );
}

function AnswerTrail({ w }: { w: ReturnType<typeof useWizard> }) {
  const { query } = w;
  const chips: { label: string; step: "category" | "refinement" }[] = [];

  if (query.category) {
    chips.push({ label: getCategory(query.category).label, step: "category" });
  }
  if (query.refinement) {
    const text =
      query.refinement === SURPRISE_ME
        ? "Surprise me"
        : (query.refinement as string[]).join(", ");
    chips.push({ label: text, step: "refinement" });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={c.step}
          onClick={() => w.editStep(c.step)}
          className="group inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-ink/5"
        >
          {c.label}
          <Pencil className="h-3 w-3 text-ink-faint opacity-0 transition group-hover:opacity-100" />
        </button>
      ))}
    </div>
  );
}

function LoadingResults() {
  return (
    <div className="space-y-3">
      <div className="relative h-44 overflow-hidden rounded-2xl bg-surface-muted shimmer" />
      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="relative h-48 overflow-hidden rounded-2xl bg-surface-muted shimmer"
          />
        ))}
      </div>
      <p className="flex items-center justify-center gap-2 pt-2 text-sm text-ink-soft">
        <Loader2 className="h-4 w-4 animate-spin" />
        Curating a few good options…
      </p>
    </div>
  );
}
