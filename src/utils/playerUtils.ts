import { PlayerData } from "@/entities/data/types";

const INVALID_FACTION_VALUES = new Set(["", "null", "neutral"]);

function cleanDisplayName(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return null;
  return trimmed;
}

export function getPlayerFactionDisplayName(player: PlayerData) {
  return (
    cleanDisplayName(player.displayName) ??
    cleanDisplayName(player.flexibleDisplayName) ??
    player.faction
  );
}

/**
 * Whether a bare faction key belongs to a real player, as opposed to the neutral (Dicecord)
 * player or a no-faction placeholder. Use this on faction keys that come from somewhere other
 * than playerData (score breakdowns, objective scorer lists) so those surfaces agree with the
 * filtered playerData instead of treating a missing entry as a hidden player.
 */
export function isAssignedFactionKey(faction?: string | null): boolean {
  const factionValue = typeof faction === "string" ? faction.trim() : "";
  if (!factionValue) return false;
  return !INVALID_FACTION_VALUES.has(factionValue.toLowerCase());
}

export function hasAssignedFaction(
  player?: PlayerData | null,
): player is PlayerData {
  if (!player) return false;
  return isAssignedFactionKey(player.faction);
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
