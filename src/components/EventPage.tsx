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

  return (
    <div className="flex h-full flex-col">
      {/* Outer bar — Back (left) · Publish (right) */}
      <div className="flex items-center justify-between pb-6">
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

      {/* Centered, contained card (~830px) holding image + details together */}
      <div className="flex flex-1 justify-center overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex h-fit w-full max-w-[830px] gap-6 rounded-3xl bg-surface p-5 shadow-soft">
          {/* Left — square event image */}
          <div className="w-[46%] shrink-0">
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
          <div className="flex flex-1 flex-col">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent font-display text-2xl text-ink outline-none placeholder:text-ink-faint"
              placeholder="Name your event"
            />

            {/* Public toggle — its own divided row */}
            <div className="mt-3 flex items-center gap-2 border-b border-line pb-4">
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

            {/* Event type — pills with label beneath, divided row */}
            <div className="border-b border-line py-4">
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

            {/* Three detail cards — content with label beneath */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {/* Description */}
              <div className="rounded-xl bg-surface-muted p-3">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a short description of your event…"
                  className="h-20 w-full resize-none bg-transparent text-[11px] leading-relaxed text-ink outline-none placeholder:text-ink-faint"
                />
                <p className="mt-1 text-sm font-semibold text-ink">Description</p>
              </div>

              {/* Date & Time — styled date display */}
              <div className="rounded-xl bg-surface-muted p-3">
                <label className="block h-20 cursor-pointer">
                  <DateDisplay value={when} />
                  <input
                    type="datetime-local"
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                    className="sr-only"
                  />
                </label>
                <p className="mt-1 text-sm font-semibold text-ink">Date &amp; Time</p>
              </div>

              {/* Location — map preview with pin pill */}
              <div className="rounded-xl bg-surface-muted p-3">
                <div
                  className="relative grid h-20 place-items-center overflow-hidden rounded-lg"
                  style={{
                    backgroundColor: "#e8eef5",
                    backgroundImage:
                      "linear-gradient(120deg,#dde7f0,#eef2f7 60%),repeating-linear-gradient(45deg,rgba(148,163,184,0.18) 0 1px,transparent 1px 14px),repeating-linear-gradient(-45deg,rgba(148,163,184,0.14) 0 1px,transparent 1px 18px)",
                  }}
                >
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FF4275] px-2 py-1 text-[10px] font-medium text-white shadow">
                    <MapPin className="h-3 w-3" />
                    {suggestion.proximity.area}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-ink">Location</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Styled date presentation (month/weekday small, day large) for the card. */
function DateDisplay({ value }: { value: string }) {
  if (!value) {
    return (
      <div className="flex h-full flex-col justify-center">
        <span className="text-xs text-ink-faint">Pick a date</span>
        <span className="font-display text-2xl text-ink-faint">--</span>
      </div>
    );
  }
  const d = new Date(value);
  const month = d.toLocaleString(undefined, { month: "short" });
  const weekday = d.toLocaleString(undefined, { weekday: "long" });
  const day = d.getDate();
  const ord =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  return (
    <div className="flex h-full flex-col justify-center">
      <span className="text-xs">
        <span className="text-[#FF4275]">{month}</span>{" "}
        <span className="text-ink-soft">{weekday}</span>
      </span>
      <span className="font-display text-2xl text-ink">
        {day}
        <span className="align-top text-sm">{ord}</span>
      </span>
    </div>
  );
}
