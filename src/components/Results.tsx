"use client";

import { Star, MapPin, Users, ArrowUpRight, CalendarPlus } from "lucide-react";
import type { Suggestion } from "@/lib/types";
import { getCategory } from "@/lib/categories";

export function Results({
  suggestions,
  onCreateEvent,
}: {
  suggestions: Suggestion[];
  onCreateEvent: (s: Suggestion) => void;
}) {
  if (suggestions.length === 0) return null;

  // Lead with whichever curated pick is socially backed, if any — that's the
  // one most worth turning into a plan. Not fabricated: if none have a signal,
  // this is just the top-ranked card with no special treatment.
  const [lead, ...rest] = suggestions;

  return (
    <section className="animate-rise">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-xl text-ink">Here&apos;s what we found</h2>
        <span className="text-sm text-ink-faint">
          {suggestions.length} curated picks
        </span>
      </div>

      <FeatureCard suggestion={lead} onCreateEvent={onCreateEvent} />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {rest.map((s, i) => (
          <SuggestionCard
            key={s.id}
            suggestion={s}
            delay={i * 70}
            onCreateEvent={onCreateEvent}
          />
        ))}
      </div>
    </section>
  );
}

function Meta({ suggestion: s }: { suggestion: Suggestion }) {
  const cat = getCategory(s.category);
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
      <span className="font-medium text-ink">
        {cat.label.replace("Eat out", "Restaurant")} · {s.subcategory}
      </span>
      <span className="inline-flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        {s.rating.toFixed(1)}
      </span>
      <span className="inline-flex items-center gap-1">
        <MapPin className="h-3.5 w-3.5" />
        {s.proximity.distanceKm} km · {s.proximity.area}
      </span>
      {s.priceLevel && (
        <span className="text-ink-faint">{"$".repeat(s.priceLevel)}</span>
      )}
    </div>
  );
}

/* The honest social signal. Renders ONLY when the data exists. There is no
   fallback string — absence is the design. */
function Signal({ suggestion: s }: { suggestion: Suggestion }) {
  if (!s.socialSignal) return null;
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
      <Users className="h-3.5 w-3.5" />
      {s.socialSignal.text}
    </span>
  );
}

function FeatureCard({
  suggestion: s,
  onCreateEvent,
}: {
  suggestion: Suggestion;
  onCreateEvent: (s: Suggestion) => void;
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-line">
      <div className="grid sm:grid-cols-[1.3fr_1fr]">
        <div
          className="relative min-h-44 bg-cover bg-center"
          style={{ backgroundImage: `url(${s.imageUrl})` }}
        >
          {s.socialSignal && (
            <div className="absolute left-3 top-3">
              <Signal suggestion={s} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 p-4">
          <h3 className="font-display text-xl text-ink">{s.name}</h3>
          <Meta suggestion={s} />
          <div className="mt-auto flex items-center gap-2 pt-2">
            <button
              onClick={() => onCreateEvent(s)}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <CalendarPlus className="h-4 w-4" />
              Plan this with your Knit
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft transition hover:border-ink/20">
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function SuggestionCard({
  suggestion: s,
  delay,
  onCreateEvent,
}: {
  suggestion: Suggestion;
  delay: number;
  onCreateEvent: (s: Suggestion) => void;
}) {
  return (
    <article
      style={{ animationDelay: `${delay}ms` }}
      className="animate-rise group flex flex-col overflow-hidden rounded-2xl border border-line transition hover-shadow-soft"
    >
      <div
        className="relative h-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${s.imageUrl})` }}
      >
        {s.socialSignal && (
          <div className="absolute left-2.5 top-2.5">
            <Signal suggestion={s} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <h3 className="font-semibold text-ink">{s.name}</h3>
        <Meta suggestion={s} />
        {/* Event prompt appears with intent: socially-backed cards show it
            outright; others reveal it on hover so it never feels stamped on. */}
        <div
          className={`mt-auto pt-1 transition ${
            s.socialSignal
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <button
            onClick={() => onCreateEvent(s)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            <CalendarPlus className="h-4 w-4" />
            Plan this with your Knit
          </button>
        </div>
      </div>
    </article>
  );
}
