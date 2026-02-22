import { tileAdjacencies } from "@/entities/data/tileAdjacencies";
import type { Tile } from "@/app/providers/context/types";
import { getHyperlaneActiveSides, isHyperlane } from "@/utils/hyperlaneUtils";

export type ControlOpenSides = Record<string, number[]>;

export function computeControlOpenSides(tiles: Tile[]): ControlOpenSides {
  const tilesByPosition = new Map(tiles.map((tile) => [tile.position, tile]));
  const hyperlaneSidesByPosition = new Map<string, Set<number>>();
  const openSidesByPosition: ControlOpenSides = {};

  const getActiveSidesForPosition = (
    position: string,
    systemId: string
  ): Set<number> => {
    const cached = hyperlaneSidesByPosition.get(position);
    if (cached) return cached;

    const activeSides = getHyperlaneActiveSides(systemId);
    hyperlaneSidesByPosition.set(position, activeSides);
    return activeSides;
  };

  tiles.forEach((tile) => {
    const faction = tile.controlledBy;
    if (!faction) return;

    const adjacentPositions = tileAdjacencies[tile.position];
    if (!adjacentPositions) return;

    const openSides: number[] = [];
    const currentIsHyperlane = isHyperlane(tile.systemId);

    for (let direction = 0; direction < 6; direction++) {
      const adjacentPos = adjacentPositions[direction];
      if (!adjacentPos) continue;

      const adjacentTile = tilesByPosition.get(adjacentPos);
      if (!adjacentTile || adjacentTile.controlledBy !== faction) continue;

      if (currentIsHyperlane) {
        const activeSides = getActiveSidesForPosition(
          tile.position,
          tile.systemId
        );
        if (!activeSides.has(direction)) continue;
      }

      if (isHyperlane(adjacentTile.systemId)) {
        const neighborAdjacencies = tileAdjacencies[adjacentPos];
        if (!neighborAdjacencies) continue;
        const neighborSide = neighborAdjacencies.findIndex(
          (pos) => pos === tile.position
        );
        if (neighborSide === -1) continue;

        const activeSides = getActiveSidesForPosition(
          adjacentPos,
          adjacentTile.systemId
        );
        if (!activeSides.has(neighborSide)) continue;
      }

      openSides.push(direction);
    }

    openSidesByPosition[tile.position] = openSides;
  });

  return openSidesByPosition;
}
