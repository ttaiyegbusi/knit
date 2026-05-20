"use client";

import { Plus, User, Sparkles, Settings, Search, Users, Bell } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-canvas">
      <div className="flex min-h-screen">
        {/* Left icon rail */}
        <aside className="hidden w-[68px] shrink-0 flex-col items-center gap-3 border-r border-line bg-surface py-5 sm:flex">
          <div className="knit-mark mb-2 h-9 w-9" aria-label="Knit" />
          <RailButton active={false} aria-label="New">
            <div className="rounded-xl border border-dashed border-rose-300 p-2 text-rose-400">
              <Plus className="h-4 w-4" />
            </div>
          </RailButton>
          <RailButton aria-label="Profile">
            <User className="h-5 w-5" />
          </RailButton>
          <RailButton active aria-label="Suggestions">
            <Sparkles className="h-5 w-5" />
          </RailButton>
          <RailButton aria-label="Settings">
            <Settings className="h-5 w-5" />
          </RailButton>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex items-center justify-between gap-4 px-5 py-3.5">
            <div className="flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-sm font-medium text-ink shadow-sm">
              <Sparkles className="h-4 w-4 text-ink-soft" />
              Smart Suggestion
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full bg-surface px-3.5 py-2 text-sm text-ink-faint shadow-sm md:flex">
                <Search className="h-4 w-4" />
                <span className="w-40">Search</span>
              </div>
              <button className="grid h-9 w-9 place-items-center rounded-full bg-surface text-ink-soft shadow-sm">
                <Users className="h-4 w-4" />
              </button>
              <button className="grid h-9 w-9 place-items-center rounded-full bg-surface text-ink-soft shadow-sm">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Content surface */}
          <main className="flex-1 px-3 pb-6 sm:px-5">
            <div className="mx-auto h-full w-full max-w-5xl rounded-t-[2rem] bg-surface px-4 pt-8 shadow-sm sm:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function RailButton({
  children,
  active,
  ...rest
}: {
  children: React.ReactNode;
  active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`grid h-10 w-10 place-items-center rounded-xl transition ${
        active
          ? "bg-ink/5 text-ink"
          : "text-ink-soft hover:bg-ink/5 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
