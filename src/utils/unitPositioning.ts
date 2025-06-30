/**
 * Unit positioning and cost map algorithms for hexagonal game boards
 */
import {
  FactionUnits,
  TileUnitData,
  EntityData,
  PlanetEntityData,
} from "@/data/types";
import {
  HexagonVertex,
  squareIntersectsCircle,
  squareOutsideHex,
  touchesCircleRim,
  touchesHexRim,
} from "./hitbox";
import { getPlanetById, getPlanetCoordsBySystemId } from "@/lookup/planets";
import { getTokenData } from "@/data/tokens";

// Define the new types here since they're not exported from types.ts

// Unit stacking constants
export const SPLAY_OFFSET_X = 10; // Horizontal offset between stacked units (pixels)
export const SPLAY_OFFSET_Y = 10; // Vertical offset between stacked units (pixels)

// Heat source parameter configurations
export const SPACE_HEAT_CONFIG = {
  maxHeat: 2000,
  planetDecayRate: 0.035,
  rimMaxHeat: 400,
  rimDecayRate: 0.08,
  unitHeat: 400,
  unitDecayRate: 0.055,
  factionRepulsionHeat: 400,
  factionDecayRate: 0.02,
  stackSizeMultiplier: 0.15,
} as const;

export const GROUND_HEAT_CONFIG = {
  maxHeat: 2000,
  planetDecayRate: 0.035,
  rimMaxHeat: 100, // Lower for tighter positioning around planet rims
  rimDecayRate: 0.06, // From placeGroundEntitiesForPlanet
  unitHeat: 400,
  unitDecayRate: 0.06, // From placeGroundEntitiesForPlanet
  factionRepulsionHeat: 400,
  factionDecayRate: 0.02,
  stackSizeMultiplier: 0.15,
} as const;

// Deprecated constants - use SPACE_HEAT_CONFIG or GROUND_HEAT_CONFIG instead
export const MAX_HEAT = SPACE_HEAT_CONFIG.maxHeat;
export const PLANET_DECAY_RATE = SPACE_HEAT_CONFIG.planetDecayRate;
export const SPACE_RIM_MAX_HEAT = SPACE_HEAT_CONFIG.rimMaxHeat;
export const GROUND_RIM_MAX_HEAT = GROUND_HEAT_CONFIG.rimMaxHeat;
export const RIM_MAX_HEAT = SPACE_HEAT_CONFIG.rimMaxHeat;
export const RIM_DECAY_RATE = SPACE_HEAT_CONFIG.rimDecayRate;
export const UNIT_HEAT = SPACE_HEAT_CONFIG.unitHeat;
export const UNIT_DECAY_RATE = SPACE_HEAT_CONFIG.unitDecayRate;
export const FACTION_REPULSION_HEAT = SPACE_HEAT_CONFIG.factionRepulsionHeat;
export const FACTION_DECAY_RATE = SPACE_HEAT_CONFIG.factionDecayRate;
export const STACK_SIZE_MULTIPLIER = SPACE_HEAT_CONFIG.stackSizeMultiplier;

export const HEX_GRID_WIDTH = 345;
export const HEX_GRID_HEIGHT = 299;
export const HEX_GRID_SIZE = 30;
export const HEX_SQUARE_WIDTH = HEX_GRID_WIDTH / HEX_GRID_SIZE;
export const HEX_SQUARE_HEIGHT = HEX_GRID_HEIGHT / HEX_GRID_SIZE;

export const DEFAULT_PLANET_RADIUS = 60;

// Flat-top hexagon vertices for a 345x299 tile
// (not correct with mallice and might need to be updated)
export const HEX_VERTICES = [
  { x: 86.25, y: 0 },
  { x: 258.75, y: 0 },
  { x: 345, y: 149.5 },
  { x: 258.75, y: 299 },
  { x: 86.25, y: 299 },
  { x: 0, y: 149.5 },
];
// Entity type priority order (lower index = higher priority)
export const entityIdPriority = [
  "ws",
  "fs",
  "dn",
  "ff",
  "ca",
  "cv",
  "dd",
  "ff",
  "gf",
  "mf",
  "sd",
  "pd",
];

