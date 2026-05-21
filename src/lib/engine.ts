import type {
  CategoryId,
  Suggestion,
  SuggestionQuery,
} from "./types";
import { SURPRISE_ME } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// THE ENGINE
//
// One function. Takes {category, refinement, location}, returns a curated
// set of suggestions. Right now it returns mock data so the whole flow is
// walkable end to end. Later, the body gets replaced with a real places API
// call + the proximity formula — the SIGNATURE stays the same, so no UI
// changes. That is the entire point of building it this way.
// ─────────────────────────────────────────────────────────────────────────

const IMG = {
  food1:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70",
  food2:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=70",
  food3:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=70",
  sport1:
    "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&q=70",
  sport2:
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=70",
  drink1:
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=70",
  drink2:
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=70",
  fun1: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=70",
  fun2: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=70",
};

// Mock catalog keyed by category. Only SOME entries carry a socialSignal —
// deliberately, so the "never fabricated" rule is visible in the UI: cards
// without real data simply don't show one.
const CATALOG: Record<CategoryId, Omit<Suggestion, "id">[]> = {
  eat_out: [
    {
      name: "Locale",
      category: "eat_out",
      subcategory: "Italian",
      rating: 4.7,
      reviewCount: 320,
      proximity: { distanceKm: 2.3, area: "Victoria Island" },
      imageUrl: IMG.food1,
      priceLevel: 3,
      socialSignal: {
        kind: "friends_visited",
        friendCount: 3,
        text: "3 friends in your Knit went here recently",
      },
    },
    {
      name: "Sakura House",
      category: "eat_out",
      subcategory: "Japanese",
      rating: 4.5,
      reviewCount: 210,
      proximity: { distanceKm: 4.1, area: "Lekki Phase 1" },
      imageUrl: IMG.food2,
      priceLevel: 3,
    },
    {
      name: "Iya Eba Kitchen",
      category: "eat_out",
      subcategory: "Nigerian",
      rating: 4.8,
      reviewCount: 540,
      proximity: { distanceKm: 1.2, area: "Ikoyi" },
      imageUrl: IMG.food3,
      priceLevel: 2,
      socialSignal: {
        kind: "popular_with_knit",
        friendCount: 12,
        text: "Popular with Knit users near you this week",
      },
    },
    {
      name: "The Smokehouse",
      category: "eat_out",
      subcategory: "American",
      rating: 4.3,
      reviewCount: 188,
      proximity: { distanceKm: 5.6, area: "Victoria Island" },
      imageUrl: IMG.food1,
      priceLevel: 2,
    },
  ],
  play_sport: [
    {
      name: "Smash Padel Club",
      category: "play_sport",
      subcategory: "Padel court",
      rating: 4.6,
      reviewCount: 96,
      proximity: { distanceKm: 3.0, area: "Lekki" },
      imageUrl: IMG.sport2,
      socialSignal: {
        kind: "trending_this_week",
        friendCount: 5,
        text: "5 Knit friends booked courts here this week",
      },
    },
    {
      name: "Teslim Balogun Pitch",
      category: "play_sport",
      subcategory: "Football",
      rating: 4.2,
      reviewCount: 140,
      proximity: { distanceKm: 6.4, area: "Surulere" },
      imageUrl: IMG.sport1,
    },
    {
      name: "Ace Tennis Centre",
      category: "play_sport",
      subcategory: "Tennis",
      rating: 4.4,
      reviewCount: 72,
      proximity: { distanceKm: 4.8, area: "Ikoyi" },
      imageUrl: IMG.sport2,
    },
  ],
  grab_drink: [
    {
      name: "Cafe Neo",
      category: "grab_drink",
      subcategory: "Coffee",
      rating: 4.5,
      reviewCount: 410,
      proximity: { distanceKm: 0.8, area: "Victoria Island" },
      imageUrl: IMG.drink1,
      priceLevel: 2,
      socialSignal: {
        kind: "popular_with_knit",
        friendCount: 8,
        text: "A regular Knit hangout nearby",
      },
    },
    {
      name: "Bature Brewery",
      category: "grab_drink",
      subcategory: "Craft beer",
      rating: 4.4,
      reviewCount: 260,
      proximity: { distanceKm: 3.7, area: "Lekki" },
      imageUrl: IMG.drink2,
      priceLevel: 2,
    },
    {
      name: "The Sip Room",
      category: "grab_drink",
      subcategory: "Cocktails",
      rating: 4.6,
      reviewCount: 150,
      proximity: { distanceKm: 2.9, area: "Ikoyi" },
      imageUrl: IMG.drink1,
      priceLevel: 3,
    },
  ],
  do_fun: [
    {
      name: "Hardrock Beach",
      category: "do_fun",
      subcategory: "Live music",
      rating: 4.3,
      reviewCount: 320,
      proximity: { distanceKm: 4.5, area: "Victoria Island" },
      imageUrl: IMG.fun2,
      priceLevel: 2,
      socialSignal: {
        kind: "trending_this_week",
        friendCount: 6,
        text: "Trending with Knit users this week",
      },
    },
    {
      name: "Rufus & Bee",
      category: "do_fun",
      subcategory: "Arcade",
      rating: 4.5,
      reviewCount: 210,
      proximity: { distanceKm: 5.1, area: "Lekki" },
      imageUrl: IMG.fun1,
      priceLevel: 2,
    },
    {
      name: "Terra Kulture",
      category: "do_fun",
      subcategory: "Art gallery",
      rating: 4.7,
      reviewCount: 480,
      proximity: { distanceKm: 2.0, area: "Victoria Island" },
      imageUrl: IMG.fun1,
      priceLevel: 1,
    },
  ],
};

