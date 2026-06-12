import { Box, Text } from "@mantine/core";
import styles from "./SpeakerToken.module.css";

type Props = {
  isVisible?: boolean;
};

export function SpeakerToken({ isVisible = false }: Props) {
  if (!isVisible) return null;

  return (
    <Box className={styles.root}>
      <Text ff="heading" size="xs" fw={700} className={styles.label}>
        SPEAKER
      </Text>
    </Box>
  );
}
