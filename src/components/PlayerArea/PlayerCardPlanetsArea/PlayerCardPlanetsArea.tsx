import { Group, Box } from "@mantine/core";
import { PlanetCard } from "../PlanetCard";
import { filterPlanetsByOcean } from "@/utils/planets";
import type { PlayerData } from "@/data/types";

type PlayerCardPlanetsAreaProps = {
  planets: string[];
  exhaustedPlanetAbilities?: string[];
  exhaustedPlanets?: string[];
  gap?: number | string;
  wrap?: "wrap" | "nowrap";
  align?: "flex-start" | "flex-end" | "center";
  className?: string;
};

export function PlayerCardPlanetsArea({
  planets,
  exhaustedPlanetAbilities = [],
  exhaustedPlanets = [],
  gap = 4,
  wrap = "wrap",
  align = "flex-start",
  className,
}: PlayerCardPlanetsAreaProps) {
  const { regularPlanets, oceanPlanets } = filterPlanetsByOcean(planets);

  return (
    <>
      <Group gap={gap} wrap={wrap} align={align} className={className}>
        {regularPlanets.map((planetId, index) => (
          <PlanetCard
            key={index}
            planetId={planetId}
            legendaryAbilityExhausted={exhaustedPlanetAbilities.includes(planetId)}
            isExhausted={exhaustedPlanets.includes(planetId)}
          />
        ))}
      </Group>
      {oceanPlanets.length > 0 && (
        <>
          <Box style={{ marginLeft: "2px" }} />
          <Group gap={oceanPlanets.length > 0 ? 1 : gap} wrap={wrap} align={align}>
            {oceanPlanets.map((planetId, index) => (
              <PlanetCard
                key={`ocean-${index}`}
                planetId={planetId}
                legendaryAbilityExhausted={exhaustedPlanetAbilities.includes(planetId)}
                isExhausted={exhaustedPlanets.includes(planetId)}
              />
            ))}
          </Group>
        </>
      )}
    </>
  );
}

