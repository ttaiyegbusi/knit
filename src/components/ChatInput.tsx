"use client";

import { useState } from "react";
import { Plus, ArrowUp } from "lucide-react";

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
    <div className="rounded-2xl bg-surface-muted p-3">
      <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink-soft">
        <span className="knit-mark h-4 w-4" />
        Or just tell us
      </div>
      <div className="flex items-end gap-2 rounded-xl bg-surface px-3 py-2 shadow-sm">
        <button className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-faint transition hover:bg-ink/5">
          <Plus className="h-4 w-4" />
        </button>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="e.g. Italian dinner near me…"
          className="max-h-24 flex-1 resize-none bg-transparent py-1.5 text-sm text-ink outline-none placeholder:text-ink-faint"
        />
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-white transition disabled:opacity-30"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
