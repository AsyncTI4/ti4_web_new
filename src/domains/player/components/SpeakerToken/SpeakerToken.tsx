import { Box, Text } from "@/ds";
import styles from "./SpeakerToken.module.css";

export function SpeakerToken() {
  return (
    <Box className={styles.root}>
      <Text ff="heading" size="xs" fw={700} className={styles.label}>
        SPEAKER
      </Text>
    </Box>
  );
}
