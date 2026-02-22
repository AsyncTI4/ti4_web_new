import { Box, type BoxProps } from "@mantine/core";
import cx from "clsx";
import classes from "./Panel.module.css";

type PanelVariant = "subtle" | "standard" | "elevated";
type PanelAccent = "none" | "red" | "green" | "blue" | "yellow" | "orange";

type Props = Omit<BoxProps, "variant"> & {
  variant?: PanelVariant;
  accent?: PanelAccent;
  noPadding?: boolean;
  children: React.ReactNode;
};

/**
 * Panel - A consistent container component for grouping related content.
 * Supports accent colors for status indicators and themed sections.
 */
export function Panel({
  variant = "subtle",
  accent = "none",
  noPadding = false,
  className,
  children,
  ...boxProps
}: Props) {
  return (
    <Box
      className={cx(
        classes.panel,
        classes[variant],
        accent !== "none" && classes[`accent_${accent}`],
        noPadding && classes.noPadding,
        className
      )}
      {...boxProps}
    >
      {children}
    </Box>
  );
}
