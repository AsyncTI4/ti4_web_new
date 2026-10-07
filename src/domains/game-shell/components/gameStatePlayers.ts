export type GameStatePlayer = {
  color: string;
  displayName?: string | null;
  userName?: string | null;
  flexibleDisplayName?: string | null;
  faction?: string | null;
  factionImage?: string | null;
  factionImageType?: string | null;
  influence?: number | null;
  totInfluence?: number | null;
};

function cleanDisplayName(value?: string | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return null;
  return trimmed;
}

export function getPlayerDisplayName(
  player: GameStatePlayer | undefined,
  fallback: string,
): string {
  return (
    cleanDisplayName(player?.displayName) ??
    cleanDisplayName(player?.userName) ??
    cleanDisplayName(player?.flexibleDisplayName) ??
    cleanDisplayName(player?.faction) ??
    fallback
  );
}

export function playerNameForColor(
  playerData: GameStatePlayer[],
  color: string,
): string {
  return getPlayerDisplayName(
    playerData.find((p) => p.color === color),
    color,
  );
}

export function isVoteTablePlayer(player: GameStatePlayer): boolean {
  if (player.faction === "neutral") return false;
  const name = getPlayerDisplayName(player, player.color).toLowerCase();
  return !name.endsWith(".deck") && !name.endsWith('.deck"');
}

export function titleCaseWords(value: string): string {
  return value
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
