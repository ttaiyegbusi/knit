"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { type KnitData } from "@/lib/workspaces";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Correct, ordered time axis (8 AM → 7 PM), unlike the mockup's slipped labels.
const HOURS = Array.from({ length: 12 }, (_, i) => 8 + i); // 8..19

function hourLabel(h: number) {
  const period = h < 12 ? "AM" : "PM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display} ${period}`;
}

interface Slot {
  day: number; // 0..6
  startHour: number;
  title: string;
  time: string;
  tone: "blue" | "pink";
  avatars: { i: string; c: string }[];
}

const ROW_H = 80; // px per hour

export function AvailabilityScreen({ knit }: { knit: KnitData }) {
  const [weekOffset, setWeekOffset] = useState(0);
  // Base week dates (mock): Sun 11 … Sat 17, today = Mon 12.
  const baseDates = [11, 12, 13, 14, 15, 16, 17].map((d) => d + weekOffset * 7);
  const todayIdx = 1; // Mon highlighted

  // Avatar cluster drawn from this Knit's members.
  const avatars = knit.members.slice(0, 2).map((m) => ({ i: m.initials, c: m.color }));
  const events: Slot[] = knit.availability.map((a) => ({ ...a, avatars }));

  return (
    <div className="flex h-full flex-col">
      {/* Breadcrumb + week nav */}
      <div className="mb-4 flex items-center gap-2 text-lg">
        <span className="text-ink-soft">Availability</span>
        <ChevronRight className="h-4 w-4 text-ink-faint" />
        <span className="font-semibold text-ink">April 2026</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-ink/5"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-ink/5"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day header */}
      <div className="grid shrink-0 border-b border-line" style={{ gridTemplateColumns: "64px repeat(7, 1fr)" }}>
        <div />
        {DAYS.map((d, i) => (
          <div key={d} className="flex items-center justify-center gap-2 pb-3 text-sm text-ink-soft">
            {d} {Math.abs(baseDates[i])}
            {i === todayIdx && weekOffset === 0 && (
              <span className="grid h-6 min-w-6 place-items-center rounded-md bg-[#FF4275] px-1 text-xs font-semibold text-white">
                {baseDates[i]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Scrollable grid */}
      <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid" style={{ gridTemplateColumns: "64px repeat(7, 1fr)" }}>
          {/* time gutter */}
          <div>
            {HOURS.map((h) => (
              <div key={h} className="relative" style={{ height: ROW_H }}>
                <span className="absolute -top-2 right-2 text-xs text-ink-faint">{hourLabel(h)}</span>
              </div>
            ))}
          </div>

          {/* day columns */}
          {DAYS.map((d, dayIdx) => (
            <div key={d} className="relative border-l border-line">
              {HOURS.map((h) => (
                <div key={h} className="border-b border-line/60" style={{ height: ROW_H }} />
              ))}

              {events.filter((e) => e.day === dayIdx).map((e, i) => {
                const top = (e.startHour - HOURS[0]) * ROW_H;
                return (
                  <div
                    key={i}
                    className={`absolute inset-x-1.5 overflow-hidden rounded-lg p-2 ${
                      e.tone === "blue" ? "bg-sky-50" : "bg-rose-50"
                    }`}
                    style={{ top, height: ROW_H * 2 - 8 }}
                  >
                    <span
                      className={`absolute left-0 top-0 h-full w-1 rounded-l-lg ${
                        e.tone === "blue" ? "bg-sky-400" : "bg-[#FF4275]"
                      }`}
                    />
                    <p className={`pl-2 text-sm font-semibold ${e.tone === "blue" ? "text-sky-600" : "text-[#FF4275]"}`}>
                      {e.title}
                    </p>
                    <p className="pl-2 text-xs text-ink-soft">{e.time}</p>
                    <div className="mt-1 flex pl-2 -space-x-1.5">
                      {e.avatars.map((a) => (
                        <span
                          key={a.i}
                          className={`grid h-5 w-5 place-items-center rounded-full ${a.c} text-[8px] font-semibold text-white ring-2 ring-surface`}
                        >
                          {a.i}
                        </span>
                      ))}
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-ink/10 text-[8px] font-semibold text-ink-soft ring-2 ring-surface">
                        3+
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
