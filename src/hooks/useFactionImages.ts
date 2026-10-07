import { getFactionImage } from "@/entities/lookup/factions";
import { useGameData } from "./useGameContext";

function useFactionImages() {
  const gameData = useGameData();
  return gameData?.factionImageMap ?? {};
}

/**
 * Faction icon URL, honouring a player's custom emoji/Discord image. Overrides
 * win over the game's faction image map, for callers (like the tab bar) that
 * render factions from outside the current game.
 */
export function useFactionImageUrl(
  faction: string,
  imageOverride?: string | null,
  imageTypeOverride?: string | null,
) {
  const factionImages = useFactionImages();
  return getFactionImage(
    faction,
    imageOverride ?? factionImages[faction]?.image,
    imageTypeOverride ?? factionImages[faction]?.type,
  );
}
