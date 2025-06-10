import { Image } from "@mantine/core";
import { cdnImage } from "../../../data/cdnImage";
import styles from "./CircularFactionIcon.module.css";

type Props = {
  faction: string;
  size?: number;
  className?: string;
};

export function CircularFactionIcon({ faction, size = 28, className }: Props) {
  return (
    <Image
      src={cdnImage(`/factions/${faction}.png`)}
      alt={faction}
      w={size}
      h={size}
      className={`${styles.factionIcon} ${className || ""}`}
    />
  );
}
