import type { PlayerData } from "@/entities/data/types";
import { getPlayerFactionDisplayName } from "@/utils/playerUtils";

/**
 * The player fields every PlayerCard variant renders, with list and count
 * defaults filled in and the faction display name resolved.
 */
export function getPlayerCardLayoutFields(playerData: PlayerData) {
  const {
    scs = [],
    unfollowedSCs = [],
    neighbors = [],
    soCount = 0,
    pnCount = 0,
    acCount = 0,
  } = playerData;

  return {
    ...playerData,
    factionDisplayName: getPlayerFactionDisplayName(playerData),
    scs,
    unfollowedSCs,
    neighbors,
    soCount,
    pnCount,
    acCount,
  };
}
