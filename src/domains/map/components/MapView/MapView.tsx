import { useMemo } from "react";
import { Box } from "@mantine/core";
import classes from "@/shared/ui/map/MapUI.module.css";
import { LeftSidebar } from "@/domains/game-shell/components/main/LeftSidebar";
import { DragHandle } from "@/domains/game-shell/components/chrome/DragHandle";
import { PanelToggleButton } from "@/domains/game-shell/components/chrome/PanelToggleButton";
import { RightSidebar } from "@/domains/game-shell/components/main/RightSidebar";
import { InteractiveMapRenderer } from "./components/InteractiveMapRenderer";
import { useSidebarDragHandle } from "@/hooks/useSidebarDragHandle";
import { useDistanceRendering } from "@/hooks/useDistanceRendering";
import { useMapScrollPosition } from "@/hooks/useMapScrollPosition";
import { useScrollToPlanet } from "@/hooks/useScrollToPlanet";
import { useTabsAndTooltips } from "@/hooks/useTabsAndTooltips";
import { useGameData, useGameDataState } from "@/hooks/useGameContext";
import { useAppStore, useSettingsStore } from "@/utils/appStore";
import ZoomControls from "@/shared/ui/map/ZoomControls";
import { useMovementMode } from "./hooks/useMovementMode";
import { useMapTooltips } from "./hooks/useMapTooltips";
import { ReconnectButton } from "./components/ReconnectButton";
import { useMapContentSize } from "./hooks/useMapContentSize";
import { useTryDecalsToggle } from "./hooks/useTryDecalsToggle";
import { useTilesList } from "@/hooks/useTilesList";
import { useMapKeyboardShortcuts } from "./hooks/useMapKeyboardShortcuts";
import { getMapLayoutConfig } from "./mapLayout";
import { MovementLayerPortal } from "./components/MovementLayerPortal";

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

  const {
    tooltipPlanet,
    handlePlanetMouseEnter,
    handlePlanetMouseLeave,
    handleUnitMouseEnter,
    handleUnitMouseLeave,
  } = useMapTooltips(handleMouseEnter, handleMouseLeave);

  const { sidebarWidth, isDragging, handleSidebarMouseDown } =
    useSidebarDragHandle(30);

  const zoom = useAppStore((state) => state.zoomLevel);
  const handleZoomIn = useAppStore((state) => state.handleZoomIn);
  const handleZoomOut = useAppStore((state) => state.handleZoomOut);
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);

  const tilesList = useTilesList(gameData?.tiles);

  const movementState = useMovementMode();
  const { draft, targetSystemId, createTileSelectHandler } = movementState;

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
    tiles: tilesList,
  });
  const selectedTileList = useMemo(
    () => Array.from(selectedTiles),
    [selectedTiles]
  );

  const mapLayout = getMapLayoutConfig("panels");
  const { mapContainerRef } = useMapScrollPosition({
    zoom,
    gameId,
    mapPadding: mapLayout.mapPadding,
  });

  useScrollToPlanet({
    mapContainerRef,
    zoom,
  });

  useMapKeyboardShortcuts({
    handlers,
    settings,
    handleZoomIn,
    handleZoomOut,
    handleAreaSelect,
    selectedArea,
  });

  const showLeftPanelToggle = useMemo(() => {
    if (!gameData) return false;
    if (gameData.objectives) return true;
    return !!(gameData.lawsInPlay && gameData.lawsInPlay.length > 0);
  }, [gameData]);

  const contentSize = useMapContentSize("panels");

  const { tryDecalsOpened, setTryDecalsOpened } = useTryDecalsToggle();

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
          <ZoomControls zoomClass="" hideFitToScreen />
        </div>

        <InteractiveMapRenderer
          layout="panels"
          mapLayoutConfig={mapLayout}
          zoom={zoom}
          isFirefox={settings.isFirefox}
          contentSize={contentSize}
          gameData={gameData}
          tilesList={tilesList}
          hoveredTilePosition={hoveredTile}
          selectedTiles={selectedTileList}
          systemsOnPath={systemsOnPath}
          targetSystemId={targetSystemId}
          pathResult={pathResult}
          activePathIndex={activePathIndex}
          showPathVisualization={!draft.targetPositionId}
          onPathIndexChange={handlePathIndexChange}
          isMovingMode={!!draft.targetPositionId}
          isOrigin={(position) => !!draft.origins?.[position]}
          onTileSelect={createTileSelectHandler(handleTileSelect)}
          onTileHover={handleTileHover}
          onUnitMouseOver={handleUnitMouseEnter}
          onUnitMouseLeave={handleUnitMouseLeave}
          onUnitSelect={handleMouseDown}
          onPlanetMouseEnter={handlePlanetMouseEnter}
          onPlanetMouseLeave={handlePlanetMouseLeave}
          tooltipUnit={tooltipUnit}
          tooltipPlanet={tooltipPlanet}
        />

        <ReconnectButton gameDataState={gameDataState} />
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

      <MovementLayerPortal
        gameId={gameId}
        tiles={tilesList}
        movementState={movementState}
        tryDecalsOpened={tryDecalsOpened}
        setTryDecalsOpened={setTryDecalsOpened}
      >
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
      </MovementLayerPortal>
    </Box>
  );
}
