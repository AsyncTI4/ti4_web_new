import { cdnImage } from "@/data/cdnImage";

export function getFactionImage(
  faction: string,
  factionImage?: string,
  factionImageType?: string
) {
  return (
    factionImageType === "DISCORD"
      ? factionImage!
      : cdnImage(`/factions/${faction}.png`)
  )!;
}
