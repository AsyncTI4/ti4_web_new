import { Box, Text } from "@/ds";
import styles from "./TyrantToken.module.css";

export function TyrantToken() {
  return (
    <Box p={6} px={8} className={styles.root}>
      <Text ff="heading" c="yellow.6" size="sm" fw={700}>
        TYRANT
      </Text>
    </Box>
  );
}
