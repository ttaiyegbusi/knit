"use client";

import { useState } from "react";
import { MapPin, Loader2, ArrowRight } from "lucide-react";
import type { LocationAnswer } from "@/lib/types";

export function StepLocation({
  onConfirm,
}: {
  onConfirm: (loc: LocationAnswer) => void;
}) {
  const [status, setStatus] = useState<"idle" | "locating" | "denied">("idle");
  const [manual, setManual] = useState("");

  function detect() {
    setStatus("locating");
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onConfirm({
          source: "auto",
          // In production this reverse-geocodes; mock keeps it honest-looking.
          label: "your current location",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => setStatus("denied"), // permission denied → manual fallback
      { timeout: 8000 },
    );
  }

  function submitManual() {
    const label = manual.trim();
    if (!label) return;
    onConfirm({ source: "manual", label });
  }

  return (
    <section className="animate-rise max-w-md">
      <p className="mb-1 font-display text-lg text-ink">Where are you?</p>
      <p className="mb-5 text-sm text-ink-soft">
        We&apos;ll find things near you.
      </p>

      {status !== "denied" ? (
        <button
          onClick={detect}
          disabled={status === "locating"}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
        >
          {status === "locating" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          {status === "locating" ? "Finding you…" : "Use my location"}
        </button>
      ) : null}

      {status === "denied" && (
        <div className="animate-rise">
          <p className="mb-2 text-sm text-ink-soft">
            No problem — type a city or area instead.
          </p>
          <div className="flex items-center gap-2 rounded-full border border-line bg-surface-muted px-4 py-1.5">
            <MapPin className="h-4 w-4 text-ink-faint" />
            <input
              autoFocus
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitManual()}
              placeholder="e.g. Lekki, Lagos"
              className="flex-1 bg-transparent py-1.5 text-sm text-ink outline-none placeholder:text-ink-faint"
            />
            <button
              onClick={submitManual}
              disabled={!manual.trim()}
              className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white transition disabled:opacity-40"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-ink-faint">
        We only use this to sort suggestions by distance.
      </p>
    </section>
  );
}
