import { tileAdjacencies } from "@/entities/data/tileAdjacencies";

/**
 * Core logic: Determine which hex sides should be "open" (sparse borders) vs "closed" (solid borders)
 *
 * For each stat tile:
 * - Check each of its 6 adjacent directions (0-5)
 * - If the adjacent tile in that direction is also a stat tile, mark that side as "open"
 * - "Open" sides get sparse/dotted borders (internal connections)
 * - "Closed" sides get solid borders (outer edges)
 */
export function determineOpenSides(statTiles: string[]): OpenSidesResult {
  const result: OpenSidesResult = {};

  for (const tilePos of statTiles) {
    const openSides: number[] = [];
    const adjacentPositions = tileAdjacencies[tilePos];

    if (!adjacentPositions) continue; // Skip if no adjacency data found

    // Check each of the 6 directions (0=N, 1=NE, 2=SE, 3=S, 4=SW, 5=NW)
    for (let direction = 0; direction < 6; direction++) {
      const adjacentPos = adjacentPositions[direction];

      // If the adjacent position exists and is also in our statTiles array,
      // then this side should be "open" (sparse border)
      if (adjacentPos && statTiles.includes(adjacentPos)) {
        openSides.push(direction);
      }
    }

    result[tilePos] = openSides;
  }

  return result;
}

type OpenSidesResult = {
  [tilePosition: string]: number[]; // Array of direction indices (0-5) that should be "open"
};
