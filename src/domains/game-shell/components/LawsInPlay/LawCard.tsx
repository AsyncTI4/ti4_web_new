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
      {hasFactionIcon && (
        <Box className={styles.factionBadge}>
          <CircularFactionIcon
            faction={law.electedFaction!}
            size={32}
            className={styles.factionIcon}
          />
        </Box>
      )}
      <Box className={styles.lawCardContent}>
        <Text className={styles.lawTitle}>{law.name}</Text>
        {law.mapText && law.mapText.trim() && (
          <Text className={styles.mapText}>{law.mapText}</Text>
        )}
      </Box>
    </Box>
  );
}

export { LawCard };
