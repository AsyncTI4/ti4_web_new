import { PlayerData } from "@/data/types";

export function calculateArmyRankings(
  playerData: PlayerData[]
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

