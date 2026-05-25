"use client";

import { useState } from "react";
import { Users, Copy, Check } from "lucide-react";
import { type KnitData } from "@/lib/workspaces";

export function ArenaScreen({ knit }: { knit: KnitData }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const joinLink = knit.joinLink;

  function send() {
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
    window.setTimeout(() => setSent(false), 2500);
  }
  function copy() {
    void navigator.clipboard?.writeText(`https://${joinLink}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-rose-50 p-6">
        {/* faint repeating-icon texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,#FF4275 0 1px,transparent 1px 22px),repeating-linear-gradient(-45deg,#FF4275 0 1px,transparent 1px 22px)",
          }}
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-3xl">
                🧑🏾‍🦱
              </span>
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-rose-50" />
            </div>
            <div>
              <p className="text-sm text-ink-soft">Knit Created by</p>
              <p className="text-lg font-semibold text-ink">{knit.creator}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:w-72">
            <Stat label="Members" value={String(knit.membersCount)} />
            <Stat label="Events Created" value={String(knit.eventsCreated)} />
            <Stat label="Date Created" value={knit.dateCreated} />
          </div>
        </div>
      </div>

      {/* Knit Share */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left */}
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#FF4275]">
            <Users className="h-4 w-4" /> Knit Share
          </p>
          <h2 className="font-display text-2xl text-ink">Share Knit with your friends</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
            Share the link below to invite your friends. They can view the event
            details and join directly — hassle-free!
          </p>

          <p className="mt-5 text-sm font-medium text-ink">Or Invite Via</p>
          <div className="mt-2 flex gap-2">
            {["WhatsApp", "Instagram", "Facebook"].map((s) => (
              <button
                key={s}
                aria-label={s}
                className="grid h-10 w-10 place-items-center rounded-full bg-surface-muted text-ink-soft transition hover:bg-ink/5 hover:text-ink"
              >
                <SocialGlyph name={s} />
              </button>
            ))}
          </div>

          <p className="mt-5 text-sm font-medium text-ink">Email Address</p>
          <div className="mt-2 flex max-w-md items-center gap-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Enter address"
              className="h-11 flex-1 rounded-xl border border-line bg-surface px-4 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-[#FF4275]"
            />
            <button
              onClick={send}
              className="h-11 rounded-full bg-[#FF4275] px-6 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {sent ? "Sent ✓" : "Send"}
            </button>
          </div>
        </div>

        {/* Right — ticket card */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-72 overflow-hidden rounded-3xl bg-[#FF4275] p-5 text-white">
            {/* notch */}
            <div className="absolute -top-4 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-surface" />
            <div className="flex items-center justify-between text-xs font-semibold tracking-wide">
              <span>KNIT</span>
              <span>RSVP</span>
            </div>

            <div className="mt-5 grid place-items-center">
              <div className="relative grid h-44 w-44 place-items-center rounded-xl bg-white p-3">
                <DecorativeQR />
                <span className="absolute grid h-9 w-9 place-items-center rounded-full bg-white text-lg shadow">
                  🔥
                </span>
              </div>
            </div>

            <p className="mt-4 text-center text-lg font-semibold leading-snug">
              {knit.name}
            </p>

            <button
              onClick={copy}
              className="mt-3 flex w-full items-center justify-between rounded-full bg-white/20 px-3 py-2 text-xs font-medium backdrop-blur transition hover:bg-white/25"
            >
              <span className="truncate">{joinLink}</span>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>

            {/* scalloped bottom edge */}
            <div className="pointer-events-none absolute -bottom-2 left-0 right-0 flex justify-around">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="h-4 w-4 rounded-full bg-surface" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface/70 px-4 py-2.5">
      <p className="text-xs text-ink-faint">{label}</p>
      <p className="text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function SocialGlyph({ name }: { name: string }) {
  // Simple monochrome glyphs (no brand-logo reproduction needed for a mock).
  if (name === "WhatsApp")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12 2a10 10 0 00-8.6 15l-1.4 5 5.1-1.3A10 10 0 1012 2zm0 2a8 8 0 11-4.2 14.8l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 0112 4zm4.5 9.6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1l-.7.9c-.1.1-.3.1-.5 0a6.5 6.5 0 01-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5.2-.4v-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a3 3 0 00-1 2.3c0 1.3 1 2.6 1.1 2.8s1.9 2.9 4.6 4c1.6.7 2.2.7 3 .6.5 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1z" />
      </svg>
    );
  if (name === "Instagram")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M14 9h3l.4-3H14V4.2c0-.9.3-1.4 1.5-1.4H17V.1A21 21 0 0014.6 0C12.2 0 10.6 1.4 10.6 4v2H8v3h2.6v9h3.4V9z" />
    </svg>
  );
}

function DecorativeQR() {
  // A decorative QR-style grid (not a real scannable code).
  const cells = 11;
  return (
    <div
      className="grid h-full w-full gap-[2px]"
      style={{ gridTemplateColumns: `repeat(${cells}, 1fr)` }}
      aria-hidden
    >
      {Array.from({ length: cells * cells }).map((_, i) => {
        const r = Math.floor(i / cells);
        const c = i % cells;
        // finder squares in three corners
        const inFinder =
          (r < 3 && c < 3) || (r < 3 && c > cells - 4) || (r > cells - 4 && c < 3);
        const on = inFinder || (i * 7 + r * 3 + c * 5) % 3 === 0;
        return (
          <span
            key={i}
            className="rounded-[1px]"
            style={{ backgroundColor: on ? "#11181C" : "transparent" }}
          />
        );
      })}
    </div>
  );
}
