import { Group, Stack, Text } from "@mantine/core";
import classes from "./StatDisplay.module.css";

type StatSize = "xs" | "sm" | "md" | "lg";

type Props = {
  value: number | string;
  label?: string;
  suffix?: string;
  size?: StatSize;
  color?: string;
  icon?: React.ReactNode;
  layout?: "horizontal" | "vertical";
};

const VALUE_SIZES: Record<StatSize, string> = {
  xs: "sm",
  sm: "md",
  md: "lg",
  lg: "xl",
};

const LABEL_SIZES: Record<StatSize, string> = {
  xs: "9px",
  sm: "10px",
  md: "xs",
  lg: "sm",
};

/**
 * StatDisplay - Displays a numeric value with optional label and icon.
 * Used for trade goods, commodities, CC pools, and other numeric displays.
 */
export function StatDisplay({
  value,
  label,
  suffix,
  size = "md",
  color = "white",
  icon,
  layout = "horizontal",
}: Props) {
  const Container = layout === "horizontal" ? Group : Stack;
  const containerGap = layout === "horizontal" ? 6 : 0;

  return (
    <Container gap={containerGap} className={classes.container}>
      {icon && <span className={classes.icon}>{icon}</span>}
      <Group gap={4} align="baseline">
        <Text
          size={VALUE_SIZES[size]}
          c={color}
          ff="mono"
          fw={700}
          lh={1.1}
          className={classes.value}
        >
          {value}
          {suffix && (
            <Text component="span" size={LABEL_SIZES[size]} c="dimmed" ml={2}>
              {suffix}
            </Text>
          )}
        </Text>
      </Group>
      {label && (
        <Text
          size={LABEL_SIZES[size]}
          fw={400}
          className={classes.label}
          lh={1.1}
        >
          {label}
        </Text>
      )}
    </Container>
  );
}