// stack for badges to appear first
// then general ground troops (in reverse placement order)
// then space entities (in reverse placement order)
export const entityZStackPriority = [
  "gf",
  "ff",
  "mf",
  "sd",
  "pd",
  "dd",
  "cv",
  "ca",
  "dn",
  "fs",
  "ws",
  "sleeper",
  "custodiavigilia1",
  "custodiavigilia2",
  "mirage",
];

const calculatePlanetHeat = (
  squareX: number,
  squareY: number,
  planets: Planet[],
  decayRate: number,
  maxHeat: number
): number => {
  if (planets.length === 0) return 0;

  let totalHeat = 0;
  for (const planet of planets) {
    const dx = squareX - planet.x;
    const dy = squareY - planet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    totalHeat += maxHeat * Math.exp(-decayRate * distance);
  }
  return totalHeat;
};

const calculateRimHeat = (
  squareX: number,
  squareY: number,
  rimSquares: { row: number; col: number }[],
  squareWidth: number,
  squareHeight: number,
  decayRate: number,
  rimMaxHeat: number
): number => {
  if (rimSquares.length === 0) return 0;

  let minRimDistance = Infinity;
  for (const rimSquare of rimSquares) {
    const rimX = rimSquare.col * squareWidth + squareWidth / 2;
    const rimY = rimSquare.row * squareHeight + squareHeight / 2;
    const dx = squareX - rimX;
    const dy = squareY - rimY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    minRimDistance = Math.min(minRimDistance, distance);
  }

  return minRimDistance < Infinity
    ? rimMaxHeat * Math.exp(-decayRate * minRimDistance)
    : 0;
};

const calculateUnitHeat = (
  squareX: number,
  squareY: number,
  heatSources: HeatSource[],
  hasMultipleFactions: boolean,
  currentFaction: string | undefined,
  entityDecayRate: number,
  factionDecayRate: number,
  unitHeat: number,
  factionRepulsionHeat: number,
  stackSizeMultiplier: number
): number => {
  if (heatSources.length === 0) return 0;

  let totalHeat = 0;
  for (const unitSource of heatSources) {
    const dx = squareX - unitSource.x;
    const dy = squareY - unitSource.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const stackHeatMultiplier = 1 + stackSizeMultiplier * unitSource.stackSize;

    const isOpposingFaction =
      hasMultipleFactions &&
      currentFaction &&
      unitSource.faction !== currentFaction;

    const heat = isOpposingFaction
      ? factionRepulsionHeat *
        stackHeatMultiplier *
        Math.exp(-factionDecayRate * distance)
      : unitHeat * stackHeatMultiplier * Math.exp(-entityDecayRate * distance);

    totalHeat += heat;
  }
  return totalHeat;
};

/**
 * Multi-source heat map algorithm using exponential decay functions.
 * Updates an existing cost map with heat calculations based on distance from multiple heat sources:
 * - Planets (attraction)
 * - Hexagon rim (attraction for defensive positions)
 * - Existing units (attraction for same faction, repulsion for opposing factions)
 *
 * Uses exponential decay: heat = maxHeat * e^(-decayRate * distance)
 */

export type HeatConfig = typeof SPACE_HEAT_CONFIG | typeof GROUND_HEAT_CONFIG;

export interface UpdateCostMapOptions {
  gridSize: number;
  squareWidth: number;
  squareHeight: number;
  factionEntities: FactionUnits;
  existingCostMap: number[][];
  heatConfig: HeatConfig;
  repellantPlanets?: Planet[];
  rimSquares?: { row: number; col: number }[];
  heatSources?: HeatSource[];
  currentFaction?: string;
}

