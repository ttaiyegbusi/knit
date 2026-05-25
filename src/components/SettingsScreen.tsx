"use client";

import { useState } from "react";
import Image from "next/image";
import {
  PanelLeft,
  Search,
  Plus,
  Sparkles,
  Clock,
  Gem,
  Settings as SettingsIcon,
  UserCog,
  Smile,
  ShieldCheck,
  Bell,
  Languages,
  Megaphone,
  ShieldQuestion,
  LogOut,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Check,
  Upload,
  ImagePlus,
  AlertTriangle,
  Copy,
} from "lucide-react";
import { Logo } from "./Logo";

type Page =
  | "profile"
  | "interests"
  | "security"
  | "sounds"
  | "language"
  | "whatsnew"
  | "privacy";

const PAGE_META: Record<Page, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  profile: { label: "User Profile", icon: UserCog },
  interests: { label: "Interest Graph", icon: Smile },
  security: { label: "Security & Login", icon: ShieldCheck },
  sounds: { label: "Sounds & Alerts", icon: Bell },
  language: { label: "Language & Time", icon: Languages },
  whatsnew: { label: "What is new", icon: Megaphone },
  privacy: { label: "Privacy Policy", icon: ShieldQuestion },
};

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [expanded, setExpanded] = useState(true);
  const [page, setPage] = useState<Page>("profile");
  const [savedPill, setSavedPill] = useState(false);

  function flashSaved() {
    setSavedPill(true);
    window.setTimeout(() => setSavedPill(false), 2500);
  }

  const meta = PAGE_META[page];

  return (
    <>
      <div className="app-bg" />
      <div className="flex h-screen gap-3 p-3 sm:gap-4 sm:p-4">
        {/* ── Unified settings sidebar ─────────────────────────────────── */}
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
            <div className="flex flex-col items-center gap-2">
              <button onClick={onBack} className="overflow-hidden rounded-[10px] transition hover:opacity-90">
                <Image src="/tile-pink.svg" alt="" width={38} height={38} unoptimized />
              </button>
              <button onClick={onBack} className="overflow-hidden rounded-[10px] transition hover:opacity-90">
                <Image src="/tile-orange.svg" alt="" width={38} height={38} unoptimized />
              </button>
            </div>
            <div className="my-3 h-px w-9 bg-line" />
            <RailIcon onClick={onBack} aria-label="Suggestions">
              <Sparkles className="h-5 w-5" />
            </RailIcon>
            <div className="mt-auto flex flex-col items-center gap-1.5">
              <RailIcon aria-label="History"><Clock className="h-5 w-5" /></RailIcon>
              <RailIcon aria-label="Saved"><Gem className="h-5 w-5" /></RailIcon>
              <RailIcon aria-label="Settings" active><SettingsIcon className="h-5 w-5" /></RailIcon>
            </div>
          </div>

          {/* Animated menu region */}
          <div
            className="h-full overflow-hidden border-l border-line transition-[width] duration-[360ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ width: expanded ? 280 : 0 }}
          >
            <div
              className={`flex h-full w-[280px] flex-col p-4 transition-opacity duration-300 ${
                expanded ? "opacity-100 delay-100" : "opacity-0"
              }`}
            >
              <div className="mb-4 flex items-center justify-between px-1">
                <Image src="/knit-wordmark.svg" alt="Knit" width={72} height={24} priority unoptimized />
                <button onClick={() => setExpanded(false)} aria-label="Collapse" className="text-ink-soft transition hover:text-ink">
                  <PanelLeft className="h-5 w-5" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2.5 text-sm text-ink-faint">
                <Search className="h-4 w-4" />
                <input
                  placeholder="Search"
                  className="w-full bg-transparent text-ink outline-none placeholder:text-ink-faint"
                />
              </div>

              <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <NavSection label="Account Settings">
                  <NavItem icon={UserCog} label="User Profile" active={page === "profile"} onClick={() => setPage("profile")} />
                  <NavItem icon={Smile} label="Interest Graph" active={page === "interests"} onClick={() => setPage("interests")} />
                </NavSection>
                <NavSection label="Security & Sound">
                  <NavItem icon={ShieldCheck} label="Security & Login" active={page === "security"} onClick={() => setPage("security")} />
                  <NavItem icon={Bell} label="Sounds and Alerts" active={page === "sounds"} onClick={() => setPage("sounds")} />
                </NavSection>
                <NavSection label="More">
                  <NavItem icon={Languages} label="Language & Time" active={page === "language"} onClick={() => setPage("language")} />
                  <NavItem icon={Megaphone} label="What is new" active={page === "whatsnew"} onClick={() => setPage("whatsnew")} />
                  <NavItem icon={ShieldQuestion} label="Privacy Policy" active={page === "privacy"} onClick={() => setPage("privacy")} />
                  <NavItem icon={LogOut} label="Log out" onClick={onBack} />
                </NavSection>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main column ──────────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          <header className="relative flex shrink-0 items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface/90 px-4 py-2.5 text-sm font-semibold text-ink shadow-soft backdrop-blur-sm">
              <meta.icon className="h-4 w-4" />
              {meta.label}
            </span>
            {savedPill && (
              <span className="absolute left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-[#FF4275] px-4 py-2.5 text-sm font-semibold text-white shadow-soft">
                <Check className="h-4 w-4" /> Changes saved
              </span>
            )}
            {(page === "privacy" || page === "whatsnew") && (
              <span className="rounded-md border border-[#FF4275]/30 px-2 py-1 text-xs font-semibold text-[#FF4275]">
                10% done
              </span>
            )}
          </header>

          <div className="min-h-0 flex-1 overflow-hidden rounded-[1.25rem] bg-surface shadow-soft">
            <div className="h-full overflow-y-auto p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:p-10">
              <div className="mx-auto max-w-3xl">
                {page === "profile" && <ProfilePage />}
                {page === "interests" && <InterestsPage />}
                {page === "security" && <SecurityPage />}
                {page === "sounds" && <SoundsPage onChange={flashSaved} />}
                {page === "language" && <LanguagePage onChange={flashSaved} />}
                {page === "whatsnew" && <WhatsNewPage />}
                {page === "privacy" && <PrivacyPage />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Page: User Profile ─────────────────────────────────────────────── */
function ProfilePage() {
  const [first, setFirst] = useState("John");
  const [last, setLast] = useState("Arowoka");
  const [email, setEmail] = useState("johndoe@mail.com");
  const [bio, setBio] = useState("Just a place where plans happen and memories get made. Pull up when you can ✨");

  return (
    <div className="space-y-6">
      <div className="relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF4275] to-rose-400">
        <div className="absolute right-4 top-1/2 h-20 w-16 -translate-y-1/2 rounded-b-full bg-amber-300/90" />
        <button className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-surface text-ink shadow-soft">
          <ImagePlus className="h-4 w-4" />
        </button>
      </div>

      <div>
        <h2 className="font-display text-2xl text-ink">{first} {last}</h2>
        <p className="text-sm text-ink-faint">Joined since</p>
        <p className="text-sm text-ink-soft">March 27, 2026</p>
      </div>

      <Row label="Profile Image">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-sky-400 text-sm font-semibold text-white">JA</span>
          <button className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface-muted">
            <Upload className="h-4 w-4" /> Upload
          </button>
        </div>
      </Row>
      <Row label="First name">
        <Field value={first} onChange={setFirst} />
      </Row>
      <Row label="last name">
        <Field value={last} onChange={setLast} />
      </Row>
      <Row label="Email address">
        <Field value={email} onChange={setEmail} />
      </Row>
      <Row label="Bio">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-[#FF4275]"
        />
      </Row>
    </div>
  );
}

/* ── Page: Interest Graph ───────────────────────────────────────────── */
const INTEREST_GROUPS: { emoji: string; title: string; items: string[] }[] = [
  { emoji: "🍽️", title: "Food & Drink", items: ["Nigerian", "Italian", "Lebanese", "Turkish", "Chinese", "Japanese", "Indian", "Mediterranean", "Street food", "Cafes", "Drinks & Cocktails", "Desserts"] },
  { emoji: "⚽", title: "Sports & Games", items: ["Football", "Basketball", "Tennis", "Padel", "Bowling", "Table tennis", "Arcade", "Board games", "Video games"] },
  { emoji: "🌿", title: "Outdoors", items: ["Parks", "Beach", "Kayaking", "Hiking", "Cycling", "Picnics", "Sightseeing", "Road trips", "Boat rides"] },
  { emoji: "🏠", title: "Chill & Hangouts", items: ["Movie night", "House hangouts", "Lounges", "Game nights", "Rooftop", "Club", "Bars", "Comedy Club Shows"] },
  { emoji: "🎪", title: "Experiences", items: ["Live Music", "Concerts", "Cinema", "Art galleries", "Museums", "Festivals", "Pop-ups & events"] },
];

function InterestsPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["Nigerian", "Bowling", "Hiking", "Movie night", "Live Music"]));
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  function toggle(item: string) {
    setSelected((s) => {
      const n = new Set(s);
      n.has(item) ? n.delete(item) : n.add(item);
      return n;
    });
  }
  function toggleSection(title: string) {
    setCollapsed((s) => {
      const n = new Set(s);
      n.has(title) ? n.delete(title) : n.add(title);
      return n;
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl text-ink">Your interests</h2>
        <p className="mt-1 max-w-lg text-sm text-ink-soft">
          Tell Knit a few things you'd do with friends—we'll use it to suggest plans your group will actually say yes to.
        </p>
      </div>

      {INTEREST_GROUPS.map((g) => {
        const open = !collapsed.has(g.title);
        return (
          <div key={g.title} className="rounded-2xl border border-line p-4">
            <button onClick={() => toggleSection(g.title)} className="flex w-full items-center justify-between">
              <span className="font-semibold text-ink">{g.emoji} {g.title}</span>
              {open ? <ChevronUp className="h-4 w-4 text-ink-soft" /> : <ChevronDown className="h-4 w-4 text-ink-soft" />}
            </button>
            {open && (
              <div className="mt-4 flex flex-wrap gap-2">
                {g.items.map((item) => {
                  const on = selected.has(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggle(item)}
                      className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                        on ? "bg-[#FF4275] font-medium text-white" : "bg-surface-muted text-ink-soft hover:text-ink"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Page: Security & Login ─────────────────────────────────────────── */
function SecurityPage() {
  const [devices, setDevices] = useState([
    { id: "1", name: "Mobile App - Iphone", current: true, meta: "May 27, 2:00 PM | Ogun, Nigeria" },
    { id: "2", name: "Web - Mac Os", current: false, meta: "May 27, 2:00 PM | Ogun, Nigeria" },
  ]);

  return (
    <div className="space-y-10">
      <section>
        <SectionHead title="Manage Passwords" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[160px_1fr]">
          <p className="pt-2 text-sm font-medium text-ink">Change Password</p>
          <div className="space-y-3">
            <input type="password" placeholder="Enter new password" className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-[#FF4275]" />
            <input type="password" placeholder="Confirm new password" className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-[#FF4275]" />
            <div className="flex justify-end">
              <button className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-muted">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHead title="Login & Devices" />
        <div className="space-y-4">
          {devices.map((d) => (
            <div key={d.id} className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Copy className="mt-0.5 h-5 w-5 text-ink-faint" />
                <div>
                  <p className="text-sm font-medium text-ink">
                    {d.name}{" "}
                    {d.current && <span className="font-semibold text-[#FF4275]">Current</span>}
                  </p>
                  <p className="text-xs text-ink-soft">{d.meta}</p>
                </div>
              </div>
              <button
                onClick={() => setDevices((ds) => ds.filter((x) => x.id !== d.id))}
                className="text-sm text-ink-soft transition hover:text-[#FF4275]"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHead title="Danger Zone" />
        <div className="rounded-2xl bg-surface-muted p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-red-500" />
            <div>
              <p className="font-semibold text-ink">Account Removal</p>
              <p className="mt-1 text-sm text-ink-soft">
                Disabling your account means you can recover all associated data after taking this action.
              </p>
              <div className="mt-4 flex gap-3">
                <button className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600">
                  Disable Account
                </button>
                <button className="rounded-full bg-red-100 px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-200">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Page: Sounds & Alerts ──────────────────────────────────────────── */
function SoundsPage({ onChange }: { onChange: () => void }) {
  const [alerts, setAlerts] = useState({
    desktop: true, joins: true, event: true, place: true, availability: true,
  });
  const [sounds, setSounds] = useState({
    message: true, invitation: true, push: true, email: true,
  });

  function flip<T extends Record<string, boolean>>(set: React.Dispatch<React.SetStateAction<T>>, key: keyof T) {
    set((s) => ({ ...s, [key]: !s[key] }));
    onChange();
  }

  return (
    <div className="space-y-10">
      <section>
        <SectionHead title="Overview" />
        <Toggle label="Enable Desktop Notification" on={alerts.desktop} onClick={() => flip(setAlerts, "desktop")} />
        <p className="mt-4 mb-1 text-sm font-medium text-ink">Get notified when</p>
        <Toggle label="A member joins knit" on={alerts.joins} onClick={() => flip(setAlerts, "joins")} />
        <Toggle label="New event is created" on={alerts.event} onClick={() => flip(setAlerts, "event")} />
        <Toggle label="A member add location / place" on={alerts.place} onClick={() => flip(setAlerts, "place")} />
        <Toggle label="A member updates their availabiltiy" on={alerts.availability} onClick={() => flip(setAlerts, "availability")} />
      </section>

      <section>
        <SectionHead title="Sounds" />
        <SoundRow label="New Message" on={sounds.message} onClick={() => flip(setSounds, "message")} />
        <SoundRow label="Knit Invitation" on={sounds.invitation} onClick={() => flip(setSounds, "invitation")} />
        <SoundRow label="Push Notification from your device" on={sounds.push} onClick={() => flip(setSounds, "push")} />
        <SoundRow label="Email Updates" on={sounds.email} onClick={() => flip(setSounds, "email")} />
      </section>
    </div>
  );
}

/* ── Page: Language & Time ──────────────────────────────────────────── */
function LanguagePage({ onChange }: { onChange: () => void }) {
  const [fmt, setFmt] = useState<"auto" | "12" | "24">("auto");
  const [lang, setLang] = useState("English - US");

  return (
    <div className="space-y-10">
      <section>
        <SectionHead title="Time Format" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {([["auto", "Auto"], ["12", "12 hour"], ["24", "24 hour"]] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setFmt(val); onChange(); }}
              className="flex items-center justify-between rounded-xl bg-surface-muted px-4 py-3.5 text-sm text-ink"
            >
              {label}
              <span className={`grid h-5 w-5 place-items-center rounded-full border ${fmt === val ? "border-[#FF4275] bg-[#FF4275] text-white" : "border-ink/25"}`}>
                {fmt === val && <Check className="h-3 w-3" />}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHead title="Language" sub="Chose the language you want knit to display" />
        <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[160px_1fr]">
          <p className="text-sm font-medium text-ink">Select Language</p>
          <select
            value={lang}
            onChange={(e) => { setLang(e.target.value); onChange(); }}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-[#FF4275]"
          >
            <option>English - US</option>
            <option>English - UK</option>
            <option>French</option>
            <option>Yoruba</option>
            <option>Spanish</option>
          </select>
        </div>
      </section>
    </div>
  );
}

/* ── Page: What is new ──────────────────────────────────────────────── */
function WhatsNewPage() {
  return (
    <article className="space-y-5 text-sm leading-relaxed text-ink-soft">
      <div>
        <h2 className="font-display text-2xl text-ink">What is new in Knit</h2>
        <p className="text-ink-faint">Last Updated May 3, 2026</p>
      </div>
      <hr className="border-line" />
      <p>We've been busy making KNIT better, smoother, and more enjoyable for every maker.</p>
      <p>This update introduces a brand-new Knitting Calculator designed to take the guesswork out of your projects—making increases, decreases, and adjustments easier than ever. We've also improved how you interact with PDF patterns, with smoother navigation, clearer layouts, and better handling so you can focus on your craft without interruptions.</p>
      <p>You'll notice a refreshed premium experience with a cleaner, more polished look, along with updated app icons that give KNIT a modern feel. Behind the scenes, we've enhanced overall performance and streamlined navigation to help everything run faster and more intuitively.</p>
      <p>As always, we've fixed bugs and made small improvements across the app to ensure a more reliable and seamless knitting experience.</p>
      <div className="grid h-48 place-items-center rounded-2xl bg-surface-muted text-ink-faint">
        <Image src="/knit-wordmark.svg" alt="Knit" width={120} height={40} unoptimized className="opacity-40" />
      </div>
      <h3 className="font-display text-xl text-ink">What is Next</h3>
      <hr className="border-line" />
      <p>We've been busy making KNIT better, smoother, and more enjoyable for every maker. This update introduces a brand-new Knitting Calculator designed to take the guesswork out of your projects.</p>
    </article>
  );
}

/* ── Page: Privacy Policy ───────────────────────────────────────────── */
function PrivacyPage() {
  const sections = [
    { h: "1. Information We Collect", p: "We may collect basic information such as your email address, account details, and usage data to improve your experience. We do not collect unnecessary personal information." },
    { h: "2. How We Use Your Information", list: ["Create and manage your account", "Provide and improve app features", "Communicate important updates", "Ensure security and prevent misuse"] },
    { h: "3. Data Sharing", p: "We do not sell your personal data. We may share limited information with trusted service providers only when necessary to operate the app (such as hosting or analytics)." },
    { h: "4. Data Security", p: "We take reasonable steps to protect your data from unauthorized access, loss, or misuse." },
    { h: "5. Your Rights", p: "You can request access, correction, or deletion of your personal data at any time by contacting us." },
    { h: "6. Cookies and Tracking", p: "We may use basic analytics tools to understand how users interact with the app and improve performance." },
    { h: "7. Changes to This Policy", p: "We may update this Privacy Policy from time to time. Any changes will be reflected within the app." },
  ];
  return (
    <article className="space-y-5 text-sm leading-relaxed text-ink-soft">
      <div>
        <h2 className="font-display text-2xl text-ink">Privacy Policy</h2>
        <p className="text-ink-faint">Last Updated May 3, 2026</p>
      </div>
      <hr className="border-line" />
      <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our app.</p>
      {sections.map((s) => (
        <div key={s.h}>
          <h3 className="mb-1 font-semibold text-ink">{s.h}</h3>
          {s.p && <p>{s.p}</p>}
          {s.list && (
            <ul className="ml-5 list-disc space-y-1">
              {s.list.map((li) => <li key={li}>{li}</li>)}
            </ul>
          )}
        </div>
      ))}
    </article>
  );
}

/* ── Shared bits ────────────────────────────────────────────────────── */
function RailIcon({ children, active, ...rest }: { children: React.ReactNode; active?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`grid h-11 w-11 place-items-center rounded-xl transition ${active ? "bg-ink/5 text-ink" : "text-ink-soft hover:bg-ink/5 hover:text-ink"}`}
    >
      {children}
    </button>
  );
}

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition ${
        active ? "bg-ink/5 font-semibold text-ink" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5 border-b border-line pb-3">
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <p className="mt-0.5 text-sm text-ink-faint">{sub ?? "Manage Passwords and account settings"}</p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-3 border-b border-line pb-5 sm:grid-cols-[160px_1fr]">
      <p className="pt-2 text-sm font-medium text-ink">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function Field({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-[#FF4275]"
    />
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-ink">{label}</span>
      <Switch on={on} onClick={onClick} />
    </div>
  );
}

function SoundRow({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-3 last:border-0">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <button className="text-xs font-medium text-[#FF4275] hover:underline">Play sound</button>
      </div>
      <Switch on={on} onClick={onClick} />
    </div>
  );
}

function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative h-6 w-11 rounded-full transition ${on ? "bg-[#FF4275]" : "bg-ink/15"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}
