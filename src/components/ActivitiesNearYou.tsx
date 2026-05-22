"use client";

import { useEffect, useRef, useState } from "react";
import { getActivitiesNearYou } from "@/lib/engine";
import type { Suggestion } from "@/lib/types";
import { getCategory } from "@/lib/categories";

/**
 * "Activities Near You" — a standing discovery feed. Not its own scroll region;
 * the surface owns scrolling. On select it reports the GRID's bounding rect so
 * the detail popover can anchor snugly to the right edge of the cards.
 */
export function ActivitiesNearYou({
  onSelect,
}: {
  onSelect?: (s: Suggestion, gridRect: DOMRect | null) => void;
}) {
  const [items, setItems] = useState<Suggestion[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    getActivitiesNearYou().then((res) => {
      if (active) setItems(res);
    });
    return () => {
      active = false;
    };
  }, []);

  if (items.length === 0) return null;

  const handleSelect = (s: Suggestion) =>
    onSelect?.(s, gridRef.current?.getBoundingClientRect() ?? null);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink">Activities Near You</h3>
        <span className="text-sm text-ink-soft">{items.length} suggestions</span>
      </div>

      {/* A full-height inline block — no internal scroll. All cards render in
          full; the conversation's single scroll container handles everything. */}
      <div ref={gridRef} className="grid grid-cols-4 gap-2.5">
        {items.map((s) => (
          <ActivityCard key={s.id} suggestion={s} onSelect={handleSelect} />
        ))}
      </div>
    </section>
  );
}

function ActivityCard({
  suggestion: s,
  onSelect,
}: {
  suggestion: Suggestion;
  onSelect?: (s: Suggestion) => void;
}) {
  const cat = getCategory(s.category);
  const label =
    s.category === "eat_out"
      ? "Restaurant"
      : cat.label.replace(/^(Play a |Grab a |Do something )/, "");
  return (
    <article
      onClick={() => onSelect?.(s)}
      className="relative h-36 cursor-pointer overflow-hidden rounded-xl bg-cover bg-center ring-2 ring-transparent transition hover:ring-[#FF4275]"
      style={{ backgroundImage: `url(${s.imageUrl})` }}
    >
      {/* Rating badge — top-left pill, real rating from the engine */}
      <span className="absolute left-2 top-2 inline-flex items-center gap-0.5 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
        {s.rating} ★
      </span>
      {/* Minimal bottom scrim purely for text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-2 text-white">
        <p className="text-xs font-semibold leading-tight">{s.name}</p>
        <p className="text-[10px] text-white/85">
          {label} · {s.proximity.distanceKm}km
        </p>
      </div>
    </article>
  );
}
