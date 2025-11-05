import { getTextColor, findColorData } from "@/lookup/colors";

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

