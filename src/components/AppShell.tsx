"use client";

import { Plus, User, Sparkles, Settings, Search, Users, Bell } from "lucide-react";

/**
 * Layout geometry (corrected):
 *  - The background image fills the viewport; everything floats on it.
 *  - Two floating columns share the SAME top line and SAME bottom line:
 *      • the sidebar (narrow, left)
 *      • the nav + content surface (right)
 *  - Within the right column, the top nav row and the white surface share the
 *    exact same left/right bounds, so they read as one aligned column.
 *  - Both columns are rounded and detached from every screen edge; the
 *    background shows through the gutters.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="app-bg" />

      <div className="flex h-screen gap-3 p-3 sm:gap-4 sm:p-4">
        {/* ── Floating sidebar ─────────────────────────────────────────── */}
        <aside className="flex w-[72px] shrink-0 flex-col items-center rounded-[10px] bg-surface/90 py-3 shadow-soft backdrop-blur-sm">
          {/* Brand tile + divider */}
          <div className="flex w-full flex-col items-center pb-3">
            <div className="knit-mark h-9 w-9" aria-label="Knit" />
          </div>
          <div className="mb-3 h-px w-9 bg-line" />

          {/* New (dashed pink "+") */}
          <button
            aria-label="New"
            className="mb-2 grid h-11 w-11 place-items-center rounded-xl border border-dashed border-rose-300 text-rose-400 transition hover:bg-rose-50"
          >
            <Plus className="h-5 w-5" />
          </button>

          {/* Icon tiles */}
          <nav className="flex flex-col items-center gap-1.5">
            <RailButton aria-label="Profile">
              <User className="h-5 w-5" />
            </RailButton>
            <RailButton active aria-label="Suggestions">
              <Sparkles className="h-5 w-5" />
            </RailButton>
            <RailButton aria-label="Settings">
              <Settings className="h-5 w-5" />
            </RailButton>
          </nav>
        </aside>

        {/* ── Right column: nav row + content surface, shared bounds ─────── */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          {/* Top nav row */}
          <header className="flex shrink-0 items-center justify-between gap-4">
            <div className="flex items-center gap-2 rounded-full bg-surface/90 px-4 py-2 text-sm font-semibold text-ink shadow-soft backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-ink-soft" />
              Smart Suggestion
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full bg-surface/90 px-4 py-2.5 text-sm text-ink-faint shadow-soft backdrop-blur-sm md:flex">
                <Search className="h-4 w-4" />
                <span className="w-44">Search</span>
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-ink-soft shadow-soft backdrop-blur-sm transition hover:text-ink">
                <Users className="h-4 w-4" />
              </button>
              <button className="grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-ink-soft shadow-soft backdrop-blur-sm transition hover:text-ink">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Content surface frame — scrolls internally. */}
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.25rem] bg-surface shadow-soft">
            <main className="h-full overflow-y-auto px-5 py-7 sm:px-8 sm:py-9">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
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
      className={`grid h-11 w-11 place-items-center rounded-xl transition ${
        active
          ? "bg-ink/5 text-ink"
          : "text-ink-soft hover:bg-ink/5 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
