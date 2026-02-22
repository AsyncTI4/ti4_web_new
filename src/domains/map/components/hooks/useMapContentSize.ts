import { useMemo } from "react";
import { useGameData } from "@/hooks/useGameContext";
import { TILE_HEIGHT, TILE_WIDTH } from "@/domains/map/model/mapgen/tilePositioning";
import { useTilesList } from "@/hooks/useTilesList";
import { getMapLayoutConfig, type MapLayout } from "../mapLayout";

export function useMapContentSize(layout: MapLayout) {
  const gameData = useGameData();
  const tiles = useTilesList(gameData?.tiles);
  const { contentPadding, mapHeightExtra } = getMapLayoutConfig(layout);

  const contentSize = useMemo(() => {
    if (!tiles.length) return { width: 0, height: 0 };

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

    return {
      width: baseWidth,
      height: baseHeight,
    };
  }, [tiles, contentPadding, mapHeightExtra]);

  return contentSize;
}
