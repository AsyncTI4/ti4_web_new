import { Box, Image } from "@mantine/core";
import { getRelicData } from "@/entities/lookup/relics";
import { RelicCard } from "./RelicCard";
import { getGradientClasses } from "../gradientClasses";
import styles from "./Relic.module.css";
import { ChipWithPopover } from "@/shared/ui/primitives/ChipWithPopover";
import { IconX } from "@tabler/icons-react";
import { cdnImage } from "@/entities/data/cdnImage";
import cx from "clsx";

type Props = {
  relicId: string;
  isExhausted?: boolean;
};

type RelicIconProps = {
  isFake: boolean;
  isExhausted: boolean;
};

function RelicIcon({ isFake, isExhausted }: RelicIconProps) {
  const gradientClasses = getGradientClasses(isFake ? "gray" : "yellow");

  return (
    <Box className={styles.iconWrapper}>
      <Image
        src={isFake ? cdnImage("/tokens/token_frontier.webp") : "/relicicon.webp"}
        className={cx(
          styles.icon,
          !isFake && gradientClasses.iconFilter,
          isExhausted && styles.exhaustedIcon
        )}
      />
      {isExhausted && (
        <span className={styles.exhaustedX}>
          <IconX size={18} stroke={3} color="var(--mantine-color-red-1)" />
        </span>
      )}
    </Box>
  );
}

export function Relic({ relicId, isExhausted = false }: Props) {
  const relicData = getRelicData(relicId);

  if (!relicData) {
    console.warn(`Relic with ID "${relicId}" not found`);
    return null;
  }

  const isFake = relicData.isFakeRelic ?? false;
  const accentColor = isFake ? "grey" : isExhausted ? "bloodOrange" : "yellow";

  return (
    <ChipWithPopover
      className={styles.relicCard}
      accent={accentColor}
      leftSection={<RelicIcon isFake={isFake} isExhausted={isExhausted} />}
      title={relicData.shortName || relicData.name}
      dropdownContent={<RelicCard relicId={relicId} />}
    />
  );
}
