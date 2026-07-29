import { EntityData } from "@/entities/data/types";
import { gridToPixel } from "./coordinateUtils";
import { EntityStack, EntityStackBase, HeatSource } from "./types";
import { calculatePlanetHeat } from "./heatMap";
import { HEX_VERTICES, SPACE_HEAT_CONFIG } from "./constants";

export type GridDimensions = {
  gridSize: number;
  squareWidth: number;
  squareHeight: number;
};

export type Square = { row: number; col: number };

export const createHeatSourceFromSquare = (
  square: Square,
  grid: GridDimensions,
  stackSize: number,
  faction?: string
): HeatSource => {
  const { x, y } = gridToPixel(square, grid.squareWidth, grid.squareHeight);
  return { x, y, stackSize, ...(faction && { faction }) };
};

export const createHeatSourceFromCoords = (
  x: number,
  y: number,
  stackSize: number,
  faction?: string
): HeatSource => {
  return { x, y, stackSize, ...(faction && { faction }) };
};

export const createPlacementFromSquare = (
  square: Square,
  grid: GridDimensions,
  entityData: EntityData,
  faction: string
): EntityStack => {
  const { x, y } = gridToPixel(square, grid.squareWidth, grid.squareHeight);
  return {
    ...entityData,
    faction,
    x,
    y,
  };
};

export const createPlacementFromCoords = (
  x: number,
  y: number,
  entityStack: EntityStackBase
): EntityStack => {
  return {
    ...entityStack,
    x,
    y,
  };
};

export const createHeatSourceFromPlacement = (
  placement: EntityStack,
  stackSize: number
): HeatSource => {
  return {
    x: placement.x,
    y: placement.y,
    stackSize,
    ...(placement.faction && { faction: placement.faction }),
  };
};

export const tokenToEntityStack = (
  token: string,
  faction: string
): EntityStackBase => {
  return {
    entityId: token,
    entityType: "token",
    count: 1,
    faction,
  };
};

type ProductionCornerPosition = "top-left" | "top-right";

export const findBestHexagonCorner = (
  planets: Array<{ name: string; x: number; y: number; radius: number }>
): {
  vertex: { x: number; y: number };
  position: ProductionCornerPosition;
} => {
  const hexagonCorners = [
    { vertex: HEX_VERTICES[0], position: "top-left" as const },
    { vertex: HEX_VERTICES[1], position: "top-right" as const },
  ];

  let lowestHeat = Infinity;
  let bestCorner = hexagonCorners[0];

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

  return bestCorner;
};

export const calculateCornerOffset = (
  position: ProductionCornerPosition,
  imageSize: number = 48
): { offsetX: number; offsetY: number } => {
  const offsetX = position === "top-left" ? -10 : -imageSize + 10;
  return { offsetX, offsetY: 0 };
};

export const findEdgeSquare = (
  costMap: number[][],
  rimSquares: { row: number; col: number }[],
  gridSize: number,
  position: "rightmost" | "leftmost",
  inwardOffsetColumns = 0
): Square | null => {
  const rimSet = new Set(rimSquares.map((sq) => `${sq.row},${sq.col}`));
  const step = position === "rightmost" ? -1 : 1;
  const end = position === "rightmost" ? -1 : gridSize;

  for (
    let col = position === "rightmost" ? gridSize - 1 : 0;
    col !== end;
    col += step
  ) {
    for (let row = 0; row < gridSize; row++) {
      if (costMap[row][col] !== -1 && !rimSet.has(`${row},${col}`)) {
        return { row, col: col + step * inwardOffsetColumns };
      }
    }
  }

  return null;
};
