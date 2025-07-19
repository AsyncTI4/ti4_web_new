import { RGBColor } from "@/utils/colorOptimization";
import { Box } from "@mantine/core";
import React from "react";
import { useMemo } from "react";
import { PlayerStatsArea } from "./Map/PlayerStatsArea";
import { MapTile } from "./Map/MapTile";


const MemoizedPlayerStatsArea = React.memo(PlayerStatsArea, (prevProps, nextProps) => {
  return (
    prevProps.faction === nextProps.faction &&
    prevProps.playerData === nextProps.playerData &&
    prevProps.color === nextProps.color &&
    prevProps.vpsToWin === nextProps.vpsToWin &&
    prevProps.ringCount === nextProps.ringCount &&
    JSON.stringify(prevProps.statTilePositions) === JSON.stringify(nextProps.statTilePositions) &&
    JSON.stringify(prevProps.factionToColor) === JSON.stringify(nextProps.factionToColor)
  );
});

const MemoizedMapTile = React.memo(MapTile, (prevProps, nextProps) => {
  // Only re-render if critical props change, ignore event handlers
  return (
    prevProps.systemId === nextProps.systemId &&
    prevProps.ringPosition === nextProps.ringPosition &&
    prevProps.position.x === nextProps.position.x &&
    prevProps.position.y === nextProps.position.y &&
    prevProps.tileUnitData === nextProps.tileUnitData &&
    prevProps.techSkipsMode === nextProps.techSkipsMode &&
    prevProps.overlaysEnabled === nextProps.overlaysEnabled &&
    prevProps.alwaysShowControlTokens === nextProps.alwaysShowControlTokens &&
    prevProps.showExhaustedPlanets === nextProps.showExhaustedPlanets &&
    JSON.stringify(prevProps.factionToColor) === JSON.stringify(nextProps.factionToColor) &&
    JSON.stringify(prevProps.optimizedColors) === JSON.stringify(nextProps.optimizedColors) &&
    JSON.stringify(prevProps.lawsInPlay) === JSON.stringify(nextProps.lawsInPlay) &&
    JSON.stringify(prevProps.exhaustedPlanets) === JSON.stringify(nextProps.exhaustedPlanets)
  );
});

const MAP_PADDING = 200;

export function TileContainer({
  playerData,
  data,
  tilePositions,
  systemIdToPosition,
  factionToColor,
  optimizedColors,
  settings,
  lawsInPlay,
  allExhaustedPlanets,
  vpsToWin,
  ringCount,
  stableHandlers,
  isFirefox,
  zoom,
  classes,
}: {
  playerData: any[] | undefined;
  data: any;
  tilePositions: any[] | undefined;
  systemIdToPosition: Record<string, any>;
  factionToColor: Record<string, string>;
  optimizedColors: Record<string, RGBColor>;
  settings: any;
  lawsInPlay: any[] | undefined;
  allExhaustedPlanets: any[] | undefined;
  vpsToWin: number;
  ringCount: number;
  stableHandlers: any;
  isFirefox: boolean;
  zoom: number;
  classes: any;
}) {
  const tileRenderingStyle = useMemo(() => ({
    ...(isFirefox ? {} : { zoom: zoom }),
    MozTransform: `scale(${zoom})`,
    MozTransformOrigin: "top left",
    top: MAP_PADDING / zoom,
    left: MAP_PADDING / zoom,
  }), [isFirefox, zoom]);

  return (
    <Box
      className={classes.tileRenderingContainer}
      style={tileRenderingStyle}
    >
      {/* Render stat tiles for each faction */}
      {playerData &&
        data?.statTilePositions &&
        Object.entries(data.statTilePositions).map(
          ([faction, statTiles]) => {
            const player = playerData.find(
              (p) => p.faction === faction
            );
            if (!player) return null;

            return (
              <MemoizedPlayerStatsArea
                key={faction}
                faction={faction}
                playerData={player as any}
                statTilePositions={statTiles as string[]}
                color={factionToColor[faction]}
                vpsToWin={vpsToWin}
                factionToColor={factionToColor}
                ringCount={ringCount}
              />
            );
          }
        )}
      {/* Render tiles */}
      {tilePositions && tilePositions.map((tile, index) => {
        const tileKey = `${tile.systemId}-${index}`;
        const position = systemIdToPosition[tile.systemId];
        const tileData =
          position && data?.tileUnitData
            ? (data.tileUnitData as any)[position]
            : undefined;

        return (
          <MemoizedMapTile
            key={tileKey}
            ringPosition={tile.ringPosition}
            systemId={tile.systemId}
            position={{ x: tile.x, y: tile.y }}
            tileUnitData={tileData}
            factionToColor={factionToColor}
            optimizedColors={optimizedColors}
            onUnitMouseOver={stableHandlers.handleUnitMouseEnter}
            onUnitMouseLeave={stableHandlers.handleUnitMouseLeave}
            onUnitSelect={stableHandlers.handleMouseDown}
            onPlanetHover={stableHandlers.handlePlanetMouseEnter}
            onPlanetMouseLeave={stableHandlers.handlePlanetMouseLeave}
            techSkipsMode={settings.techSkipsMode}
            overlaysEnabled={settings.overlaysEnabled}
            lawsInPlay={lawsInPlay}
            exhaustedPlanets={allExhaustedPlanets}
            alwaysShowControlTokens={
              settings.alwaysShowControlTokens
            }
            showExhaustedPlanets={settings.showExhaustedPlanets}
          />
        );
      })}
    </Box>
  );
}

export const MemoizedTileContainer = React.memo(TileContainer, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.tilePositions) === JSON.stringify(nextProps.tilePositions) &&
    JSON.stringify(prevProps.systemIdToPosition) === JSON.stringify(nextProps.systemIdToPosition) &&
    JSON.stringify(prevProps.factionToColor) === JSON.stringify(nextProps.factionToColor) &&
    JSON.stringify(prevProps.optimizedColors) === JSON.stringify(nextProps.optimizedColors) &&
    JSON.stringify(prevProps.lawsInPlay) === JSON.stringify(nextProps.lawsInPlay) &&
    JSON.stringify(prevProps.allExhaustedPlanets) === JSON.stringify(nextProps.allExhaustedPlanets) &&
    prevProps.settings.techSkipsMode === nextProps.settings.techSkipsMode &&
    prevProps.settings.overlaysEnabled === nextProps.settings.overlaysEnabled &&
    prevProps.settings.alwaysShowControlTokens === nextProps.settings.alwaysShowControlTokens &&
    prevProps.settings.showExhaustedPlanets === nextProps.settings.showExhaustedPlanets &&
    prevProps.vpsToWin === nextProps.vpsToWin &&
    prevProps.ringCount === nextProps.ringCount &&
    prevProps.zoom === nextProps.zoom &&
    prevProps.isFirefox === nextProps.isFirefox &&
    JSON.stringify(prevProps.playerData) === JSON.stringify(nextProps.playerData) &&
    JSON.stringify(prevProps.data?.statTilePositions) === JSON.stringify(nextProps.data?.statTilePositions) &&
    JSON.stringify(prevProps.data?.tileUnitData) === JSON.stringify(nextProps.data?.tileUnitData)
  );
});