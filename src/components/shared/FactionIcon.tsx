import { Image, ImageProps } from "@mantine/core";
import { useFactionImages } from "@/hooks/useFactionImages";

type Props = {
  faction: string;
} & Omit<ImageProps, "src">;

export function FactionIcon({ faction, ...imageProps }: Props) {
  const factionImages = useFactionImages();
  const factionIcon = factionImages[faction]?.image;

  if (!factionIcon) return null;

  return <Image src={factionIcon} {...imageProps} />;
}
