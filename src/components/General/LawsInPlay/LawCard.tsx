import { Box, Text } from "@mantine/core";
import { IconScale } from "@tabler/icons-react";
import { LawInPlay } from "../../../data/types";
import { CircularFactionIcon } from "../../shared/CircularFactionIcon";
import styles from "./LawCard.module.css";
import { useFactionColors } from "@/hooks/useFactionColors";

type Props = {
  law: LawInPlay;
};

function LawCard({ law }: Props) {
  const hasFactionIcon = law.displaysElectedFaction && law.electedFaction;
  const factionColorMap = useFactionColors();

  return (
    <Box className={styles.lawCard}>
      <Box
        className={`${styles.lawCardContent} ${hasFactionIcon ? styles.withFactionIcon : ""}`}
      >
        {/* Administrative badge/seal background for faction icon - only show if displays elected faction */}
        {hasFactionIcon && (
          <Box className={styles.factionBadge}>
            <CircularFactionIcon
              faction={law.electedFaction!}
              size={32}
              className={styles.factionIcon}
            />
          </Box>
        )}

        {/* Administrative text background */}
        <Box className={styles.textBackground}>
          {/* Subtle administrative pattern */}
          <Box className={styles.backgroundPattern} />

          <Box className={styles.titleRow}>
            <Text className={styles.lawTitle}>{law.name}</Text>

          </Box>
        </Box>

        {/* Map effect text - outside the inner box */}
        {law.mapText && law.mapText.trim() && (
          <Text className={styles.mapText}>{law.mapText}</Text>
        )}
      </Box>
    </Box>
  );
}

export { LawCard };
