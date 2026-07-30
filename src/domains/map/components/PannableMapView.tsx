import {
  useCallback,
  useMemo,
  useRef,
  type CSSProperties,
  type RefObject,
} from "react";
import { Box, Group, Stack, Text } from "@mantine/core";
import classes from "@/shared/ui/map/MapUI.module.css";
import { InteractiveMapRenderer } from "./components/InteractiveMapRenderer";
import { useDistanceRendering } from "@/hooks/useDistanceRendering";
import { useDragScroll } from "@/hooks/useDragScroll";
import { useTabsAndTooltips } from "@/hooks/useTabsAndTooltips";
import { useGameData, useGameDataState } from "@/hooks/useGameContext";
import { useAppStore, useSettingsStore } from "@/utils/appStore";
import ZoomControls from "@/shared/ui/map/ZoomControls";
import { ScoreTracker } from "@/domains/objectives/components";
import ExpandedPublicObjectives from "@/domains/objectives/components/PublicObjectives/ExpandedPublicObjectives";
import { useMapContentSize } from "./hooks/useMapContentSize";
import {
  shouldHideZoomControls,
  computeMapZoom,
  computePanelsZoom,
} from "@/utils/zoom";
import { isMobileDevice } from "@/utils/isTouchDevice";
import PlayerCardMobile from "@/domains/player/components/composition/PlayerCardMobile";
import { FloatingMapToolbar } from "@/domains/game-shell/components/FloatingMapToolbar";
import { GameStatePanel } from "@/domains/game-shell/components/GameStatePanel";
import { PlayerScoreSummary } from "@/domains/objectives/components/PlayerScoreSummary/PlayerScoreSummary";
import { useMovementMode } from "./hooks/useMovementMode";
import { useMapTooltips } from "./hooks/useMapTooltips";
import { ReconnectButton } from "./components/ReconnectButton";
import { ScaledContent } from "@/shared/ui/ScaledContent";
import { getMapLayoutConfig } from "./mapLayout";
import { useMapKeyboardShortcuts } from "./hooks/useMapKeyboardShortcuts";
import { filterPlayersWithAssignedFaction } from "@/utils/playerUtils";
import { useTryDecalsToggle } from "./hooks/useTryDecalsToggle";
import { MovementLayerPortal } from "./components/MovementLayerPortal";
import { DISABLE_PLAYER_AREA_RENDERING } from "@/utils/renderDebugFlags";
import { useScrollToReplayHighlight } from "@/hooks/useScrollToReplayHighlight";
import Caption from "@/shared/ui/Caption/Caption";

type Props = {
  gameId: string;
};

/** DESIGN.md's stated gap between the board's outermost paint and the chrome. */
const BOARD_CLEARANCE = 20;

function ReplayAutoScroll({
  mapContainerRef,
}: {
  mapContainerRef: RefObject<HTMLDivElement | null>;
}) {
  useScrollToReplayHighlight(mapContainerRef);
  return null;
}

