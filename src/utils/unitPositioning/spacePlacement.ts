import { EntityData, FactionUnits } from "@/data/types";
import { FIGHTER_OFFSET_COLUMNS, SPACE_HEAT_CONFIG, HEX_VERTICES, DEFAULT_PLANET_RADIUS } from "./constants";
import { gridToPixel } from "./coordinateUtils";
import { initializeSpaceCostMap } from "./costMap";
import { getEntityStackSize } from "./entitySorting";
import { placeEntitiesWithCostMap } from "./placement";
import { PlaceSpaceEntitiesOptions, EntityStack, HeatSource } from "./types";
import { getPlanetCoordsBySystemId } from "@/lookup/planets";
import { calculatePlanetHeat } from "./heatMap";

const findNonRimSquare = (
  costMap: number[][],
  rimSquares: { row: number; col: number }[],
  gridSize: number,
  position: "rightmost" | "leftmost"
): { row: number; col: number } | null => {
  const rimSet = new Set(rimSquares.map((sq) => `${sq.row},${sq.col}`));

  const colRange =
    position === "rightmost"
      ? Array.from({ length: gridSize }, (_, i) => gridSize - 1 - i)
      : Array.from({ length: gridSize }, (_, i) => i);

  for (const col of colRange) {
    for (let row = 0; row < gridSize; row++) {
      if (costMap[row][col] !== -1 && !rimSet.has(`${row},${col}`)) {
        const offsetCol =
          position === "rightmost"
            ? col - FIGHTER_OFFSET_COLUMNS
            : col + FIGHTER_OFFSET_COLUMNS;
        return { row, col: offsetCol };
      }
    }
  }

  return null;
};

type FighterStack = {
  faction: string;
  fighterStack: EntityData;
};

const extractFighterStacks = (
  factionEntities: FactionUnits
): FighterStack[] => {
  const factionsWithFighters: FighterStack[] = [];

  Object.entries(factionEntities).forEach(([faction, entities]) => {
    const fighterIndex = entities.findIndex((e) => e.entityId === "ff");
    if (fighterIndex !== -1 && entities[fighterIndex].count > 0) {
      factionsWithFighters.push({
        faction,
        fighterStack: entities[fighterIndex],
      });
    }
  });

  return factionsWithFighters;
};

const placeFighterAt = (
  fighter: FighterStack,
  position: "rightmost" | "leftmost",
  costMap: number[][],
  rimSquares: { row: number; col: number }[],
  gridSize: number,
  squareWidth: number,
  squareHeight: number
): { placement: EntityStack; heatSource: HeatSource } | null => {
  const square = findNonRimSquare(costMap, rimSquares, gridSize, position);
  if (!square) return null;

  const { x, y } = gridToPixel(square, squareWidth, squareHeight);

  const placement: EntityStack = {
    faction: fighter.faction,
    entityId: fighter.fighterStack.entityId,
    entityType: fighter.fighterStack.entityType,
    count: fighter.fighterStack.count,
    sustained: fighter.fighterStack.sustained,
    x,
    y,
  };

  const heatSource: HeatSource = {
    x,
    y,
    faction: fighter.faction,
    stackSize: getEntityStackSize(
      fighter.fighterStack.entityId,
      fighter.fighterStack.count
    ),
  };

  return { placement, heatSource };
};

const removeFightersFromEntities = (
  factionEntities: FactionUnits,
  placedFighterFactions: string[]
): FactionUnits => {
  const remainingEntities: FactionUnits = {};

  Object.entries(factionEntities).forEach(([faction, entities]) => {
    if (placedFighterFactions.includes(faction)) {
      remainingEntities[faction] = entities.filter((e) => e.entityId !== "ff");
    } else {
      remainingEntities[faction] = [...entities];
    }
  });

  return remainingEntities;
};

export const preplaceFighters = (
  factionEntities: FactionUnits,
  costMap: number[][],
  rimSquares: { row: number; col: number }[],
  gridSize: number,
  squareWidth: number,
  squareHeight: number
): {
  placements: EntityStack[];
  heatSources: HeatSource[];
  remainingEntities: FactionUnits;
} => {
  const fighters = extractFighterStacks(factionEntities);
  const positions: Array<"rightmost" | "leftmost"> = ["rightmost", "leftmost"];

  const results = fighters
    .slice(0, 2)
    .map((fighter, index) =>
      placeFighterAt(
        fighter,
        positions[index],
        costMap,
        rimSquares,
        gridSize,
        squareWidth,
        squareHeight
      )
    )
    .filter((result): result is NonNullable<typeof result> => result !== null);

  const placements = results.map((r) => r.placement);
  const heatSources = results.map((r) => r.heatSource);
  const placedFactions = placements.map((p) => p.faction);

  return {
    placements,
    heatSources,
    remainingEntities: removeFightersFromEntities(
      factionEntities,
      placedFactions
    ),
  };
};

const findLeftmostNonRimSquare = (
  costMap: number[][],
  rimSquares: { row: number; col: number }[],
  gridSize: number
): { row: number; col: number } | null => {
  const rimSet = new Set(rimSquares.map((sq) => `${sq.row},${sq.col}`));

  // Find the leftmost valid non-rim square without offset
  for (let col = 0; col < gridSize; col++) {
    for (let row = 0; row < gridSize; row++) {
      if (costMap[row][col] !== -1 && !rimSet.has(`${row},${col}`)) {
        return { row, col };
      }
    }
  }

  return null;
};

