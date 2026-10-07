import { PlayerData } from "@/entities/data/types";

/** Faction names sorted alphabetically, for consistent ordering across components. */
export function useOrderedFactions(playerData: PlayerData[]) {
  return playerData.map((player) => player.faction).sort();
}
