// Two distinct Knits (workspaces), each with coherent, context-aware content
// across all screens. The rail tiles switch between them.

export type KnitId = "pink" | "orange";

export interface KnitMember {
  name: string;
  role: string;
  initials: string;
  color: string;
  sinceDays: number;
  joinMethod: "Mail Invite" | "QR code" | "Knit link";
  online: boolean;
}

export interface KnitMessage {
  kind: "system" | "in" | "out" | "location" | "activity" | "divider";
  id: string;
  // system
  actor?: string;
  verb?: string;
  rest?: string;
  // divider
  label?: string;
  // in/out
  sender?: string;
  text?: string;
  online?: boolean;
  // location
  locLabel?: string;
  // activity
  pre?: string;
  keyword?: string;
  post?: string;
}

export interface KnitEvent {
  category: string;
  title: string;
  datetime: string;
  location: string;
  about: string;
  host: string;
  hostInitials: string;
}

export interface KnitData {
  id: KnitId;
  name: string;
  creator: string;
  creatorInitials: string;
  membersCount: number;
  eventsCreated: number;
  dateCreated: string;
  joinLink: string;
  members: KnitMember[];
  messages: KnitMessage[];
  event: KnitEvent;
  availability: {
    day: number;
    startHour: number;
    title: string;
    time: string;
    tone: "blue" | "pink";
  }[];
}

const ACTIVITY_SAMPLE = [
  { date: "May 23, 2026", actor: "John Arowoka", action: "created an event", visited: true },
  { date: "April 29, 2026", actor: "John Arowoka", action: "created an event", visited: true },
  { date: "April 29, 2026", actor: "John Arowoka", action: "created an event", visited: false },
];

