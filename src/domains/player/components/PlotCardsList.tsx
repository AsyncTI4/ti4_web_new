import { Group, SimpleGrid, type GroupProps } from "@mantine/core";
import { Plot } from "./Plot";
import type { PlotCard } from "@/entities/data/types";

type PlotCardsListProps = {
  plotCards?: PlotCard[] | null;
  faction: string;
  groupProps?: GroupProps;
  keyPrefix?: string;
  columns?: number;
  compact?: boolean;
};

export function PlotCardsList({
  plotCards,
  faction,
  groupProps,
  keyPrefix = "plot",
  columns,
  compact = false,
}: PlotCardsListProps) {
  if (!Array.isArray(plotCards) || plotCards.length === 0) {
    return null;
  }

  const items = plotCards.map((plotCard, index) => (
    <Plot
      key={`${keyPrefix}-${index}`}
      plotCard={plotCard}
      faction={faction}
      compact={compact}
    />
  ));

  if (columns) {
    return (
      <SimpleGrid cols={columns} spacing="4px">
        {items}
      </SimpleGrid>
    );
  }

  if (compact) {
    return (
      <Group gap={4} wrap="nowrap" style={{ flexDirection: "column" }} {...groupProps}>
        {items}
      </Group>
    );
  }

  return (
    <Group gap={4} wrap="wrap" flex={1} {...groupProps}>
      {items}
    </Group>
  );
}
