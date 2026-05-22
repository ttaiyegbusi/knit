"use client";

import { X, MapPin } from "lucide-react";
import type { Suggestion } from "@/lib/types";
import { getCategory } from "@/lib/categories";

/**
 * The suggestion detail modal (Suggestion.png). Opens when a user taps an
 * activity card. Shows the place's name + rating, a photo gallery, a short
 * description, the full address, and a "Create event" button that hands off
 * to the existing pre-filled event sheet (Flow 3).
 */
export function SuggestionModal({
  suggestion: s,
  onClose,
  onCreateEvent,
}: {
  suggestion: Suggestion;
  onClose: () => void;
  onCreateEvent: (s: Suggestion) => void;
}) {
  const cat = getCategory(s.category);
  const label = s.category === "eat_out" ? "Restaurant" : cat.label;
  const photos = s.gallery && s.gallery.length > 0 ? s.gallery : [s.imageUrl];

  return (
    <div className="w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-surface shadow-soft ring-1 ring-line">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 pt-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-ink">{s.name}</h3>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FF4275]/10 px-2 py-0.5 text-xs font-semibold text-[#FF4275]">
            {s.rating} ★
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="grid h-7 w-7 place-items-center rounded-full text-ink-soft transition hover:bg-ink/5"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Subtitle */}
      <p className="border-b border-line px-4 pb-3 pt-1 text-sm text-ink-soft">
        {label} · {s.proximity.distanceKm}km
      </p>

      <div className="space-y-4 px-4 py-4">
        {/* Photo gallery */}
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {photos.map((src, i) => (
            <div
              key={i}
              className="h-20 w-24 shrink-0 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>

        {/* Description */}
        {s.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {s.description}
          </p>
        )}

        {/* Location */}
        {s.address && (
          <div>
            <p className="mb-1 text-sm font-semibold text-ink">Location</p>
            <div className="flex items-start gap-2 text-sm text-ink-soft">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FF4275]" />
              <span>{s.address}</span>
            </div>
          </div>
        )}

        {/* Primary action */}
        <button
          onClick={() => onCreateEvent(s)}
          className="w-full rounded-full bg-[#FF4275] py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Create event
        </button>
      </div>
    </div>
  );
}
