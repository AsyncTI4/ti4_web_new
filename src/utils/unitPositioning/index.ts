import { getTokenData } from "@/lookup/tokens";
import { getPlanetCoordsBySystemId } from "@/lookup/planets";
import {
  HEX_GRID_SIZE,
  HEX_SQUARE_WIDTH,
  HEX_SQUARE_HEIGHT,
  HEX_VERTICES,
  DEFAULT_PLANET_RADIUS,
  SPACE_HEAT_CONFIG,
} from "./constants";
import {
  parsePlanetsFromCoords,
  getInitialHeatSourcesForSystem,
} from "./coordinateUtils";
import { calculatePlanetHeat } from "./heatMap";
import { processPlanetEntities } from "./planetPlacement";
import { placeSpaceEntities } from "./spacePlacement";
import { EntityStack } from "./types";
import { PrePlacementTile } from "@/context/types";

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
    .map((planet) => {
      const planetEntityData = tile.planets[planet.name];
      return processPlanetEntities(planet, planetEntityData).entityPlacements;
    })
    .flat();

  return [...spaceEntityPlacements, ...planetEntityPlacements];
};

export const findOptimalProductionIconCorner = (
  systemId: string
): { x: number; y: number } | null => {
  const planetCoords = getPlanetCoordsBySystemId(systemId);
  const planets = Object.entries(planetCoords).map(([planetId, coordStr]) => {
    const [x, y] = coordStr.split(",").map(Number);
    return {
      name: planetId,
      x,
      y,
      radius: DEFAULT_PLANET_RADIUS,
    };
  });

  const hexagonCorners = [
    { vertex: HEX_VERTICES[0], position: "top-left" },
    { vertex: HEX_VERTICES[1], position: "top-right" },
  ];

  let lowestHeat = Infinity;
  let bestCorner: {
    vertex: { x: number; y: number };
    position: string;
  } | null = null;

  for (const corner of hexagonCorners) {
    const heat = calculatePlanetHeat(
      corner.vertex.x,
      corner.vertex.y,
      planets,
      SPACE_HEAT_CONFIG.planetDecayRate,
      SPACE_HEAT_CONFIG.maxHeat
    );

    if (heat < lowestHeat) {
      lowestHeat = heat;
      bestCorner = corner;
    }
  }

  if (!bestCorner) {
    bestCorner = { vertex: { x: 86.25, y: 0 }, position: "top-left" };
  }

  const IMAGE_SIZE = 48;
  let offsetX = 0;
  let offsetY = 0;

  switch (bestCorner.position) {
    case "top-left":
      offsetX = -10;
      offsetY = 0;
      break;
    case "top-right":
      offsetX = -IMAGE_SIZE + 10;
      offsetY = 0;
      break;
  }

  return {
    x: bestCorner.vertex.x + offsetX,
    y: bestCorner.vertex.y + offsetY,
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
