"use client";

import { useState } from "react";
import { Shuffle, MapPin, Loader2, Settings } from "lucide-react";
import { KnitBubble, KnitText, UserBubble } from "./ChatBubbles";
import { VibeIcon } from "./VibeIcon";
import { ActivitiesNearYou } from "./ActivitiesNearYou";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { SURPRISE_ME } from "@/lib/types";
import type { CategoryId, LocationAnswer, Suggestion } from "@/lib/types";
import type { useWizard } from "@/lib/useWizard";

export function Conversation({
  w,
  onPickCategory,
  onConfirmRefinement,
  onSkipRefinement,
  onSelectSuggestion,
}: {
  w: ReturnType<typeof useWizard>;
  onPickCategory: (id: CategoryId) => void;
  onConfirmRefinement: (r: string[]) => void;
  onSkipRefinement: () => void;
  onSelectSuggestion: (s: Suggestion) => void;
}) {
  const { query, phase } = w;

  return (
    <div className="mx-auto flex w-[600px] max-w-full flex-col gap-6">
      <KnitBubble>
        <KnitText>Pick a vibe to get started</KnitText>
        {phase === "category" && (
          <div className="mt-1 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onPickCategory(cat.id)}
                className="flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2 text-sm font-medium text-ink ring-2 ring-transparent transition hover:ring-[#FF4275]"
              >
                <VibeIcon category={cat.id} size={22} />
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </KnitBubble>

      {query.category && <UserBubble>{getCategory(query.category).label}</UserBubble>}

      {query.category && (
        <RefinementTurn
          category={query.category}
          isActive={phase === "refinement"}
          answer={query.refinement}
          onConfirm={onConfirmRefinement}
          onSkip={onSkipRefinement}
        />
      )}

      {query.refinement !== undefined && (
        <LocationTurn
          isActive={phase === "location"}
          answer={query.location}
          onConfirm={w.setLocation}
        />
      )}

      {phase === "results" && (
        <KnitBubble>
          <div className="rounded-2xl rounded-tl-md bg-surface-muted px-4 py-3 text-sm font-medium text-ink">
            <p className="leading-relaxed">
              Okay, based on your preference and location; here are some
              suggestions
            </p>
            <button
              onClick={() => w.changeLocation()}
              className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF4275] hover:underline"
            >
              <Settings className="h-3.5 w-3.5" />
              Change my location
            </button>
          </div>
          <div className="w-full pt-1">
            {w.isLoading ? (
              <ResultsLoading />
            ) : (
              <ActivitiesNearYou onSelect={onSelectSuggestion} />
            )}
          </div>
        </KnitBubble>
      )}
    </div>
  );
}

function RefinementTurn({
  category,
  isActive,
  answer,
  onConfirm,
  onSkip,
}: {
  category: CategoryId;
  isActive: boolean;
  answer: string[] | typeof SURPRISE_ME | undefined;
  onConfirm: (r: string[]) => void;
  onSkip: () => void;
}) {
  const cat = getCategory(category);
  return (
    <>
      <KnitBubble>
        <KnitText>{cat.refinementPrompt}</KnitText>
        {isActive && (
          <>
            <p className="px-1 text-xs text-ink-soft">
              {cat.refinementMultiSelect ? "Select cuisines" : "Select one"}
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.refinementOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => onConfirm([opt])}
                  className="rounded-lg bg-surface-muted px-3.5 py-2 text-sm font-medium text-ink ring-2 ring-transparent transition hover:ring-[#FF4275]"
                >
                  {opt}
                </button>
              ))}
              <button
                onClick={onSkip}
                className="inline-flex items-center gap-1.5 rounded-lg bg-surface-muted px-3.5 py-2 text-sm font-medium text-ink-soft ring-2 ring-transparent transition hover:ring-[#FF4275]"
              >
                <Shuffle className="h-3.5 w-3.5" />
                Surprise me
              </button>
            </div>
          </>
        )}
      </KnitBubble>

      {answer !== undefined && (
        <UserBubble>
          {answer === SURPRISE_ME ? "Surprise me" : (answer as string[]).join(", ")}
        </UserBubble>
      )}
    </>
  );
}

function LocationTurn({
  isActive,
  answer,
  onConfirm,
}: {
  isActive: boolean;
  answer: LocationAnswer | undefined;
  onConfirm: (loc: LocationAnswer) => void;
}) {
  const [manual, setManual] = useState("");
  const [denied, setDenied] = useState(false);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setDenied(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        onConfirm({
          source: "auto",
          label: "your current location",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setDenied(true),
      { timeout: 8000 },
    );
  }

  return (
    <>
      <KnitBubble>
        <KnitText>Where are you? We&apos;ll find things near you.</KnitText>
        {isActive && (
          <div className="flex flex-col gap-2">
            {!denied ? (
              <button
                onClick={useMyLocation}
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#FF4275] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <MapPin className="h-4 w-4" />
                Use my location
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-1.5">
                <MapPin className="h-4 w-4 text-ink-faint" />
                <input
                  autoFocus
                  value={manual}
                  onChange={(e) => setManual(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    manual.trim() &&
                    onConfirm({ source: "manual", label: manual.trim() })
                  }
                  placeholder="Enter a city or area"
                  className="bg-transparent py-1 text-sm text-ink outline-none placeholder:text-ink-faint"
                />
              </div>
            )}
          </div>
        )}
      </KnitBubble>

      {answer !== undefined && <UserBubble>{answer.label}</UserBubble>}
    </>
  );
}

function ResultsLoading() {
  return (
    <p className="flex items-center gap-2 py-2 text-sm text-ink-soft">
      <Loader2 className="h-4 w-4 animate-spin" />
      Curating a few good options…
    </p>
  );
}
