/** Fighters and infantry render as a count badge instead of individual units. */
export function isBadgeUnit(unitType: string): unitType is "ff" | "gf" {
  return unitType === "ff" || unitType === "gf";
}
