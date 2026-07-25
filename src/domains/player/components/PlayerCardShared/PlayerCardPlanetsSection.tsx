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
  /** "stretch" makes the economics ledger match the planet cards' height. */
  align?: "flex-start" | "stretch";
  children: ReactNode;
};

export function PlayerCardPlanetsSection({
  planetEconomics,
  gap = 8,
  economyGap,
  wrap = "wrap",
  showTotalSpend = true,
  align = "flex-start",
  children,
}: PlayerCardPlanetsSectionProps) {
  return (
    <Group align={align} gap={gap} wrap={wrap}>
      <Box mr={economyGap} style={align === "stretch" ? { display: "flex" } : undefined}>
        <ResourceInfluenceCompact
          planetEconomics={planetEconomics}
          showTotalSpend={showTotalSpend}
        />
      </Box>
      {children}
    </Group>
  );
}
