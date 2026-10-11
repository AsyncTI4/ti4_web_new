import { PlayerData } from "@/entities/data/types";
import { filterPlayersWithAssignedFaction } from "@/entities/game/playerUtils";

/**
 * Seated players in seat order: the order the game sends them in, which is also
 * the order the 1–8 keys pin them in. Every per-seat readout (progress pills,
 * matrix columns, track tokens) uses this so a seat keeps one position.
 */
export function getSeatOrder(playerData: PlayerData[]) {
  return filterPlayersWithAssignedFaction(playerData);
}

/** Faction names in seat order. */
export function useOrderedFactions(playerData: PlayerData[]) {
  return getSeatOrder(playerData).map((player) => player.faction);
}
