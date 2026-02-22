import type { EntryType, EntryState } from "@/entities/data/types";

export function shouldShowProgress(
  currentProgress: number | undefined,
  totalProgress: number | undefined,
  entryType: EntryType,
  state: EntryState
): boolean {
  return (
    currentProgress !== undefined &&
    totalProgress !== undefined &&
    entryType !== "SECRET" &&
    (state === "QUALIFIES" || state === "POTENTIAL")
  );
}
