import { planets } from "@/data/planets";
import { Planet } from "@/data/types";

const planetsMap = new Map(planets.map((planet) => [planet.id, planet]));

const planetsByTileIdMap = new Map<string, Planet[]>();
planets.forEach((planet) => {
  if (planet.tileId) {
    const existingPlanets = planetsByTileIdMap.get(planet.tileId) || [];
    planetsByTileIdMap.set(planet.tileId, [...existingPlanets, planet]);
  }
});

export const getPlanetById = (planetId: string): Planet | undefined => {
  return planetsMap.get(planetId);
};

export const getPlanetsByTileId = (tileId: string): Planet[] => {
  return planetsByTileIdMap.get(tileId) || [];
};

export const getPlanetCoordsBySystemId = (
  systemId: string
): { [key: string]: string } => {
  const planetCoords: { [key: string]: string } = {};

  const systemPlanets = planetsByTileIdMap.get(systemId) || [];
  systemPlanets.forEach((planet) => {
    // Prioritize planetLayout.centerPosition if available, otherwise use positionInTile
    if (planet.planetLayout?.centerPosition) {
      planetCoords[planet.id] =
        `${planet.planetLayout.centerPosition.x},${planet.planetLayout.centerPosition.y}`;
    } else if (planet.positionInTile) {
      planetCoords[planet.id] =
        `${planet.positionInTile.x},${planet.positionInTile.y}`;
    }
  });

  return planetCoords;
};

export const getPlanetData = (planetId: string): Planet | undefined => {
  return planetsMap.get(planetId);
};
