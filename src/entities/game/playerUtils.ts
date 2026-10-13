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

function hasAssignedFaction(
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

/**
 * A promissory note's text with its owner filled in: "the <color> player"
 * names the faction holding that colour (or owning the note), falling back to
 * the colour itself when nobody at the table matches.
 */
export function resolvePromissoryNoteText(
  text: string,
  owner: { color?: string; faction?: string },
  players: PlayerData[] | undefined,
) {
  const player =
    players?.find((p) => owner.color && p.color === owner.color) ??
    players?.find((p) => owner.faction && p.faction === owner.faction);
  const name = player
    ? getPlayerFactionDisplayName(player)
    : owner.color || owner.faction || "";
  return text.replace(/<color>/g, name);
}
