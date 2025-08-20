import { Stack, Box, Group, Text, Flex } from "@mantine/core";
import { colors } from "../../../data/colors";
import styles from "./StasisInfantryCard.module.css";
import { Unit } from "../../shared/Unit";

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

// Helper function to get color alias from color name
const getColorAlias = (color?: string) => {
  if (!color) return "pnk"; // default fallback

  const colorData = colors.find(
    (solidColor) =>
      solidColor.name === color.toLowerCase() ||
      solidColor.aliases.includes(color.toLowerCase()) ||
      solidColor.alias === color.toLowerCase()
  );

  return colorData?.alias || "pnk"; // fallback to pink if not found
};