export function PannableMapView({ gameId }: Props) {
  const isMobile = isMobileDevice();
  const gameData = useGameData();
  const tilesList = useMemo(
    () => Object.values(gameData?.tiles || {}),
    [gameData?.tiles],
  );
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
  const handleZoomFitToWidth = useAppStore((state) => state.handleZoomFitToWidth);
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);

  const mapLayout = getMapLayoutConfig("pannable");
  const contentSize = useMapContentSize("pannable");
  const zoom = computeMapZoom(storeZoom, contentSize.width + 150);
  const unscaledMapWidth = contentSize.width + mapLayout.mapWidthExtra;
  const unscaledMapHeight = contentSize.height;
  const mapWidth = unscaledMapWidth * zoom;
  const mapHeight = unscaledMapHeight * zoom;
  const scaledBleed = {
    top: contentSize.bleed.top * zoom,
    right: contentSize.bleed.right * zoom,
    bottom: contentSize.bleed.bottom * zoom,
    left: contentSize.bleed.left * zoom,
  };
  const hideZoomControls = shouldHideZoomControls();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  /* The board's painted extent, including the overlay bleed the wrapper excludes. */
  const paintedBoardWidth =
    unscaledMapWidth + contentSize.bleed.left + contentSize.bleed.right;

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
      paintedBoardWidth,
      area.clientWidth - BOARD_CLEARANCE * 2,
    );
    requestAnimationFrame(() => {
      const boardCentre = BOARD_CLEARANCE + (paintedBoardWidth * fitZoom) / 2;
      area.scrollTo({
        left: Math.max(0, boardCentre - area.clientWidth / 2),
        top: 0,
        behavior: "smooth",
      });
    });
  };

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
    distanceMode: isMobile ? false : settings.distanceMode,
    tiles: tilesList,
  });
  const isMovementOrigin = useCallback(
    (position: string) => !!draft.origins?.[position],
    [draft.origins],
  );
  const handleMapTileSelect = useMemo(
    () => createTileSelectHandler(handleTileSelect),
    [createTileSelectHandler, handleTileSelect],
  );

  useMapKeyboardShortcuts({
    handlers,
    settings,
    handleZoomIn,
    handleZoomOut,
    handleAreaSelect,
    selectedArea,
  });

  const { tryDecalsOpened, setTryDecalsOpened } = useTryDecalsToggle();

  const contentWidth = isMobile ? "1300px" : "2150px";

  /* Horizontal padding now belongs to the bottom deck's sections, so every
     block inside it lines up on one margin instead of setting its own. */
  const areaStyles = isMobile
    ? { width: contentWidth }
    : { minWidth: contentWidth };
  const scoreSummaryAreaStyles = areaStyles;

  /* Player cards grow to their content width (no internal scrollbars);
     the surrounding map area provides the horizontal scrolling */
  /* No width:max-content here — the deck stretches every section to one shared
     width, and the inner Stack already makes the cards equal to the widest. */
  const playerAreaStyles = {
    minWidth: contentWidth,
  };
  const showGameStatePanel = !isMobile;
  const showFloatingMapToolbar = !isMobile;

  return (
    <Box className={classes.mapContainer}>
      {!isMobile && <ReplayAutoScroll mapContainerRef={mapContainerRef} />}
      {showGameStatePanel && (
        <Box className={classes.gameStateOverlay}>
          <GameStatePanel />
        </Box>
      )}
      {showFloatingMapToolbar && (
        <FloatingMapToolbar gameId={gameId} rightOffset="35px" />
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
          <>
            <InteractiveMapRenderer
              layout="pannable"
              mapLayoutConfig={mapLayout}
              zoom={zoom}
              isFirefox={settings.isFirefox}
              contentSize={contentSize}
              layoutWidthOverride={mapWidth}
              layoutHeightOverride={mapHeight}
              widthOverride={unscaledMapWidth}
              heightOverride={unscaledMapHeight}
              /*
               * Reserve only the overflow this game's coordinates can paint.
               * Stat tiles can live outside the regular tile grid, but most maps
               * have no top/left overflow at all; a fixed worst-case reserve grew
               * into hundreds of empty pixels at larger zoom levels.
               *
               * When the complete painted width fits, centre it. Otherwise keep
               * its left edge reachable with the standard board clearance.
               */
              styleOverrides={{
                marginTop: scaledBleed.top + BOARD_CLEARANCE,
                marginLeft: `max(${
                  scaledBleed.left + BOARD_CLEARANCE
                }px, calc((100% - ${mapWidth}px + ${scaledBleed.left}px - ${
                  scaledBleed.right
                }px) / 2))`,
                marginRight: "auto",
              }}
              gameData={gameData}
              tilesList={tilesList}
              hoveredTilePosition={hoveredTile}
              selectedTiles={selectedTiles}
              systemsOnPath={systemsOnPath}
              targetSystemId={targetSystemId}
              pathResult={pathResult}
              activePathIndex={activePathIndex}
              showPathVisualization={!draft.targetPositionId}
              onPathIndexChange={handlePathIndexChange}
              isMovingMode={!!draft.targetPositionId}
              isOrigin={isMovementOrigin}
              onTileSelect={handleMapTileSelect}
              onTileHover={handleTileHover}
              onUnitMouseOver={handleUnitMouseEnter}
              onUnitMouseLeave={handleUnitMouseLeave}
              onUnitSelect={handleMouseDown}
              onPlanetMouseEnter={handlePlanetMouseEnter}
              onPlanetMouseLeave={handlePlanetMouseLeave}
              tooltipUnit={tooltipUnit}
              tooltipPlanet={tooltipPlanet}
            />

          </>
        )}

        {/* ---- Bottom HUD deck ---------------------------------------- */}
        <Box
          className={classes.bottomHud}
          style={
            {
              "--board-bleed-bottom": `${scaledBleed.bottom}px`,
            } as CSSProperties
          }
        >
          <Box className={classes.bottomHudBody}>
        {gameData && (
          <ScaledContent
            zoom={computePanelsZoom()}
            innerStyle={areaStyles}
            enabled={isMobile}
            className={classes.hudSection}
          >
            <Stack gap="md">
              <Group
                align="baseline"
                gap={12}
                wrap="nowrap"
                className={classes.hudTitle}
              >
                <Text span className={classes.hudRoundLabel}>
                  Round
                </Text>
                <Text span className={classes.hudRoundNumeral}>
                  {String(gameData.gameRound ?? 1).padStart(2, "0")}
                </Text>
                {gameData.gameName && (
                  <Text span className={classes.hudGameName}>
                    {gameData.gameName}
                    {gameData.gameCustomName &&
                      ` — ${gameData.gameCustomName}`}
                  </Text>
                )}
                <span className={classes.hudRule} />
              </Group>

              <Box className={classes.hudFitScreen}>
                <ScoreTracker
                  playerData={gameData.playerData}
                  vpsToWin={gameData.vpsToWin || 10}
                />
              </Box>

              <Box className={classes.hudFitScreen}>
                <ExpandedPublicObjectives
                  objectives={gameData.objectives}
                  playerData={gameData.playerData}
                  lawsInPlay={gameData.lawsInPlay}
                />
              </Box>
            </Stack>
          </ScaledContent>
        )}

        {!DISABLE_PLAYER_AREA_RENDERING && (
          <ScaledContent
            zoom={computePanelsZoom()}
            innerStyle={playerAreaStyles}
            enabled={isMobile}
            className={classes.hudSection}
          >
            {/* Column stack: width resolves to the widest card so every card
                shares the same width and data groups align vertically */}
            <Stack gap={4} style={{ width: "max-content", minWidth: "100%" }}>
              <Caption size="sm" rule mt={4}>
                Player Areas
              </Caption>
              {filterPlayersWithAssignedFaction(gameData?.playerData || []).map(
                (player) => (
                  <Box key={player.color}>
                    <PlayerCardMobile playerData={player} />
                  </Box>
                ),
              )}
            </Stack>
          </ScaledContent>
        )}

        {!DISABLE_PLAYER_AREA_RENDERING && gameData && (
          <ScaledContent
            zoom={computePanelsZoom()}
            innerStyle={scoreSummaryAreaStyles}
            enabled={isMobile}
            className={classes.hudSection}
          >
            <PlayerScoreSummary
              playerData={gameData.playerData}
              objectives={gameData.objectives}
            />
          </ScaledContent>
        )}
          </Box>
        </Box>
        {/* ---- end bottom HUD deck ------------------------------------ */}
      </Box>

      {/* Outside the scroller on purpose: dragscroll pans on any mousedown that
          reaches the map area, so a control inside it lurches the board out from
          under the cursor on the way to being clicked. */}
      <ReconnectButton gameDataState={gameDataState} />

      <MovementLayerPortal
        gameId={gameId}
        tiles={tilesList}
        movementState={movementState}
        tryDecalsOpened={tryDecalsOpened}
        setTryDecalsOpened={setTryDecalsOpened}
      />
    </Box>
  );
}
