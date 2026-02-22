import { useMemo } from "react";
import { PlayerData } from "@/entities/data/types";

/**
 * Custom hook that provides consistent faction ordering across all components.
 * Returns factions sorted alphabetically for predictable positioning.
 */
export function useOrderedFactions(playerData: PlayerData[]) {
  return useMemo(() => {
    return playerData.map((player) => player.faction).sort();
  }, [playerData]);
}
