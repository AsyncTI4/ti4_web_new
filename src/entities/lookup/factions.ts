import { cdnImage } from "@/entities/data/cdnImage";
import type { FactionImageMap } from "@/app/providers/context/types";
import type { PlayerData } from "@/entities/data/types";

export function getFactionImage(
  faction: string,
  factionImage?: string,
  factionImageType?: string
): string | undefined {
  if (factionImageType === "DISCORD") return factionImage;
  return cdnImage(`/factions/${faction}.png`);
}

export function buildFactionImageMap(
  playerData: PlayerData[]
): FactionImageMap {
  return playerData.reduce((acc, player) => {
    acc[player.faction] = {
      image: player.factionImage ?? "",
      type: player.factionImageType ?? "",
    };

    return acc;
  }, {} as FactionImageMap);
}
