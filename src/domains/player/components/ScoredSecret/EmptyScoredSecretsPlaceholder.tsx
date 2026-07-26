import { Box, Text } from "@mantine/core";
import { SecretObjectiveIcon } from "@/shared/ui/SecretObjectiveIcon";
import styles from "./EmptyPlaceholder.module.css";

/** An empty dossier slot: a socket waiting for a card, not a dashed outline. */
export function EmptyScoredSecretsPlaceholder() {
  return (
    <Box className={styles.socket}>
      <SecretObjectiveIcon size={16} className={styles.icon} />
      <Text className={styles.label}>No secrets scored</Text>
    </Box>
  );
}
