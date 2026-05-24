"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronsRight,
  ExternalLink,
  X,
  CalendarDays,
} from "lucide-react";
import {
  PLACES,
  BUCKET_LABEL,
  type Place,
  type PlaceBucket,
  type PlaceList,
} from "@/lib/places";

type Filter = "all" | PlaceBucket;

export function PlacesScreen({ onPlanEvent }: { onPlanEvent: (name: string) => void }) {
  const [places, setPlaces] = useState<Place[]>(PLACES);
  const [tab, setTab] = useState<PlaceList>("personal");
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const inTab = useMemo(() => places.filter((p) => p.list === tab), [places, tab]);
  const counts = {
    soon: inTab.filter((p) => p.bucket === "soon").length,
    later: inTab.filter((p) => p.bucket === "later").length,
    much_later: inTab.filter((p) => p.bucket === "much_later").length,
  };
  const visible = filter === "all" ? inTab : inTab.filter((p) => p.bucket === filter);
  const open = places.find((p) => p.id === openId) ?? null;

  function deletePlace(id: string) {
    setPlaces((ps) => ps.filter((p) => p.id !== id));
    setOpenId(null);
  }
  function addToGroup(id: string) {
    setPlaces((ps) => ps.map((p) => (p.id === id ? { ...p, list: "group" } : p)));
    setOpenId(null);
  }

  return (
    <div className="relative h-full">
      {/* Tabs */}
      <div className="mb-5 flex items-center gap-6 border-b border-line">
        {(["personal", "group"] as PlaceList[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 pb-3 text-sm capitalize transition ${
              tab === t
                ? "border-[#FF4275] font-semibold text-ink"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Filter chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </Chip>
        <Chip active={filter === "soon"} onClick={() => setFilter("soon")}>
          Soon [{counts.soon}]
        </Chip>
        <Chip active={filter === "later"} onClick={() => setFilter("later")}>
          Later [{counts.later}]
        </Chip>
        <Chip active={filter === "much_later"} onClick={() => setFilter("much_later")}>
          Much Later [{counts.much_later}]
        </Chip>
      </div>

      {/* Cards grid */}
      {visible.length === 0 ? (
        <p className="text-sm text-ink-soft">No places here yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <PlaceCard key={p.id} place={p} onOpen={() => setOpenId(p.id)} />
          ))}
        </div>
      )}

      {/* Detail panel + backdrop */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-ink/20"
            onClick={() => setOpenId(null)}
          />
          <PlaceDetail
            place={open}
            onClose={() => setOpenId(null)}
            onDelete={() => deletePlace(open.id)}
            onPlanEvent={() => {
              onPlanEvent(open.subtitle);
              setOpenId(null);
            }}
            onAddToGroup={() => addToGroup(open.id)}
          />
        </>
      )}
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-[#FF4275]/10 text-[#FF4275]"
          : "bg-surface-muted text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function PlaceCard({ place: p, onOpen }: { place: Place; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="flex flex-col rounded-2xl border border-line p-3 text-left transition hover:shadow-soft"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-lg" style={mapTexture}>
          <MapPin className={`h-5 w-5 ${p.pinColor}`} fill="currentColor" />
        </div>
        <span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-medium text-ink-soft">
          {BUCKET_LABEL[p.bucket]}
        </span>
      </div>
      <p className="font-semibold text-ink">{p.name}</p>
      <p className="mt-0.5 text-sm text-ink-soft">
        {p.city} · {p.country}
      </p>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-2">
        <span className={`text-sm ${p.visits > 0 ? "text-[#FF4275]" : "text-ink-soft"}`}>
          {p.visits > 0 ? `Visited ${p.visits} times` : "Not Visited"}
        </span>
        <MoreHorizontal className="h-4 w-4 text-ink-faint" />
      </div>
    </button>
  );
}

function PlaceDetail({
  place: p,
  onClose,
  onDelete,
  onPlanEvent,
  onAddToGroup,
}: {
  place: Place;
  onClose: () => void;
  onDelete: () => void;
  onPlanEvent: () => void;
  onAddToGroup: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[460px] animate-rise flex-col overflow-y-auto bg-surface shadow-soft [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5">
        <button onClick={onClose} className="flex items-center gap-2 text-ink transition hover:text-ink-soft">
          <ChevronsRight className="h-5 w-5" />
          <span className="font-semibold">Knit Place</span>
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-ink/5"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-xl bg-surface py-1 shadow-soft ring-1 ring-line">
                <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-ink transition hover:bg-surface-muted">
                  <Pencil className="h-4 w-4" /> Edit place
                </button>
                <button
                  onClick={onDelete}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#FF4275] transition hover:bg-surface-muted"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-5 px-5 py-4">
        {/* Map */}
        <div className="relative h-44 overflow-hidden rounded-2xl" style={mapTexture}>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <MapPin className={`h-8 w-8 ${p.pinColor}`} fill="currentColor" />
          </span>
          <button className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-xs font-medium text-ink shadow-soft">
            Google map <ExternalLink className="h-3 w-3" />
          </button>
        </div>

        <p className="text-sm text-ink-soft">
          {p.list === "personal" ? "Personal list" : "Group list"} ·{" "}
          {p.visits > 0 ? `Visited ${p.visits} times` : "Not visited"}
        </p>

        <div>
          <h2 className="font-display text-2xl text-ink">{p.subtitle}</h2>
          <p className={`mt-1 text-sm leading-relaxed text-ink-soft ${expanded ? "" : "line-clamp-2"}`}>
            {p.description}
          </p>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-sm font-semibold text-[#FF4275] hover:underline"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        </div>

        <div className="flex items-center gap-2 border-t border-line pt-4 text-sm text-ink">
          <MapPin className="h-4 w-4 shrink-0 text-[#FF4275]" />
          {p.address}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onPlanEvent}
            className="flex-1 rounded-full bg-[#FF4275] py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Plan event
          </button>
          {p.list === "personal" && (
            <button
              onClick={onAddToGroup}
              className="flex-1 rounded-full py-3 text-sm font-semibold text-[#FF4275] ring-1 ring-[#FF4275] transition hover:bg-[#FF4275]/5"
            >
              Add to group list
            </button>
          )}
        </div>

        {/* Added by */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-ink-soft">Added by</span>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-sky-400 text-[10px] font-semibold text-white">
            JA
          </span>
          <span className="text-ink">
            John Arowoka <span className="text-ink-faint">[You]</span>
          </span>
        </div>

        {/* Activities */}
        <div>
          <p className="mb-3 text-sm font-semibold text-ink">
            Activities <span className="text-ink-faint">[{p.activities.length}]</span>
          </p>
          <div className="space-y-4">
            {p.activities.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <CalendarDays className="h-4 w-4 text-ink-faint" />
                  {i < p.activities.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-line" />
                  )}
                </div>
                <div className="flex flex-1 items-start justify-between pb-1">
                  <div>
                    <p className="text-xs text-ink-faint">{a.date}</p>
                    <p className="text-sm text-ink">
                      <span className="font-medium">{a.actor}</span>{" "}
                      <span className="text-ink-soft">{a.action}</span>
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${
                      a.visited ? "bg-[#FF4275]/10 text-[#FF4275]" : "bg-surface-muted text-ink-soft"
                    }`}
                  >
                    {a.visited ? "Visited" : "Not visited"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

const mapTexture: React.CSSProperties = {
  backgroundColor: "#e8eef5",
  backgroundImage:
    "linear-gradient(120deg,#dde7f0,#eef2f7 60%),repeating-linear-gradient(45deg,rgba(148,163,184,0.18) 0 1px,transparent 1px 16px),repeating-linear-gradient(-45deg,rgba(148,163,184,0.14) 0 1px,transparent 1px 20px)",
};
