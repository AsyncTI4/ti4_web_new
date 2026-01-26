import { Box, Text } from "@mantine/core";
import classes from "./IconValue.module.css";

type Size = "xs" | "sm" | "md";

type Props = {
  icon: React.ReactNode;
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
export function IconValue({ icon, value, size = "sm", className }: Props) {
  const iconSize = ICON_SIZES[size];
  const offset = TEXT_OFFSETS[size];
  
  // Calculate offsets as percentages of icon size so they scale properly
  const leftPercent = (offset.left / iconSize) * 100;
  const topPercent = (offset.top / iconSize) * 100;

  return (
    <Box
      className={className}
      w={iconSize}
      h={iconSize}
      style={{
        position: "relative",
      }}
    >
      <Box className={classes.iconWrapper}>{icon}</Box>
      <Text
        className={classes.value}
        size="sm"
        fw={700}
        c="white"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(calc(-50% + ${leftPercent}%), calc(-50% + ${topPercent}%))`,
        }}
      >
        {value}
      </Text>
    </Box>
  );
}
