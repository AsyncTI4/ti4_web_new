import { Box, Text, Image } from "@mantine/core";
import { Chip } from "@/components/shared/primitives/Chip";
import { Shimmer } from "../Shimmer";
import styles from "./ScoredSecret.module.css";

export function UnscoredSecret() {
  return (
    <Chip
      className={`${styles.secretCard} ${styles.unscoredDark}`}
      accent="red"
      enableHover={false}
    >
      <Shimmer
        color="red"
        py={2}
        px={6}
        className={`${styles.deepRedBorder} ${styles.deepRedBackground} ${styles.noShimmerOverlay}`}
      >
        <Box className={styles.contentContainer}>
          <Image
            src="/so_icon.png"
            className={`${styles.icon} ${styles.deepRedIcon}`}
          />
          <Text size="xs" fw={700} c="white" className={styles.textContainer}>
            Unscored Secret
          </Text>
        </Box>
      </Shimmer>
    </Chip>
  );
}
