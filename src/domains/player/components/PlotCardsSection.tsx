import { Group, Stack, type GroupProps } from "@mantine/core";
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
};

export function PlotCardsSection({
  plotCards,
  faction,
  layout = "horizontal",
  title = "Plots",
  groupProps,
  keyPrefix,
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

  if (layout === "vertical") {
    return (
      <Stack gap="xs">
        <Caption size="xs">{title}</Caption>
        {list}
      </Stack>
    );
  }

  return (
    <Group gap="md" align="flex-start">
      <Caption size="xs">{title}</Caption>
      {list}
    </Group>
  );
}
