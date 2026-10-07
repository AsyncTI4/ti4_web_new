import { Box, BoxProps } from "@mantine/core";
import type { ReactNode } from "react";
import cx from "clsx";
import classes from "./Surface.module.css";

type PatternType = "none" | "grid" | "circle";

type Props = BoxProps & {
  children: ReactNode;
  pattern?: PatternType;
  cornerAccents?: boolean;
};

const PATTERN_CLASS: Record<PatternType, string> = {
  none: "",
  grid: classes.gridPattern,
  circle: classes.circlePattern,
};

const CORNER_CLASSES = [
  classes.cornerAccentTopLeft,
  classes.cornerAccentTopRight,
  classes.cornerAccentBottomLeft,
  classes.cornerAccentBottomRight,
];

export function Surface({
  children,
  pattern = "none",
  cornerAccents = false,
  className,
  ...boxProps
}: Props) {
  return (
    <Box {...boxProps} className={cx(classes.surface, className)}>
      {pattern !== "none" && (
        <Box className={cx(classes.patternOverlay, PATTERN_CLASS[pattern])} />
      )}

      {cornerAccents &&
        CORNER_CLASSES.map((corner) => (
          <Box key={corner} className={cx(classes.cornerAccent, corner)} />
        ))}

      {children}
    </Box>
  );
}
