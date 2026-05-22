"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  CategoryId,
  LocationAnswer,
  Suggestion,
  SuggestionQuery,
} from "./types";
import { SURPRISE_ME } from "./types";
import { getSuggestions } from "./engine";

// ─────────────────────────────────────────────────────────────────────────
// WIZARD STATE
//
// The flow is NOT three pages. It is one SuggestionQuery that fills up. The
// "current step" is simply the first field that's still undefined. This is
// what lets the cards (one field at a time) and the chat parser (several
// fields at once) share the exact same machine — and what makes "Surprise
// me" a one-line write.
// ─────────────────────────────────────────────────────────────────────────

export type Phase = "category" | "refinement" | "location" | "results";

export interface WizardState {
  query: SuggestionQuery;
  phase: Phase;
  suggestions: Suggestion[];
  isLoading: boolean;
}

function derivePhase(q: SuggestionQuery): Phase {
  if (q.category === undefined) return "category";
  if (q.refinement === undefined) return "refinement";
  if (q.location === undefined) return "location"; // step 3: location permission
  return "results";
}

/** Default auto-detected location stand-in (real geocoding slots in later). */
const DEFAULT_LOCATION: LocationAnswer = {
  source: "auto",
  label: "your area",
};

export function useWizard() {
  const [query, setQuery] = useState<SuggestionQuery>({});
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const phase = useMemo(() => derivePhase(query), [query]);

  const runEngine = useCallback(async (q: SuggestionQuery) => {
    setIsLoading(true);
    try {
      const results = await getSuggestions(q);
      setSuggestions(results);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setCategory = useCallback((category: CategoryId) => {
    // Picking a (new) category resets the answers below it.
    setQuery({ category });
  }, []);

  const setRefinement = useCallback((refinement: string[]) => {
    // Advances to the location step (engine runs once location is set).
    setQuery((q) => ({ ...q, refinement }));
  }, []);

  const skipRefinement = useCallback(() => {
    setQuery((q) => ({
      ...q,
      refinement: SURPRISE_ME as typeof SURPRISE_ME,
    }));
  }, []);

  const setLocation = useCallback(
    (location: LocationAnswer) => {
      setQuery((q) => {
        const next = { ...q, location };
        void runEngine(next); // we now have all three params → fetch
        return next;
      });
    },
    [runEngine],
  );

  /**
   * The chat shortcut. Merges a parsed partial query, then either fetches
   * (if complete) or simply advances to whatever step is still open.
   */
  const applyParsedQuery = useCallback(
    (partial: SuggestionQuery) => {
      setQuery((q) => {
        const next = { ...q, ...partial };
        if (derivePhase(next) === "results") void runEngine(next);
        return next;
      });
    },
    [runEngine],
  );

  const reset = useCallback(() => {
    setQuery({});
    setSuggestions([]);
    setIsLoading(false);
  }, []);

  // Lets the user jump back to edit an earlier answer (clears everything below).
  const editStep = useCallback((step: Phase) => {
    setQuery((q) => {
      if (step === "category") return {};
      if (step === "refinement") return { category: q.category };
      if (step === "location")
        return { category: q.category, refinement: q.refinement };
      return q;
    });
  }, []);

  // "Change location" from the results turn — re-runs the engine with a new
  // location once the user provides one (wired to manual entry in the UI).
  const changeLocation = useCallback(
    (location?: LocationAnswer) => {
      setQuery((q) => {
        const next = { ...q, location: location ?? DEFAULT_LOCATION };
        void runEngine(next);
        return next;
      });
    },
    [runEngine],
  );

  return {
    query,
    phase,
    suggestions,
    isLoading,
    setCategory,
    setRefinement,
    skipRefinement,
    setLocation,
    changeLocation,
    applyParsedQuery,
    editStep,
    reset,
  };
}
