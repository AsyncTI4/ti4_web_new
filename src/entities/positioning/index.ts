import { getTokenData } from "@/entities/lookup/tokens";
import {
  HEX_GRID_SIZE,
  HEX_SQUARE_WIDTH,
  HEX_SQUARE_HEIGHT,
  HEX_VERTICES,
  DEFAULT_PLANET_RADIUS,
} from "./constants";
import {
  parsePlanetsFromCoords,
  getInitialHeatSourcesForSystem,
} from "./coordinateUtils";
import { placePlanetEntitiesForTile } from "./planetPlacement";
import { placeSpaceEntities } from "./spacePlacement";
import { EntityStack } from "./types";
import { PrePlacementTile } from "@/entities/game/types";
import { calculateSystemIndicatorLayout } from "./placementHelpers";
import { getTileById } from "@/entities/lookup/systems";

const hasCrowdedSystemRim = (
  systemId: string,
  hasBorderAnomaly = false,
) => hasBorderAnomaly || getTileById(systemId)?.tileBack === "fracture";

export const getAllEntityPlacementsForTile = (
  systemId: string,
  tile: PrePlacementTile,
): EntityStack[] => {
  const planets = parsePlanetsFromCoords(tile.systemId);
  const initialHeatSources = getInitialHeatSourcesForSystem(systemId);
  const highestProduction = tile.highestProduction;

  const { entityPlacements: spaceEntityPlacements } = placeSpaceEntities({
    gridSize: HEX_GRID_SIZE,
    squareWidth: HEX_SQUARE_WIDTH,
    squareHeight: HEX_SQUARE_HEIGHT,
    hexagonVertices: HEX_VERTICES,
    planets,
    tokens: tile.tokens,
    factionEntities: tile.unitsByFaction,
    initialHeatSources,
    commandCounters: tile.commandCounters || [],
    systemId,
    highestProduction,
    largestCapacity: tile.largestCapacity,
    hasCrowdedRim: hasCrowdedSystemRim(
      systemId,
      Boolean(tile.borderAnomalies?.length),
    ),
  });

  spaceEntityPlacements.forEach((entity) => {
    if (entity.entityType === "token") {
      const tokenData = getTokenData(entity.entityId);
      if (tokenData?.isPlanet) {
        planets.push({
          name: entity.entityId,
          x: entity.x,
          y: entity.y,
          radius: DEFAULT_PLANET_RADIUS,
        });
      }
    }
  });

  const planetEntityPlacements = placePlanetEntitiesForTile(
    planets,
    tile.planets,
  );

  return [...spaceEntityPlacements, ...planetEntityPlacements];
};

export const findSystemIndicatorLayout = (
  systemId: string,
  hasBorderAnomaly = false,
) =>
  calculateSystemIndicatorLayout(
    parsePlanetsFromCoords(systemId),
    hasCrowdedSystemRim(systemId, hasBorderAnomaly),
  );

export type { EntityStack } from "./types";

export {
  MAX_HEAT,
  HEX_GRID_SIZE,
  HEX_SQUARE_WIDTH,
  HEX_SQUARE_HEIGHT,
  DEFAULT_PLANET_RADIUS,
  HEX_VERTICES,
} from "./constants";

export { placeSpaceEntities } from "./spacePlacement";
