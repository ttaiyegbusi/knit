// ─────────────────────────────────────────────────────────────────────────
// Knit · Smart Suggestion — Data Layer
//
// This file is the contract. The wizard, the engine, the results view and the
// event handoff all depend on these shapes. Change them deliberately.
// ─────────────────────────────────────────────────────────────────────────

/**
 * Step 1 — What do you want to do?
 * Single-select. Designed to be extended in v2 (the union is the only place
 * you'd add a new category; everything downstream keys off it).
 */
export type CategoryId = "eat_out" | "play_sport" | "grab_drink" | "do_fun";

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  /** Tailwind classes for the icon chip — keeps the screenshot's colored tiles. */
  chipClass: string;
  /** The Step 2 question shown once this category is picked. */
  refinementPrompt: string;
  /** Predefined Step 2 options. Empty = free skip straight to location. */
  refinementOptions: string[];
  /** Whether Step 2 allows picking more than one option. */
  refinementMultiSelect: boolean;
}

/**
 * The three parameters the engine needs. This is ALSO the wizard's state.
 * A field being `undefined` means "not answered yet" — that's what the view
 * keys off to decide which step to show. The cards fill these one at a time;
 * the chat parser fills as many as it can from a sentence. Same object.
 */
export interface SuggestionQuery {
  category?: CategoryId;
  /**
   * Step 2 answer(s). The SURPRISE_ME sentinel means "the user chose to skip
   * refinement" — distinct from `undefined` which means "not answered yet".
   */
  refinement?: string[] | typeof SURPRISE_ME;
  location?: LocationAnswer;
}

export const SURPRISE_ME = "__surprise_me__" as const;

export interface LocationAnswer {
  /** "auto" when geolocation succeeded; "manual" when the user typed a place. */
  source: "auto" | "manual";
  label: string; // e.g. "Lekki, Lagos" — human-readable, shown back to user
  lat?: number;
  lng?: number;
}

/**
 * A single suggestion. NOTE the social signal: it is an optional property,
 * not a string that might be "". If there is no real data, the field is
 * ABSENT. The renderer literally cannot show a fabricated signal because
 * there is nothing to render. "Never fabricated" enforced by the type system.
 */
export interface Suggestion {
  id: string;
  name: string;
  category: CategoryId;
  subcategory: string; // e.g. "Italian", "Padel court", "Cocktail bar"
  rating: number; // 0–5
  reviewCount?: number;
  proximity: Proximity;
  imageUrl: string;
  /** Present ONLY when backed by real data. Absence = no signal. */
  socialSignal?: SocialSignal;
  priceLevel?: 1 | 2 | 3 | 4; // $ … $$$$
  // ── Detail-modal fields ───────────────────────────────────────────────
  /** A short venue description shown in the detail modal. */
  description?: string;
  /** Full street address shown in the detail modal. */
  address?: string;
  /** A few photos for the modal's gallery (falls back to imageUrl). */
  gallery?: string[];
}

export interface Proximity {
  distanceKm: number;
  area: string; // e.g. "Victoria Island"
}

/**
 * The honest social signal. It carries the count that justifies it, so the
 * UI can choose to show "3 Knit friends went here" rather than vague hype.
 * If you can't populate `friendCount` with a real number, don't build this.
 */
export interface SocialSignal {
  kind: "popular_with_knit" | "friends_visited" | "trending_this_week";
  friendCount: number;
  text: string; // pre-composed, e.g. "Popular with Knit users near you"
}
