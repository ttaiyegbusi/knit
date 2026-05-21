"use client";

import { useState } from "react";
import { Plus, ArrowUp } from "lucide-react";

/**
 * Chat block — matched to chat.png:
 *  - An OUTER container (rounded, subtle fill) that holds a header row
 *    ("Start a New Chat" with the brand mark) at the top…
 *  - …and a NESTED inner container below it: the white input surface, 90px
 *    tall, holding the "+" affordance, the placeholder, and the circular
 *    send button pinned bottom-right.
 *  Padding is intentionally non-conventional and set explicitly.
 */
export function ChatInput({
  onSubmit,
}: {
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState("");

  function submit() {
    const t = text.trim();
    if (!t) return;
    onSubmit(t);
    setText("");
  }

  return (
    // OUTER container — 4px padding all round, no border
    <div className="rounded-2xl bg-surface-muted/60 p-1">
      {/* Header row */}
      <div className="mb-1.5 flex items-center gap-2 px-2 pt-1.5 text-sm font-semibold text-ink">
        <span className="knit-mark h-4 w-4" />
        Start a New Chat
      </div>

      {/* NESTED inner container — the input surface, fixed 90px height */}
      <div className="relative h-[90px] rounded-xl border border-line bg-surface">
        {/* "+" affordance, bottom-left */}
        <button
          aria-label="Add"
          className="absolute bottom-3 left-3 grid h-7 w-7 place-items-center rounded-lg text-ink-faint transition hover:bg-ink/5"
        >
          <Plus className="h-4 w-4" />
        </button>

        {/* Text input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Type in here...."
          className="absolute inset-x-11 top-3 bottom-3 resize-none bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
        />

        {/* Circular send button, bottom-right */}
        <button
          onClick={submit}
          aria-label="Send"
          className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-surface-muted text-ink-soft shadow-soft transition hover:bg-ink/5 disabled:opacity-40"
          disabled={!text.trim()}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
