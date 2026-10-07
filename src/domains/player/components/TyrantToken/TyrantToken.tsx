import { Box, Group, Text } from "@mantine/core";
import styles from "./TyrantToken.module.css";

export function TyrantToken() {
  return (
    <Box p={6} px={8} className={styles.root}>
      <Box className={styles.shimmerBorder}>
        <Box className={styles.shimmerFill} />
      </Box>
      <Box className={styles.metalTexture} />
      <Box className={styles.topRightShadow} />
      <Box className={styles.bottomLeftHighlight} />
      <Box className={styles.yellowGlow} />

      <Group justify="center" align="center" className={styles.content}>
        <Text
          ff="heading"
          c="yellow.6"
          size="sm"
          fw={700}
          className={styles.label}
        >
          TYRANT
        </Text>
      </Group>
    </Box>
  );
}
