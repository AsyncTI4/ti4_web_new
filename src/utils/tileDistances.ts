import { tileAdjacencies } from "../data/tileAdjacencies";
import { getTileById } from "../mapgen/systems";
import { getTokenData } from "../lookup/tokens";
import { Tile, TilePlanet } from "@/context/types";
import { PlayerDataResponse, TileUnitData, EntityData } from "@/data/types";
import {
  getConnectingSide,
  getHyperlaneConnections,
  getValidHyperlaneExits,
  isHyperlane,
  type TileAdjacencies,
} from "@/utils/hyperlaneUtils";

/**
 * Helper function to get all wormholes present on a tile
 */
export function getTileWormholes(position: string, tiles: Tile[]): string[] {
  const wormholes = new Set<string>();

  const tile = tiles.find((t) => t.position === position);
  const tileData = tile?.systemId ? getTileById(tile.systemId) : undefined;
  if (tileData?.wormholes) {
    tileData.wormholes.forEach((wh) => wormholes.add(wh));
  }

  tile?.tokens.forEach((token) => {
    const tokenData = getTokenData(token);
    if (tokenData?.wormholes) {
      tokenData.wormholes.forEach((wh: string) => wormholes.add(wh));
    }
  });

  return Array.from(wormholes);
}

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
const getSafeValidHyperlaneExits = (
  hyperlaneId: string,
  hyperlanePosition: string,
  entranceSide: number,
  tileAdjacencies: TileAdjacencies
): string[] => {
  try {
    return getValidHyperlaneExits(
      hyperlaneId,
      hyperlanePosition,
      entranceSide,
      tileAdjacencies
    );
  } catch (error) {
    console.warn(
      `Failed to get valid hyperlane exits for ${hyperlaneId} at ${hyperlanePosition} from side ${entranceSide}:`,
      error
    );
    return [];
  }
};

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
  startPosition: string,
  tiles: Tile[]
): Record<string, number> {
  if (!startPosition) return {};

  // Get set of valid positions (only positions that are actually in play)
  const validPositions = new Set(tiles.map((t) => t.position));

  // Pre-calculate wormhole connections by creating a map of wormhole types to positions
  const wormholeMap: Record<string, string[]> = {};

  // Collect wormholes per position
  tiles.forEach((t) => {
    const pos = t.position;
    const wormholes = getTileWormholes(pos, tiles);
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

    const currentSystemId = tiles.find((t) => t.position === currentPosition)
      ?.systemId as string;
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
        const validExits = getSafeValidHyperlaneExits(
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
        const currentWormholes = getTileWormholes(currentPosition, tiles);
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
  startPosition: string,
  endPosition: string,
  tiles: Tile[]
): PathResult | null {
  if (!startPosition || !endPosition) return null;

  // Get set of valid positions (only positions that are actually in play)
  const validPositions = new Set(Object.values(tiles).map((t) => t.position));

  // Pre-calculate wormhole connections and position mappings
  const wormholeMap: Record<string, string[]> = {};

  tiles.forEach((t) => {
    const pos = t.position;
    const wormholes = getTileWormholes(pos, tiles);
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
    systemPath: [
      tiles.find((t) => t.position === startPosition)?.systemId as string,
    ],
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

    const currentSystemId = tiles.find((t) => t.position === currentPosition)
      ?.systemId as string;
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
        const validExits = getSafeValidHyperlaneExits(
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
      const currentWormholes = getTileWormholes(currentPosition, tiles);
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

      const adjacentSystemId = tiles.find(
        (t) => t.position === adjacentPosition
      )?.systemId as string;
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

// Hyperlane connection helpers live in src/utils/hyperlaneUtils.ts.

export function getTileController(
  planets: Record<string, TilePlanet>,
  unitsByFaction: Record<string, EntityData[]>
): string | undefined {
  const uniquePlanetFactions = new Set(
    Object.values(planets).map((planet: TilePlanet) => planet.controlledBy)
  );
  const uniqueFactions = new Set(Object.keys(unitsByFaction));

  if (uniquePlanetFactions.size === 1) {
    return uniquePlanetFactions.values().next().value;
  } else if (uniqueFactions.size === 1) {
    return uniqueFactions.values().next().value;
  } else {
    return undefined;
  }
}

export function hasTechSkips(planets: Record<string, TilePlanet>): boolean {
  return Object.values(planets).some(
    (planet: TilePlanet) =>
      planet.techSpecialties && planet.techSpecialties.length > 0
  );
}

export function computePdsData(
  data: PlayerDataResponse,
  factionToColor: Record<string, string>
) {
  const tilesWithPds = new Set<string>();
  const dominantPdsFaction: Record<
    string,
    { faction: string; color: string; count: number; expected: number }
  > = {};
  const pdsByTile: Record<
    string,
    { faction: string; color: string; count: number; expected: number }[]
  > = {};

  if (!data.tileUnitData)
    return { tilesWithPds, dominantPdsFaction, pdsByTile };

  Object.entries(data.tileUnitData).forEach(
    ([position, tileData]: [string, TileUnitData]) => {
      if (!(tileData.pds && Object.keys(tileData.pds).length > 0)) return;

      tilesWithPds.add(position);

      let highestExpected = -1;
      let dominantFaction = "";
      let dominantCount = 0;
      let dominantExpectedValue = 0;

      const allForTile: {
        faction: string;
        color: string;
        count: number;
        expected: number;
      }[] = [];

      Object.entries(tileData.pds).forEach(
        ([faction, pdsData]: [string, { count: number; expected: number }]) => {
          if (factionToColor[faction]) {
            allForTile.push({
              faction,
              color: factionToColor[faction],
              count: pdsData.count,
              expected: pdsData.expected,
            });
          }
          if (pdsData.expected > highestExpected) {
            highestExpected = pdsData.expected;
            dominantFaction = faction;
            dominantCount = pdsData.count;
            dominantExpectedValue = pdsData.expected;
          }
        }
      );

      if (allForTile.length > 0) {
        allForTile.sort((a, b) =>
          b.expected !== a.expected
            ? b.expected - a.expected
            : b.count - a.count
        );
        pdsByTile[position] = allForTile;
      }

      if (dominantFaction && factionToColor[dominantFaction]) {
        dominantPdsFaction[position] = {
          faction: dominantFaction,
          color: factionToColor[dominantFaction],
          count: dominantCount,
          expected: dominantExpectedValue,
        };
      }
    }
  );

  return { tilesWithPds, dominantPdsFaction, pdsByTile };
}
