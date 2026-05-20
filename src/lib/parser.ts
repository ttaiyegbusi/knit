import type { CategoryId, SuggestionQuery } from "./types";
import { CATEGORIES } from "./categories";

// ─────────────────────────────────────────────────────────────────────────
// THE PARSER
//
// This is what makes the chat box a SHORTCUT into the wizard rather than a
// second product. It does ONE job: read a sentence, fill as many of
// {category, refinement, location} as it confidently can, and hand back a
// partial query. The wizard then resumes at whatever step is still empty.
//
// It never holds a conversation. It never guesses wildly. Low confidence =
// leave the field undefined and let the user tap through the normal step.
//
// Right now this is keyword matching (deterministic, debuggable, free). The
// signature is designed so it can later call an LLM to extract the same
// partial query — the rest of the app won't know the difference.
// ─────────────────────────────────────────────────────────────────────────

const CATEGORY_KEYWORDS: Record<CategoryId, string[]> = {
  eat_out: ["eat", "food", "dinner", "lunch", "breakfast", "restaurant", "hungry", "brunch", "meal"],
  play_sport: ["sport", "play", "football", "soccer", "padel", "tennis", "basketball", "swim", "game", "match"],
  grab_drink: ["drink", "coffee", "cocktail", "wine", "beer", "bar", "cafe", "café", "tea", "smoothie"],
  do_fun: ["fun", "music", "arcade", "bowling", "gallery", "comedy", "karaoke", "show", "concert", "活动"],
};

function detectCategory(text: string): CategoryId | undefined {
  const t = text.toLowerCase();
  for (const cat of Object.keys(CATEGORY_KEYWORDS) as CategoryId[]) {
    if (CATEGORY_KEYWORDS[cat].some((kw) => t.includes(kw))) return cat;
  }
  return undefined;
}

function detectRefinement(text: string, category: CategoryId): string[] {
  const t = text.toLowerCase();
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat) return [];
  return cat.refinementOptions.filter((opt) => t.includes(opt.toLowerCase()));
}

// Very light location hint: "near me" / "nearby" implies auto-detect intent;
// "in <place>" is left for the location step to confirm rather than guessed,
// because getting someone's location wrong is worse than asking.
function detectWantsNearby(text: string): boolean {
  const t = text.toLowerCase();
  return /\bnear\s?(me|by)\b|\baround here\b|\bclose by\b/.test(t);
}

export interface ParseResult {
  query: SuggestionQuery;
  /** Which fields the parser actually filled — useful for transparency. */
  filled: Array<keyof SuggestionQuery>;
  wantsNearby: boolean;
}

export function parseFreeText(text: string): ParseResult {
  const query: SuggestionQuery = {};
  const filled: Array<keyof SuggestionQuery> = [];

  const category = detectCategory(text);
  if (category) {
    query.category = category;
    filled.push("category");

    const refinement = detectRefinement(text, category);
    if (refinement.length > 0) {
      query.refinement = refinement;
      filled.push("refinement");
    }
  }

  return { query, filled, wantsNearby: detectWantsNearby(text) };
}
