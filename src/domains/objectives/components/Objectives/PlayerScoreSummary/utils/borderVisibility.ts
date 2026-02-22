import type { ScoreBreakdownEntry } from "@/entities/data/types";

export function calculateBorderVisibility(
  idx: number,
  entries: ScoreBreakdownEntry[]
): { hideLeftBorder: boolean; hideRightBorder: boolean } {
  const firstNonScoredIdx = entries.findIndex((e) => e.state !== "SCORED");
  const isFirstNonScored = idx === firstNonScoredIdx;
  const isLastEntry = idx === entries.length - 1;
  const entry = entries[idx];

  if (isFirstNonScored) {
    return { hideLeftBorder: false, hideRightBorder: true };
  }

  if (isLastEntry) {
    return { hideLeftBorder: true, hideRightBorder: false };
  }

  if (entry.state === "POTENTIAL" || entry.state === "QUALIFIES") {
    return { hideLeftBorder: true, hideRightBorder: true };
  }

  return { hideLeftBorder: false, hideRightBorder: false };
}
