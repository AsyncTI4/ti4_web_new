import {
  squareIntersectsCircle,
  squareOutsideHex,
  touchesCircleRim,
  touchesHexRim,
  HexagonVertex,
} from "../hitbox";

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
    .map(() => Array(gridSize).fill(-1));

  const rimSquares: { row: number; col: number }[] = [];

  const planetSquareCol = Math.floor(planetX / squareWidth);
  const planetSquareRow = Math.floor(planetY / squareHeight);

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
        costMap[row][col] = 0;

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
    }
  }

  return { costMap, rimSquares };
};

export const initializeSpaceCostMap = (
  gridSize: number,
  squareWidth: number,
  squareHeight: number,
  hexagonVertices: HexagonVertex[]
): { costMap: number[][]; rimSquares: { row: number; col: number }[] } => {
  const costMap: number[][] = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(0));

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
        costMap[row][col] = -1;
        continue;
      }

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

export const findOptimalSquareGreedy = (
  costMap: number[][],
  gridSize: number
): { square: { row: number; col: number }; cost: number } | null => {
  let lowestCost = Infinity;
  let bestSquare: { row: number; col: number } | null = null;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cost = costMap[row][col];
      if (cost === -1) continue;

      if (cost < lowestCost) {
        lowestCost = cost;
        bestSquare = { row, col };
      }
    }
  }

  return bestSquare ? { square: bestSquare, cost: lowestCost } : null;
};
