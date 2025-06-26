import { planets } from "@/data/planets";
import { Planet } from "@/data/types";

export const getPlanetById = (planetId: string): Planet | undefined => {
  return planets.find((planet) => planet.id === planetId);
};

export const getPlanetsByTileId = (tileId: string): Planet[] => {
  return planets.filter((planet) => planet.tileId === tileId);
};

export const getPlanetCoordsBySystemId = (
  systemId: string
): { [key: string]: string } => {
  const planetCoords: { [key: string]: string } = {};

  const systemPlanets = planets.filter((planet) => planet.tileId === systemId);
  systemPlanets.forEach((planet) => {
    if (planet.positionInTile) {
      planetCoords[planet.id] =
        `${planet.positionInTile.x},${planet.positionInTile.y}`;
    }
  });

  return planetCoords;
};

export const getPlanetData = (planetId: string): Planet | undefined => {
  return planets.find((planet) => planet.id === planetId);
};

export const calculatePlanetEconomics = (
  planets: string[],
  exhaustedPlanets: string[]
) => {
  return planets.reduce(
    (acc, planetId) => {
      const planetData = getPlanetData(planetId);
      if (!planetData) return acc;

      const isExhausted = exhaustedPlanets.includes(planetId);
      const resources = planetData.resources;
      const influence = planetData.influence;

      // Check if this is a flex planet (equal resources and influence)
      const isFlex = resources === influence && resources > 0;

      if (isFlex) {
        // Flex planets only count towards flex totals
        acc.flex.totalFlex += resources; // Use resources value since they're equal
        if (!isExhausted) {
          acc.flex.currentFlex += resources;
        }
      } else {
        // Non-flex planets count towards total always
        acc.total.totalResources += resources;
        acc.total.totalInfluence += influence;

        // Add to current if not exhausted
        if (!isExhausted) {
          acc.total.currentResources += resources;
          acc.total.currentInfluence += influence;
        }

        // Optimal calculation for non-flex planets
        if (resources > influence) {
          acc.optimal.totalResources += resources;
          if (!isExhausted) acc.optimal.currentResources += resources;
        } else if (influence > resources) {
          acc.optimal.totalInfluence += influence;
          if (!isExhausted) acc.optimal.currentInfluence += influence;
        }
        // Note: We don't handle the equal case here since it's already handled as flex
      }

      return acc;
    },
    {
      total: {
        currentResources: 0,
        totalResources: 0,
        currentInfluence: 0,
        totalInfluence: 0,
      },
      optimal: {
        currentResources: 0,
        totalResources: 0,
        currentInfluence: 0,
        totalInfluence: 0,
      },
      flex: {
        currentFlex: 0,
        totalFlex: 0,
      },
    }
  );
};