export const updateCostMap = ({
  gridSize,
  squareWidth,
  squareHeight,
  factionEntities,
  existingCostMap,
  heatConfig,
  repellantPlanets = [],
  rimSquares = [],
  heatSources = [],
  currentFaction,
}: UpdateCostMapOptions): number[][] => {
  const costMap = existingCostMap.map((row) => [...row]); // Deep copy
  const hasHeatSources =
    repellantPlanets.length > 0 ||
    rimSquares.length > 0 ||
    heatSources.length > 0;
  if (!hasHeatSources) return costMap;

  const hasMultipleFactions = Object.keys(factionEntities).length > 1;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (costMap[row][col] === -1) continue;
      const squareX = col * squareWidth + squareWidth / 2;
      const squareY = row * squareHeight + squareHeight / 2;
      const planetHeat = calculatePlanetHeat(
        squareX,
        squareY,
        repellantPlanets,
        heatConfig.planetDecayRate,
        heatConfig.maxHeat
      );
      const rimHeat = calculateRimHeat(
        squareX,
        squareY,
        rimSquares,
        squareWidth,
        squareHeight,
        heatConfig.rimDecayRate,
        heatConfig.rimMaxHeat
      );
      const unitHeat = calculateUnitHeat(
        squareX,
        squareY,
        heatSources,
        hasMultipleFactions,
        currentFaction,
        heatConfig.unitDecayRate,
        heatConfig.factionDecayRate,
        heatConfig.unitHeat,
        heatConfig.factionRepulsionHeat,
        heatConfig.stackSizeMultiplier
      );

      const totalHeat = planetHeat + rimHeat + unitHeat;
      costMap[row][col] = totalHeat < 1 ? 0 : Math.round(totalHeat);
    }
  }

  return costMap;
};

export const entityBaseZIndex = (entityType: string) => {
  // Calculate base z-index based on entity type priority (higher priority = higher z-index)
  const entityTypePriorityIndex = entityZStackPriority.indexOf(entityType);
  const baseEntityZIndex =
    1000 + (entityIdPriority.length - entityTypePriorityIndex) * 10;

  return baseEntityZIndex;
};

/**
 * Initializes the cost map for ground units within a planet's circular boundary.
 * Squares that are in or partially intersecting the planet circle are marked as accessible (0).
 * All other squares are marked as inaccessible (-1).
 * Also calculates rim squares that touch the circle boundary.
 * Uses the center of the grid square containing the planet for consistent rim calculation.
 */
export const initializeGroundCostMap = (
  gridSize: number,
  squareWidth: number,
  squareHeight: number,
  planetX: number,
  planetY: number,
  planetRadius: number
): { costMap: number[][]; rimSquares: { row: number; col: number }[] } => {
  const costMap: number[][] = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(-1)); // Start with all squares inaccessible

  const rimSquares: { row: number; col: number }[] = [];

  // Find the grid square that contains the planet center
  const planetSquareCol = Math.floor(planetX / squareWidth);
  const planetSquareRow = Math.floor(planetY / squareHeight);

  // Calculate the center of that square for consistent rim calculation
  const normalizedPlanetX = planetSquareCol * squareWidth + squareWidth / 2;
  const normalizedPlanetY = planetSquareRow * squareHeight + squareHeight / 2;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const isIntersecting = squareIntersectsCircle(
        row,
        col,
        squareWidth,
        squareHeight,
        normalizedPlanetX,
        normalizedPlanetY,
        planetRadius
      );

      if (isIntersecting) {
        // Mark as accessible
        costMap[row][col] = 0;

        // Check if this square touches the circle rim
        if (
          touchesCircleRim(
            row,
            col,
            gridSize,
            squareWidth,
            squareHeight,
            normalizedPlanetX,
            normalizedPlanetY,
            planetRadius
          )
        ) {
          rimSquares.push({ row, col });
        }
      }
      // Otherwise leave as -1 (inaccessible)
    }
  }

  return { costMap, rimSquares };
};

/**
 * Greedy selection algorithm to find the optimal grid square with the lowest cost.
 * Searches through the entire cost map to find the square with minimum heat value,
 * ignoring inaccessible squares (marked as -1).
 */
export const findOptimalSquareGreedy = (
  costMap: number[][],
  gridSize: number
): { square: { row: number; col: number }; cost: number } | null => {
  let lowestCost = Infinity;
  let bestSquare: { row: number; col: number } | null = null;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cost = costMap[row][col];

      // Skip out of bounds squares
      if (cost === -1) continue;

      // Find the lowest cost square
      if (cost < lowestCost) {
        lowestCost = cost;
        bestSquare = { row, col };
      }
    }
  }

  return bestSquare ? { square: bestSquare, cost: lowestCost } : null;
};

