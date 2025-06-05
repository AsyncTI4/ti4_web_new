import { Stack, Box, Image, Group, Text, Flex } from "@mantine/core";
import { colors } from "../../../data/colors";
import styles from "./StasisInfantryCard.module.css";
import { cdnImage } from "../../../data/cdnImage";

type Props = {
  reviveCount: number;
  color?: string;
};

export function StasisInfantryCard({ reviveCount, color }: Props) {
  const colorAlias = getColorAlias(color);

  return (
    <Stack className={`${styles.stasisCard} ${styles.cardStack}`}>
      {/* Enhanced top highlight with green hue */}
      <Box className={`${styles.highlight} ${styles.topHighlight}`} />

      <Box className={styles.glassySheen} />
      <Box className={styles.innerGlow} />

      <Flex className={styles.imageContainer}>
        <Image
          src={cdnImage(`/units/${colorAlias}_gf.png`)}
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
