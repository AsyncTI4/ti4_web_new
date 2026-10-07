import { getTextColor } from "@/entities/lookup/colors";
import { PlayerData } from "@/entities/data/types";

const EMPTY_DECAL_IDS = ["null", "none", "undefined"];

/**
 * Decal file path for a unit given the player's active decal, matching the
 * backend format `{decalId}_{unitType}_{wht|blk}.png` (e.g. "cb_101_dn_wht.png").
 * The suffix follows the color's text color, same as UnitBadge.
 */
export function getUnitDecalPath(
  player: PlayerData | undefined,
  unitType: string,
  colorAlias: string
): string | null {
  const decalId = player?.decalId;
  if (!decalId || EMPTY_DECAL_IDS.includes(decalId.trim().toLowerCase())) {
    return null;
  }

  const textColor = getTextColor(colorAlias);
  const colorSuffix = textColor.toLowerCase() === "white" ? "_wht" : "_blk";
  return `${decalId}_${unitType}${colorSuffix}.png`;
}