const preplaceProductionHeatSource = (
  systemId: string | undefined,
  highestProduction: number | undefined
): HeatSource | null => {
  if (!systemId || !highestProduction || highestProduction <= 0) return null;

  const planetCoords = getPlanetCoordsBySystemId(systemId);
  const planetsWithCoords = Object.entries(planetCoords).map(([planetId, coordStr]) => {
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
      planetsWithCoords,
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
    stackSize: 0.5,
  };
};

const preplaceCommandCounterHeatSource = (
  costMap: number[][],
  rimSquares: { row: number; col: number }[],
  gridSize: number,
  squareWidth: number,
  squareHeight: number,
  hasCommandCounters: boolean
): HeatSource | null => {
  if (!hasCommandCounters) return null;

  const square = findLeftmostNonRimSquare(costMap, rimSquares, gridSize);
  if (!square) return null;

  const { x, y } = gridToPixel(square, squareWidth, squareHeight);

  // Use a very small stack size to create minimal heat
  return {
    x,
    y,
    stackSize: 0.5,
  };
};

const preplaceThundersEdge = (
  factionEntities: FactionUnits,
  squareWidth: number,
  squareHeight: number,
  gridSize: number
): {
  placement: EntityStack | null;
  heatSource: HeatSource | null;
  remainingEntities: FactionUnits;
} => {
  let thundersEdgePlacement: EntityStack | null = null;
  let thundersEdgeHeatSource: HeatSource | null = null;
  const updatedEntities: FactionUnits = {};

  Object.entries(factionEntities).forEach(([faction, entities]) => {
    const thundersEdgeIndex = entities.findIndex(
      (e) => e.entityId === "thundersedge"
    );

    if (thundersEdgeIndex !== -1 && !thundersEdgePlacement) {
      const thundersEdge = entities[thundersEdgeIndex];
      const centerRow = Math.floor(gridSize / 2);
      const centerCol = Math.floor(gridSize / 2);
      const { x, y } = gridToPixel(
        { row: centerRow, col: centerCol },
        squareWidth,
        squareHeight
      );

      thundersEdgePlacement = {
        faction,
        entityId: thundersEdge.entityId,
        entityType: thundersEdge.entityType,
        count: thundersEdge.count,
        sustained: thundersEdge.sustained,
        x,
        y,
      };

      thundersEdgeHeatSource = {
        x,
        y,
        faction,
        stackSize: getEntityStackSize(
          thundersEdge.entityId,
          thundersEdge.count
        ),
      };

      updatedEntities[faction] = entities.filter(
        (_, index) => index !== thundersEdgeIndex
      );
    } else {
      updatedEntities[faction] = [...entities];
    }
  });

  return {
    placement: thundersEdgePlacement,
    heatSource: thundersEdgeHeatSource,
    remainingEntities: updatedEntities,
  };
};

export const placeSpaceEntities = ({
  gridSize,
  squareWidth,
  squareHeight,
  hexagonVertices,
  planets,
  factionEntities,
  initialHeatSources = [],
  commandCounters = [],
  systemId,
  highestProduction,
}: PlaceSpaceEntitiesOptions) => {
  const { costMap: initialCostMap, rimSquares } = initializeSpaceCostMap(
    gridSize,
    squareWidth,
    squareHeight,
    hexagonVertices
  );

  // Pre-place a small heat source for command counters at the leftmost valid square
  const commandCounterHeatSource = preplaceCommandCounterHeatSource(
    initialCostMap,
    rimSquares,
    gridSize,
    squareWidth,
    squareHeight,
    commandCounters.length > 0
  );

  // Pre-place a small heat source for production icon at the optimal corner
  const productionHeatSource = preplaceProductionHeatSource(
    systemId,
    highestProduction
  );

  const {
    placement: thundersEdgePlacement,
    heatSource: thundersEdgeHeatSource,
    remainingEntities: entitiesAfterThundersEdge,
  } = preplaceThundersEdge(
    factionEntities,
    squareWidth,
    squareHeight,
    gridSize
  );

  const thundersEdgeHeatSources = thundersEdgeHeatSource
    ? [thundersEdgeHeatSource]
    : [];

  const commandCounterHeatSources = commandCounterHeatSource
    ? [commandCounterHeatSource]
    : [];

  const productionHeatSources = productionHeatSource
    ? [productionHeatSource]
    : [];

  const {
    placements: fighterPlacements,
    heatSources: fighterHeatSources,
    remainingEntities,
  } = preplaceFighters(
    entitiesAfterThundersEdge,
    initialCostMap,
    rimSquares,
    gridSize,
    squareWidth,
    squareHeight
  );

  const combinedHeatSources = [
    ...initialHeatSources,
    ...commandCounterHeatSources,
    ...productionHeatSources,
    ...thundersEdgeHeatSources,
    ...fighterHeatSources,
  ];

  const { entityPlacements: heatMapPlacements, finalCostMap } =
    placeEntitiesWithCostMap({
      gridSize,
      squareWidth,
      squareHeight,
      initialCostMap,
      rimSquares,
      repellantPlanets: planets,
      factionEntities: remainingEntities,
      heatConfig: SPACE_HEAT_CONFIG,
      initialHeatSources: combinedHeatSources,
    });

  const allPlacements = [
    ...(thundersEdgePlacement ? [thundersEdgePlacement] : []),
    ...fighterPlacements,
    ...heatMapPlacements,
  ];

  return {
    entityPlacements: allPlacements,
    finalCostMap,
  };
};
