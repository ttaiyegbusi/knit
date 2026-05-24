"use client";

import { useState, useMemo } from "react";
import { ChevronsUpDown, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";

interface Member {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  sinceDays: number; // for sorting; displayed as relative
  joinMethod: "Mail Invite" | "QR code" | "Knit link";
  online: boolean;
}

const MEMBERS: Member[] = [
  { id: "1", name: "Tope Aiyegbusi", role: "Creator", initials: "TA", color: "bg-blue-500", sinceDays: 14, joinMethod: "Mail Invite", online: true },
  { id: "2", name: "John Niyon", role: "Member", initials: "JN", color: "bg-pink-500", sinceDays: 14, joinMethod: "QR code", online: true },
  { id: "3", name: "Faith Onasanya", role: "Member", initials: "FO", color: "bg-violet-500", sinceDays: 14, joinMethod: "Mail Invite", online: true },
  { id: "4", name: "Jenny Wilson", role: "Member", initials: "JW", color: "bg-rose-500", sinceDays: 15, joinMethod: "Knit link", online: false },
  { id: "5", name: "Theresa Webb", role: "Member", initials: "TW", color: "bg-teal-500", sinceDays: 15, joinMethod: "QR code", online: true },
  { id: "6", name: "Marvin McKinney", role: "Member", initials: "MM", color: "bg-cyan-500", sinceDays: 16, joinMethod: "Knit link", online: false },
  { id: "7", name: "Courtney Henry", role: "Member", initials: "CH", color: "bg-violet-400", sinceDays: 16, joinMethod: "QR code", online: true },
  { id: "8", name: "Ralph Edwards", role: "Member", initials: "RE", color: "bg-emerald-500", sinceDays: 17, joinMethod: "Mail Invite", online: false },
  { id: "9", name: "Wade Warren", role: "Member", initials: "WW", color: "bg-orange-500", sinceDays: 17, joinMethod: "Knit link", online: true },
  { id: "10", name: "Bessie Cooper", role: "Member", initials: "BC", color: "bg-indigo-500", sinceDays: 18, joinMethod: "QR code", online: true },
  { id: "11", name: "Darrell Steward", role: "Member", initials: "DS", color: "bg-fuchsia-500", sinceDays: 18, joinMethod: "Mail Invite", online: false },
  { id: "12", name: "Guy Hawkins", role: "Member", initials: "GH", color: "bg-amber-500", sinceDays: 19, joinMethod: "Knit link", online: true },
];

type SortKey = "name" | "sinceDays" | "joinMethod" | "online";

const PAGE_SIZE = 8;

export function MembersScreen() {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const arr = [...MEMBERS].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "sinceDays") cmp = a.sinceDays - b.sinceDays;
      else if (sortKey === "joinMethod") cmp = a.joinMethod.localeCompare(b.joinMethod);
      else cmp = Number(b.online) - Number(a.online);
      return sortAsc ? cmp : -cmp;
    });
    return arr;
  }, [sortKey, sortAsc]);

  // Display 500 as a stand-in total to match the mockup's "of 500".
  const total = 500;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pageStart = (page - 1) * PAGE_SIZE;
  const rows = sorted.slice(pageStart % sorted.length, (pageStart % sorted.length) + PAGE_SIZE);
  // pad to PAGE_SIZE by cycling (mock infinite list)
  while (rows.length < PAGE_SIZE) rows.push(sorted[rows.length % sorted.length]);

  const pageIds = rows.map((r) => r.id);
  const allSelected = pageIds.every((id) => selected.has(id));

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }
  function toggleRow(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleAll() {
    setSelected((s) => {
      const next = new Set(s);
      if (allSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-line text-left text-sm text-ink-soft">
              <th className="w-10 py-3 pl-2">
                <Checkbox checked={allSelected} onChange={toggleAll} />
              </th>
              <Th label="Name" onSort={() => toggleSort("name")} />
              <Th label="Member since" onSort={() => toggleSort("sinceDays")} />
              <Th label="Join Method" onSort={() => toggleSort("joinMethod")} />
              <Th label="Status" onSort={() => toggleSort("online")} />
              <th className="py-3 pr-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m, i) => (
              <tr key={`${m.id}-${i}`} className="border-b border-line/70 text-sm">
                <td className="py-3 pl-2">
                  <Checkbox
                    checked={selected.has(m.id)}
                    onChange={() => toggleRow(m.id)}
                  />
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${m.color} text-xs font-semibold text-white`}>
                      {m.initials}
                    </span>
                    <div>
                      <p className="font-medium text-ink">{m.name}</p>
                      <p className="text-xs text-ink-soft">{m.role}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-ink-soft">
                  {Math.round(m.sinceDays / 7)} weeks ago
                </td>
                <td className="py-3 text-ink-soft">{m.joinMethod}</td>
                <td className="py-3">
                  <StatusPill online={m.online} />
                </td>
                <td className="py-3 pr-2">
                  <button className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-ink/5">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-sm">
        <div className="flex items-center gap-2 text-ink-soft">
          Rows per Page
          <span className="inline-flex items-center gap-1 rounded-lg border border-line px-2 py-1 text-ink">
            {PAGE_SIZE} <ChevronsUpDown className="h-3 w-3" />
          </span>
        </div>

        <div className="flex items-center gap-1">
          <PageBtn
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </PageBtn>
          {[1, 2, 3].map((n) => (
            <PageNum key={n} n={n} active={page === n} onClick={() => setPage(n)} />
          ))}
          <span className="px-1 text-ink-faint">…</span>
          <PageNum n={totalPages} active={page === totalPages} onClick={() => setPage(totalPages)} />
          <PageBtn
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next <ChevronRight className="h-4 w-4" />
          </PageBtn>
        </div>

        <p className="text-ink-soft">
          Showing {pageStart + 1} - {pageStart + PAGE_SIZE} of {total}
        </p>
      </div>
    </div>
  );
}

function Th({ label, onSort }: { label: string; onSort: () => void }) {
  return (
    <th className="py-3 font-medium">
      <button onClick={onSort} className="inline-flex items-center gap-1 transition hover:text-ink">
        {label}
        <ChevronsUpDown className="h-3 w-3" />
      </button>
    </th>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`grid h-4 w-4 place-items-center rounded border transition ${
        checked ? "border-[#FF4275] bg-[#FF4275] text-white" : "border-ink/25 hover:border-ink/40"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
          <path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function StatusPill({ online }: { online: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        online ? "bg-emerald-50 text-emerald-600" : "bg-surface-muted text-ink-soft"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-emerald-500" : "bg-ink-faint"}`} />
      {online ? "Online" : "Offline"}
    </span>
  );
}

function PageBtn({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-ink transition hover:bg-ink/5 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function PageNum({ n, active, onClick }: { n: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`grid h-8 min-w-8 place-items-center rounded-lg px-2 text-sm transition ${
        active ? "bg-[#FF4275] font-semibold text-white" : "text-ink hover:bg-ink/5"
      }`}
    >
      {n}
    </button>
  );
}
