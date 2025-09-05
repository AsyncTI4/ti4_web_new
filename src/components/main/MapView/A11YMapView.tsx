import { useEffect } from "react";
import { Box } from "@mantine/core";
import classes from "@/components/MapUI.module.css";
import { MapTile } from "@/components/Map/MapTile";
import { useGameData } from "@/hooks/useGameContext";
import { useMovementStore } from "@/utils/movementStore";
import { PlayerStatsArea } from "@/components/Map/PlayerStatsArea";
import { useAppStore, useSettingsStore } from "@/utils/appStore";
import { useHexRingNavigation } from "@/hooks/a11y/useHexRingNavigation";
import { useTileVoiceOver } from "@/hooks/a11y/useTileVoiceOver";

const MAP_PADDING = 200;

export function A11YMapView() {
  const gameData = useGameData();
  const zoom = useAppStore((state) => state.zoomLevel);
  const settings = useSettingsStore((state) => state.settings);
  const draft = useMovementStore((s) => s.draft);

  const { selectedPosition, onKeyDown, containerTabIndex, containerRef } =
    useHexRingNavigation({
      mapTiles: gameData?.mapTiles || [],
      initialPosition: "000",
    });
  const { announceTile } = useTileVoiceOver({ speakWithSpeechSynthesis: true });

  useEffect(() => {
    if (!gameData || !selectedPosition) return;
    const tile = gameData.mapTiles.find((t) => t.position === selectedPosition);
    announceTile(tile);
  }, [announceTile, gameData, selectedPosition]);

  return (
    <Box className={classes.mapContainer}>
      <Box
        className={`dragscroll ${classes.mapArea}`}
        style={{ width: `100vw` }}
      >
        {gameData && (
          <>
            <Box
              className={classes.tileRenderingContainer}
              style={{
                ...(settings.isFirefox ? {} : { zoom: zoom }),
                MozTransform: `scale(${zoom})`,
                MozTransformOrigin: "top left",
                top: MAP_PADDING / zoom,
                left: MAP_PADDING / zoom,
              }}
              tabIndex={containerTabIndex}
              aria-label="Game map. Use arrow keys to move between tiles."
              onKeyDown={onKeyDown}
              ref={containerRef}
              onClick={() => {
                try {
                  containerRef.current?.focus();
                } catch (err) {}
              }}
            >
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
                    isMovingMode={!!draft.targetPositionId}
                    isOrigin={!!draft.origins?.[tile.position]}
                    isA11ySelected={selectedPosition === tile.position}
                  />
                );
              })}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