/** Simulates async + network latency so the UI's loading state is real. */
export async function getSuggestions(
  query: SuggestionQuery,
): Promise<Suggestion[]> {
  await new Promise((r) => setTimeout(r, 650));

  if (!query.category) return [];
  let pool = CATALOG[query.category].map((s, i) => ({
    ...s,
    id: `${query.category}-${i}`,
  }));

  // Honor refinement when the user picked specific options (not Surprise me).
  const refinement = query.refinement;
  if (Array.isArray(refinement) && refinement.length > 0) {
    const wanted = new Set(refinement.map((r) => r.toLowerCase()));
    const filtered = pool.filter((s) =>
      wanted.has(s.subcategory.toLowerCase()),
    );
    // Curated, not strict: if the filter is too tight, fall back to the pool
    // rather than showing an empty, directory-style "no results" page.
    if (filtered.length > 0) pool = filtered;
  }

  // Curated handful, ranked by a blend of rating and closeness — never a
  // 50-item directory dump. This is where the real proximity formula slots in.
  return pool
    .sort(
      (a, b) =>
        b.rating - a.rating + (a.proximity.distanceKm - b.proximity.distanceKm) * 0.1,
    )
    .slice(0, 6);
}

/**
 * The standing "Activities Near You" feed on the landing view. Unlike the
 * wizard's tailored results, this is a broad mix across ALL categories — it's
 * what's around the user right now, not an answer to their three questions.
 * Wired to the same catalog so cards are real data; later this becomes a
 * "nearby places" API call behind the same signature.
 */
export async function getActivitiesNearYou(): Promise<Suggestion[]> {
  await new Promise((r) => setTimeout(r, 400));

  // Flatten every category into one pool, then pad to ~15 so there are
  // enough rows to scroll through.
  const base: Suggestion[] = (
    Object.keys(CATALOG) as CategoryId[]
  ).flatMap((cat) =>
    CATALOG[cat].map((s, i) => ({ ...s, id: `near-${cat}-${i}` })),
  );

  const out: Suggestion[] = [];
  let n = 0;
  while (out.length < 15) {
    const s = base[n % base.length];
    out.push({ ...s, id: `near-${n}` });
    n++;
  }
  return out;
}

export { SURPRISE_ME };
