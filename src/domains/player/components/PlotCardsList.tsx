import { Group } from "@mantine/core";
import { Plot } from "./Plot";
import type { PlotCard } from "@/entities/data/types";

type Props = {
  plotCards?: PlotCard[] | null;
  faction: string;
  keyPrefix?: string;
  compact?: boolean;
};

export function PlotCardsList({
  plotCards,
  faction,
  keyPrefix = "plot",
  compact = false,
}: Props) {
  if (!Array.isArray(plotCards) || plotCards.length === 0) return null;

  const items = plotCards.map((plotCard, index) => (
    <Plot
      key={`${keyPrefix}-${index}`}
      plotCard={plotCard}
      faction={faction}
      compact={compact}
    />
  ));

  if (compact) {
    return (
      <Group gap={4} wrap="nowrap" style={{ flexDirection: "column" }}>
        {items}
      </Group>
    );
  }

  return (
    <Group gap={4} wrap="wrap" flex={1}>
      {items}
    </Group>
  );
}
