"use client";

import { useState } from "react";
import { FileText, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { Drawer } from "./SuggestionHistory";
import type { Attachment, AttachmentKind } from "@/lib/useAttachments";

type Tab = "all" | "document" | "link" | "image";
const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "document", label: "Documents" },
  { id: "link", label: "Links" },
  { id: "image", label: "Images" },
];

export function Attachments({
  items,
  onClose,
}: {
  items: Attachment[];
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("all");
  const show = (k: AttachmentKind) => tab === "all" || tab === k;

  const docs = items.filter((a) => a.kind === "document");
  const links = items.filter((a) => a.kind === "link");
  const images = items.filter((a) => a.kind === "image");

  return (
    <Drawer title="Attachments" onClose={onClose}>
      {/* Tabs */}
      <div className="mb-4 flex items-center gap-4 border-b border-line text-sm">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 pb-2 transition ${
              tab === t.id
                ? "border-ink font-semibold text-ink"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {show("document") && docs.length > 0 && (
          <Section label="Documents">
            <div className="grid grid-cols-2 gap-3">
              {docs.map((d) => (
                <div
                  key={d.id}
                  className="grid h-28 place-items-center rounded-xl bg-surface-muted"
                  title={d.name}
                >
                  <FileText className="h-7 w-7 text-ink-faint" />
                </div>
              ))}
            </div>
          </Section>
        )}

        {show("link") && links.length > 0 && (
          <Section label="Links">
            <div className="space-y-2">
              {links.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-ink transition hover:text-[#FF4275]"
                >
                  <LinkIcon className="h-4 w-4 text-ink-faint" />
                  {l.name}
                </a>
              ))}
            </div>
          </Section>
        )}

        {show("image") && images.length > 0 && (
          <Section label="Images">
            <div className="grid grid-cols-2 gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="grid h-28 place-items-center overflow-hidden rounded-xl bg-surface-muted bg-cover bg-center"
                  style={img.url ? { backgroundImage: `url(${img.url})` } : undefined}
                >
                  {!img.url && <ImageIcon className="h-7 w-7 text-ink-faint" />}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </Drawer>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-ink-faint">{label}</p>
      {children}
    </div>
  );
}