/**
 * Creates a heat source from an optimal placement result
 */
const createHeatSource = (
  optimalResult: { square: { row: number; col: number }; cost: number },
  stack: EntityStackBase,
  squareWidth: number,
  squareHeight: number
): HeatSource => {
  const bestSquare = optimalResult.square;
  const heatSourceX = bestSquare.col * squareWidth + squareWidth / 2;
  const heatSourceY = bestSquare.row * squareHeight + squareHeight / 2;

  let stackSize = stack.count;
  if (
    stack.entityId === "gf" ||
    stack.entityId === "ff" ||
    stack.entityId === "sd" ||
    stack.entityId === "mf"
  ) {
    stackSize = 2;
  }
  return {
    x: heatSourceX,
    y: heatSourceY,
    faction: stack.faction,
    stackSize,
  };
};

/**
 * Core iterative placement algorithm that handles the priority queues, alternating placement,
 * and greedy positioning logic. This shared method is used by both space and ground unit placement.
 */

export interface PlaceEntitiesOptions {
  gridSize: number;
  squareWidth: number;
  squareHeight: number;
  initialCostMap: number[][];
  rimSquares: { row: number; col: number }[];
  repellantPlanets: Planet[];
  heatConfig: HeatConfig;
  factionEntities: FactionUnits;
  initialHeatSources?: HeatSource[];
}

const placeEntitiesWithCostMap = ({
  gridSize,
  squareWidth,
  squareHeight,
  initialCostMap,
  rimSquares,
  repellantPlanets,
  factionEntities,
  heatConfig,
  initialHeatSources = [],
}: PlaceEntitiesOptions) => {
  const heatSources: HeatSource[] = [...initialHeatSources];
  const entityPlacements: EntityStack[] = [];
  const sortedStacks = createSortedEntityStacks(factionEntities);

  // Place each stack iteratively using greedy algorithm
  for (const stack of sortedStacks) {
    const currentCostMap = updateCostMap({
      gridSize,
      squareWidth,
      squareHeight,
      repellantPlanets,
      factionEntities,
      existingCostMap: initialCostMap,
      rimSquares,
      heatSources: heatSources,
      currentFaction: stack.faction,
      heatConfig,
    });
    const optimalResult = findOptimalSquareGreedy(currentCostMap, gridSize);
    if (optimalResult) {
      const bestSquare = optimalResult.square;
      // Calculate pixel position from grid coordinates
      const pixelX = bestSquare.col * squareWidth + squareWidth / 2;
      const pixelY = bestSquare.row * squareHeight + squareHeight / 2;

      // Create entity stack with pixel positions
      const entityWithPosition: EntityStack = {
        ...stack,
        x: pixelX,
        y: pixelY,
      };

      entityPlacements.push(entityWithPosition);
      heatSources.push(
        createHeatSource(optimalResult, stack, squareWidth, squareHeight)
      );
    }
  }

  // Calculate final cost map with all entities placed
  const finalCostMap = updateCostMap({
    gridSize,
    squareWidth,
    squareHeight,
    repellantPlanets,
    factionEntities,
    existingCostMap: initialCostMap,
    rimSquares,
    heatSources: heatSources,
    currentFaction: undefined,
    heatConfig,
  });

  return { entityPlacements, finalCostMap };
};

export interface PlaceSpaceEntitiesOptions {
  gridSize: number;
  squareWidth: number;
  squareHeight: number;
  hexagonVertices: HexagonVertex[];
  planets: Planet[];
  factionEntities: FactionUnits;
  planetDecayRate?: number;
  rimDecayRate?: number;
  entityDecayRate?: number;
  factionDecayRate?: number;
  initialHeatSources?: HeatSource[];
}

/**
 * Iterative greedy placement algorithm for optimal space entity positioning.
 * Initializes space cost map and rim squares, then places entities using the core placement algorithm.
 */
