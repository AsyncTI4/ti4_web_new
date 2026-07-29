import { useMemo } from "react";
import { useGameData } from "@/hooks/useGameContext";
import {
  calculateTilePositions,
  isFractureInPlay,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "@/domains/map/model/mapgen/tilePositioning";
import { useTilesList } from "@/hooks/useTilesList";
import { getMapLayoutConfig, type MapLayout } from "../mapLayout";

export function useMapContentSize(layout: MapLayout) {
  const gameData = useGameData();
  const tiles = useTilesList(gameData?.tiles);
  const { contentPadding, mapHeightExtra, mapWidthExtra } =
    getMapLayoutConfig(layout);

  const contentSize = useMemo(() => {
    if (!tiles.length) {
      return {
        width: 0,
        height: 0,
        bleed: { top: 0, right: 0, bottom: 0, left: 0 },
      };
    }

    let maxRight = 0;
    let maxBottom = 0;

    for (const t of tiles) {
      const right = t.properties.x + TILE_WIDTH;
      const bottom = t.properties.y + TILE_HEIGHT;
      if (right > maxRight) maxRight = right;
      if (bottom > maxBottom) maxBottom = bottom;
    }

    const baseWidth = maxRight + contentPadding;
    const baseHeight = maxBottom + contentPadding + mapHeightExtra;
    const statPositionIds = Object.values(
      gameData?.statTilePositions ?? {},
    ).flat();
    const fractureYBump =
      gameData?.tilePositions && isFractureInPlay(gameData.tilePositions)
        ? 400
        : 0;
    const statPositions = calculateTilePositions(
      statPositionIds.map((position) => `${position}:stat_${position}`),
      gameData?.ringCount,
      fractureYBump,
    );
    const paintedPositions = [
      ...tiles.map((tile) => tile.properties),
      ...statPositions,
    ];
    const minLeft = Math.min(...paintedPositions.map(({ x }) => x));
    const minTop = Math.min(...paintedPositions.map(({ y }) => y));
    const paintedRight = Math.max(
      ...paintedPositions.map(({ x }) => x + TILE_WIDTH),
    );
    const paintedBottom = Math.max(
      ...paintedPositions.map(({ y }) => y + TILE_HEIGHT),
    );

    return {
      width: baseWidth,
      height: baseHeight,
      bleed: {
        top: Math.max(0, -minTop),
        right: Math.max(0, paintedRight - (baseWidth + mapWidthExtra)),
        bottom: Math.max(0, paintedBottom - baseHeight),
        left: Math.max(0, -minLeft),
      },
    };
  }, [
    tiles,
    gameData?.statTilePositions,
    gameData?.tilePositions,
    gameData?.ringCount,
    contentPadding,
    mapHeightExtra,
    mapWidthExtra,
  ]);

  return contentSize;
}
