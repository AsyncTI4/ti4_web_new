import { planets } from "@/entities/data/planets";
import { groupBy, indexBy } from "@/entities/lookup/indexBy";
import type { Planet, Point } from "@/entities/data/types";

const planetsMap = indexBy(planets, (planet) => planet.id);

const planetsByTileIdMap = groupBy(
  planets,
  (planet) => planet.tileId || undefined
);

/**
 * A planet's position within its tile: planetLayout.centerPosition when present,
 * otherwise positionInTile.
 */
export const getPlanetLocalPosition = (
  planet: Planet
): Point | undefined => {
  const position = planet.planetLayout?.centerPosition ?? planet.positionInTile;
  if (!position) return undefined;
  return { x: position.x, y: position.y };
};

const planetPositionsBySystemId = new Map<
  string,
  Readonly<Record<string, Point>>
>();
planetsByTileIdMap.forEach((systemPlanets, systemId) => {
  const positions: Record<string, Point> = {};
  systemPlanets.forEach((planet) => {
    const position = getPlanetLocalPosition(planet);
    if (position) positions[planet.id] = position;
  });
  planetPositionsBySystemId.set(systemId, positions);
});

const EMPTY_POSITIONS: Readonly<Record<string, Point>> = {};

export const getPlanetsByTileId = (tileId: string): Planet[] => {
  return planetsByTileIdMap.get(tileId) || [];
};

/** Local (in-tile) positions of every positioned planet in a system, keyed by planet id. */
export const getPlanetPositionsBySystemId = (
  systemId: string
): Readonly<Record<string, Point>> => {
  return planetPositionsBySystemId.get(systemId) ?? EMPTY_POSITIONS;
};

export const getPlanetData = (planetId: string): Planet | undefined => {
  return planetsMap.get(planetId);
};
