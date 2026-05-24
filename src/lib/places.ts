export type PlaceBucket = "soon" | "later" | "much_later";
export type PlaceList = "personal" | "group";

export interface Place {
  id: string;
  name: string;
  subtitle: string; // shown in the detail panel as the long title
  city: string;
  country: string;
  bucket: PlaceBucket;
  list: PlaceList;
  visits: number; // 0 = Not Visited
  pinColor: string; // tailwind text color for the pin
  description: string;
  address: string;
  activities: { date: string; actor: string; action: string; visited: boolean }[];
}

export const BUCKET_LABEL: Record<PlaceBucket, string> = {
  soon: "Soon",
  later: "Later",
  much_later: "Much Later",
};

const ACTIVITIES = [
  { date: "May 23, 2026", actor: "John Arowoka", action: "created an event", visited: true },
  { date: "April 29, 2026", actor: "John Arowoka", action: "created an event", visited: true },
  { date: "April 29, 2026", actor: "John Arowoka", action: "created an event", visited: false },
  { date: "April 29, 2026", actor: "John Arowoka", action: "created an event", visited: false },
];

export const PLACES: Place[] = [
  {
    id: "p1",
    name: "The Broad",
    subtitle: "The Broadstreet Show",
    city: "Downtown LA",
    country: "USA",
    bucket: "soon",
    list: "personal",
    visits: 0,
    pinColor: "text-[#FF4275]",
    description:
      "I saw this on Remi's story and it looks amazing. I'd love for us to check it out soon—maybe this Saturday with the rest of the crew if everyone's free.",
    address: "Downtown LA, Los Angeles, California, USA",
    activities: ACTIVITIES,
  },
  {
    id: "p2",
    name: "Eiffel Tower",
    subtitle: "Eiffel Tower Evening Tour",
    city: "Paris",
    country: "France",
    bucket: "later",
    list: "personal",
    visits: 2,
    pinColor: "text-indigo-500",
    description:
      "A classic. Best at sunset when the lights come on. We should plan ahead since tickets sell out fast during the season.",
    address: "Champ de Mars, 5 Av. Anatole, Paris, France",
    activities: ACTIVITIES,
  },
  {
    id: "p3",
    name: "National Theater",
    subtitle: "National Theater Lagos",
    city: "Lagos",
    country: "Nigeria",
    bucket: "much_later",
    list: "personal",
    visits: 0,
    pinColor: "text-emerald-500",
    description:
      "Iconic spot. There's usually a show on weekends — worth checking the calendar before we go.",
    address: "National Theatre Rd, Iganmu, Lagos, Nigeria",
    activities: ACTIVITIES,
  },
  {
    id: "p4",
    name: "The Broad",
    subtitle: "The Broad Contemporary",
    city: "Downtown LA",
    country: "USA",
    bucket: "soon",
    list: "personal",
    visits: 0,
    pinColor: "text-amber-500",
    description:
      "Contemporary art museum downtown. Free general admission but the special exhibitions need booking.",
    address: "221 S Grand Ave, Los Angeles, California, USA",
    activities: ACTIVITIES,
  },
  {
    id: "p5",
    name: "Terra Kulture",
    subtitle: "Terra Kulture Arts",
    city: "Victoria Island",
    country: "Nigeria",
    bucket: "later",
    list: "group",
    visits: 1,
    pinColor: "text-[#FF4275]",
    description:
      "Great for a group hangout — art, food, and usually a play running. Good middle-ground spot for everyone.",
    address: "Plot 1376 Tiamiyu Savage St, Victoria Island, Lagos, Nigeria",
    activities: ACTIVITIES,
  },
  {
    id: "p6",
    name: "Bature Brewery",
    subtitle: "Bature Brewery Garden",
    city: "Lekki",
    country: "Nigeria",
    bucket: "soon",
    list: "group",
    visits: 0,
    pinColor: "text-orange-500",
    description:
      "Open-air brewery with a relaxed garden. Good for a casual group evening once everyone's back in town.",
    address: "Plot 6 Block 13 Admiralty Way, Lekki, Lagos, Nigeria",
    activities: ACTIVITIES,
  },
];
