"use client";

import { useEffect, useState } from "react";
import { getActivitiesNearYou } from "@/lib/engine";
import type { Suggestion } from "@/lib/types";
import { getCategory } from "@/lib/categories";

/**
 * "Activities Near You" — a standing discovery feed anchored at the bottom of
 * the surface. It's a VERTICALLY-SCROLLING zone of multiple rows; the user
 * scrolls up to reveal more activities. A white fade sits on the TOP EDGE of
 * the scroll zone (not on the cards) as the scroll affordance: cards dissolve
 * into white as they pass the top, signalling more content below.
 */
export function ActivitiesNearYou() {
  const [items, setItems] = useState<Suggestion[]>([]);

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

  return (
    <section className="relative">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink">Activities Near You</h3>
        <span className="text-sm text-ink-soft">{items.length} suggestions</span>
      </div>

      {/* Vertically scrolling zone. The fade is a top-edge mask on THIS
          container — the cards stay clean. */}
      <div className="relative">
        {/* Top-edge white fade — the "scroll up for more" affordance */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-surface to-transparent" />

        <div className="max-h-[320px] overflow-y-auto pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((s) => (
              <ActivityCard key={s.id} suggestion={s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivityCard({ suggestion: s }: { suggestion: Suggestion }) {
  const cat = getCategory(s.category);
  const label =
    s.category === "eat_out" ? "Restaurant" : cat.label.replace(/^(Play a |Grab a |Do something )/, "");
  return (
    <article
      className="relative h-40 overflow-hidden rounded-xl bg-cover bg-center"
      style={{ backgroundImage: `url(${s.imageUrl})` }}
    >
      {/* Minimal bottom scrim purely for text legibility — not the fade effect */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
        <p className="text-sm font-semibold leading-tight">{s.name}</p>
        <p className="text-[11px] text-white/85">
          {label} · {s.proximity.distanceKm}km
        </p>
      </div>
    </article>
  );
}