export const placeSpaceEntities = ({
  gridSize,
  squareWidth,
  squareHeight,
  hexagonVertices,
  planets,
  factionEntities,
  initialHeatSources = [],
}: PlaceSpaceEntitiesOptions) => {
  // Initialize space cost map and rim squares
  const { costMap: initialCostMap, rimSquares } = initializeSpaceCostMap(
    gridSize,
    squareWidth,
    squareHeight,
    hexagonVertices
  );

  return placeEntitiesWithCostMap({
    gridSize,
    squareWidth,
    squareHeight,
    initialCostMap,
    rimSquares,
    repellantPlanets: planets,
    factionEntities,
    heatConfig: SPACE_HEAT_CONFIG,
    initialHeatSources,
  });
};

export interface PlaceGroundEntitiesOptions {
  gridSize: number;
  squareWidth: number;
  squareHeight: number;
  planetX: number;
  planetY: number;
  planetRadius: number;
  factionEntities: FactionUnits;
  planetDecayRate?: number;
  rimDecayRate?: number;
  entityDecayRate?: number;
  factionDecayRate?: number;
  heatSources?: HeatSource[];
}

/**
 * Iterative greedy placement algorithm for optimal ground entity positioning.
 * Initializes ground cost map and rim squares within a planet's circular boundary,
 * then places entities using the core placement algorithm.
 */
export const placeGroundEntities = ({
  gridSize,
  squareWidth,
  squareHeight,
  planetX,
  planetY,
  planetRadius,
  factionEntities,
  heatSources = [],
}: PlaceGroundEntitiesOptions) => {
  // Initialize ground cost map and rim squares for the planet
  const { costMap: initialCostMap, rimSquares } = initializeGroundCostMap(
    gridSize,
    squareWidth,
    squareHeight,
    planetX,
    planetY,
    planetRadius
  );

  return placeEntitiesWithCostMap({
    gridSize,
    squareWidth,
    squareHeight,
    initialCostMap,
    rimSquares,
    repellantPlanets: [],
    factionEntities,
    heatConfig: GROUND_HEAT_CONFIG,
    initialHeatSources: heatSources,
  });
};

/**
 * Places attachment entities on the rim of a planet.
 * Starts from the EAST side (directly to the right) and distributes around the rim.
 */
const placeAttachmentsOnRim = (
  planetX: number,
  planetY: number,
  planetRadius: number,
  attachmentEntities: EntityStackBase[]
): EntityStack[] => {
  const attachmentPlacements: EntityStack[] = [];
  // If no attachments, return empty array
  if (attachmentEntities.length === 0) return attachmentPlacements;

  if (attachmentEntities.length === 1) {
    // Single attachment: place directly on the EAST side (right side, centered vertically)
    attachmentPlacements.push({
      ...attachmentEntities[0],
      x: planetX + planetRadius, // Direct east = planetX + radius
      y: planetY, // Same Y as planet center (centered vertically)
    });
  } else {
    // Multiple attachments: distribute around the rim starting from east going counter-clockwise
    const totalAttachments = attachmentEntities.length;
    const angleSpread = Math.PI / 1.25; // 120 degrees total spread
    const angleStep = angleSpread / (totalAttachments - 1);
    const startAngle = 0; // Start at east (0 degrees)

    attachmentEntities.forEach((attachment, index) => {
      const angle = startAngle + index * angleStep * -1;

      // Calculate position on the rim (angle 0 = east, positive = counter-clockwise)
      const x = planetX + planetRadius * Math.cos(angle);
      const y = planetY + planetRadius * Math.sin(angle);

      attachmentPlacements.push({
        ...attachment,
        x,
        y,
      });
    });
    attachmentPlacements.reverse();
  }

  return attachmentPlacements;
};

/**
 * Creates sorted entity stacks by alternating between factions based on entity type priority.
 */
