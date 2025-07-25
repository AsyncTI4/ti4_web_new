import { hyperlaneIds, hyperlanes } from "@/data/hyperlanes";
import { tileAdjacencies } from "../data/tileAdjacencies";
import { getTileById } from "../mapgen/systems";

/**
 * Helper function to get all wormholes present on a tile
 */
export function getTileWormholes(
  systemId: string,
  systemIdToPosition: Record<string, string>,
  tileUnitData?: Record<string, any>
): string[] {
  const wormholes = new Set<string>();

  // Get wormholes from the base tile
  const tileData = getTileById(systemId);
  if (tileData?.wormholes) {
    tileData.wormholes.forEach((wh) => wormholes.add(wh));
  }

  // Get wormholes from tokens in space (like Creuss wormhole tokens)
  const position = systemIdToPosition[systemId];
  const tileSpatialData =
    position && tileUnitData ? tileUnitData[position] : undefined;

  if (tileSpatialData?.space) {
    Object.values(tileSpatialData.space).forEach((factionEntities: any) => {
      if (Array.isArray(factionEntities)) {
        factionEntities.forEach((entity: any) => {
          if (entity.entityType === "token") {
            // Check if this token has wormholes
            // Note: We'd need to lookup token data to get wormholes, but for now
            // we can check common Creuss token patterns
            const tokenId = entity.entityId;
            if (tokenId === "creussalpha") wormholes.add("ALPHA");
            else if (tokenId === "creussbeta") wormholes.add("BETA");
            else if (tokenId === "creussgamma") wormholes.add("GAMMA");
            else if (tokenId === "creussepsilon") wormholes.add("EPSILON");
          }
        });
      }
    });
  }

  return Array.from(wormholes);
}

const isHyperlane = (systemId: string) => hyperlaneIds.includes(systemId);

/**
 * Helper function to get hyperlane connections for a tile
 */
function getHyperlaneConnectionsForTile(
  systemId: string,
  position: string,
  tileAdjacencies: TileAdjacencies
): string[] {
  if (!isHyperlane(systemId)) return [];

  try {
    const result = getHyperlaneConnections(systemId, position, tileAdjacencies);
    return result.connectedTiles;
  } catch (error) {
    console.warn(
      `Failed to get hyperlane connections for ${systemId} at ${position}:`,
      error
    );
    return [];
  }
}

/**
 * Get valid hyperlane exits from a specific entrance direction
 */
function getValidHyperlaneExits(
  hyperlaneId: string,
  hyperlanePosition: string,
  entranceSide: number,
  tileAdjacencies: TileAdjacencies
): string[] {
  try {
    const result = getHyperlaneConnections(
      hyperlaneId,
      hyperlanePosition,
      tileAdjacencies
    );
    const validExits: string[] = [];

    // Find all connections that include our entrance side
    result.connections.forEach((connection) => {
      if (connection.throughSides[0] === entranceSide) {
        // We entered from side 0 of the connection, can exit to side 1
        validExits.push(connection.toTile);
      } else if (connection.throughSides[1] === entranceSide) {
        // We entered from side 1 of the connection, can exit to side 0
        validExits.push(connection.fromTile);
      }
    });

    return validExits;
  } catch (error) {
    console.warn(
      `Failed to get valid hyperlane exits for ${hyperlaneId} at ${hyperlanePosition} from side ${entranceSide}:`,
      error
    );
    return [];
  }
}

/**
 * Get the side index (0-5) that connects two adjacent positions
 */
function getConnectingSide(
  fromPosition: string,
  toPosition: string,
  tileAdjacencies: TileAdjacencies
): number | null {
  const adjacentPositions = tileAdjacencies[fromPosition];
  if (!adjacentPositions) return null;

  return adjacentPositions.findIndex((pos) => pos === toPosition);
}

export type TilePath = {
  systemIds: string[];
  positions: string[];
  distance: number;
  hyperlanePositions: Set<string>; // Positions that are hyperlanes (don't contribute to distance)
};

export type PathResult = {
  distance: number;
  paths: TilePath[];
};

/**
 * Calculate distances and optimal paths from a starting tile to all other tiles using BFS
 * with support for normal adjacencies, wormhole connections, and hyperlanes
 */
