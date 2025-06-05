import { Box, Text } from "@mantine/core";
import { memo } from "react";
import styles from "./StatusIndicator.module.css";

type Props = {
  passed?: boolean;
  active?: boolean;
};

export const StatusIndicator = memo(function StatusIndicator({
  passed,
  active,
}: Props) {
  if (!passed && !active) return null;

  return (
    <Box
      px={8}
      py={2}
      ml={4}
      className={passed ? styles.passedContainer : styles.activeContainer}
    >
      <Text
        size="xs"
        fw={700}
        c={passed ? "red.3" : "green.3"}
        className={styles.statusText}
      >
        {passed ? "PASSED" : "ACTIVE"}
      </Text>
    </Box>
  );
});