const createSortedEntityStacks = (
  factionEntities: FactionUnits
): EntityStackBase[] => {
  const entityIdPriorityMap: { [key: string]: number } = {};
  entityIdPriority.forEach((entityId, index) => {
    entityIdPriorityMap[entityId] = index;
  });

  // Create priority queues for each faction
  const factionQueues: {
    [faction: string]: {
      entityId: string;
      count: number;
      priority: number;
      entityType: "unit" | "token" | "attachment";
      sustained?: number | null;
    }[];
  } = {};

  Object.entries(factionEntities).forEach(([faction, entities]) => {
    factionQueues[faction] = [];
    entities.forEach((entity) => {
      if (entity.count > 0) {
        const priority = entityIdPriorityMap[entity.entityId] ?? 999;
        factionQueues[faction].push({
          entityId: entity.entityId,
          count: entity.count,
          priority,
          entityType: entity.entityType,
          sustained: entity.sustained,
        });
      }
    });
    // Sort each faction's queue by priority
    factionQueues[faction].sort((a, b) => a.priority - b.priority);
  });

  // Create alternating placement order by alternating between faction queues
  const sortedStacks: EntityStackBase[] = [];
  const factionNames = Object.keys(factionQueues);

  // Continue until all queues are empty
  while (factionNames.some((faction) => factionQueues[faction].length > 0)) {
    for (const faction of factionNames) {
      if (factionQueues[faction].length > 0) {
        const stack = factionQueues[faction].shift()!;
        sortedStacks.push({
          faction,
          entityId: stack.entityId,
          entityType: stack.entityType,
          count: stack.count,
          sustained: stack.sustained,
        });
      }
    }
  }

  return sortedStacks;
};

/**
 * Separates entities into attachments and regular entities for a planet
 */
const separateEntityTypes = (planetEntityData: PlanetEntityData) => {
  const filteredPlanetEntities: FactionUnits = {};
  const attachmentEntities: EntityStackBase[] = [];

  Object.entries(planetEntityData.entities).forEach(([faction, entities]) => {
    const nonAttachmentEntities = entities.filter(
      (entity) => entity.entityType !== "attachment"
    );
    const attachments = entities.filter(
      (entity) => entity.entityType === "attachment"
    );

    if (nonAttachmentEntities.length > 0) {
      filteredPlanetEntities[faction] = nonAttachmentEntities;
    }

    attachments.forEach((attachment) => {
      attachmentEntities.push({
        faction,
        entityId: attachment.entityId,
        entityType: attachment.entityType,
        count: attachment.count,
        sustained: attachment.sustained,
      });
    });
  });

  return { filteredPlanetEntities, attachmentEntities };
};

/**
 * Places attachments and returns heat sources for ground unit placement
 */
const placeAttachmentsAndCreateHeatSources = (
  planet: Planet,
  attachmentEntities: EntityStackBase[]
): { placements: EntityStack[]; heatSources: HeatSource[] } => {
  if (attachmentEntities.length === 0) {
    return { placements: [], heatSources: [] };
  }

  const placements = placeAttachmentsOnRim(
    planet.x,
    planet.y,
    DEFAULT_PLANET_RADIUS, // Planet radius for attachment placement
    attachmentEntities
  );

  const heatSources = placements.map((attachment) => ({
    x: attachment.x,
    y: attachment.y,
    faction: attachment.faction,
    stackSize: attachment.count,
  }));

  return { placements, heatSources };
};

/**
 * Places ground entities for a single planet
 */
/**
 * Helper function to convert resourcesLocation to angle values
 */
const getResourcesLocationAngle = (
  resourcesLocation: "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight"
): number => {
  switch (resourcesLocation) {
    case "TopLeft":
      return (5 * Math.PI) / 4;
    case "TopRight":
      return (7 * Math.PI) / 4;
    case "BottomLeft":
      return (3 * Math.PI) / 4;
    case "BottomRight":
      return Math.PI / 4;
    default:
      return 0;
  }
};

const placeGroundEntitiesForPlanet = (
  planet: Planet,
  filteredPlanetEntities: FactionUnits,
  attachmentHeatSources: HeatSource[]
): { entityPlacements: EntityStack[]; finalCostMap: number[][] } => {
  if (Object.keys(filteredPlanetEntities).length === 0) {
    return { entityPlacements: [], finalCostMap: [] };
  }

  // Create stats position heat source to discourage covering planet stats
  const statsHeatSources: HeatSource[] = [];
  if (planet.resourcesLocation) {
    const statsHeatDistance = planet.radius + 15;
    const statsAngle = getResourcesLocationAngle(planet.resourcesLocation);

    const statsX = planet.x + statsHeatDistance * Math.cos(statsAngle);
    const statsY = planet.y + statsHeatDistance * Math.sin(statsAngle);

    statsHeatSources.push({
      x: statsX,
      y: statsY,
      stackSize: 0.1,
    });
  }

  const allHeatSources = [...attachmentHeatSources, ...statsHeatSources];

  const { entityPlacements, finalCostMap } = placeGroundEntities({
    gridSize: HEX_GRID_SIZE,
    squareWidth: HEX_SQUARE_WIDTH,
    squareHeight: HEX_SQUARE_HEIGHT,
    planetX: planet.x,
    planetY: planet.y,
    planetRadius: planet.radius,
    factionEntities: filteredPlanetEntities,
    heatSources: allHeatSources,
  });

  return { entityPlacements, finalCostMap };
};

