import { hyperlaneIds, hyperlanes } from "@/data/hyperlanes";

export const isHyperlane = (systemId: string | undefined) =>
  !!systemId && hyperlaneIds.includes(systemId);

export type TileAdjacencies = {
  [tilePosition: string]: (string | null)[];
};

type HyperlaneConnection = {
  fromTile: string;
  toTile: string;
  throughSides: [number, number];
};

type HyperlaneConnectionResult = {
  hyperlaneId: string;
  tilePosition: string;
  connections: HyperlaneConnection[];
  connectedTiles: string[];
};

export const parseHyperlaneMatrix = (matrixString: string): boolean[][] => {
  const rows = matrixString.split(";");
  const matrix: boolean[][] = [];

  for (let i = 0; i < 6; i++) {
    const cols = rows[i].split(",");
    const row: boolean[] = [];
    for (let j = 0; j < 6; j++) {
      row.push(cols[j].trim() === "1");
    }
    matrix.push(row);
  }

  return matrix;
};

const getConnectionPairs = (matrix: boolean[][]): [number, number][] => {
  const pairs: [number, number][] = [];
  const seen = new Set<string>();

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (matrix[i][j]) {
        const pair: [number, number] = [Math.min(i, j), Math.max(i, j)];
        const key = `${pair[0]},${pair[1]}`;

        if (!seen.has(key)) {
          pairs.push(pair);
          seen.add(key);
        }
      }
    }
  }

  return pairs;
};

const isValidTilePosition = (position: string | null): position is string => {
  if (!position) return false;
  return position !== "x" && position.length > 0;
};

export const getHyperlaneConnections = (
  hyperlaneId: string,
  tilePosition: string,
  adjacencyData: TileAdjacencies
): HyperlaneConnectionResult => {
  const matrixString = hyperlanes[hyperlaneId];
  if (!matrixString) {
    throw new Error(`Hyperlane ${hyperlaneId} not found in data`);
  }

  const adjacentTiles = adjacencyData[tilePosition];
  if (!adjacentTiles || adjacentTiles.length !== 6) {
    throw new Error(
      `Adjacent tiles for position ${tilePosition} not found or invalid`
    );
  }

  const matrix = parseHyperlaneMatrix(matrixString);
  const connectionPairs = getConnectionPairs(matrix);

  const connections: HyperlaneConnection[] = [];
  const connectedTileSet = new Set<string>();

  for (const [side1, side2] of connectionPairs) {
    const tile1 = adjacentTiles[side1];
    const tile2 = adjacentTiles[side2];

    if (isValidTilePosition(tile1) && isValidTilePosition(tile2)) {
      connections.push({
        fromTile: tile1,
        toTile: tile2,
        throughSides: [side1, side2],
      });

      connections.push({
        fromTile: tile2,
        toTile: tile1,
        throughSides: [side2, side1],
      });

      connectedTileSet.add(tile1);
      connectedTileSet.add(tile2);
    }
  }

  return {
    hyperlaneId,
    tilePosition,
    connections,
    connectedTiles: Array.from(connectedTileSet),
  };
};

export const getValidHyperlaneExits = (
  hyperlaneId: string,
  hyperlanePosition: string,
  entranceSide: number,
  tileAdjacencies: TileAdjacencies
): string[] => {
  const result = getHyperlaneConnections(
    hyperlaneId,
    hyperlanePosition,
    tileAdjacencies
  );
  const validExits: string[] = [];

  result.connections.forEach((connection) => {
    if (connection.throughSides[0] === entranceSide) {
      validExits.push(connection.toTile);
    } else if (connection.throughSides[1] === entranceSide) {
      validExits.push(connection.fromTile);
    }
  });

  return validExits;
};

export const getConnectingSide = (
  fromPosition: string,
  toPosition: string,
  tileAdjacencies: TileAdjacencies
): number | null => {
  const adjacentPositions = tileAdjacencies[fromPosition];
  if (!adjacentPositions) return null;

  return adjacentPositions.findIndex((pos) => pos === toPosition);
};

export const getHyperlaneActiveSides = (hyperlaneId: string): Set<number> => {
  const matrixString = hyperlanes[hyperlaneId];
  if (!matrixString) return new Set<number>();

  const matrix = parseHyperlaneMatrix(matrixString);
  const activeSides = new Set<number>();

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (matrix[i][j]) {
        activeSides.add(i);
        activeSides.add(j);
      }
    }
  }

  return activeSides;
};
