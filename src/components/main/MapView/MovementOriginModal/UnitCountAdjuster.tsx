import { ActionIcon, Group, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";

export type UnitCountField = "healthy" | "sustained";

type UnitCountAdjusterProps = {
  field: UnitCountField;
  value: number;
  max: number;
  onAdjust: (field: UnitCountField, delta: number) => void;
  valueClassName?: string;
};

export function UnitCountAdjuster({
  field,
  value,
  max,
  onAdjust,
  valueClassName,
}: UnitCountAdjusterProps) {
  return (
    <Group gap={4} wrap="nowrap">
      <ActionIcon
        size="xs"
        variant="light"
        onClick={() => onAdjust(field, -1)}
        disabled={value <= 0}
      >
        <IconMinus size={12} />
      </ActionIcon>
      <Text size="sm" className={valueClassName}>
        {value}
      </Text>
      <ActionIcon
        size="xs"
        variant="light"
        onClick={() => onAdjust(field, 1)}
        disabled={value >= max}
      >
        <IconPlus size={12} />
      </ActionIcon>
    </Group>
  );
}