export function calculateTileDistances(
  startSystemId: string,
  systemIdToPosition: Record<string, string>,
  tileUnitData?: Record<string, any>
): Record<string, number> {
  // Convert systemId to position for tileAdjacencies lookup
  const startPosition = systemIdToPosition[startSystemId];
  if (!startPosition) return {};

  // Get set of valid positions (only positions that are actually in play)
  const validPositions = new Set(Object.values(systemIdToPosition));

  // Pre-calculate wormhole connections by creating a map of wormhole types to positions
  const wormholeMap: Record<string, string[]> = {};
  const positionToSystemId: Record<string, string> = {};

  // Build reverse mapping and collect wormholes
  Object.entries(systemIdToPosition).forEach(([sysId, pos]) => {
    positionToSystemId[pos] = sysId;
    const wormholes = getTileWormholes(sysId, systemIdToPosition, tileUnitData);
    wormholes.forEach((whType) => {
      if (!wormholeMap[whType]) wormholeMap[whType] = [];
      wormholeMap[whType].push(pos);
    });
  });

  const distances: Record<string, number> = {};
  const queue: Array<{
    position: string;
    distance: number;
    previousPosition?: string; // Track where we came from for hyperlane logic
  }> = [];
  const visited = new Set<string>();

  // Start BFS from the hovered tile position
  queue.push({ position: startPosition, distance: 0 });
  visited.add(startPosition);
  distances[startPosition] = 0;

  while (queue.length > 0) {
    const {
      position: currentPosition,
      distance: currentDistance,
      previousPosition,
    } = queue.shift()!;

    const currentSystemId = positionToSystemId[currentPosition];
    const currentIsHyperlane = isHyperlane(currentSystemId);

    // Get all adjacent positions based on tile type
    const allAdjacentPositions = new Set<string>();

    if (currentIsHyperlane && previousPosition) {
      // For hyperlanes, only allow exits based on entrance direction
      // Need to find which side of the hyperlane connects to the previous position
      const entranceSide = getConnectingSide(
        currentPosition,
        previousPosition,
        tileAdjacencies
      );
      if (entranceSide !== null) {
        const validExits = getValidHyperlaneExits(
          currentSystemId,
          currentPosition,
          entranceSide,
          tileAdjacencies
        );
        validExits.forEach((exitPosition) => {
          // Only add positions that are actually in play
          if (
            exitPosition &&
            exitPosition !== currentPosition &&
            validPositions.has(exitPosition)
          ) {
            allAdjacentPositions.add(exitPosition);
          }
        });
      }
    } else if (currentIsHyperlane && !previousPosition) {
      // If we start on a hyperlane (no previous position), we can go to any connected tile
      const hyperlaneConnections = getHyperlaneConnectionsForTile(
        currentSystemId,
        currentPosition,
        tileAdjacencies
      );
      hyperlaneConnections.forEach((connectedPosition: string) => {
        // Only add positions that are actually in play
        if (
          connectedPosition &&
          connectedPosition !== currentPosition &&
          validPositions.has(connectedPosition)
        ) {
          allAdjacentPositions.add(connectedPosition);
        }
      });
    } else {
      // For normal tiles, use normal adjacencies + wormhole connections
      const adjacentPositions = tileAdjacencies[currentPosition];
      if (adjacentPositions) {
        adjacentPositions.forEach((pos) => {
          // Only add positions that are actually in play
          if (pos && validPositions.has(pos)) {
            allAdjacentPositions.add(pos);
          }
        });
      }

      // Add wormhole connections
      if (currentSystemId) {
        const currentWormholes = getTileWormholes(
          currentSystemId,
          systemIdToPosition,
          tileUnitData
        );
        currentWormholes.forEach((whType) => {
          const connectedPositions = wormholeMap[whType] || [];
          connectedPositions.forEach((pos) => {
            // Only add positions that are actually in play
            if (pos !== currentPosition && validPositions.has(pos)) {
              allAdjacentPositions.add(pos);
            }
          });
        });
      }
    }

    // Explore each adjacent tile (normal + wormhole + hyperlane)
    for (const adjacentPosition of allAdjacentPositions) {
      if (adjacentPosition && !visited.has(adjacentPosition)) {
        visited.add(adjacentPosition);

        // Determine the distance cost for this move
        // If we're currently ON a hyperlane, moving to adjacent tiles costs 0
        // If we're on a normal tile, moving costs 1
        const distanceCost = currentIsHyperlane ? 0 : 1;
        const newDistance = currentDistance + distanceCost;

        distances[adjacentPosition] = newDistance;
        queue.push({
          position: adjacentPosition,
          distance: newDistance,
          previousPosition: currentPosition,
        });
      }
    }
  }

  return distances;
}

/**
 * Calculate optimal paths between two specific tiles
 */
