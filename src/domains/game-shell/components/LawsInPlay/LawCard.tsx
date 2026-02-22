import { Box, Text } from "@mantine/core";
import { LawInPlay } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import styles from "./LawCard.module.css";

type Props = {
  law: LawInPlay;
};

function LawCard({ law }: Props) {
  const hasFactionIcon = law.displaysElectedFaction && law.electedFaction;

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
