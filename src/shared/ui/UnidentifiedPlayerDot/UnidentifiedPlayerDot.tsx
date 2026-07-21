import { Box } from "@mantine/core";
import { findColorData, getPrimaryColorCSS } from "@/entities/lookup/colors";
import styles from "./UnidentifiedPlayerDot.module.css";

type Props = {
  /** The player's color, which stays public even when their faction doesn't. */
  color: string;
  size?: number;
  className?: string;
};

/**
 * Stand-in for a player whose color the viewer knows but whose faction they can't identify (FoW).
 * Used wherever a faction icon would normally go - a colored dot says "someone in this color"
 * without revealing who, which is strictly more information than omitting the marker entirely.
 */
export function UnidentifiedPlayerDot({ color, size = 20, className }: Props) {
  const colorData = findColorData(color);
  return (
    <Box
      title={colorData?.displayName ?? colorData?.name ?? color}
      className={className ? `${styles.dot} ${className}` : styles.dot}
      style={{
        width: size,
        height: size,
        background: getPrimaryColorCSS(color),
      }}
    />
  );
}
