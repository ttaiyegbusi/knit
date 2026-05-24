"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Smile, ArrowUp, MapPin } from "lucide-react";

type Msg =
  | { kind: "system"; id: string; actor: string; verb: string; rest: string }
  | { kind: "divider"; id: string; label: string }
  | { kind: "in"; id: string; sender: string; avatar?: string; text: string; online?: boolean }
  | { kind: "out"; id: string; text: string }
  | { kind: "location"; id: string; sender: string; label: string }
  | { kind: "activity"; id: string; pre: string; keyword: string; post: string };

const SEED: Msg[] = [
  { kind: "system", id: "s1", actor: "John", verb: "created", rest: "Erstwhile Accounting Class 22" },
  { kind: "divider", id: "d1", label: "Today" },
  { kind: "system", id: "s2", actor: "John", verb: "added", rest: "Fouad" },
  { kind: "system", id: "s3", actor: "John", verb: "added", rest: "Temitope" },
  { kind: "system", id: "s4", actor: "John", verb: "added", rest: "Fouad" },
  { kind: "out", id: "o1", text: "hey Temitope" },
  { kind: "out", id: "o2", text: "I have gotten your message, I'll send it across board for error" },
  { kind: "in", id: "i1", sender: "Temitope", text: "hey John", online: true },
  { kind: "in", id: "i2", sender: "Temitope", text: "Alright' thank you, also check the groom designs on figma", online: true },
  { kind: "in", id: "i3", sender: "Fouad", text: "Hi guys, please check the designs ASAP", online: true },
  { kind: "out", id: "o3", text: "Alrightttt." },
  { kind: "location", id: "l1", sender: "Fouad", label: "Ajao Estate, Lag…" },
  { kind: "activity", id: "a1", pre: "Fouad added a", keyword: "place", post: "to the group list" },
];

export function MessagesScreen() {
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { kind: "out", id: `o-${Date.now()}`, text: t }]);
    setText("");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {messages.map((m) => (
          <MessageRow key={m.id} m={m} />
        ))}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="flex items-center gap-2 pt-3">
        <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-muted text-ink-soft transition hover:bg-ink/5">
          <Plus className="h-5 w-5" />
        </button>
        <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-muted text-ink-soft transition hover:bg-ink/5">
          <Smile className="h-5 w-5" />
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Aa"
          className="h-11 flex-1 rounded-full bg-surface-muted px-4 text-sm text-ink outline-none placeholder:text-ink-faint"
        />
        <button
          onClick={send}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-muted text-ink transition hover:bg-ink/5"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function MessageRow({ m }: { m: Msg }) {
  if (m.kind === "system") {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-surface-muted px-3 py-1 text-xs text-ink">
          <span className="font-medium">{m.actor}</span>{" "}
          <span className="text-ink-faint">{m.verb}</span>{" "}
          <span className="font-medium">{m.rest}</span>
        </span>
      </div>
    );
  }
  if (m.kind === "divider") {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-surface-muted px-3 py-1 text-xs text-ink-soft">
          {m.label}
        </span>
      </div>
    );
  }
  if (m.kind === "out") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[60%] rounded-2xl rounded-tr-md bg-[#FF4275] px-4 py-2.5 text-sm text-white">
          {m.text}
        </p>
      </div>
    );
  }
  if (m.kind === "in") {
    return (
      <div className="flex items-end gap-2">
        <Avatar sender={m.sender} online={m.online} />
        <div>
          <p className="mb-1 ml-1 text-xs text-ink-soft">{m.sender}</p>
          <p className="max-w-[60%] rounded-2xl rounded-tl-md bg-surface-muted px-4 py-2.5 text-sm text-ink">
            {m.text}
          </p>
        </div>
      </div>
    );
  }
  if (m.kind === "location") {
    return (
      <div className="flex items-end gap-2">
        <Avatar sender={m.sender} online />
        <div>
          <p className="mb-1 ml-1 text-xs text-ink-soft">{m.sender}</p>
          <div className="w-44 overflow-hidden rounded-2xl rounded-tl-md bg-surface-muted">
            <div
              className="relative grid h-28 place-items-center"
              style={{
                backgroundColor: "#e8eef5",
                backgroundImage:
                  "linear-gradient(120deg,#dde7f0,#eef2f7 60%),repeating-linear-gradient(45deg,rgba(148,163,184,0.18) 0 1px,transparent 1px 14px)",
              }}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#FF4275] text-white shadow">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="absolute bottom-2 left-2 rounded-md bg-surface/90 px-1.5 py-0.5 text-[10px] font-medium text-ink">
                {m.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // activity
  return (
    <div className="flex items-center gap-2">
      <Avatar sender="Fouad" online />
      <p className="rounded-2xl rounded-tl-md bg-surface-muted px-4 py-2.5 text-sm italic text-ink-soft">
        {m.pre} <span className="font-medium not-italic text-[#FF4275]">{m.keyword}</span> {m.post}
      </p>
    </div>
  );
}

function Avatar({ sender, online }: { sender: string; online?: boolean }) {
  const initials = sender.slice(0, 2).toUpperCase();
  return (
    <div className="relative shrink-0">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-ink/10 text-xs font-semibold text-ink-soft">
        {initials}
      </span>
      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
      )}
    </div>
  );
}