export function calculateOptimalPaths(
  startSystemId: string,
  endSystemId: string,
  systemIdToPosition: Record<string, string>,
  tileUnitData?: Record<string, any>
): PathResult | null {
  const startPosition = systemIdToPosition[startSystemId];
  const endPosition = systemIdToPosition[endSystemId];

  if (!startPosition || !endPosition) return null;

  // Get set of valid positions (only positions that are actually in play)
  const validPositions = new Set(Object.values(systemIdToPosition));

  // Pre-calculate wormhole connections and position mappings
  const wormholeMap: Record<string, string[]> = {};
  const positionToSystemId: Record<string, string> = {};

  Object.entries(systemIdToPosition).forEach(([sysId, pos]) => {
    positionToSystemId[pos] = sysId;
    const wormholes = getTileWormholes(sysId, systemIdToPosition, tileUnitData);
    wormholes.forEach((whType) => {
      if (!wormholeMap[whType]) wormholeMap[whType] = [];
      wormholeMap[whType].push(pos);
    });
  });

  // BFS with path tracking
  const queue: Array<{
    position: string;
    distance: number;
    path: string[]; // positions
    systemPath: string[]; // system IDs
    hyperlanePositions: Set<string>;
    previousPosition?: string; // Track where we came from for hyperlane logic
  }> = [];

  const visited = new Map<string, number>(); // position -> best distance found
  const allPaths: TilePath[] = [];
  let bestDistance = Infinity;

  // Start BFS
  queue.push({
    position: startPosition,
    distance: 0,
    path: [startPosition],
    systemPath: [startSystemId],
    hyperlanePositions: new Set(),
  });

  visited.set(startPosition, 0);

  while (queue.length > 0) {
    const {
      position: currentPosition,
      distance: currentDistance,
      path,
      systemPath,
      hyperlanePositions,
      previousPosition,
    } = queue.shift()!;

    // If we've found a longer path than our best, skip
    if (currentDistance > bestDistance) continue;

    // If we reached the target
    if (currentPosition === endPosition) {
      if (currentDistance < bestDistance) {
        // Found a better path, clear previous paths
        bestDistance = currentDistance;
        allPaths.length = 0;
      }

      if (currentDistance === bestDistance) {
        // Add this path to our collection
        allPaths.push({
          systemIds: [...systemPath],
          positions: [...path],
          distance: currentDistance,
          hyperlanePositions: new Set(hyperlanePositions),
        });
      }
      continue;
    }

    const currentSystemId = positionToSystemId[currentPosition];
    const currentIsHyperlane = isHyperlane(currentSystemId);

    // Get all adjacent positions
    const allAdjacentPositions = new Set<string>();

    if (currentIsHyperlane && previousPosition) {
      // For hyperlanes, only allow exits based on entrance direction
      // Need to find which side of the hyperlane connects to the previous position
      const entranceSide = getConnectingSide(
        currentPosition,
        previousPosition,
        tileAdjacencies
      );
      if (entranceSide !== null) {
        const validExits = getValidHyperlaneExits(
          currentSystemId,
          currentPosition,
          entranceSide,
          tileAdjacencies
        );
        validExits.forEach((exitPosition) => {
          // Only add positions that are actually in play
          if (
            exitPosition &&
            exitPosition !== currentPosition &&
            validPositions.has(exitPosition)
          ) {
            allAdjacentPositions.add(exitPosition);
          }
        });
      }
    } else if (currentIsHyperlane && !previousPosition) {
      // If we start on a hyperlane (no previous position), we can go to any connected tile
      const hyperlaneConnections = getHyperlaneConnectionsForTile(
        currentSystemId,
        currentPosition,
        tileAdjacencies
      );
      hyperlaneConnections.forEach((connectedPosition: string) => {
        // Only add positions that are actually in play
        if (
          connectedPosition &&
          connectedPosition !== currentPosition &&
          validPositions.has(connectedPosition)
        ) {
          allAdjacentPositions.add(connectedPosition);
        }
      });
    } else {
      // Normal adjacencies
      const adjacentPositions = tileAdjacencies[currentPosition];
      if (adjacentPositions) {
        adjacentPositions.forEach((pos) => {
          // Only add positions that are actually in play
          if (pos && validPositions.has(pos)) {
            allAdjacentPositions.add(pos);
          }
        });
      }

      // Wormhole connections
      const currentWormholes = getTileWormholes(
        currentSystemId,
        systemIdToPosition,
        tileUnitData
      );
      currentWormholes.forEach((whType) => {
        const connectedPositions = wormholeMap[whType] || [];
        connectedPositions.forEach((pos) => {
          // Only add positions that are actually in play
          if (pos !== currentPosition && validPositions.has(pos)) {
            allAdjacentPositions.add(pos);
          }
        });
      });
    }

    // Explore adjacent positions
    for (const adjacentPosition of allAdjacentPositions) {
      if (!adjacentPosition) continue;

      const adjacentSystemId = positionToSystemId[adjacentPosition];
      const distanceCost = currentIsHyperlane ? 0 : 1;
      const newDistance = currentDistance + distanceCost;

      // Only continue if we haven't visited this position with a better distance
      const bestKnownDistance = visited.get(adjacentPosition);
      if (bestKnownDistance !== undefined && newDistance > bestKnownDistance) {
        continue;
      }

      // Update visited with the new best distance
      visited.set(adjacentPosition, newDistance);

      // Create new path
      const newPath = [...path, adjacentPosition];
      const newSystemPath = [...systemPath, adjacentSystemId];
      const newHyperlanePositions = new Set(hyperlanePositions);

      // Mark hyperlanes in the path
      if (currentIsHyperlane) {
        newHyperlanePositions.add(currentPosition);
      }
      if (isHyperlane(adjacentSystemId)) {
        newHyperlanePositions.add(adjacentPosition);
      }

      queue.push({
        position: adjacentPosition,
        distance: newDistance,
        path: newPath,
        systemPath: newSystemPath,
        hyperlanePositions: newHyperlanePositions,
        previousPosition: currentPosition,
      });
    }
  }

  if (allPaths.length === 0) return null;

  return {
    distance: bestDistance,
    paths: allPaths,
  };
}

