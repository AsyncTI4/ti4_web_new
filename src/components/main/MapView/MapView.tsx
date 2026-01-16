import { useMemo, useState, useEffect } from "react";
import { Box } from "@mantine/core";
import classes from "@/components/MapUI.module.css";
import { LeftSidebar } from "@/components/main/LeftSidebar";
import { DragHandle } from "@/components/DragHandle";
import { PanelToggleButton } from "@/components/PanelToggleButton";
import { RightSidebar } from "@/components/main/RightSidebar";
import { PathVisualization } from "@/components/PathVisualization";
import { MapPlanetDetailsCard } from "@/components/main/MapPlanetDetailsCard";
import { MapUnitDetailsCard } from "@/components/main/MapUnitDetailsCard";
import { useSidebarDragHandle } from "@/hooks/useSidebarDragHandle";
import { useDistanceRendering } from "@/hooks/useDistanceRendering";
import { useMapScrollPosition } from "@/hooks/useMapScrollPosition";
import { useScrollToPlanet } from "@/hooks/useScrollToPlanet";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTabsAndTooltips } from "@/hooks/useTabsAndTooltips";
import { useGameData, useGameDataState } from "@/hooks/useGameContext";
import { MovementModeBox } from "./MovementModeBox";
import { useAppStore, useSettingsStore } from "@/utils/appStore";
import ZoomControls from "@/components/ZoomControls";
import { useMovementMode } from "./hooks/useMovementMode";
import { useMapTooltips } from "./hooks/useMapTooltips";
import { MovementModals } from "./components/MovementModals";
import { ReconnectButton } from "./components/ReconnectButton";
import { MapTilesRenderer } from "./components/MapTilesRenderer";
import { ExpeditionLayer } from "@/components/Map/ExpeditionLayer";
import { useMapContentSize } from "./hooks/useMapContentSize";
import { TryUnitDecalsSidebar } from "@/components/TryUnitDecalsSidebar";

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

  const tilesList = useMemo(
    () => Object.values(gameData?.tiles || {}),
    [gameData?.tiles]
  );

  const {
    draft,
    targetSystemId,
    showAuthModal,
    setShowAuthModal,
    originModalOpen,
    setOriginModalOpen,
    showSuccessModal,
    setShowSuccessModal,
    activeOrigin,
    handleResetMovement,
    handleCancelMovement,
    createTileSelectHandler,
  } = useMovementMode();

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

  const { mapContainerRef } = useMapScrollPosition({
    zoom,
    gameId,
  });

  useScrollToPlanet({
    mapContainerRef,
    zoom,
  });

  useKeyboardShortcuts({
    toggleOverlays: handlers.toggleOverlays,
    toggleTechSkipsMode: handlers.toggleTechSkipsMode,
    togglePlanetTypesMode: handlers.togglePlanetTypesMode,
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

  const contentSize = useMapContentSize();

  const [tryDecalsOpened, setTryDecalsOpened] = useState(false);

  // Listen for the toggleTryDecals event
  useEffect(() => {
    const handleToggleTryDecals = () => {
      setTryDecalsOpened((prev) => !prev);
    };
    window.addEventListener("toggleTryDecals", handleToggleTryDecals);
    return () => {
      window.removeEventListener("toggleTryDecals", handleToggleTryDecals);
    };
  }, []);

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
              <MapTilesRenderer
                tiles={tilesList}
                playerData={gameData.playerData}
                statTilePositions={gameData.statTilePositions}
                isMovingMode={!!draft.targetPositionId}
                isOrigin={(position) => !!draft.origins?.[position]}
                selectedTiles={Array.from(selectedTiles)}
                isOnPath={(systemId) =>
                  targetSystemId ? true : systemsOnPath.has(systemId)
                }
                isTargetSelected={(systemId) =>
                  targetSystemId ? systemId === targetSystemId : false
                }
                hoveredTilePosition={hoveredTile}
                onUnitMouseOver={handleUnitMouseEnter}
                onUnitMouseLeave={handleUnitMouseLeave}
                onUnitSelect={(faction) => handleMouseDown(faction)}
                onPlanetMouseEnter={handlePlanetMouseEnter}
                onPlanetMouseLeave={handlePlanetMouseLeave}
                onTileSelect={createTileSelectHandler(handleTileSelect)}
                onTileHover={handleTileHover}
              />
              <ExpeditionLayer contentSize={contentSize} />
            </Box>

            {!draft.targetPositionId && (
              <PathVisualization
                pathResult={pathResult}
                activePathIndex={activePathIndex}
                onPathIndexChange={handlePathIndexChange}
              />
            )}

            <MapUnitDetailsCard tooltipUnit={tooltipUnit} />

            <MapPlanetDetailsCard tooltipPlanet={tooltipPlanet} />
          </>
        )}

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

      {/* Movement Mode Box (bottom-left) */}
      {draft.targetPositionId && (
        <MovementModeBox
          gameId={gameId}
          onCancel={handleCancelMovement}
          onReset={handleResetMovement}
          onSuccess={() => setShowSuccessModal(true)}
        />
      )}

      <MovementModals
        showAuthModal={showAuthModal}
        onCloseAuthModal={() => setShowAuthModal(false)}
        showSuccessModal={showSuccessModal}
        onCloseSuccessModal={() => setShowSuccessModal(false)}
        originModalOpen={originModalOpen}
        onCloseOriginModal={() => setOriginModalOpen(false)}
        activeOrigin={activeOrigin}
        tiles={tilesList}
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

      <TryUnitDecalsSidebar
        opened={tryDecalsOpened}
        onClose={() => setTryDecalsOpened(false)}
      />
    </Box>
  );
}
