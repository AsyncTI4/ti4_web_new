import type { ReactNode } from "react";
import { Box, Group } from "@mantine/core";
import {
  ResourceInfluenceCompact,
  type PlanetEconomics,
} from "../ResourceInfluenceTable";

type PlayerCardPlanetsSectionProps = {
  planetEconomics: PlanetEconomics;
  gap?: number | string;
  economyGap?: number | string;
  wrap?: "wrap" | "nowrap";
  showTotalSpend?: boolean;
  children: ReactNode;
};

export function PlayerCardPlanetsSection({
  planetEconomics,
  gap = 8,
  economyGap,
  wrap = "wrap",
  showTotalSpend = true,
  children,
}: PlayerCardPlanetsSectionProps) {
  return (
    <Group align="flex-start" gap={gap} wrap={wrap}>
      <Box mr={economyGap}>
        <ResourceInfluenceCompact
          planetEconomics={planetEconomics}
          showTotalSpend={showTotalSpend}
        />
      </Box>
      {children}
    </Group>
  );
}
