import { useRef, type RefObject } from "react";
import { Box } from "@mantine/core";
import classes from "@/shared/ui/map/MapUI.module.css";
import { InteractiveMapRenderer } from "./components/InteractiveMapRenderer";
import { useDragScroll } from "@/hooks/useDragScroll";
import { useTabsAndTooltips } from "@/hooks/useTabsAndTooltips";
import { useGameData, useGameDataState } from "@/hooks/useGameContext";
import { useAppStore, useSettingsStore } from "@/utils/appStore";
import ZoomControls from "@/shared/ui/map/ZoomControls";
import { useMapContentSize } from "./hooks/useMapContentSize";
import { useTilesList } from "@/hooks/useTilesList";
import { shouldHideZoomControls, computeMapZoom } from "@/utils/zoom";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { FloatingMapToolbar } from "@/domains/game-shell/components/FloatingMapToolbar";
import { GameStatePanel } from "@/domains/game-shell/components/GameStatePanel";
import { useMapTooltips } from "./hooks/useMapTooltips";
import { ReconnectButton } from "./components/ReconnectButton";
import { getMapLayoutConfig } from "./mapLayout";
import { useMapKeyboardShortcuts } from "./hooks/useMapKeyboardShortcuts";
import { useTryDecalsToggle } from "./hooks/useTryDecalsToggle";
import { useScrollToReplayHighlight } from "@/hooks/useScrollToReplayHighlight";
import { TryUnitDecalsSidebar } from "./TryUnitDecalsSidebar";
import { BoardHud } from "./BoardHud";

/** DESIGN.md's stated gap between the board's outermost paint and the chrome. */
const BOARD_CLEARANCE = 20;

type ContentSize = ReturnType<typeof useMapContentSize>;

/**
 * Scaled board extents and margins. Only the overflow this game's coordinates
 * can paint is reserved: stat tiles can sit outside the tile grid, but most
 * maps have no top/left overflow, and a fixed worst-case reserve grew into
 * hundreds of empty pixels at larger zooms. When the full painted width fits
 * it is centred; otherwise its left edge stays reachable with the standard
 * board clearance.
 */
function boardGeometry(
  contentSize: ContentSize,
  unscaledWidth: number,
  zoom: number,
) {
  const { bleed } = contentSize;
  const width = unscaledWidth * zoom;
  const bleedLeft = bleed.left * zoom;
  const bleedRight = bleed.right * zoom;
  return {
    unscaledWidth,
    unscaledHeight: contentSize.height,
    width,
    height: contentSize.height * zoom,
    bleedBottom: bleed.bottom * zoom,
    /** Painted extent including the overlay bleed the wrapper excludes. */
    paintedWidth: unscaledWidth + bleed.left + bleed.right,
    margins: {
      marginTop: bleed.top * zoom + BOARD_CLEARANCE,
      marginLeft: `max(${bleedLeft + BOARD_CLEARANCE}px, calc((100% - ${width}px + ${bleedLeft}px - ${bleedRight}px) / 2))`,
      marginRight: "auto",
    },
  };
}

function ReplayAutoScroll({
  mapContainerRef,
}: {
  mapContainerRef: RefObject<HTMLDivElement | null>;
}) {
  useScrollToReplayHighlight(mapContainerRef);
  return null;
}

export function PannableMapView({ gameId }: { gameId: string }) {
  const isMobile = isMobileDevice();
  const gameData = useGameData();
  const tilesList = useTilesList(gameData?.tiles);
  const gameDataState = useGameDataState();

  useDragScroll();

  const {
    selectedArea,
    tooltipUnit,
    handleAreaSelect,
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

  const storeZoom = useAppStore((state) => state.zoomLevel);
  const handleZoomIn = useAppStore((state) => state.handleZoomIn);
  const handleZoomOut = useAppStore((state) => state.handleZoomOut);
  const handleZoomFitToWidth = useAppStore(
    (state) => state.handleZoomFitToWidth,
  );
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);

  const mapLayout = getMapLayoutConfig("pannable");
  const contentSize = useMapContentSize("pannable");
  const zoom = computeMapZoom(storeZoom, contentSize.width + 150);
  const board = boardGeometry(
    contentSize,
    contentSize.width + mapLayout.mapWidthExtra,
    zoom,
  );
  const hideZoomControls = shouldHideZoomControls();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  /*
   * Fit the board to the viewport and put it back under the player's eyes.
   *
   * Zoom snaps to the existing ladder rather than taking the raw ratio: the +/-
   * buttons step by index, so an off-ladder value would make the next press jump.
   * Centring runs on the next frame because the fit changes the scroller's
   * content width first.
   */
  const handleFitBoard = () => {
    const area = mapContainerRef.current;
    if (!area) return;
    const fitZoom = handleZoomFitToWidth(
      board.paintedWidth,
      area.clientWidth - BOARD_CLEARANCE * 2,
    );
    requestAnimationFrame(() => {
      const boardCentre = BOARD_CLEARANCE + (board.paintedWidth * fitZoom) / 2;
      area.scrollTo({
        left: Math.max(0, boardCentre - area.clientWidth / 2),
        top: 0,
        behavior: "smooth",
      });
    });
  };

  useMapKeyboardShortcuts({
    handlers,
    settings,
    handleZoomIn,
    handleZoomOut,
    handleAreaSelect,
    selectedArea,
  });

  const { tryDecalsOpened, setTryDecalsOpened } = useTryDecalsToggle();

  return (
    <Box className={classes.mapContainer}>
      {!isMobile && (
        <>
          <ReplayAutoScroll mapContainerRef={mapContainerRef} />
          <Box className={classes.gameStateOverlay}>
            <GameStatePanel />
          </Box>
          <FloatingMapToolbar gameId={gameId} rightOffset="35px" />
        </>
      )}

      <Box
        ref={mapContainerRef}
        className={`dragscroll ${classes.mapArea}`}
        style={{ width: "100%" }}
      >
        {!hideZoomControls && (
          <div
            className={classes.zoomControlsDynamic}
            style={{ right: "35px" }}
          >
            <ZoomControls
              zoomClass=""
              hideFitToScreen
              onFitBoard={handleFitBoard}
            />
          </div>
        )}

        {gameData && (
          <InteractiveMapRenderer
            mapLayoutConfig={mapLayout}
            zoom={zoom}
            isFirefox={settings.isFirefox}
            contentSize={contentSize}
            layoutWidthOverride={board.width}
            layoutHeightOverride={board.height}
            widthOverride={board.unscaledWidth}
            heightOverride={board.unscaledHeight}
            styleOverrides={board.margins}
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
        )}

        <BoardHud
          gameData={gameData}
          bleedBottom={board.bleedBottom}
          isMobile={isMobile}
        />
      </Box>

      {/* Outside the scroller on purpose: dragscroll pans on any mousedown that
          reaches the map area, so a control inside it lurches the board out from
          under the cursor on the way to being clicked. */}
      <ReconnectButton gameDataState={gameDataState} />

      <TryUnitDecalsSidebar
        opened={tryDecalsOpened}
        onClose={() => setTryDecalsOpened(false)}
      />
    </Box>
  );
}
