import {
  getColorAlias,
  resolvePrimaryRgb,
} from "@/entities/lookup/colors";
import { getPlayerFactionDisplayName } from "@/entities/game/playerUtils";
import { useGameData } from "@/state/useGameContext";
import type { PlayerData } from "@/entities/data/types";

export type FactionHelpers = ReturnType<typeof useFactionHelpers>;

/** A player colour as a space-separated triplet for `rgb(var(--pc) / a)`; hairline grey when unknown. */
export function colorTriplet(color: string | undefined): string {
  const rgb = color ? resolvePrimaryRgb(color) : undefined;
  if (!rgb) return "var(--ds-hair-rgb)";
  return `${rgb.red} ${rgb.green} ${rgb.blue}`;
}

export function useFactionHelpers() {
  const gameData = useGameData();
  const players = gameData?.playerData ?? [];

  const playerFor = (faction: string): PlayerData | undefined =>
    players.find((p) => p.faction === faction);

  const displayName = (faction: string): string => {
    const player = playerFor(faction);
    if (player) return getPlayerFactionDisplayName(player);
    return faction.charAt(0).toUpperCase() + faction.slice(1);
  };

  const colorAlias = (faction: string): string =>
    getColorAlias(playerFor(faction)?.color);

  const rgb = (faction: string): string =>
    colorTriplet(playerFor(faction)?.color);

  return { playerFor, displayName, colorAlias, rgb };
}
