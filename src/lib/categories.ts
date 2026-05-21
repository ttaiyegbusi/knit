import type { Category, CategoryId } from "./types";

/**
 * The catalog. Adding a category in v2 = adding one entry here (plus the id
 * to the CategoryId union in types.ts). Nothing else needs to change — the
 * wizard and parser both read from this.
 */
export const CATEGORIES: Category[] = [
  {
    id: "eat_out",
    label: "Eat out",
    emoji: "🍽️",
    chipClass: "bg-gradient-to-br from-sky-400 to-blue-500",
    refinementPrompt: "Any cuisine in mind?",
    refinementOptions: [
      "Italian",
      "Japanese",
      "Nigerian",
      "American",
      "Chinese",
      "Indian",
      "Lebanese",
    ],
    refinementMultiSelect: true,
  },
  {
    id: "play_sport",
    label: "Play a sport",
    emoji: "⚽",
    chipClass: "bg-gradient-to-br from-pink-400 to-rose-500",
    refinementPrompt: "What sport?",
    refinementOptions: [
      "Football",
      "Padel",
      "Tennis",
      "Basketball",
      "Table tennis",
      "Swimming",
    ],
    refinementMultiSelect: false,
  },
  {
    id: "grab_drink",
    label: "Grab a drink",
    emoji: "☕",
    chipClass: "bg-gradient-to-br from-orange-400 to-amber-500",
    refinementPrompt: "What are you in the mood for?",
    refinementOptions: [
      "Coffee",
      "Cocktails",
      "Wine",
      "Craft beer",
      "Smoothies",
      "Tea",
    ],
    refinementMultiSelect: false,
  },
  {
    id: "do_fun",
    label: "something fun",
    emoji: "🎭",
    chipClass: "bg-gradient-to-br from-violet-400 to-purple-500",
    refinementPrompt: "What kind of fun?",
    refinementOptions: [
      "Live music",
      "Arcade",
      "Bowling",
      "Art gallery",
      "Comedy",
      "Karaoke",
    ],
    refinementMultiSelect: true,
  },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export function getCategory(id: CategoryId): Category {
  return CATEGORY_MAP[id];
}
