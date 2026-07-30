import { useEffect, useMemo, useRef } from "react";
import { Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import classes from "@/shared/ui/map/MapUI.module.css";
import { LeftSidebar } from "@/domains/game-shell/components/LeftSidebar";
import { DragHandle } from "@/domains/game-shell/components/chrome/DragHandle";
import { PanelToggleButton } from "@/domains/game-shell/components/PanelToggleButton";
import { RightSidebar } from "@/domains/game-shell/components/RightSidebar";
import { InteractiveMapRenderer } from "./components/InteractiveMapRenderer";
import { useDragScroll } from "@/hooks/useDragScroll";
import { useSidebarDragHandle } from "@/hooks/useSidebarDragHandle";
import { useMapScrollPosition } from "@/hooks/useMapScrollPosition";
import { useScrollToPlanet } from "@/hooks/useScrollToPlanet";
import { useScrollToReplayHighlight } from "@/hooks/useScrollToReplayHighlight";
import { useTabsAndTooltips } from "@/hooks/useTabsAndTooltips";
import { useGameData, useGameDataState } from "@/hooks/useGameContext";
import { useAppStore, useSettingsStore } from "@/utils/appStore";
import ZoomControls from "@/shared/ui/map/ZoomControls";
import { useMapTooltips } from "./hooks/useMapTooltips";
import { ReconnectButton } from "./components/ReconnectButton";
import { useMapContentSize } from "./hooks/useMapContentSize";
import { useTryDecalsToggle } from "./hooks/useTryDecalsToggle";
import { useTilesList } from "@/hooks/useTilesList";
import { useMapKeyboardShortcuts } from "./hooks/useMapKeyboardShortcuts";
import { getMapLayoutConfig } from "./mapLayout";
import { filterPlayersWithAssignedFaction } from "@/utils/playerUtils";
import { FloatingMapToolbar } from "@/domains/game-shell/components/FloatingMapToolbar";
import { TryUnitDecalsSidebar } from "./TryUnitDecalsSidebar";

type Props = {
  gameId: string;
  embedded?: boolean;
  embeddedSidebar?: "left" | "right" | "none";
};

// Clears the 36px right-panel toggle at 165px with the toolbar's 8px gap.
const PANELS_TOOLBAR_TOP = 209;

export function MapView({
  gameId,
  embedded = false,
  embeddedSidebar = "left",
}: Props) {
  const gameData = useGameData();
  const gameDataState = useGameDataState();

  useDragScroll();

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
    useSidebarDragHandle(embedded ? 22 : 30);

  const zoom = useAppStore((state) => state.zoomLevel);
  const handleZoomIn = useAppStore((state) => state.handleZoomIn);
  const handleZoomOut = useAppStore((state) => state.handleZoomOut);
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);

  const tilesList = useTilesList(gameData?.tiles);

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
  useScrollToReplayHighlight(mapContainerRef);

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
  const isBelowEmbeddedSidebarBreakpoint = useMediaQuery("(max-width: 1300px)");
  const showEmbeddedRightSidebar =
    embedded && embeddedSidebar === "right" && !isBelowEmbeddedSidebarBreakpoint;
  const showLeftSidebar = !embedded || embeddedSidebar === "left";
  const showRightSidebar = !embedded || showEmbeddedRightSidebar;
  const embeddedRightSidebarWidth = `max(420px, ${sidebarWidth}%)`;
  const floatingControlsBaseRightOffset = embedded
    ? showEmbeddedRightSidebar
      ? embeddedRightSidebarWidth
      : "0px"
    : settings.rightPanelCollapsed
      ? "0px"
      : `${sidebarWidth}vw`;
  const floatingControlsRightOffset = `calc(${floatingControlsBaseRightOffset} + 35px)`;
  const hasAutoSelectedFactionRef = useRef(false);

  useEffect(() => {
    hasAutoSelectedFactionRef.current = false;
  }, [gameId]);

  useEffect(() => {
    if (!embedded || hasAutoSelectedFactionRef.current || selectedArea) {
      return;
    }
    const players = filterPlayersWithAssignedFaction(gameData?.playerData || []);
    const firstFaction = players[0]?.faction;
    if (!firstFaction) return;

    handleAreaSelect({
      type: "faction",
      faction: firstFaction,
      coords: { x: 0, y: 0 },
    });
    hasAutoSelectedFactionRef.current = true;
  }, [embedded, selectedArea, gameData?.playerData, handleAreaSelect]);

  return (
    <Box className={classes.mapContainer}>
      {/* Map Container - Full Width */}
      <Box
        ref={mapContainerRef}
        className={`dragscroll ${classes.mapArea}`}
        style={{
          width: embedded
            ? showEmbeddedRightSidebar
              ? `calc(100% - ${embeddedRightSidebarWidth})`
              : "100%"
            : settings.rightPanelCollapsed
              ? "100%"
              : `${100 - sidebarWidth}%`,
        }}
      >
        {showLeftSidebar && <LeftSidebar />}

        {!embedded && showLeftPanelToggle && (
          <PanelToggleButton
            isCollapsed={settings.leftPanelCollapsed}
            onClick={handlers.toggleLeftPanelCollapsed}
            position="left"
          />
        )}

        <div
          className={`${classes.zoomControlsDynamic} ${embedded ? classes.zoomControlsEmbedded : ""}`}
          style={{
            right: floatingControlsRightOffset,
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
          onUnitMouseOver={handleUnitMouseEnter}
          onUnitMouseLeave={handleUnitMouseLeave}
          onUnitSelect={handleMouseDown}
          onPlanetMouseEnter={handlePlanetMouseEnter}
          onPlanetMouseLeave={handlePlanetMouseLeave}
          tooltipUnit={tooltipUnit}
          tooltipPlanet={tooltipPlanet}
        />

      </Box>

      {/* Outside the scroller on purpose: dragscroll pans on any mousedown that
          reaches the map area, so a control inside it lurches the board out from
          under the cursor on the way to being clicked. */}
      <ReconnectButton gameDataState={gameDataState} />

      {!embedded && (
        <FloatingMapToolbar
          gameId={gameId}
          rightOffset={floatingControlsRightOffset}
          topOffset={PANELS_TOOLBAR_TOP}
          isDragging={isDragging}
        />
      )}

      {!embedded && <DragHandle onMouseDown={handleSidebarMouseDown} />}

      {!embedded && (
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
      )}

      {showRightSidebar && (
        <>
          <RightSidebar
            isRightPanelCollapsed={
              embedded ? false : settings.rightPanelCollapsed
            }
            sidebarWidth={embedded ? 0 : sidebarWidth}
            selectedArea={selectedArea}
            activeArea={activeArea}
            selectedFaction={selectedFaction}
            hasActiveUnit={activeUnit !== null}
            onAreaSelect={handleAreaSelect}
            onAreaMouseEnter={handleAreaMouseEnter}
            onAreaMouseLeave={handleAreaMouseLeave}
            gameId={gameId}
            embeddedWidth={showEmbeddedRightSidebar ? embeddedRightSidebarWidth : undefined}
          />
          <TryUnitDecalsSidebar
            opened={tryDecalsOpened}
            onClose={() => setTryDecalsOpened(false)}
          />
        </>
      )}
    </Box>
  );
}
