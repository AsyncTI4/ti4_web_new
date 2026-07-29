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
import { processPlanetEntities } from "./planetPlacement";
import { placeSpaceEntities } from "./spacePlacement";
import { EntityStack } from "./types";
import { PrePlacementTile } from "@/app/providers/context/types";
import {
  calculateCornerOffset,
  findBestHexagonCorner,
} from "./placementHelpers";

export const getAllEntityPlacementsForTile = (
  systemId: string,
  tile: PrePlacementTile
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

  const planetEntityPlacements = planets
    .filter((planet) => tile.planets[planet.name] !== undefined)
    .map((planet) => {
      const planetEntityData = tile.planets[planet.name];
      return processPlanetEntities(planet, planetEntityData).entityPlacements;
    })
    .flat();

  return [...spaceEntityPlacements, ...planetEntityPlacements];
};

export const findOptimalProductionIconCorner = (
  systemId: string
): { x: number; y: number } => {
  const { vertex, position } = findBestHexagonCorner(
    parsePlanetsFromCoords(systemId)
  );
  const { offsetX, offsetY } = calculateCornerOffset(position);

  return {
    x: vertex.x + offsetX,
    y: vertex.y + offsetY,
  };
};

// Re-export commonly used types and constants
export type {
  Planet,
  HeatSource,
  EntityStackBase,
  EntityStack,
  GameState,
} from "./types";

export {
  SPLAY_OFFSET_X,
  SPLAY_OFFSET_Y,
  SPACE_HEAT_CONFIG,
  GROUND_HEAT_CONFIG,
  MAX_HEAT,
  HEX_GRID_WIDTH,
  HEX_GRID_HEIGHT,
  HEX_GRID_SIZE,
  HEX_SQUARE_WIDTH,
  HEX_SQUARE_HEIGHT,
  DEFAULT_PLANET_RADIUS,
  HEX_VERTICES,
  entityIdPriority,
  entityZStackPriority,
} from "./constants";

export { initializeGroundCostMap, initializeSpaceCostMap } from "./costMap";
export { processPlanetEntities } from "./planetPlacement";
export { placeSpaceEntities } from "./spacePlacement";
