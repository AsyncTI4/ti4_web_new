import { Image } from "@mantine/core";
import styles from "./CircularFactionIcon.module.css";
import { useFactionImages } from "@/hooks/useFactionImages";
import { getFactionImage } from "@/lookup/factions";

type Props = {
  faction: string;

  size?: number;
  className?: string;
};

export function CircularFactionIcon({ faction, size = 28, className }: Props) {
  const factionImages = useFactionImages();
  const factionImage = factionImages[faction]?.image;
  const factionImageType = factionImages[faction]?.type;
  const factionUrl = getFactionImage(faction, factionImage, factionImageType);

  return (
    <Image
      src={factionUrl}
      alt={faction}
      w={size}
      h={size}
      className={`${styles.factionIcon} ${className || ""}`}
    />
  );
}
