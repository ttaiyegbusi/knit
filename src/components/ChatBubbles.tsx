import { Logo } from "./Logo";

/** A message from Knit — left-aligned, with the logo avatar. */
export function KnitBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0">
        <Logo size={28} />
      </span>
      <div className="flex flex-col items-start gap-2">{children}</div>
    </div>
  );
}

/** The text bubble inside a Knit message. */
export function KnitText({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl rounded-tl-md bg-surface-muted px-4 py-2.5 text-sm font-medium text-ink">
      {children}
    </div>
  );
}

/** A message from the user — right-aligned, pink. */
export function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="rounded-2xl rounded-tr-md bg-[#FF4275] px-4 py-2.5 text-sm font-medium text-white">
        {children}
      </div>
    </div>
  );
}
