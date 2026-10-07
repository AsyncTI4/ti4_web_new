import { useGameData } from "@/state/useGameContext";
import {
  calculateStatTilePositions,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "@/entities/geometry/tilePositioning";
import { useTilesList } from "@/hooks/useTilesList";
import { getMapLayoutConfig, type MapLayout } from "../mapLayout";

const EMPTY_CONTENT_SIZE = {
  width: 0,
  height: 0,
  bleed: { top: 0, right: 0, bottom: 0, left: 0 },
};

export function useMapContentSize(layout: MapLayout) {
  const gameData = useGameData();
  const tiles = useTilesList(gameData?.tiles);
  const { contentPadding, mapHeightExtra, mapWidthExtra } =
    getMapLayoutConfig(layout);

  if (!tiles.length) return EMPTY_CONTENT_SIZE;

  let maxRight = 0;
  let maxBottom = 0;
  for (const t of tiles) {
    maxRight = Math.max(maxRight, t.properties.x + TILE_WIDTH);
    maxBottom = Math.max(maxBottom, t.properties.y + TILE_HEIGHT);
  }

  const baseWidth = maxRight + contentPadding;
  const baseHeight = maxBottom + contentPadding + mapHeightExtra;
  const statPositionIds = Object.values(
    gameData?.statTilePositions ?? {},
  ).flat();
  const statPositions = calculateStatTilePositions(
    statPositionIds,
    gameData?.ringCount,
    gameData?.tilePositions,
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
}
