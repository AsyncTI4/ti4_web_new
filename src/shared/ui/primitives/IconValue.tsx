import { Box, Text } from "@mantine/core";
import classes from "./IconValue.module.css";
import cx from "clsx";
import type { CSSProperties } from "react";

type Size = "xs" | "sm" | "md";

type Props = {
  icon?: React.ReactNode;
  iconSrc?: string;
  iconClassName?: string;
  value: number | string;
  size?: Size;
  className?: string;
};

const ICON_SIZES: Record<Size, number> = {
  xs: 14,
  sm: 16,
  md: 18,
};

const TEXT_OFFSETS: Record<Size, { top: number; left: number }> = {
  xs: { top: 1, left: 4 },
  sm: { top: 1, left: 5 },
  md: { top: 2, left: 5 },
};

/**
 * IconValue - Displays a value overlaid on an icon.
 * Used for resource/influence displays on planet cards and similar patterns.
 */
export function IconValue({
  icon,
  iconSrc,
  iconClassName,
  value,
  size = "sm",
  className,
}: Props) {
  const iconSize = ICON_SIZES[size];
  const offset = TEXT_OFFSETS[size];

  return (
    <Box
      className={className}
      style={{
        position: "relative",
        width: iconSize,
        height: iconSize,
      }}
    >
      <Box
        className={cx(
          classes.iconWrapper,
          iconSrc && classes.backgroundIcon,
          iconClassName
        )}
        style={
          iconSrc
            ? ({ "--icon-value-image": `url("${iconSrc}")` } as CSSProperties)
            : undefined
        }
      >
        {icon}
      </Box>
      <Text
        className={classes.value}
        size="xs"
        fw={700}
        c="white"
        style={{
          top: offset.top,
          left: offset.left,
        }}
      >
        {value}
      </Text>
    </Box>
  );
}
