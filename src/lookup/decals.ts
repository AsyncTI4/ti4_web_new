import { getTextColor } from "@/lookup/colors";
import { PlayerData } from "@/data/types";

/**
 * Get the decal file path for a unit based on player's active decal
 * Matches backend format: {decalId}_{unitType}_{colorSuffix}.png
 *
 * @param player Player data containing decalId
 * @param unitType Unit type (e.g., "dn", "cr", "ws")
 * @param colorAlias Color alias for determining white/black suffix
 * @returns Decal file path (e.g., "cb_101_dn_wht.png") or null if no decal
 *
 * The color suffix is determined by getTextColor() same as UnitBadge:
 * - White text → "_wht" suffix
 * - Black text → "_blk" suffix
 */
export function getUnitDecalPath(
  player: PlayerData | undefined,
  unitType: string,
  colorAlias: string
): string | null {
  // decalId contains the decal ID directly (e.g., "cb_101")
  const decalId = player?.decalId as string;
  if (!decalId) return null;

  const textColor = getTextColor(colorAlias);
  const colorSuffix = textColor.toLowerCase() === "white" ? "_wht" : "_blk";

  return `${decalId}_${unitType}${colorSuffix}.png`;
}
