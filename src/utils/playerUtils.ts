import { PlayerData } from "@/data/types";

const INVALID_FACTION_VALUES = new Set(["", "null", "neutral"]);

export function hasAssignedFaction(
  player?: PlayerData | null,
): player is PlayerData {
  if (!player) return false;
  const factionValue =
    typeof player.faction === "string" ? player.faction.trim() : "";

  if (!factionValue) return false;
  return !INVALID_FACTION_VALUES.has(factionValue.toLowerCase());
}

export function filterPlayersWithAssignedFaction(playerData: PlayerData[]) {
  return playerData.filter(hasAssignedFaction);
}

export function calculateArmyRankings(
  playerData: PlayerData[],
): Record<string, number> {
  const armyValues = playerData.map((player) => {
    const totalValue =
      (player.spaceArmyHealth ?? 0) +
      (player.groundArmyHealth ?? 0) +
      (player.spaceArmyCombat ?? 0) * 2 +
      (player.groundArmyCombat ?? 0) * 2;
    return {
      faction: player.faction,
      totalValue,
    };
  });

  armyValues.sort((a, b) => b.totalValue - a.totalValue);

  const rankings: Record<string, number> = {};
  armyValues.forEach((item, index) => {
    rankings[item.faction] = index + 1;
  });

  return rankings;
}
