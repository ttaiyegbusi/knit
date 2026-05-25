"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  LayoutGrid,
  MessageCircle,
  Users,
  CalendarDays,
  MapPin,
  Settings,
  Search,
  Plus,
  Bell,
  Clock,
  Gem,
  Sparkles,
  UserPlus,
  Megaphone,
  MoreHorizontal,
  QrCode,
  Copy,
  ArrowUpRight,
  Pin,
  Info,
} from "lucide-react";
import { Logo } from "./Logo";
import { MessagesScreen } from "./MessagesScreen";
import { MembersScreen } from "./MembersScreen";
import { PlacesScreen } from "./PlacesScreen";
import { ArenaScreen } from "./ArenaScreen";
import { AvailabilityScreen } from "./AvailabilityScreen";
import { WORKSPACES, type KnitId, type KnitData } from "@/lib/workspaces";

/**
 * The workspace + Event Details screen (Place_Details.png). A separate
 * top-level view from the Suggestion flow, opened from a workspace tile in the
 * rail. Three columns: slim icon rail · expanded workspace sidebar · event
 * details main surface.
 */
type Section = "arena" | "events" | "messages" | "members" | "places" | "availability";

export function WorkspaceScreen({ onBack }: { onBack: () => void }) {
  const [expanded, setExpanded] = useState(true);
  const [section, setSection] = useState<Section>("events");
  const [activeKnit, setActiveKnit] = useState<KnitId>("pink");
  const knit = WORKSPACES[activeKnit];

  function switchKnit(id: KnitId) {
    setActiveKnit(id);
    setExpanded(true);
  }

  return (
    <>
      <div className="app-bg" />
      <div className="flex h-screen gap-3 p-3 sm:gap-4 sm:p-4">
        {/* ── ONE unified sidebar: rail strip + animated menu region ─────── */}
        <aside className="flex h-full shrink-0 overflow-hidden rounded-[1.25rem] bg-surface/95 shadow-soft backdrop-blur-sm">
          {/* Rail strip */}
          <div className="flex w-[72px] shrink-0 flex-col items-center py-3">
            <div className="pb-3">
              <Logo size={34} />
            </div>
            <div className="mb-3 h-px w-9 bg-line" />

            <button
              aria-label="New"
              className="mb-3 grid h-11 w-11 place-items-center rounded-xl border border-dashed border-rose-300 text-rose-400 transition hover:bg-rose-50"
            >
              <Plus className="h-5 w-5" />
            </button>

            {/* Workspace tiles — switch between Knits */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => switchKnit("pink")}
                className={`relative overflow-hidden rounded-[10px] transition hover:opacity-90 ${
                  activeKnit === "pink" ? "ring-2 ring-[#FF4275]" : ""
                }`}
              >
                {activeKnit === "pink" && (
                  <span className="absolute -left-[6px] top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-[#FF4275]" />
                )}
                <Image src="/tile-pink.svg" alt="" width={38} height={38} unoptimized />
              </button>
              <button
                onClick={() => switchKnit("orange")}
                className={`relative overflow-hidden rounded-[10px] transition hover:opacity-90 ${
                  activeKnit === "orange" ? "ring-2 ring-[#FF4275]" : ""
                }`}
              >
                {activeKnit === "orange" && (
                  <span className="absolute -left-[6px] top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-[#FF4275]" />
                )}
                <Image src="/tile-orange.svg" alt="" width={38} height={38} unoptimized />
              </button>
            </div>

            <div className="my-3 h-px w-9 bg-line" />

            {/* Suggestions (star) */}
            <RailIcon onClick={onBack} aria-label="Suggestions">
              <Sparkles className="h-5 w-5" />
            </RailIcon>

            {/* Bottom utilities */}
            <div className="mt-auto flex flex-col items-center gap-1.5">
              <RailIcon aria-label="History">
                <Clock className="h-5 w-5" />
              </RailIcon>
              <RailIcon aria-label="Saved">
                <Gem className="h-5 w-5" />
              </RailIcon>
              <RailIcon aria-label="Settings">
                <Settings className="h-5 w-5" />
              </RailIcon>
            </div>
          </div>

          {/* Animated menu region — part of the SAME surface (hairline divider) */}
          <div
            className="h-full overflow-hidden border-l border-line transition-[width] duration-[360ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ width: expanded ? 260 : 0 }}
          >
            <div
              className={`flex h-full w-[260px] flex-col p-4 transition-opacity duration-300 ${
                expanded ? "opacity-100 delay-100" : "opacity-0"
              }`}
            >
              {/* Logo lockup + collapse */}
              <div className="mb-4 flex items-center justify-between px-1">
                <Image
                  src="/knit-wordmark.svg"
                  alt="Knit"
                  width={72}
                  height={24}
                  priority
                  unoptimized
                />
                <button
                  onClick={() => setExpanded(false)}
                  aria-label="Collapse sidebar"
                  className="text-ink-soft transition hover:text-ink"
                >
                  <PanelLeft className="h-5 w-5" />
                </button>
              </div>

              {/* Workspace card */}
              <div className="relative mb-5 overflow-hidden rounded-2xl bg-rose-50 p-4">
                <svg
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-12 w-full text-rose-200/70"
                  viewBox="0 0 260 48"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path d="M0 28C40 14 80 40 130 30S220 8 260 22V48H0V28Z" fill="currentColor" />
                  <path d="M0 38C50 26 90 46 140 38S230 24 260 34V48H0V38Z" fill="currentColor" opacity="0.6" />
                </svg>
                <p className="relative text-sm font-semibold leading-snug text-ink">
                  {knit.name}
                </p>
              </div>

              <NavSection label="Core">
                <NavItem
                  icon={LayoutGrid}
                  label="Arena"
                  active={section === "arena"}
                  onClick={() => setSection("arena")}
                />
                <NavItem
                  icon={MessageCircle}
                  label="Messages"
                  badge={3}
                  active={section === "messages"}
                  onClick={() => setSection("messages")}
                />
                <NavItem
                  icon={Users}
                  label="Members"
                  active={section === "members"}
                  onClick={() => setSection("members")}
                />
                <NavItem
                  icon={CalendarDays}
                  label="Events"
                  active={section === "events"}
                  onClick={() => setSection("events")}
                />
              </NavSection>

              <NavSection label="Manage">
                <NavItem
                  icon={Clock}
                  label="Availability"
                  active={section === "availability"}
                  onClick={() => setSection("availability")}
                />
                <NavItem
                  icon={MapPin}
                  label="Places"
                  active={section === "places"}
                  onClick={() => setSection("places")}
                />
                <NavItem icon={Settings} label="Settings" />
              </NavSection>

              <NavSection label="Share">
                <NavItem icon={QrCode} label="Share and Invite" />
              </NavSection>

              {/* Share-with-friends card */}
              <div className="mt-auto rounded-2xl bg-surface-muted p-4">
                <div className="mb-2 flex -space-x-2">
                  {[
                    { i: "JA", c: "bg-sky-400" },
                    { i: "SK", c: "bg-violet-500" },
                    { i: "AB", c: "bg-emerald-500" },
                  ].map((a) => (
                    <span
                      key={a.i}
                      className={`grid h-7 w-7 place-items-center rounded-full ${a.c} text-[10px] font-semibold text-white ring-2 ring-surface`}
                    >
                      {a.i}
                    </span>
                  ))}
                </div>
                <p className="text-sm font-semibold text-ink">Share with friends</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                  Invite your friends to knit and have fun
                </p>
                <button className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#FF4275] hover:underline">
                  Send invite <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main column: top toolbar + active section content ────────── */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          <header className="flex shrink-0 items-center justify-between gap-4">
            {section === "events" ? (
              <button
                onClick={onBack}
                className="flex items-center gap-2 rounded-full bg-surface/90 px-4 py-2 text-sm font-semibold text-ink shadow-soft backdrop-blur-sm transition hover:bg-surface"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-surface/90 px-4 py-2.5 text-sm font-semibold text-ink shadow-soft backdrop-blur-sm">
                {section === "arena" ? (
                  <LayoutGrid className="h-4 w-4" />
                ) : section === "messages" ? (
                  <MessageCircle className="h-4 w-4" />
                ) : section === "members" ? (
                  <Users className="h-4 w-4" />
                ) : section === "availability" ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {section === "arena"
                  ? "Arena"
                  : section === "messages"
                    ? "Messages"
                    : section === "members"
                      ? "Members"
                      : section === "availability"
                        ? "Availability"
                        : "Places"}
              </span>
            )}

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full bg-surface/90 px-4 py-2.5 text-sm text-ink-faint shadow-soft backdrop-blur-sm md:flex">
                <Search className="h-4 w-4" />
                <span className="w-44">Search</span>
              </div>
              {section === "members" ? (
                <button className="inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-4 py-2.5 text-sm font-semibold text-[#FF4275] shadow-soft backdrop-blur-sm transition hover:bg-surface">
                  <Plus className="h-4 w-4" />
                  Add member
                </button>
              ) : section === "places" ? (
                <button className="inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-4 py-2.5 text-sm font-semibold text-[#FF4275] shadow-soft backdrop-blur-sm transition hover:bg-surface">
                  <Plus className="h-4 w-4" />
                  Add a place
                </button>
              ) : section === "events" ? (
                <button className="inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-4 py-2.5 text-sm font-semibold text-[#FF4275] shadow-soft backdrop-blur-sm transition hover:bg-surface">
                  <Plus className="h-4 w-4" />
                  Create event
                </button>
              ) : (
                <button className="grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-ink-soft shadow-soft backdrop-blur-sm transition hover:text-ink">
                  <Info className="h-4 w-4" />
                </button>
              )}
              <button className="grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-ink-soft shadow-soft backdrop-blur-sm transition hover:text-ink">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-hidden rounded-[1.25rem] bg-surface shadow-soft">
            <div className="h-full overflow-y-auto p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:p-8">
              {section === "arena" && <ArenaScreen knit={knit} />}
              {section === "events" && <EventDetails knit={knit} />}
              {section === "messages" && <MessagesScreen key={activeKnit} knit={knit} />}
              {section === "members" && <MembersScreen key={activeKnit} knit={knit} />}
              {section === "availability" && <AvailabilityScreen knit={knit} />}
              {section === "places" && (
                <PlacesScreen onPlanEvent={() => setSection("events")} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EventDetails({ knit }: { knit: KnitData }) {
  const e = knit.event;
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Left — hero + mini toolbar + share */}
      <div className="flex gap-4 lg:w-[46%]">
        {/* Mini vertical toolbar */}
        <div className="flex h-fit flex-col items-center gap-1 rounded-2xl bg-surface-muted p-1.5">
          <ToolButton icon={MoreHorizontal} label="Manage" />
          <ToolButton icon={UserPlus} label="Invite" />
          <ToolButton icon={Megaphone} label="Blast" />
          <ToolButton icon={MoreHorizontal} label="More" />
        </div>

        {/* Hero image + share */}
        <div className="flex-1">
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src="/flame.png"
              alt="Event artwork"
              width={1080}
              height={1080}
              unoptimized
              className="w-full"
            />
            {/* Share link bar overlaid near the bottom of the artwork */}
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl bg-surface/85 px-3 py-2 text-xs shadow-soft backdrop-blur">
              <span className="inline-flex items-center gap-1 text-ink-soft">
                knitevent.com/share
                <ArrowUpRight className="h-3 w-3" />
              </span>
              <button className="inline-flex items-center gap-1 font-semibold text-ink transition hover:text-[#FF4275]">
                COPY <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>
          <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface-muted px-4 py-2 text-sm font-medium text-ink transition hover:bg-ink/5">
            <QrCode className="h-4 w-4" />
            Download Event QR
          </button>
        </div>
      </div>

      {/* Right — details */}
      <div className="flex-1 space-y-6">
        <div>
          <p className="mb-1 inline-flex items-center gap-2 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1">
              <Users className="h-4 w-4 text-[#FF4275]" /> {e.category}
            </span>
            · Public
          </p>
          <h1 className="font-display text-3xl text-ink">{e.title}</h1>
          <p className="mt-1 text-sm text-ink-soft">{e.datetime}</p>
        </div>

        <div>
          <p className="mb-1 text-sm font-semibold text-ink">Location</p>
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <Pin className="h-4 w-4 text-[#FF4275]" />
            {e.location}
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Guests</p>
            <button className="text-sm font-semibold text-[#FF4275] hover:underline">
              View
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat n="4" label="Attending" />
            <Stat n="23" label="Pending" />
            <Stat n="1" label="Declined" />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Hosted by</p>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-300 text-xs font-semibold text-white">
              {e.hostInitials}
            </span>
            <span className="text-sm text-ink">
              {e.host} <span className="text-ink-faint">[You]</span>
            </span>
          </div>
        </div>

        <div>
          <p className="mb-1 text-sm font-semibold text-ink">About Event</p>
          <p className="text-sm leading-relaxed text-ink-soft">{e.about}</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Event kit</p>
          <div className="space-y-3">
            <KitItem
              text="Picnic snacks and drinks. Non alcoholic items only"
              assignee="None"
              pill="Unassign"
            />
            <KitItem
              text="Tent and shade"
              assignee="All Guest"
              avatars={["AB", "BC"]}
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Blasts</p>
          <div className="flex items-start gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-300 text-xs font-semibold text-white">
              {e.hostInitials}
            </span>
            <div>
              <p className="text-sm text-ink">
                {e.host} <span className="text-ink-faint">[Host]</span>
                <span className="ml-2 text-xs text-ink-faint">2hrs ago</span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{e.about}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RailIcon({
  children,
  ...rest
}: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="grid h-11 w-11 place-items-center rounded-xl text-ink-soft transition hover:bg-ink/5 hover:text-ink"
    >
      {children}
    </button>
  );
}

function NavSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <p className="mb-1.5 px-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition ${
        active
          ? "bg-ink/5 font-semibold text-ink"
          : "text-ink-soft hover:bg-ink/5 hover:text-ink"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
      {badge !== undefined && (
        <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-[#FF4275]/10 px-1 text-xs font-semibold text-[#FF4275]">
          {badge}
        </span>
      )}
    </button>
  );
}

function ToolButton({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button className="flex w-14 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium text-ink-soft transition hover:bg-ink/5 hover:text-ink">
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-xl bg-surface-muted py-3 text-center">
      <p className="text-lg font-semibold text-ink">{n}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  );
}

function KitItem({
  text,
  assignee,
  pill,
  avatars,
}: {
  text: string;
  assignee: string;
  pill?: string;
  avatars?: string[];
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-sm text-ink">
        <Pin className="h-4 w-4 text-[#FF4275]" />
        {text}
      </p>
      <div className="mt-1 flex items-center justify-between pl-6">
        <span className="text-xs text-ink-soft">
          Assigned to <span className="text-[#FF4275]">{assignee}</span>
        </span>
        {pill && (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-[#FF4275]">
            <UserPlus className="h-3 w-3" />
            {pill}
          </span>
        )}
        {avatars && (
          <span className="flex -space-x-1.5">
            {avatars.map((a, i) => (
              <span
                key={i}
                className="grid h-5 w-5 place-items-center rounded-full bg-violet-400 text-[8px] font-semibold text-white ring-2 ring-surface"
              >
                {a}
              </span>
            ))}
            <span className="grid h-5 w-5 place-items-center rounded-full bg-ink/10 text-[8px] font-semibold text-ink-soft ring-2 ring-surface">
              3+
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