export const WORKSPACES: Record<KnitId, KnitData> = {
  // ── Pink Knit — the original academic community ──────────────────────────
  pink: {
    id: "pink",
    name: "Erstwhile Accounting Class 22",
    creator: "Temitope Aiyegbusi",
    creatorInitials: "TA",
    membersCount: 10,
    eventsCreated: 3,
    dateCreated: "24 April, 2024 at 10:24pm",
    joinLink: "knit.app/join/accounting-22",
    members: [
      { name: "Tope Aiyegbusi", role: "Creator", initials: "TA", color: "bg-blue-500", sinceDays: 14, joinMethod: "Mail Invite", online: true },
      { name: "John Niyon", role: "Member", initials: "JN", color: "bg-pink-500", sinceDays: 14, joinMethod: "QR code", online: true },
      { name: "Faith Onasanya", role: "Member", initials: "FO", color: "bg-violet-500", sinceDays: 14, joinMethod: "Mail Invite", online: true },
      { name: "Jenny Wilson", role: "Member", initials: "JW", color: "bg-rose-500", sinceDays: 15, joinMethod: "Knit link", online: false },
      { name: "Theresa Webb", role: "Member", initials: "TW", color: "bg-teal-500", sinceDays: 15, joinMethod: "QR code", online: true },
      { name: "Marvin McKinney", role: "Member", initials: "MM", color: "bg-cyan-500", sinceDays: 16, joinMethod: "Knit link", online: false },
      { name: "Courtney Henry", role: "Member", initials: "CH", color: "bg-violet-400", sinceDays: 16, joinMethod: "QR code", online: true },
      { name: "Ralph Edwards", role: "Member", initials: "RE", color: "bg-emerald-500", sinceDays: 17, joinMethod: "Mail Invite", online: false },
    ],
    messages: [
      { kind: "system", id: "s1", actor: "John", verb: "created", rest: "Erstwhile Accounting Class 22" },
      { kind: "divider", id: "d1", label: "Today" },
      { kind: "system", id: "s2", actor: "John", verb: "added", rest: "Fouad" },
      { kind: "system", id: "s3", actor: "John", verb: "added", rest: "Temitope" },
      { kind: "out", id: "o1", text: "hey Temitope" },
      { kind: "out", id: "o2", text: "I have gotten your message, I'll send it across board for error" },
      { kind: "in", id: "i1", sender: "Temitope", text: "hey John", online: true },
      { kind: "in", id: "i2", sender: "Temitope", text: "Alright' thank you, also check the groom designs on figma", online: true },
      { kind: "in", id: "i3", sender: "Fouad", text: "Hi guys, please check the designs ASAP", online: true },
      { kind: "out", id: "o3", text: "Alrightttt." },
      { kind: "location", id: "l1", sender: "Fouad", locLabel: "Ajao Estate, Lag…" },
      { kind: "activity", id: "a1", pre: "Fouad added a", keyword: "place", post: "to the group list" },
    ],
    event: {
      category: "Social hangout",
      title: "Bowling with the guys",
      datetime: "Wed, Apr 24, 8:00 PM – 10 PM",
      location: "Overtoom 301, Netherlands",
      about:
        "Some random explanation of why four men are hanging out in a room for hours… and just bowling away their thoughts and stress",
      host: "John Arowoka",
      hostInitials: "JA",
    },
    availability: [
      { day: 3, startHour: 8, title: "Boys Hangout", time: "8:00 AM", tone: "blue" },
      { day: 5, startHour: 9, title: "Girls Hangout", time: "8:00 AM", tone: "pink" },
    ],
  },

  // ── Orange Knit — Lagos Run Club (running / fitness community) ───────────
  orange: {
    id: "orange",
    name: "Lagos Run Club",
    creator: "Bisi Adeleke",
    creatorInitials: "BA",
    membersCount: 24,
    eventsCreated: 11,
    dateCreated: "2 January, 2025 at 6:05am",
    joinLink: "knit.app/join/lagos-run",
    members: [
      { name: "Bisi Adeleke", role: "Creator", initials: "BA", color: "bg-orange-500", sinceDays: 120, joinMethod: "Mail Invite", online: true },
      { name: "Chidi Okonkwo", role: "Pace leader", initials: "CO", color: "bg-emerald-500", sinceDays: 110, joinMethod: "Knit link", online: true },
      { name: "Amara Eze", role: "Member", initials: "AE", color: "bg-rose-500", sinceDays: 90, joinMethod: "QR code", online: false },
      { name: "Tunde Bello", role: "Member", initials: "TB", color: "bg-sky-500", sinceDays: 80, joinMethod: "Knit link", online: true },
      { name: "Zainab Yusuf", role: "Member", initials: "ZY", color: "bg-violet-500", sinceDays: 75, joinMethod: "Mail Invite", online: true },
      { name: "Femi Coker", role: "Member", initials: "FC", color: "bg-amber-500", sinceDays: 60, joinMethod: "QR code", online: false },
      { name: "Ngozi Umeh", role: "Member", initials: "NU", color: "bg-teal-500", sinceDays: 45, joinMethod: "Knit link", online: true },
      { name: "Kola Salami", role: "Member", initials: "KS", color: "bg-indigo-500", sinceDays: 30, joinMethod: "QR code", online: false },
    ],
    messages: [
      { kind: "system", id: "s1", actor: "Bisi", verb: "created", rest: "Lagos Run Club" },
      { kind: "divider", id: "d1", label: "Today" },
      { kind: "system", id: "s2", actor: "Bisi", verb: "added", rest: "Chidi" },
      { kind: "system", id: "s3", actor: "Bisi", verb: "added", rest: "Amara" },
      { kind: "in", id: "i1", sender: "Chidi", text: "Morning runners! Lekki bridge loop at 6am Saturday — who's in?", online: true },
      { kind: "out", id: "o1", text: "I'm in 🏃🏾 bringing water for the crew" },
      { kind: "in", id: "i2", sender: "Amara", text: "Count me in, I need to beat my 10k time", online: true },
      { kind: "in", id: "i3", sender: "Tunde", text: "Can we make it 6:30? Traffic from the mainland", online: false },
      { kind: "out", id: "o2", text: "6:30 works. Meet at the usual spot." },
      { kind: "location", id: "l1", sender: "Chidi", locLabel: "Lekki-Ikoyi Link Bridge" },
      { kind: "activity", id: "a1", pre: "Chidi added a", keyword: "route", post: "to the group list" },
    ],
    event: {
      category: "Fun hangout",
      title: "Saturday Sunrise 10K",
      datetime: "Sat, May 30, 6:30 AM – 8:30 AM",
      location: "Lekki-Ikoyi Link Bridge, Lagos",
      about:
        "Our weekly long run along the bridge and waterfront. All paces welcome — pace leaders will hang back for the 7:30/km group. Bring water and stretch before you show up!",
      host: "Bisi Adeleke",
      hostInitials: "BA",
    },
    availability: [
      { day: 6, startHour: 6, title: "Saturday 10K", time: "6:30 AM", tone: "pink" },
      { day: 2, startHour: 18, title: "Tempo Tuesday", time: "6:00 PM", tone: "blue" },
    ],
  },
};