/**
 * Processes all entities for a single planet
 */
export const processPlanetEntities = (
  planet: Planet,
  planetEntityData: PlanetEntityData
): { entityPlacements: EntityStack[]; finalCostMap: number[][] } => {
  const { filteredPlanetEntities, attachmentEntities } =
    separateEntityTypes(planetEntityData);

  const {
    placements: attachmentPlacements,
    heatSources: attachmentHeatSources,
  } = placeAttachmentsAndCreateHeatSources(planet, attachmentEntities);

  const { entityPlacements: groundEntityPlacements, finalCostMap } =
    placeGroundEntitiesForPlanet(
      planet,
      filteredPlanetEntities,
      attachmentHeatSources
    );

  // Add planet name to all planet-based entities
  const planetEntitiesWithPlanetName = [
    ...attachmentPlacements,
    ...groundEntityPlacements,
  ].map((entity) => ({
    ...entity,
    planetName: planet.name,
  }));

  return { entityPlacements: planetEntitiesWithPlanetName, finalCostMap };
};

/**
 * Finds the optimal corner of the hexagon for placing a production icon.
 * Calculates planet heat at the 4 diagonal corners and returns the one with lowest heat.
 * Ignores rim square heat and unit heat sources - only considers planet repulsion.
 * Returns coordinates adjusted for a 64x64px image positioned at the selected corner.
 */
export const findOptimalProductionIconCorner = (
  systemId: string
): { x: number; y: number } | null => {
  // Get planet coordinates
  const planetCoords = getPlanetCoordsBySystemId(systemId);
  const planets: Planet[] = Object.entries(planetCoords).map(
    ([planetId, coordStr]) => {
      const [x, y] = coordStr.split(",").map(Number);
      return {
        name: planetId,
        x,
        y,
        radius: DEFAULT_PLANET_RADIUS,
      };
    }
  );

  // Define the 4 diagonal corners of the hexagon using existing HEX_VERTICES
  const hexagonCorners = [
    { vertex: HEX_VERTICES[0], position: "top-left" }, // top-left
    { vertex: HEX_VERTICES[1], position: "top-right" }, // top-right
    // { vertex: HEX_VERTICES[3], position: "bottom-right" }, // bottom-right
    // { vertex: HEX_VERTICES[4], position: "bottom-left" }, // bottom-left
  ];

  let lowestHeat = Infinity;
  let bestCorner: {
    vertex: { x: number; y: number };
    position: string;
  } | null = null;

  // Check heat at each corner (only from planets, no rim or unit heat)
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

  // If no best corner found, default to top-left
  if (!bestCorner) {
    bestCorner = { vertex: { x: 86.25, y: 0 }, position: "top-left" };
  }

  // Apply offset for 64x64px image based on corner position
  const IMAGE_SIZE = 48;
  let offsetX = 0;
  let offsetY = 0;

  switch (bestCorner.position) {
    case "top-left":
      // Image top-left should align with hex corner
      offsetX = -10;
      offsetY = 0;
      break;
    case "top-right":
      // Image top-right should align with hex corner
      offsetX = -IMAGE_SIZE + 10;
      offsetY = 0;
      break;
  }

  return {
    x: bestCorner.vertex.x + offsetX,
    y: bestCorner.vertex.y + offsetY,
  };
};

