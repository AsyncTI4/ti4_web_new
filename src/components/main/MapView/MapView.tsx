import { useMemo } from "react";
import { Box } from "@mantine/core";
import classes from "@/components/MapUI.module.css";
import { MapTile } from "@/components/Map/MapTile";
import { useMapScrollPosition } from "@/hooks/useMapScrollPosition";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTabsAndTooltips } from "@/hooks/useTabsAndTooltips";
import { useGameData } from "@/hooks/useGameContext";
import { PlayerStatsArea } from "@/components/Map/PlayerStatsArea";
import { useAppStore, useSettingsStore } from "@/utils/appStore";
import {
  TILE_HEIGHT,
  TILE_WIDTH,
  calculateSingleTilePosition,
} from "@/mapgen/tilePositioning";
import PlayerCard2Mid from "@/components/PlayerCard2Mid";

const MAP_PADDING = 200;

type Props = {
  gameId: string;
};

export function MapView({ gameId }: Props) {
  const gameData = useGameData();

  const {
    selectedArea,

    handleAreaSelect,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
  } = useTabsAndTooltips();

  const handleUnitMouseEnter = (
    faction: string,
    unitId: string,
    x: number,
    y: number
  ) => {
    handleMouseEnter(faction, unitId, x, y);
  };

  const handleUnitMouseLeave = () => handleMouseLeave();

  const zoom = useAppStore((state) => state.zoomLevel);
  const handleZoomIn = useAppStore((state) => state.handleZoomIn);
  const handleZoomOut = useAppStore((state) => state.handleZoomOut);
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);

  const { mapContainerRef } = useMapScrollPosition({
    zoom,
    gameId,
  });

  useKeyboardShortcuts({
    toggleOverlays: handlers.toggleOverlays,
    toggleTechSkipsMode: handlers.toggleTechSkipsMode,
    toggleDistanceMode: handlers.toggleDistanceMode,
    togglePdsMode: handlers.togglePdsMode,
    toggleLeftPanelCollapsed: handlers.toggleLeftPanelCollapsed,
    toggleRightPanelCollapsed: handlers.toggleRightPanelCollapsed,
    isLeftPanelCollapsed: settings.leftPanelCollapsed,
    isRightPanelCollapsed: settings.rightPanelCollapsed,
    updateSettings: handlers.updateSettings,
    handleZoomIn,
    handleZoomOut,
    onAreaSelect: handleAreaSelect,
    selectedArea,
  });

  const mapBounds = useMemo(() => {
    const tiles = gameData?.mapTiles;
    if (!tiles || tiles.length === 0) return null;

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (const tile of tiles) {
      const x = tile?.properties?.x ?? 0;
      const y = tile?.properties?.y ?? 0;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      const right = x + TILE_WIDTH;
      const bottom = y + TILE_HEIGHT;
      if (right > maxX) maxX = right;
      if (bottom > maxY) maxY = bottom;
    }

    // Include stat tile areas in bounds if present
    const statPositions = gameData?.statTilePositions;
    const ringCount = (gameData as any)?.ringCount ?? 3;
    if (statPositions) {
      for (const positions of Object.values(statPositions) as string[][]) {
        for (const pos of positions) {
          try {
            const { x, y } = calculateSingleTilePosition(pos, ringCount);
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            const right = x + TILE_WIDTH;
            const bottom = y + TILE_HEIGHT;
            if (right > maxX) maxX = right;
            if (bottom > maxY) maxY = bottom;
          } catch (_) {
            // ignore invalid positions
          }
        }
      }
    }

    const width = Math.ceil(maxX - minX + MAP_PADDING * 2);
    const height = Math.ceil(maxY - minY + MAP_PADDING * 2);
    const offsetX = Math.round(-minX + MAP_PADDING);
    const offsetY = Math.round(-minY + MAP_PADDING);

    return { width, height, offsetX, offsetY };
  }, [gameData?.mapTiles, gameData?.statTilePositions]);

  return (
    <Box ref={mapContainerRef} className={`dragscroll`}>
      {gameData && (
        <>
          <Box
            className={classes.tileRenderingContainer}
            style={
              mapBounds
                ? {
                    width: `${mapBounds.width}px`,
                    height: `${mapBounds.height}px`,
                    background: "var(--main-bg)",
                  }
                : undefined
            }
          >
            <div>
              {/* Render stat tiles for each faction */}
              {gameData.playerData &&
                gameData.statTilePositions &&
                Object.entries(gameData.statTilePositions).map(
                  ([faction, statTiles]) => {
                    const player = gameData.playerData!.find(
                      (p) => p.faction === faction
                    );
                    if (!player) return null;

                    return (
                      <PlayerStatsArea
                        key={faction}
                        faction={faction}
                        playerData={player as any}
                        statTilePositions={statTiles as string[]}
                      />
                    );
                  }
                )}
              {gameData.mapTiles?.map((tile, index) => {
                return (
                  <MapTile
                    key={`${tile.systemId}-${index}`}
                    mapTile={tile}
                    onUnitMouseOver={handleUnitMouseEnter}
                    onUnitMouseLeave={handleUnitMouseLeave}
                    onUnitSelect={handleMouseDown}
                  />
                );
              })}
            </div>
          </Box>
        </>
      )}

      {gameData?.playerData?.map((player) => (
        <div
          style={{
            width: `${mapBounds?.width ?? 0}px`,
          }}
        >
          <PlayerCard2Mid key={player.faction} playerData={player} />
        </div>
      ))}
    </Box>
  );
}
