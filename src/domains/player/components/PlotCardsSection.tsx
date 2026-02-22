import { Group, Stack, type GroupProps } from "@mantine/core";
import { type ReactNode } from "react";
import type { PlotCard } from "@/entities/data/types";
import Caption from "@/shared/ui/Caption/Caption";
import { PlotCardsList } from "./PlotCardsList";

type Layout = "horizontal" | "vertical";

type PlotCardsSectionProps = {
  plotCards?: PlotCard[] | null;
  faction: string;
  layout?: Layout;
  title?: string;
  groupProps?: GroupProps;
  keyPrefix?: string;
  renderContainer?: (section: ReactNode) => ReactNode;
};

export function PlotCardsSection({
  plotCards,
  faction,
  layout = "horizontal",
  title = "Plots",
  groupProps,
  keyPrefix,
  renderContainer,
}: PlotCardsSectionProps) {
  if (!Array.isArray(plotCards) || plotCards.length === 0) {
    return null;
  }

  const list = (
    <PlotCardsList
      plotCards={plotCards}
      faction={faction}
      groupProps={groupProps}
      keyPrefix={keyPrefix}
    />
  );

  const section =
    layout === "vertical" ? (
      <Stack gap="xs">
        <Caption size="xs">{title}</Caption>
        {list}
      </Stack>
    ) : (
      <Group gap="md" align="flex-start">
        <Caption size="xs">{title}</Caption>
        {list}
      </Group>
    );

  if (renderContainer) {
    return <>{renderContainer(section)}</>;
  }

  return section;
}
