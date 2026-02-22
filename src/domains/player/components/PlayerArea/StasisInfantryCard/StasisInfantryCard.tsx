import { Stack, Box, Group, Text, Flex } from "@mantine/core";
import styles from "./StasisInfantryCard.module.css";
import { Unit } from "@/shared/ui/Unit";
import { getColorAlias } from "@/entities/lookup/colors";

type Props = {
  reviveCount: number;
  color?: string;
};

export function StasisInfantryCard({ reviveCount, color }: Props) {
  const colorAlias = getColorAlias(color);
  
  if (reviveCount == 0) return <></>;

  return (
    <Stack className={`${styles.stasisCard} ${styles.cardStack}`}>
      {/* Enhanced top highlight with green hue */}
      <Box className={`${styles.highlight} ${styles.topHighlight}`} />

      <Box className={styles.glassySheen} />
      <Box className={styles.innerGlow} />

      <Flex className={styles.imageContainer}>
        <Unit
          unitType="gf"
          colorAlias={colorAlias}
          className={styles.unitImage}
        />
      </Flex>

      <Stack className={styles.infoStack}>
        <Group className={styles.mainGroup}>
          <Group className={styles.reviveGroup}>
            <Text className={styles.countText}>{reviveCount}</Text>
            <Text className={styles.reviveLabel}>revive</Text>
          </Group>
        </Group>
      </Stack>
    </Stack>
  );
}
