"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import type { Suggestion } from "@/lib/types";
import { getCategory } from "@/lib/categories";

const EVENT_TYPE_BY_CATEGORY: Record<string, string> = {
  eat_out: "Dinner",
  play_sport: "Sports session",
  grab_drink: "Drinks",
  do_fun: "Hangout",
};

export function EventSheet({
  suggestion,
  onClose,
}: {
  suggestion: Suggestion;
  onClose: () => void;
}) {
  const cat = getCategory(suggestion.category);

  // Pre-filled from the suggestion — this is the "hard work already done" part.
  const [title, setTitle] = useState(
    suggestion.category === "eat_out"
      ? `Dinner at ${suggestion.name}`
      : `${EVENT_TYPE_BY_CATEGORY[suggestion.category]} · ${suggestion.name}`,
  );
  const [eventType] = useState(EVENT_TYPE_BY_CATEGORY[suggestion.category]);
  const [location] = useState(
    `${suggestion.name} — ${suggestion.proximity.area}`,
  );

  // Left for the user to complete — pre-fill reduces effort, doesn't replace it.
  const [when, setWhen] = useState("");
  const [note, setNote] = useState("");
  const [published, setPublished] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-0 sm:items-center sm:p-4">
      <div className="animate-rise w-full max-w-lg overflow-hidden rounded-t-3xl bg-surface shadow-soft sm:rounded-3xl">
        {published ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-accent/10 text-accent">
              <Check className="h-7 w-7" />
            </div>
            <h3 className="font-display text-xl text-ink">Added to your Knit</h3>
            <p className="max-w-xs text-sm text-ink-soft">
              &ldquo;{title}&rdquo; is live. Your friends will see it and can RSVP.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                  New Knit event
                </p>
                <p className="text-sm text-ink-soft">
                  We&apos;ve filled in what we know — add the rest.
                </p>
              </div>
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition hover:bg-ink/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <Field label="Title" prefilled>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent text-base font-medium text-ink outline-none"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Type" prefilled>
                  <span className="text-sm text-ink">{eventType}</span>
                </Field>
                <Field label="Category" prefilled>
                  <span className="text-sm text-ink">
                    {cat.label} · {suggestion.subcategory}
                  </span>
                </Field>
              </div>

              <Field label="Location" prefilled>
                <span className="text-sm text-ink">{location}</span>
              </Field>

              <Field label="When" required>
                <input
                  type="datetime-local"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  className="w-full bg-transparent text-sm text-ink outline-none"
                />
              </Field>

              <Field label="A note for your friends" optional>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Anything you want them to know?"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                />
              </Field>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-line px-5 py-4">
              <button
                onClick={onClose}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition hover:text-ink"
              >
                Cancel
              </button>
              <button
                onClick={() => setPublished(true)}
                disabled={!when}
                className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
              >
                Publish to my Knit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  prefilled,
  required,
  optional,
}: {
  label: string;
  children: React.ReactNode;
  prefilled?: boolean;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label className="block rounded-xl border border-line bg-surface-muted px-3.5 py-2.5">
      <span className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
        {label}
        {prefilled && (
          <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] normal-case text-accent">
            pre-filled
          </span>
        )}
        {required && <span className="text-rose-400">·  required</span>}
        {optional && <span className="normal-case text-ink-faint">· optional</span>}
      </span>
      {children}
    </label>
  );
}
