import { Image } from "@mantine/core";
import styles from "./CircularFactionIcon.module.css";
import { useFactionImages } from "@/hooks/useFactionImages";
import { getFactionImage } from "@/entities/lookup/factions";

type Props = {
  faction: string;
  size?: number;
  className?: string;
  factionImageOverride?: string | null;
  factionImageTypeOverride?: string | null;
};

export function CircularFactionIcon({ faction, size = 28, className, factionImageOverride, factionImageTypeOverride }: Props) {
  const factionImages = useFactionImages();
  const factionImage = factionImageOverride ?? factionImages[faction]?.image;
  const factionImageType = factionImageTypeOverride ?? factionImages[faction]?.type;
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
