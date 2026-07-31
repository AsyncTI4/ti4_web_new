import { squareOutsideHex, touchesHexRim, HexagonVertex } from "../hitbox";

export const initializeSpaceCostMap = (
  gridSize: number,
  squareWidth: number,
  squareHeight: number,
  hexagonVertices: HexagonVertex[],
): { costMap: number[][]; rimSquares: { row: number; col: number }[] } => {
  const costMap = Array.from({ length: gridSize }, () =>
    Array<number>(gridSize).fill(0),
  );

  const rimSquares: { row: number; col: number }[] = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const isOutside = squareOutsideHex(
        row,
        col,
        squareWidth,
        squareHeight,
        hexagonVertices,
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
          hexagonVertices,
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
  gridSize: number,
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
