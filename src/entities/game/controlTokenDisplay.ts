export type ControlTokenDisplayMode = "always" | "ambiguous" | "empty";

export function shouldShowControlToken(
  mode: ControlTokenDisplayMode,
  groundPiecesByFaction: Record<string, ReadonlyArray<{ count: number }>>,
): boolean {
  if (mode === "always") return true;

  const factionCount = Object.values(groundPiecesByFaction).filter((pieces) =>
    pieces.some((piece) => piece.count > 0),
  ).length;
  if (factionCount === 0) return true;

  return mode === "ambiguous" && factionCount > 1;
}
