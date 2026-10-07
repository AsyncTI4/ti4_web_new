import { Group, Stack, Text } from "@mantine/core";
import classes from "./StatGroup.module.css";

type StatItem = {
  value: number | string;
  label: string;
  suffix?: string;
};

type StatSize = "sm" | "md" | "lg";

type Props = {
  items: StatItem[];
  layout?: "horizontal" | "vertical";
  gap?: number;
  size?: StatSize;
};

const VALUE_SIZES: Record<StatSize, string> = {
  sm: "md",
  md: "lg",
  lg: "xl",
};

const LABEL_SIZES: Record<StatSize, string> = {
  sm: "9px",
  md: "xs",
  lg: "sm",
};

/**
 * StatGroup - Displays a group of labeled statistics.
 * Used for CCPool, TradeGoods, Commodities, and similar numeric groups.
 */
export function StatGroup({
  items,
  layout = "vertical",
  gap = 0,
  size = "md",
}: Props) {
  const Container = layout === "horizontal" ? Group : Stack;

  return (
    <Container gap={gap} ff="mono" fw={500}>
      {items.map((item, index) => (
        <Group key={index} gap={6}>
          <Text
            size={VALUE_SIZES[size]}
            c="white"
            lh={1.1}
            className={classes.value}
          >
            {item.value}
            {item.suffix}
          </Text>
          <Text
            size={LABEL_SIZES[size]}
            lh={1.1}
            fw={400}
            className={classes.label}
          >
            {item.label}
          </Text>
        </Group>
      ))}
    </Container>
  );
}