interface TileAdjacencies {
  [tilePosition: string]: (string | null)[]; // 6 adjacent positions in clockwise order [N, NE, SE, S, SW, NW]
}

interface HyperlaneConnection {
  fromTile: string;
  toTile: string;
  throughSides: [number, number]; // [fromSide, toSide]
}

interface HyperlaneConnectionResult {
  hyperlaneId: string;
  tilePosition: string;
  connections: HyperlaneConnection[];
  connectedTiles: string[]; // Unique list of all reachable tiles
}

/**
 * Parse a hyperlane matrix string into a 6x6 boolean matrix
 */
function parseHyperlaneMatrix(matrixString: string): boolean[][] {
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
}

/**
 * Get all connection pairs from a hyperlane matrix
 * Returns pairs as [min(i,j), max(i,j)] to avoid duplicates
 */
function getConnectionPairs(matrix: boolean[][]): [number, number][] {
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
}

/**
 * Check if a tile position is valid (not "x" which represents invalid/missing tiles)
 */
function isValidTilePosition(position: string | null): position is string {
  if (!position) return false;
  return position !== "x" && position.length > 0;
}

/**
 * Get all tiles connected through a hyperlane at a specific position
 */
function getHyperlaneConnections(
  hyperlaneId: string,
  tilePosition: string,
  adjacencyData: TileAdjacencies
): HyperlaneConnectionResult {
  // Get the hyperlane matrix data
  const matrixString = hyperlanes[hyperlaneId];
  if (!matrixString) {
    throw new Error(`Hyperlane ${hyperlaneId} not found in data`);
  }

  // Get adjacent tile positions for this tile
  const adjacentTiles = adjacencyData[tilePosition];
  if (!adjacentTiles || adjacentTiles.length !== 6) {
    throw new Error(
      `Adjacent tiles for position ${tilePosition} not found or invalid`
    );
  }

  // Parse the hyperlane matrix
  const matrix = parseHyperlaneMatrix(matrixString);

  // Get all connection pairs
  const connectionPairs = getConnectionPairs(matrix);

  // Build connections
  const connections: HyperlaneConnection[] = [];
  const connectedTileSet = new Set<string>();

  for (const [side1, side2] of connectionPairs) {
    const tile1 = adjacentTiles[side1];
    const tile2 = adjacentTiles[side2];

    // Only add valid tile positions (not null and not "x")
    if (isValidTilePosition(tile1) && isValidTilePosition(tile2)) {
      // Add bidirectional connections
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
}

// Example usage:
/*
const hyperlaneData: HyperlaneData = {
  "84b": "0,0,0,1,1,0;0,0,0,1,0,0;0,0,0,0,0,0;1,1,0,0,0,0;1,0,0,0,0,0;0,0,0,0,0,0",
  "83a": "0,0,0,0,0,0;0,0,0,0,1,0;0,0,0,0,0,0;0,0,0,0,0,0;0,1,0,0,0,0;0,0,0,0,0,0"
  // ... more hyperlanes
};

const adjacencyData: TileAdjacencies = {
  "201": ["101", "202", "203", "x", "212", "x"],
  "304": ["203", "305", "306", "307", "303", "302"]
  // ... more adjacencies
};

// Get connections for hyperlane 84b at position 201
const result = getHyperlaneConnections("84b", "201", hyperlaneData, adjacencyData);

console.log("Connected tiles:", result.connectedTiles);
console.log("All connections:", result.connections);

// Check if specific tiles are connected
const isConnected = aretilesConnectedThroughHyperlane("101", "203", "84b", "201", hyperlaneData, adjacencyData);
console.log("101 and 203 connected through 84b at 201:", isConnected);
*/
