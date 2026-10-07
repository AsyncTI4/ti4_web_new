import { tileAdjacencies } from "@/entities/data/tileAdjacencies";

/** Direction indices (0=N … 5=NW) per tile position whose border is "open". */
type OpenSidesResult = Record<string, number[]>;

/**
 * For each stat tile, the sides that face another stat tile. Open sides get
 * sparse internal borders; the rest get solid outer borders.
 */
export function determineOpenSides(statTiles: string[]): OpenSidesResult {
  const result: OpenSidesResult = {};

  for (const tilePos of statTiles) {
    const adjacentPositions = tileAdjacencies[tilePos];
    if (!adjacentPositions) continue;

    const openSides: number[] = [];
    for (let direction = 0; direction < 6; direction++) {
      const adjacentPos = adjacentPositions[direction];
      if (adjacentPos && statTiles.includes(adjacentPos)) {
        openSides.push(direction);
      }
    }
    result[tilePos] = openSides;
  }

  return result;
}
