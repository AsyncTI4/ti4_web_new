import { Paper, Box } from "@/ds";
import { getPrimaryColorWithOpacity } from "@/entities/lookup/colors";
import "@/styles/theme.css";
import styles from "./PlayerCardBox.module.css";
import cx from "clsx";
import { searchKey, searchTarget } from "@/domains/search/searchKeys";

type Props = {
  color: string;
  children: React.ReactNode;
  /** Breathing faction-colored glow while this player holds the turn */
  isActive?: boolean;
  /** Makes the whole card findable by board search under this faction. */
  faction?: string;
};

export function PlayerCardBox({ color, children, isActive = false, faction }: Props) {
  return (
    <Box
      className={cx(styles.wrapper, isActive && styles.activeCard)}
      {...(faction && searchTarget(searchKey("faction", faction)))}
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
