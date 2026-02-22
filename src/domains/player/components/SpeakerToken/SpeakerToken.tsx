import { Box, Group, Text } from "@mantine/core";
import styles from "./SpeakerToken.module.css";

type Props = {
  isVisible?: boolean;
};

export function SpeakerToken({ isVisible = false }: Props) {
  if (!isVisible) return null;

  return (
    <Box p={6} px={8} className={styles.root}>
      {/* Shimmering red border overlay */}
      <Box className={styles.shimmerBorder}>
        <Box className={styles.shimmerFill} />
      </Box>

      {/* Brushed metal texture overlay */}
      <Box className={styles.metalTexture} />

      {/* Top-right dark shadow for proper inset lighting */}
      <Box className={styles.topRightShadow} />

      {/* Bottom-left highlight for proper inset lighting */}
      <Box className={styles.bottomLeftHighlight} />

      {/* Red metallic glow */}
      <Box className={styles.redGlow} />

      <Group justify="center" align="center" className={styles.content}>
        <Text
          ff="heading"
          c="red.2"
          size="sm"
          fw={700}
          className={styles.label}
        >
          SPEAKER
        </Text>
      </Group>
    </Box>
  );
}
