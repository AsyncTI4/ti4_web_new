import { cdnImage } from "@/entities/data/cdnImage";
import type { FactionImageMap } from "@/entities/game/types";
import type { PlayerData } from "@/entities/data/types";

export function getFactionImage(
  faction: string,
  factionImage?: string,
  factionImageType?: string
): string | undefined {
  if (factionImageType === "EMOJI") {
    return `https://emoji-cdn.mqrio.dev/${factionImage}?style=twitter`;
  }
  if (factionImageType === "DISCORD") return factionImage;
  const franken = /^franken(19|2[0-6])$/.exec(faction);
  if (franken) {
    return cdnImage(`/emojis/factions/franken/Franken${franken[1]}.png`);
  }
  return cdnImage(`/factions/${faction}.png`);
}

export function buildFactionImageMap(
  playerData: PlayerData[]
): FactionImageMap {
  return Object.fromEntries(
    playerData.map((player) => [
      player.faction,
      {
        image: player.factionImage ?? "",
        type: player.factionImageType ?? "",
      },
    ]),
  );
}
