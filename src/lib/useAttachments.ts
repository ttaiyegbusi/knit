"use client";

import { useState, useCallback } from "react";

export type AttachmentKind = "document" | "link" | "image";

export interface Attachment {
  id: string;
  kind: AttachmentKind;
  name: string;
  url?: string; // for links / image previews
}

// Seeded sample attachments so the drawer reads as populated, matching the
// mockup. The composer's "+" adds real entries on top of these in-session.
const SEED: Attachment[] = [
  { id: "d1", kind: "document", name: "Venue brief.pdf" },
  { id: "d2", kind: "document", name: "Menu.pdf" },
  { id: "d3", kind: "document", name: "Group plan.pdf" },
  { id: "d4", kind: "document", name: "Budget.pdf" },
  { id: "l1", kind: "link", name: "www.warehouse.ng", url: "https://www.warehouse.ng" },
  { id: "l2", kind: "link", name: "www.warehouse.ng", url: "https://www.warehouse.ng" },
  { id: "l3", kind: "link", name: "www.warehouse.ng", url: "https://www.warehouse.ng" },
  { id: "l4", kind: "link", name: "www.warehouse.ng", url: "https://www.warehouse.ng" },
  { id: "i1", kind: "image", name: "photo1.jpg" },
  { id: "i2", kind: "image", name: "photo2.jpg" },
  { id: "i3", kind: "image", name: "photo3.jpg" },
  { id: "i4", kind: "image", name: "photo4.jpg" },
];

export function useAttachments() {
  const [items, setItems] = useState<Attachment[]>(SEED);

  const add = useCallback((files: FileList | null) => {
    if (!files) return;
    const next: Attachment[] = Array.from(files).map((f, i) => {
      const isImage = f.type.startsWith("image/");
      return {
        id: `up-${Date.now()}-${i}`,
        kind: isImage ? "image" : "document",
        name: f.name,
        url: isImage ? URL.createObjectURL(f) : undefined,
      };
    });
    setItems((prev) => [...next, ...prev]);
  }, []);

  return { items, add };
}
