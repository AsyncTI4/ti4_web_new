import { Group, type GroupProps } from "@mantine/core";
import { Plot } from "./Plot";
import type { PlotCard } from "@/entities/data/types";
import { type ReactNode } from "react";

type PlotCardsListProps = {
  plotCards?: PlotCard[] | null;
  faction: string;
  groupProps?: GroupProps;
  renderWrapper?: (items: ReactNode[]) => ReactNode;
  keyPrefix?: string;
};

export function PlotCardsList({
  plotCards,
  faction,
  groupProps,
  renderWrapper,
  keyPrefix = "plot",
}: PlotCardsListProps) {
  if (!Array.isArray(plotCards) || plotCards.length === 0) {
    return null;
  }

  const items = plotCards.map((plotCard, index) => (
    <Plot key={`${keyPrefix}-${index}`} plotCard={plotCard} faction={faction} />
  ));

  if (renderWrapper) {
    return <>{renderWrapper(items)}</>;
  }

  return (
    <Group gap={4} wrap="wrap" flex={1} {...groupProps}>
      {items}
    </Group>
  );
}