export const getAllEntityPlacementsForTile = (
  systemId: string,
  tileUnitData: TileUnitData | undefined
): EntityStack[] => {
  // Early return if no entity data
  if (!tileUnitData) {
    return [];
  }

  // Convert planet coordinates to Planet[] format expected by placeSpaceEntities
  const planetCoords = getPlanetCoordsBySystemId(systemId);
  const planets: Planet[] = Object.entries(planetCoords).map(
    ([planetId, coordStr]) => {
      const planetData = getPlanetById(planetId);
      const [x, y] = coordStr.split(",").map(Number);
      return {
        name: planetId,
        x,
        y,
        radius: DEFAULT_PLANET_RADIUS, // Default planet radius for collision detection
        resourcesLocation: planetData?.planetLayout?.resourcesLocation,
      };
    }
  );

  // Hardcoded heat sources to avoid wormholes being blocked on wormhole tiles.
  // TODO: Move to data instead.
  const initialHeatSources: HeatSource[] = [];
  if (systemId === "40" || systemId === "39" || systemId === "79") {
    initialHeatSources.push({
      x: HEX_GRID_WIDTH / 2,
      y: HEX_GRID_HEIGHT / 2,
      stackSize: 1,
    });
  }

  if (systemId === "25" || systemId === "26" || systemId === "64") {
    initialHeatSources.push({
      x: 200,
      y: 190,
      stackSize: 1,
    });
  }

  // Start with space entity placements
  const { entityPlacements: spaceEntityPlacements } = placeSpaceEntities({
    gridSize: HEX_GRID_SIZE,
    squareWidth: HEX_SQUARE_WIDTH,
    squareHeight: HEX_SQUARE_HEIGHT,
    hexagonVertices: HEX_VERTICES,
    planets,
    factionEntities: tileUnitData.space || {},
    initialHeatSources,
  });

  // Check space entities for tokens with isPlanet: true and add to planets array
  spaceEntityPlacements.forEach((entity) => {
    if (entity.entityType === "token") {
      const tokenData = getTokenData(entity.entityId);
      if (tokenData?.isPlanet) {
        planets.push({
          name: entity.entityId, // Use token ID as planet name
          x: entity.x,
          y: entity.y,
          radius: DEFAULT_PLANET_RADIUS, // Default planet radius for collision detection
        });
      }
    }
  });

  // Process each planet and collect all ground/attachment entity placements
  const planetEntityPlacements = planets
    .map((planet) => {
      const planetEntityData = tileUnitData.planets?.[planet.name];
      if (
        !planetEntityData ||
        Object.keys(planetEntityData.entities).length === 0
      ) {
        return [];
      }
      return processPlanetEntities(planet, planetEntityData).entityPlacements;
    })
    .flat();

  return [...spaceEntityPlacements, ...planetEntityPlacements];
};

/**
 * Initializes the cost map with inaccessible squares and rim squares.
 * This optimization avoids checking if squares are outside the hexagon
 * on every heat calculation iteration.
 */
export const initializeSpaceCostMap = (
  gridSize: number,
  squareWidth: number,
  squareHeight: number,
  hexagonVertices: HexagonVertex[]
): { costMap: number[][]; rimSquares: { row: number; col: number }[] } => {
  const costMap: number[][] = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(0));

  // First, identify all rim squares using neighbor analysis
  const rimSquares: { row: number; col: number }[] = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const isOutside = squareOutsideHex(
        row,
        col,
        squareWidth,
        squareHeight,
        hexagonVertices
      );

      if (isOutside) {
        // Mark as out of bounds with -1
        costMap[row][col] = -1;
        continue;
      }

      // Check if this square touches the hexagon rim
      if (
        touchesHexRim(
          row,
          col,
          gridSize,
          squareWidth,
          squareHeight,
          hexagonVertices
        )
      ) {
        rimSquares.push({ row, col });
      }
    }
  }

  return { costMap, rimSquares };
};

export interface Planet {
  name: string;
  x: number;
  y: number;
  radius: number;
  resourcesLocation?: "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight";
}

export interface HeatSource {
  x: number;
  y: number;
  faction?: string;
  stackSize: number;
}

export type EntityStackBase = EntityData & {
  faction: string;
};

export type EntityStack = EntityStackBase & {
  x: number;
  y: number;
  planetName?: string;
};

export interface GameState {
  space: {
    [faction: string]: {
      [unitType: string]: number;
    };
  };
  planets: {
    [planetName: string]: any;
  };
}
