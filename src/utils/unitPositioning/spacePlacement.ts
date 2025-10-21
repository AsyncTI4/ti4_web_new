import { EntityData, FactionUnits } from "@/data/types";
import { FIGHTER_OFFSET_COLUMNS, SPACE_HEAT_CONFIG } from "./constants";
import { gridToPixel } from "./coordinateUtils";
import { initializeSpaceCostMap } from "./costMap";
import { getEntityStackSize } from "./entitySorting";
import { placeEntitiesWithCostMap } from "./placement";
import { PlaceSpaceEntitiesOptions, EntityStack, HeatSource } from "./types";

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
}: PlaceSpaceEntitiesOptions) => {
  const { costMap: initialCostMap, rimSquares } = initializeSpaceCostMap(
    gridSize,
    squareWidth,
    squareHeight,
    hexagonVertices
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
