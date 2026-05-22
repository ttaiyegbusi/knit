"use client";

import { X } from "lucide-react";

// Knit-flavored sample history, grouped by date. Structured so real stored
// sessions slot in later behind the same shape.
const HISTORY: { group: string; items: string[] }[] = [
  {
    group: "Today",
    items: [
      "Nigerian Food Cuisine",
      "Padel courts near Lekki",
      "Cocktail bars in Victoria Island",
      "Live music this weekend",
    ],
  },
  {
    group: "Yesterday",
    items: [
      "Brunch spots for 6 people",
      "Tennis courts nearby",
      "Coffee near the office",
      "Art galleries to visit",
    ],
  },
  {
    group: "21st May 2026",
    items: [
      "Italian dinner for a date",
      "Football pitches to book",
      "Craft beer tasting",
      "Bowling with the team",
    ],
  },
];

export function SuggestionHistory({ onClose }: { onClose: () => void }) {
  return (
    <Drawer title="Suggestion History" onClose={onClose}>
      <div className="space-y-6">
        {HISTORY.map((section) => (
          <div key={section.group}>
            <p className="mb-2 text-sm text-ink-faint">{section.group}</p>
            <div className="space-y-1">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  className="block w-full truncate rounded-lg px-2 py-2 text-left text-sm text-ink transition hover:bg-surface-muted"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
}

// Shared drawer chrome (also used by Attachments).
export function Drawer({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col rounded-[1.25rem] bg-surface shadow-soft">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-ink/5"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </aside>
  );
}
