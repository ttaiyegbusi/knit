"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ImagePlus,
  Users,
  UtensilsCrossed,
  PartyPopper,
  Lock,
  Sparkles,
  MonitorPlay,
  MoreHorizontal,
  Info,
  MapPin,
} from "lucide-react";
import type { Suggestion } from "@/lib/types";

const EVENT_TYPES = [
  { id: "social", label: "Social hangout", icon: Users },
  { id: "eating", label: "Eating", icon: UtensilsCrossed },
  { id: "party", label: "Party", icon: PartyPopper },
  { id: "workshop", label: "Workshop", icon: Lock },
  { id: "fun", label: "Fun hangout", icon: Sparkles },
  { id: "webinar", label: "Webinar", icon: MonitorPlay },
  { id: "others", label: "Others", icon: MoreHorizontal },
] as const;

// Pick a sensible default event type from the suggestion's category.
const DEFAULT_TYPE: Record<string, string> = {
  eat_out: "eating",
  play_sport: "social",
  grab_drink: "social",
  do_fun: "fun",
};

export function EventPage({
  suggestion,
  onBack,
  onPublish,
}: {
  suggestion: Suggestion;
  onBack: () => void;
  onPublish: () => void;
}) {
  const [title, setTitle] = useState(
    suggestion.category === "eat_out"
      ? `Dinner at ${suggestion.name}`
      : `${suggestion.name} hangout`,
  );
  const [isPublic, setIsPublic] = useState(false);
  const [type, setType] = useState<string>(
    DEFAULT_TYPE[suggestion.category] ?? "social",
  );
  const [description, setDescription] = useState("");
  const [when, setWhen] = useState("");
  const location = suggestion.address ?? `${suggestion.name}, ${suggestion.proximity.area}`;

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between pb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-ink transition hover:bg-ink/5"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={onPublish}
          className="rounded-full bg-[#FF4275] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Publish to knit
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto md:flex-row [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Left — event image with upload affordance */}
        <div className="md:w-[44%]">
          <div
            className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cover bg-center ring-1 ring-line"
            style={{ backgroundImage: `url(${suggestion.imageUrl})` }}
          >
            <button
              aria-label="Change image"
              className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-ink shadow-soft backdrop-blur transition hover:bg-surface"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Right — details */}
        <div className="flex-1 space-y-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent font-display text-3xl text-ink outline-none placeholder:text-ink-faint"
            placeholder="Name your event"
          />

          {/* Public toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink">Make event public</span>
            <Info className="h-3.5 w-3.5 text-ink-faint" />
            <button
              onClick={() => setIsPublic((v) => !v)}
              className={`relative ml-auto h-6 w-11 rounded-full transition ${
                isPublic ? "bg-[#FF4275]" : "bg-ink/15"
              }`}
              aria-pressed={isPublic}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  isPublic ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Event type */}
          <div>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => {
                const Icon = t.icon;
                const active = type === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "text-ink ring-2 ring-[#FF4275]"
                        : "bg-surface-muted text-ink ring-2 ring-transparent hover:ring-line"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-ink-soft" />
                    {t.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-sm text-ink-soft">Event type</p>
          </div>

          {/* Three detail cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Description */}
            <div className="rounded-xl bg-surface-muted p-3">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a short description of your event…"
                className="h-24 w-full resize-none bg-transparent text-xs leading-relaxed text-ink outline-none placeholder:text-ink-faint"
              />
              <p className="mt-1 text-sm font-medium text-ink">Description</p>
            </div>

            {/* Date & Time */}
            <div className="rounded-xl bg-surface-muted p-3">
              <div className="flex h-24 flex-col justify-center">
                <input
                  type="datetime-local"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  className="w-full bg-transparent text-sm text-ink outline-none"
                />
              </div>
              <p className="mt-1 text-sm font-medium text-ink">Date &amp; Time</p>
            </div>

            {/* Location */}
            <div className="rounded-xl bg-surface-muted p-3">
              <div className="relative grid h-24 place-items-center overflow-hidden rounded-lg bg-ink/5">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FF4275] px-2 py-1 text-[10px] font-medium text-white">
                  <MapPin className="h-3 w-3" />
                  {suggestion.proximity.area}
                </span>
              </div>
              <p className="mt-1 truncate text-sm font-medium text-ink" title={location}>
                Location
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
