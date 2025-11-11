import { EntityData } from "@/data/types";
import { gridToPixel } from "./coordinateUtils";
import { EntityStack, EntityStackBase, HeatSource } from "./types";
import { calculatePlanetHeat } from "./heatMap";
import { FIGHTER_OFFSET_COLUMNS, SPACE_HEAT_CONFIG } from "./constants";
import { HEX_VERTICES } from "./constants";

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

export const findBestHexagonCorner = (
  planets: Array<{ name: string; x: number; y: number; radius: number }>
): { vertex: { x: number; y: number }; position: string } => {
  const hexagonCorners = [
    { vertex: HEX_VERTICES[0], position: "top-left" },
    { vertex: HEX_VERTICES[1], position: "top-right" },
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
  position: string,
  imageSize: number = 48
): { offsetX: number; offsetY: number } => {
  switch (position) {
    case "top-left":
      return { offsetX: -10, offsetY: 0 };
    case "top-right":
      return { offsetX: -imageSize + 10, offsetY: 0 };
    default:
      return { offsetX: 0, offsetY: 0 };
  }
};

export const findNonRimSquare = (
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

export const findNonRimSquareWithoutOffset = (
  costMap: number[][],
  rimSquares: { row: number; col: number }[],
  gridSize: number,
  position: "rightmost" | "leftmost"
): Square | null => {
  const rimSet = new Set(rimSquares.map((sq) => `${sq.row},${sq.col}`));

  const colRange =
    position === "rightmost"
      ? Array.from({ length: gridSize }, (_, i) => gridSize - 1 - i)
      : Array.from({ length: gridSize }, (_, i) => i);

  for (const col of colRange) {
    for (let row = 0; row < gridSize; row++) {
      if (costMap[row][col] !== -1 && !rimSet.has(`${row},${col}`)) {
        return { row, col };
      }
    }
  }

  return null;
};
