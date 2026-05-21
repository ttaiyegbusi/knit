"use client";

import { useEffect, useState } from "react";
import { getActivitiesNearYou } from "@/lib/engine";
import type { Suggestion } from "@/lib/types";
import { getCategory } from "@/lib/categories";

/**
 * "Activities Near You" — a standing discovery feed at the bottom of the
 * surface. It is NOT its own scroll region: the main surface owns scrolling.
 * This is just a tall block of activity cards that flows within the surface
 * and dissolves against the fade fixed to the surface's bottom edge.
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
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink">Activities Near You</h3>
        <span className="text-sm text-ink-soft">{items.length} suggestions</span>
      </div>

      {/* One row tall at rest; the rest scroll vertically WITHIN this window.
          A bottom fade on this window signals more rows below. */}
      <div className="relative">
        <div className="max-h-36 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid grid-cols-4 gap-2.5">
            {items.map((s) => (
              <ActivityCard key={s.id} suggestion={s} />
            ))}
          </div>
        </div>
        {/* Bottom fade — the "scroll for more rows" cue for this window */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface to-transparent" />
      </div>
    </section>
  );
}

function ActivityCard({ suggestion: s }: { suggestion: Suggestion }) {
  const cat = getCategory(s.category);
  const label =
    s.category === "eat_out"
      ? "Restaurant"
      : cat.label.replace(/^(Play a |Grab a |Do something )/, "");
  return (
    <article
      className="relative h-36 overflow-hidden rounded-xl bg-cover bg-center"
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
