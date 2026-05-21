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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((s) => (
          <ActivityCard key={s.id} suggestion={s} />
        ))}
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
      className="relative h-40 overflow-hidden rounded-xl bg-cover bg-center"
      style={{ backgroundImage: `url(${s.imageUrl})` }}
    >
      {/* Minimal bottom scrim purely for text legibility */}
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
