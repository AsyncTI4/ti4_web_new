import { Group, Stack } from "@mantine/core";
import { Caption } from "../Caption";
import { EconomicsColumn } from "./EconomicsColumn";

type PlanetEconomics = {
  total: {
    currentResources: number;
    totalResources: number;
    currentInfluence: number;
    totalInfluence: number;
  };
  optimal: {
    currentResources: number;
    totalResources: number;
    currentInfluence: number;
    totalInfluence: number;
  };
  flex: {
    currentFlex: number;
    totalFlex: number;
  };
  flexSpendOnly?: boolean;
};

type Props = {
  planetEconomics: PlanetEconomics;
};

export function ResourceInfluenceCompact({ planetEconomics }: Props) {
  return (
    <Group gap="md" align="flex-start" wrap="nowrap">
      <Stack gap={4} align="flex-start">
        <Caption>Optimal</Caption>
        <EconomicsColumn
          currentResources={planetEconomics.optimal.currentResources}
          totalResources={planetEconomics.optimal.totalResources}
          currentInfluence={planetEconomics.optimal.currentInfluence}
          totalInfluence={planetEconomics.optimal.totalInfluence}
          currentFlex={planetEconomics.flex.currentFlex}
          totalFlex={planetEconomics.flex.totalFlex}
          showFlex={true}
          flexSpendOnly={planetEconomics.flexSpendOnly}
        />
      </Stack>

      <Stack gap={4} align="flex-start">
        <Caption>Total</Caption>
        <EconomicsColumn
          currentResources={planetEconomics.total.currentResources}
          totalResources={planetEconomics.total.totalResources}
          currentInfluence={planetEconomics.total.currentInfluence}
          totalInfluence={planetEconomics.total.totalInfluence}
          showFlex={false}
          showTotal={false}
        />
      </Stack>
    </Group>
  );
}
