import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import classes from "@/components/MapUI.module.css";
import { LeftSidebar } from "@/components/main/LeftSidebar";
import { ZoomControls } from "@/components/ZoomControls";
import { DragHandle } from "@/components/DragHandle";
import { PanelToggleButton } from "@/components/PanelToggleButton";
import { RightSidebar } from "@/components/main/RightSidebar";
import { MapTile } from "@/components/Map/MapTile";
import { PathVisualization } from "@/components/PathVisualization";
import { MapPlanetDetailsCard } from "@/components/main/MapPlanetDetailsCard";
import { MapUnitDetailsCard } from "@/components/main/MapUnitDetailsCard";
import { useSidebarDragHandle } from "@/hooks/useSidebarDragHandle";
import { useDistanceRendering } from "@/hooks/useDistanceRendering";
import { useZoom } from "@/hooks/useZoom";
import { useMapScrollPosition } from "@/hooks/useMapScrollPosition";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTabsAndTooltips } from "@/hooks/useTabsAndTooltips";
import { useGameData, useGameDataState } from "@/hooks/useGameContext";
import { useSettingsStore } from "@/utils/appStore";
import { ReadyState } from "react-use-websocket";
// Local constant to avoid circular imports
const MAP_PADDING = 200;

type Props = {
  gameId: string;
};

export function MapView({ gameId }: Props) {
  const gameData = useGameData();
  const gameDataState = useGameDataState();

  const {
    selectedArea,
    activeArea,
    selectedFaction,
    activeUnit,
    tooltipUnit,
    handleAreaSelect,
    handleAreaMouseEnter,
    handleAreaMouseLeave,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
  } = useTabsAndTooltips();

  const [tooltipPlanet, setTooltipPlanet] = useState<{
    planetId: string;
    coords: { x: number; y: number };
  } | null>(null);

  const handlePlanetMouseEnter = useCallback(
    (planetId: string, x: number, y: number) => {
      setTooltipPlanet({ planetId, coords: { x, y } });
    },
    []
  );

  const handlePlanetMouseLeave = () => setTooltipPlanet(null);

  const handleUnitMouseEnter = (
    faction: string,
    unitId: string,
    x: number,
    y: number
  ) => {
    setTooltipPlanet(null);
    handleMouseEnter(faction, unitId, x, y);
  };

  const handleUnitMouseLeave = () => handleMouseLeave();

  const { sidebarWidth, isDragging, handleSidebarMouseDown } =
    useSidebarDragHandle(30);

  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);

  const {
    selectedTiles,
    pathResult,
    hoveredTile,
    systemsOnPath,
    activePathIndex,
    handleTileSelect,
    handleTileHover,
    handlePathIndexChange,
  } = useDistanceRendering({
    distanceMode: settings.distanceMode,
    mapTiles: gameData?.mapTiles || [],
  });

  const {
    zoom,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleZoomScreenSize,
  } = useZoom(undefined, undefined);

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

  const showLeftPanelToggle = useMemo(() => {
    if (!gameData) return false;
    if (gameData.objectives) return true;
    return !!(gameData.lawsInPlay && gameData.lawsInPlay.length > 0);
  }, [gameData]);

  return (
    <Box className={classes.mapContainer}>
      {/* Map Container - Full Width */}
      <Box
        ref={mapContainerRef}
        className={`dragscroll ${classes.mapArea}`}
        style={{
          width: settings.rightPanelCollapsed
            ? "100%"
            : `${100 - sidebarWidth}%`,
        }}
      >
        <LeftSidebar />

        {/* Left Panel Toggle Button */}
        {showLeftPanelToggle && (
          <PanelToggleButton
            isCollapsed={settings.leftPanelCollapsed}
            onClick={handlers.toggleLeftPanelCollapsed}
            position="left"
          />
        )}

        <div
          className={classes.zoomControlsDynamic}
          style={{
            right: settings.rightPanelCollapsed
              ? "35px"
              : `calc(${sidebarWidth}vw + 35px)`,
            transition: isDragging ? "none" : "right 0.1s ease",
          }}
        >
          <ZoomControls
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomReset={handleZoomReset}
            onZoomScreenSize={handleZoomScreenSize}
            zoomClass=""
          />
        </div>

        {/* Tile-based rendering */}
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
            >
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
              {/* Render tiles */}

              {gameData.mapTiles?.map((tile, index) => {
                return (
                  <MapTile
                    key={`${tile.systemId}-${index}`}
                    mapTile={tile}
                    selectedTiles={selectedTiles}
                    isOnPath={systemsOnPath.has(tile.systemId)}
                    hoveredTilePosition={hoveredTile}
                    onUnitMouseOver={handleUnitMouseEnter}
                    onUnitMouseLeave={handleUnitMouseLeave}
                    onUnitSelect={handleMouseDown}
                    onPlanetMouseEnter={handlePlanetMouseEnter}
                    onPlanetMouseLeave={handlePlanetMouseLeave}
                    onTileSelect={handleTileSelect}
                    onTileHover={handleTileHover}
                  />
                );
              })}
            </Box>

            <PathVisualization
              pathResult={pathResult}
              tilePositions={gameData.calculatedTilePositions}
              zoom={zoom}
              activePathIndex={activePathIndex}
              onPathIndexChange={handlePathIndexChange}
              mapPadding={MAP_PADDING}
            />

            <MapUnitDetailsCard tooltipUnit={tooltipUnit} zoom={zoom} />

            <MapPlanetDetailsCard tooltipPlanet={tooltipPlanet} zoom={zoom} />
          </>
        )}

        {/* Reconnect button when disconnected */}
        {gameDataState?.readyState === ReadyState.CLOSED && (
          <Button
            variant="filled"
            size="md"
            radius="xl"
            leftSection={<IconRefresh size={20} />}
            style={{
              position: "fixed",
              top: "80px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
            }}
            onClick={gameDataState?.reconnect}
            loading={gameDataState?.isReconnecting}
          >
            Refresh
          </Button>
        )}
      </Box>

      <DragHandle onMouseDown={handleSidebarMouseDown} />

      <PanelToggleButton
        isCollapsed={settings.rightPanelCollapsed}
        onClick={handlers.toggleRightPanelCollapsed}
        position="right"
        style={{
          right: settings.rightPanelCollapsed
            ? "10px"
            : `calc(${sidebarWidth}vw + 14px)`,
          transition: isDragging ? "none" : "right 0.1s ease",
        }}
      />

      <RightSidebar
        isRightPanelCollapsed={settings.rightPanelCollapsed}
        sidebarWidth={sidebarWidth}
        selectedArea={selectedArea}
        activeArea={activeArea}
        selectedFaction={selectedFaction}
        activeUnit={activeUnit}
        onAreaSelect={handleAreaSelect}
        onAreaMouseEnter={handleAreaMouseEnter}
        onAreaMouseLeave={handleAreaMouseLeave}
        gameId={gameId}
      />
    </Box>
  );
}

// Local import to avoid circular dependency issues
import { PlayerStatsArea } from "@/components/Map/PlayerStatsArea";
