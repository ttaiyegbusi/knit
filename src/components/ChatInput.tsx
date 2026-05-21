"use client";

import { useState } from "react";
import { Plus, ArrowUp } from "lucide-react";
import { Logo } from "./Logo";

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
        <Logo size={16} />
        Start a New Chat
      </div>

      {/* NESTED inner container — borderless, fixed 90px height. The "+",
          the text, and the send button all sit together on one bottom row. */}
      <div className="flex h-[90px] items-end gap-2 rounded-xl bg-surface px-3 py-3">
        {/* "+" affordance */}
        <button
          aria-label="Add"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-ink-faint transition hover:bg-ink/5"
        >
          <Plus className="h-4 w-4" />
        </button>

        {/* Text input — single-line input centers its text on the same line
            as the "+", unlike a textarea which top-anchors its content */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Type in here...."
          className="h-7 flex-1 bg-transparent text-sm leading-7 text-ink outline-none placeholder:text-ink-faint"
        />

        {/* Circular send button */}
        <button
          onClick={submit}
          aria-label="Send"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-muted text-ink-soft shadow-soft transition hover:bg-ink/5 disabled:opacity-40"
          disabled={!text.trim()}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
