import { memo } from "react";
import { Chip } from "@/components/shared/primitives/Chip";
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
    <Chip
      accent={passed ? "red" : "green"}
      title={passed ? "PASSED" : "ACTIVE"}
      size="xs"
      className={styles.indicator}
    />
  );
});
