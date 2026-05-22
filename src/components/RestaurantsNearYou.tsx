"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSuggestions } from "@/lib/engine";
import type { Suggestion } from "@/lib/types";

/**
 * A standing discovery feed on the landing view: restaurants near the user.
 * Wired to the same mock engine (eat_out catalog) so cards are real data, not
 * hardcoded duplicates. The lower portion of each card FADES out, signaling
 * there's more below — as the user scrolls up, more of the card is revealed.
 */
export function RestaurantsNearYou() {
  const [items, setItems] = useState<Suggestion[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    getSuggestions({ category: "eat_out" }).then((res) => {
      if (active) setItems(res);
    });
    return () => {
      active = false;
    };
  }, []);

  function scroll(dir: -1 | 1) {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <section className="mt-2">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink">Restaurants Near You</h3>
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          <button
            onClick={() => scroll(-1)}
            aria-label="Previous"
            className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-ink/5"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span>{items.length} suggestions</span>
          <button
            onClick={() => scroll(1)}
            aria-label="Next"
            className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-ink/5"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* The fade lives on a wrapper so the carousel's bottom dissolves into
          the surface — the "more below as you scroll up" cue. */}
      <div className="relative">
        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((s) => (
            <RestaurantCard key={s.id} suggestion={s} />
          ))}
        </div>

        {/* Bottom fade overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
      </div>
    </section>
  );
}

function RestaurantCard({ suggestion: s }: { suggestion: Suggestion }) {
  return (
    <article
      className="relative h-44 w-[150px] shrink-0 overflow-hidden rounded-xl bg-cover bg-center"
      style={{ backgroundImage: `url(${s.imageUrl})` }}
    >
      {/* Per-card darkening at the bottom so the overlaid text is legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
        <p className="text-sm font-semibold leading-tight">{s.name}</p>
        <p className="text-[11px] text-white/80">
          Restaurant · {s.proximity.distanceKm}km
        </p>
      </div>
    </article>
  );
}
