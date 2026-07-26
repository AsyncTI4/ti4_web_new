import { Box, Image, Text } from "@mantine/core";
import styles from "../ScoredSecret/EmptyPlaceholder.module.css";

/** An empty promissory slot, seated in the same socket as the other holdings. */
export function EmptyPromissoryNotePlaceholder() {
  return (
    <Box className={styles.socket}>
      <Image src="/pnicon.png" alt="" w={16} className={styles.icon} />
      <Text className={styles.label}>No notes in play</Text>
    </Box>
  );
}
