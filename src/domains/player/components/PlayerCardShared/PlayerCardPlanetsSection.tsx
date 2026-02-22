import type { ReactNode } from "react";
import { Group, type GroupProps, Box, type BoxProps } from "@mantine/core";
import {
  PlayerCardPlanetsWithReinforcements,
  type PlayerCardPlanetsWithReinforcementsProps,
} from "../PlayerCardPlanetsArea";
import {
  ResourceInfluenceCompact,
  type PlanetEconomics,
} from "../ResourceInfluenceTable";

type PlayerCardPlanetsSectionProps = {
  planetEconomics: PlanetEconomics;
  groupProps?: GroupProps;
  resourceWrapperProps?: BoxProps;
  planetsProps?: PlayerCardPlanetsWithReinforcementsProps;
  renderPlanets?: () => ReactNode;
};

export function PlayerCardPlanetsSection({
  planetEconomics,
  groupProps,
  resourceWrapperProps,
  planetsProps,
  renderPlanets,
}: PlayerCardPlanetsSectionProps) {
  const planetsContent = renderPlanets
    ? renderPlanets()
    : planetsProps ? (
        <PlayerCardPlanetsWithReinforcements {...planetsProps} />
      ) : null;

  if (!planetsContent) return null;

  return (
    <Group align="flex-start" gap={groupProps?.gap ?? 8} {...groupProps}>
      <Box {...resourceWrapperProps}>
        <ResourceInfluenceCompact planetEconomics={planetEconomics} />
      </Box>
      {planetsContent}
    </Group>
  );
}
