import { hyperlaneIds, hyperlanes } from "@/entities/data/hyperlanes";

export const isHyperlane = (systemId: string | undefined) =>
  !!systemId && hyperlaneIds.includes(systemId);

const parseHyperlaneMatrix = (matrixString: string): boolean[][] =>
  matrixString
    .split(";")
    .slice(0, 6)
    .map((row) =>
      row
        .split(",")
        .slice(0, 6)
        .map((cell) => cell.trim() === "1"),
    );

export const getHyperlaneActiveSides = (hyperlaneId: string): Set<number> => {
  const matrixString = hyperlanes[hyperlaneId];
  if (!matrixString) return new Set<number>();

  const matrix = parseHyperlaneMatrix(matrixString);
  const activeSides = new Set<number>();

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (!matrix[i][j]) continue;
      activeSides.add(i);
      activeSides.add(j);
    }
  }

  return activeSides;
};
