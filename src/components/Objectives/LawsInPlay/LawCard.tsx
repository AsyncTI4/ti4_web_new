import { Box, Text } from "@mantine/core";
import { IconScale } from "@tabler/icons-react";
import { LawInPlay } from "../../../data/types";
import { CircularFactionIcon } from "../../shared/CircularFactionIcon";
import { getPrimaryColorWithOpacity } from "../../../lookup/colors";
import styles from "./LawCard.module.css";
import { useFactionColors } from "@/hooks/useFactionColors";

type Props = {
  law: LawInPlay;
};

function LawCard({ law }: Props) {
  const hasFactionIcon = law.displaysElectedFaction && law.electedFaction;
  const factionColorMap = useFactionColors();
  const factionColor = factionColorMap?.[law.electedFaction!]?.color || "gray";
  const badgeBorderColor = getPrimaryColorWithOpacity(factionColor, 0.8);

  return (
    <Box className={styles.lawCard}>
      <Box
        className={`${styles.lawCardContent} ${hasFactionIcon ? styles.withFactionIcon : ""}`}
      >
        {/* Law scales badge in top right */}
        <Box className={styles.gavelBadge}>
          <IconScale size={20} className={styles.gavelIcon} />
        </Box>

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

            {/* Elected faction badge - inline with title */}
            {law.electedFaction && (
              <Box
                className={styles.electedBadge}
                style={{ borderColor: badgeBorderColor }}
              >
                <Text className={styles.electedText}>
                  ELECTED: {law.electedFaction.toUpperCase()}
                </Text>
              </Box>
            )}
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
