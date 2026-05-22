"use client";

import { useRef, useState } from "react";
import { Plus, ArrowUp } from "lucide-react";
import { Logo } from "./Logo";

/**
 * Chat block — outer container with the "Start a New Chat" header, and a
 * nested 90px input row holding the "+", the text, and the send button.
 * The "+" opens a file picker when onAttach is provided.
 */
export function ChatInput({
  onSubmit,
  onAttach,
}: {
  onSubmit: (text: string) => void;
  onAttach?: (files: FileList | null) => void;
}) {
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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
        {/* "+" affordance — opens the file picker */}
        <input
          ref={fileRef}
          type="file"
          multiple
          hidden
          onChange={(e) => onAttach?.(e.target.files)}
        />
        <button
          aria-label="Add attachment"
          onClick={() => fileRef.current?.click()}
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
