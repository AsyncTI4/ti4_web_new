import { Group, Box } from "@mantine/core";
import { PlanetCard } from "../PlanetCard";
import { filterPlanetsByOcean } from "@/utils/planets";

type Props = {
  planets: string[];
  exhaustedPlanetAbilities?: string[];
  exhaustedPlanets?: string[];
  wrap?: "wrap" | "nowrap";
};

export function PlayerCardPlanetsArea({
  planets,
  exhaustedPlanetAbilities = [],
  exhaustedPlanets = [],
  wrap = "wrap",
}: Props) {
  const { regularPlanets, oceanPlanets } = filterPlanetsByOcean(planets);

  return (
    <>
      <Group gap={4} wrap={wrap} align="flex-start">
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
          <Group gap={1} wrap={wrap} align="flex-start">
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
