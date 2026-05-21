"use client";

import { useState } from "react";
import { Loader2, Settings } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StepCategory } from "@/components/StepCategory";
import { Conversation } from "@/components/Conversation";
import { KnitBubble } from "@/components/ChatBubbles";
import { ActivitiesNearYou } from "@/components/ActivitiesNearYou";
import { ChatInput } from "@/components/ChatInput";
import { EventSheet } from "@/components/EventSheet";
import { SuggestionModal } from "@/components/SuggestionModal";
import { Logo } from "@/components/Logo";
import { useWizard } from "@/lib/useWizard";
import { parseFreeText } from "@/lib/parser";
import { type Suggestion } from "@/lib/types";

export default function Page() {
  const w = useWizard();
  const [activeEvent, setActiveEvent] = useState<Suggestion | null>(null);
  const [selected, setSelected] = useState<Suggestion | null>(null);

  function handleChat(text: string) {
    const { query } = parseFreeText(text);
    w.applyParsedQuery(query);
  }

  const isLanding = w.phase === "category";
  const inConversation = w.phase === "refinement";

  return (
    <AppShell>
      {isLanding ? (
        /* ── STATE 1 · Landing — greeting, vibe cards, chat box, activities ── */
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="mx-auto flex min-h-full w-[600px] max-w-full flex-col pb-4">
              <div>
                <div className="mb-10 flex flex-col items-center text-center">
                  <div className="mb-3">
                    <Logo size={48} />
                  </div>
                  <p className="text-sm text-ink-soft">Hi, there</p>
                  <h1 className="font-display text-3xl text-ink">
                    What do you feel like doing?
                  </h1>
                </div>

                <div className="mb-8">
                  <StepCategory onPick={w.setCategory} />
                </div>

                <ChatInput onSubmit={handleChat} />
              </div>

              <div className="mt-auto pt-16">
                <ActivitiesNearYou onSelect={setSelected} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── STATE 2 · Conversation — transcript + bottom composer ────────── */
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Greeting stays at top */}
            <div className="mb-10 flex flex-col items-center text-center">
              <div className="mb-3">
                <Logo size={48} />
              </div>
              <p className="text-sm text-ink-soft">Hi, there</p>
              <h1 className="font-display text-3xl text-ink">
                What do you feel like doing?
              </h1>
            </div>

            {inConversation && (
              <Conversation
                w={w}
                onPickCategory={w.setCategory}
                onConfirmRefinement={w.setRefinement}
                onSkipRefinement={w.skipRefinement}
              />
            )}

            {w.phase === "results" && (
              <div className="mx-auto mt-6 w-[600px] max-w-full">
                <ResultsTurn w={w} onSelect={setSelected} />
              </div>
            )}
          </div>

          {/* Composer pinned at the bottom — present through the conversation */}
          {(inConversation || w.phase === "results") && (
            <div className="mx-auto w-[600px] max-w-full pt-4">
              <ChatInput onSubmit={handleChat} />
            </div>
          )}
        </div>
      )}

      {activeEvent && (
        <EventSheet
          suggestion={activeEvent}
          onClose={() => setActiveEvent(null)}
        />
      )}

      {/* Suggestion detail modal — opens on card tap. "Create event" closes it
          and hands off to the existing pre-filled event sheet (Flow 3). */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 p-4"
          onClick={() => setSelected(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <SuggestionModal
              suggestion={selected}
              onClose={() => setSelected(null)}
              onCreateEvent={(s) => {
                setSelected(null);
                setActiveEvent(s);
              }}
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}

function ResultsTurn({
  w,
  onSelect,
}: {
  w: ReturnType<typeof useWizard>;
  onSelect: (s: Suggestion) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <KnitBubble>
        <div className="rounded-2xl rounded-tl-md bg-surface-muted px-4 py-3 text-sm font-medium text-ink">
          <p className="leading-relaxed">
            Okay, based on your preference and location; here are some
            suggestions
          </p>
          <button
            onClick={() => w.changeLocation()}
            className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF4275] hover:underline"
          >
            <Settings className="h-3.5 w-3.5" />
            Change location
          </button>
        </div>
      </KnitBubble>

      {w.isLoading ? (
        <LoadingResults />
      ) : (
        <ActivitiesNearYou onSelect={onSelect} />
      )}
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
