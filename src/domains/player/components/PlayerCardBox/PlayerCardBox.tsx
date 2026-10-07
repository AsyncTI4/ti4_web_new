import { Paper, Box } from "@mantine/core";
import { getPrimaryColorWithOpacity } from "@/entities/lookup/colors";
import "@/styles/theme.css";
import styles from "./PlayerCardBox.module.css";
import cx from "clsx";

type Props = {
  color: string;
  children: React.ReactNode;
  /** Breathing faction-colored glow while this player holds the turn */
  isActive?: boolean;
};

export function PlayerCardBox({ color, children, isActive = false }: Props) {
  return (
    <Box
      className={cx(styles.wrapper, isActive && styles.activeCard)}
      style={
        isActive
          ? ({
              "--active-glow": getPrimaryColorWithOpacity(color, 0.4),
              "--active-glow-weak": getPrimaryColorWithOpacity(color, 0.14),
            } as React.CSSProperties)
          : undefined
      }
    >
      <Paper p="sm" radius="md" className={styles.paper}>
        <Box
          className={styles.colorBand}
          style={{ background: getPrimaryColorWithOpacity(color, 0.85) }}
        />
        <Box className={styles.content}>{children}</Box>
        <Box className={styles.innerGlow} />
      </Paper>
    </Box>
  );
}
