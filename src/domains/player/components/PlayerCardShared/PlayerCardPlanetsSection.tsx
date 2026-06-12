import type { ReactNode } from "react";
import { Group } from "@mantine/core";
import {
  ResourceInfluenceCompact,
  type PlanetEconomics,
} from "../ResourceInfluenceTable";

type PlayerCardPlanetsSectionProps = {
  planetEconomics: PlanetEconomics;
  gap?: number | string;
  wrap?: "wrap" | "nowrap";
  showTotalSpend?: boolean;
  children: ReactNode;
};

export function PlayerCardPlanetsSection({
  planetEconomics,
  gap = 8,
  wrap = "wrap",
  showTotalSpend = true,
  children,
}: PlayerCardPlanetsSectionProps) {
  return (
    <Group align="flex-start" gap={gap} wrap={wrap}>
      <ResourceInfluenceCompact
        planetEconomics={planetEconomics}
        showTotalSpend={showTotalSpend}
      />
      {children}
    </Group>
  );
}
