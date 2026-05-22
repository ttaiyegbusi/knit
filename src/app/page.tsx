"use client";

import { useState, useEffect } from "react";
import { ChevronDown, MoreVertical } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StepCategory } from "@/components/StepCategory";
import { Conversation } from "@/components/Conversation";
import { ActivitiesNearYou } from "@/components/ActivitiesNearYou";
import { ChatInput } from "@/components/ChatInput";
import { EventSheet } from "@/components/EventSheet";
import { SuggestionModal } from "@/components/SuggestionModal";
import { SuggestionHistory } from "@/components/SuggestionHistory";
import { Attachments } from "@/components/Attachments";
import { Logo } from "@/components/Logo";
import { useWizard } from "@/lib/useWizard";
import { useAttachments } from "@/lib/useAttachments";
import { parseFreeText } from "@/lib/parser";
import { getCategory } from "@/lib/categories";
import { SURPRISE_ME, type Suggestion } from "@/lib/types";

export default function Page() {
  const w = useWizard();
  const attachments = useAttachments();
  const [activeEvent, setActiveEvent] = useState<Suggestion | null>(null);
  const [selected, setSelected] = useState<Suggestion | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  function openSuggestion(s: Suggestion, rect: DOMRect | null) {
    setAnchorRect(rect);
    setSelected(s);
  }
  const [drawer, setDrawer] = useState<"history" | "attachments" | null>(null);
  const [drawerContent, setDrawerContent] = useState<
    "history" | "attachments" | null
  >(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Keep the drawer's content mounted while it animates closed: adopt the new
  // value on open, retain the old value through the collapse, then unmount.
  useEffect(() => {
    if (drawer) {
      setDrawerContent(drawer);
      return;
    }
    const t = window.setTimeout(() => setDrawerContent(null), 380);
    return () => window.clearTimeout(t);
  }, [drawer]);

  function handleChat(text: string) {
    const { query } = parseFreeText(text);
    w.applyParsedQuery(query);
  }

  function handleShare() {
    const summary = `Knit suggestion: ${conversationTitle(w)}`;
    void navigator.clipboard?.writeText(summary);
  }

  const isLanding = w.phase === "category";
  const inThread = !isLanding; // refinement, location, results all render the thread

  return (
    <AppShell
      aside={
        <div
          className="h-full shrink-0 overflow-hidden transition-[width] duration-[360ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ width: drawer ? 340 : 0 }}
        >
          <div
            className={`h-full w-[340px] overflow-hidden rounded-[1.25rem] bg-surface shadow-soft transition-opacity duration-300 ${
              drawer ? "opacity-100 delay-100" : "opacity-0"
            }`}
          >
            {drawerContent === "history" && (
              <SuggestionHistory onClose={() => setDrawer(null)} />
            )}
            {drawerContent === "attachments" && (
              <Attachments
                items={attachments.items}
                onClose={() => setDrawer(null)}
              />
            )}
          </div>
        </div>
      }
    >
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
                <ActivitiesNearYou onSelect={openSuggestion} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── STATE 2 · Conversation — header + transcript + composer ─────── */
        <div className="flex h-full flex-col">
          <div className="flex h-full min-w-0 flex-1 flex-col">
            {/* Header: title (left) · menu (right) */}
            <div className="relative flex items-center justify-between pb-3">
              <button className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-ink transition hover:bg-ink/5">
                {conversationTitle(w)}
                <ChevronDown className="h-4 w-4 text-ink-soft" />
              </button>

              <div className="flex items-center gap-1">
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="More"
                    className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-ink/5"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  {menuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-10 z-20 w-48 overflow-hidden rounded-xl bg-surface py-1 shadow-soft ring-1 ring-line">
                        <MenuItem
                          label="Share"
                          onClick={() => {
                            handleShare();
                            setMenuOpen(false);
                          }}
                        />
                        <MenuItem
                          label="Suggestion History"
                          onClick={() => {
                            setDrawer("history");
                            setMenuOpen(false);
                          }}
                        />
                        <MenuItem
                          label="Attachments"
                          onClick={() => {
                            setDrawer("attachments");
                            setMenuOpen(false);
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Scrollable thread */}
            <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Conversation
                w={w}
                onPickCategory={w.setCategory}
                onConfirmRefinement={w.setRefinement}
                onSkipRefinement={w.skipRefinement}
                onSelectSuggestion={openSuggestion}
              />
            </div>

            {/* Composer pinned at the bottom */}
            <div className="mx-auto w-[600px] max-w-full pt-4">
              <ChatInput onSubmit={handleChat} onAttach={attachments.add} />
            </div>
          </div>
        </div>
      )}

      {activeEvent && (
        <EventSheet
          suggestion={activeEvent}
          onClose={() => setActiveEvent(null)}
        />
      )}

      {/* Suggestion detail — a floating popover anchored bottom-right over the
          activities area. No dimming backdrop; just a subtle elevation shadow.
          An invisible catcher closes it on outside-click. */}
      {selected && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setSelected(null)}
          />
          {/* Anchored to the FOURTH card's position (top row), to its right —
              every card opens the popover at this same spot. */}
          <div
            className="fixed z-50 animate-rise"
            style={fourthCardPosition(anchorRect)}
          >
            <SuggestionModal
              suggestion={selected}
              onClose={() => setSelected(null)}
              onCreateEvent={(s) => {
                setSelected(null);
                setActiveEvent(s);
              }}
            />
          </div>
        </>
      )}
    </AppShell>
  );
}

/** Pins the popover just to the right of the fourth (top-row) card. */
function fourthCardPosition(rect: DOMRect | null): React.CSSProperties {
  const GAP = 16;
  if (typeof window === "undefined" || !rect) {
    return { right: 32, top: 120 };
  }
  return { left: rect.right + GAP, top: rect.top };
}

function MenuItem({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="block w-full px-4 py-2.5 text-left text-sm text-ink transition hover:bg-surface-muted"
    >
      {label}
    </button>
  );
}

/** Derives a conversation title from the answers (stands in for AI naming). */
function conversationTitle(w: ReturnType<typeof useWizard>): string {
  const { query } = w;
  if (!query.category) return "New Suggestion";
  const cat = getCategory(query.category);
  const refinement =
    query.refinement && query.refinement !== SURPRISE_ME
      ? (query.refinement as string[])[0]
      : undefined;

  if (query.category === "eat_out") {
    return refinement ? `${refinement} Food Cuisine` : "Food Cuisine";
  }
  return refinement ? `${refinement} · ${cat.label}` : cat.label;
}
