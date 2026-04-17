import { Image, ImageProps } from "@mantine/core";
import { useFactionImages } from "@/hooks/useFactionImages";
import { getFactionImage } from "@/entities/lookup/factions";

type Props = {
  faction: string;
  factionImageOverride?: string | null;
  factionImageTypeOverride?: string | null;
} & Omit<ImageProps, "src">;

export function FactionIcon({ faction, factionImageOverride, factionImageTypeOverride, ...imageProps }: Props) {
  const factionImages = useFactionImages();
  const factionImage = factionImageOverride ?? factionImages[faction]?.image;
  const factionImageType = factionImageTypeOverride ?? factionImages[faction]?.type;
  const factionUrl = getFactionImage(faction, factionImage, factionImageType);

  if (!factionUrl) return null;

  return <Image src={factionUrl} {...imageProps} />;
}
