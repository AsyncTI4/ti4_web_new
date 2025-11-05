/**
 * Checks if a unit type should be rendered as a badge instead of individual units
 */
export function isBadgeUnit(unitType: string): boolean {
  return unitType === "ff" || unitType === "gf";
}

