import { useMemo } from "react";
import { useGameData } from "@/hooks/useGameContext";
import { useAppStore, useSettingsStore } from "@/utils/appStore";
import { TILE_HEIGHT, TILE_WIDTH } from "@/mapgen/tilePositioning";

const MAP_PADDING = 200;

export function useMapContentSize() {
  const gameData = useGameData();
  const zoom = useAppStore((state) => state.zoomLevel);
  const settings = useSettingsStore((state) => state.settings);

  const contentSize = useMemo(() => {
    const tiles = gameData?.mapTiles || [];
    if (!tiles.length) return { width: 0, height: 0 };

    let maxRight = 0;
    let maxBottom = 0;

    for (const t of tiles) {
      const right = t.properties.x + TILE_WIDTH;
      const bottom = t.properties.y + TILE_HEIGHT;
      if (right > maxRight) maxRight = right;
      if (bottom > maxBottom) maxBottom = bottom;
    }

    const baseWidth = maxRight + MAP_PADDING;
    const baseHeight = maxBottom + MAP_PADDING + 50;

    if (settings.isFirefox) {
      return {
        width: baseWidth * zoom,
        height: baseHeight * zoom,
      };
    }

    return {
      width: baseWidth,
      height: baseHeight,
    };
  }, [gameData?.mapTiles, settings.isFirefox, zoom]);

  return contentSize;
}
