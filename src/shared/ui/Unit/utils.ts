import { getTextColor, findColorData } from "@/entities/lookup/colors";
import { lookupUnit } from "@/entities/lookup/units";

/** Unit IDs that have the Dimensional Tear ability (create a gravity rift) */
const DIMENSIONAL_TEAR_UNIT_IDS = new Set([
  "cabal_spacedock",
  "cabal_spacedock2",
  "absol_cabal_spacedock2",
  "absol_cabal_spacedock2Alt",
]);

/**
 * Checks if a unit is a Dimensional Tear space dock (Cabal faction units that create gravity rifts)
 */
export function isDimensionalTearSpaceDock(
  unitType: string,
  faction?: string
): boolean {
  if (unitType !== "sd" || !faction) return false;

  const unit = lookupUnit(unitType, faction);
  if (!unit) return false;

  return DIMENSIONAL_TEAR_UNIT_IDS.has(unit.id);
}

/**
 * Checks if a unit type is a fighter or infantry
 */
export function isFighterOrInfantry(unitType: string): boolean {
  return unitType === "ff" || unitType === "gf";
}

/**
 * Computes the default alt text for a unit
 */
export function computeDefaultAlt(
  alt: string | undefined,
  faction: string | undefined,
  colorAlias: string,
  unitType: string
): string {
  return alt || `${faction || colorAlias} ${unitType}`;
}

/**
 * Computes the URL color based on unit type
 */
export function computeUrlColor(unitType: string, colorAlias: string): string {
  return unitType === "monument" || unitType === "lady"
    ? findColorData(colorAlias)?.name || colorAlias
    : colorAlias;
}

/**
 * Computes the token suffix based on text color
 */
export function computeTokenSuffix(colorAlias: string): string {
  const textColor = getTextColor(colorAlias);
  return textColor.toLowerCase() === "white" ? "_wht" : "_blk";
}

