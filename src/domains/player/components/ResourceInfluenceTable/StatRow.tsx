import { Group, Text } from "@mantine/core";
import { StatMono } from "@/shared/ui/primitives/StatMono";

const padNumber = (num: number): string => {
  const rounded = Math.floor(num);
  return rounded < 10 ? ` ${rounded}` : `${rounded}`;
};

type StatTextProps = {
  value: number | string;
  size: "lg" | "xs";
  color: string;
  useYellow: boolean;
  width?: string;
  align?: "right";
  withShadow?: boolean;
};

function StatText({ value, size, color, useYellow, width, align, withShadow }: StatTextProps) {
  const Component = useYellow ? Text : StatMono;
  const style = {
    lineHeight: 1,
    ...(width && { minWidth: width }),
    ...(align && { textAlign: align }),
    ...(withShadow && { textShadow: "0 2px 4px rgba(0, 0, 0, 0.6)" }),
  };

  return (
    <Component
      size={size}
      fw={size === "lg" ? 700 : 500}
      c={color}
      ff={useYellow ? "mono" : undefined}
      style={style}
    >
      {value}
    </Component>
  );
}

type Props = {
  icon: React.ReactNode;
  current: number;
  total: number;
  currentWidth: string;
  totalWidth: string;
  color: "yellow" | "blue" | "gray";
};

export function StatRow({
  icon,
  current,
  total,
  currentWidth,
  totalWidth,
  color,
}: Props) {
  const currentColor =
    color === "yellow" ? "yellow.3" : color === "blue" ? "blue.3" : "gray.3";
  const totalColor =
    color === "yellow" ? "yellow.5" : color === "blue" ? "blue.5" : "gray.5";
  const useYellow = color === "yellow";

  return (
    <Group gap={6} align="center" wrap="nowrap">
      {icon}
      <Group gap={4} align="baseline" wrap="nowrap">
        <StatText
          value={padNumber(current)}
          size="lg"
          color={currentColor}
          useYellow={useYellow}
          width={currentWidth}
          align="right"
          withShadow={useYellow}
        />
        <StatText
          value="/"
          size="xs"
          color={totalColor}
          useYellow={useYellow}
          width="1ch"
        />
        <StatText
          value={Math.floor(total)}
          size="xs"
          color={totalColor}
          useYellow={useYellow}
          width={totalWidth}
          align="right"
        />
      </Group>
    </Group>
  );
}
