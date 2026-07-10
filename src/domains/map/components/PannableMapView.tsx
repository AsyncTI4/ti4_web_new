import { useMemo, useRef, type RefObject } from "react";
import { Box, Stack, Text } from "@mantine/core";
import classes from "@/shared/ui/map/MapUI.module.css";
import { InteractiveMapRenderer } from "./components/InteractiveMapRenderer";
import { useDistanceRendering } from "@/hooks/useDistanceRendering";
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
import { SecretHand } from "@/domains/game-shell/components/SecretHand";
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
import { useSecretHandPanel } from "@/hooks/useSecretHandPanel";
import { DISABLE_PLAYER_AREA_RENDERING } from "@/utils/renderDebugFlags";
import { useScrollToReplayHighlight } from "@/hooks/useScrollToReplayHighlight";

type Props = {
  gameId: string;
};

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
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);

  const mapLayout = getMapLayoutConfig("pannable");
  const contentSize = useMapContentSize("pannable");
  const zoom = computeMapZoom(storeZoom, contentSize.width + 150);
  const unscaledMapWidth = contentSize.width + mapLayout.mapWidthExtra;
  const unscaledMapHeight = contentSize.height;
  const mapWidth = unscaledMapWidth * zoom;
  const mapHeight = unscaledMapHeight * zoom;
  const hideZoomControls = shouldHideZoomControls();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const movementState = useMovementMode();
  const { draft, targetSystemId, createTileSelectHandler } = movementState;
  const {
    canViewSecretHand,
    userDiscordId,
    handData,
    isHandLoading,
    handError,
  } = useSecretHandPanel({ gameId, playerData: gameData?.playerData });

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

  useMapKeyboardShortcuts({
    handlers,
    settings,
    handleZoomIn,
    handleZoomOut,
    handleAreaSelect,
    selectedArea,
  });

  const { tryDecalsOpened, setTryDecalsOpened } = useTryDecalsToggle();

  const areaStyles = isMobile
    ? {
        width: "1300px",
      }
    : {
        minWidth: "2150px",
        padding: "0 16px",
      };
  const scoreSummaryAreaStyles = {
    ...areaStyles,
    marginTop: "8px",
  };

  /* Player cards grow to their content width (no internal scrollbars);
     the surrounding map area provides the horizontal scrolling */
  const playerAreaStyles = isMobile
    ? { width: "max-content" as const, minWidth: "1300px" }
    : { width: "max-content" as const, minWidth: "2150px", padding: "0 16px" };
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
        <FloatingMapToolbar
          rightOffset="35px"
          cardsPanel={
            !DISABLE_PLAYER_AREA_RENDERING && canViewSecretHand ? (
              <SecretHand
                isCollapsed={false}
                onToggle={() => {}}
                hideHeader
                handData={handData}
                isLoading={isHandLoading}
                error={handError}
                playerData={gameData?.playerData}
                activeArea={null}
                userDiscordId={userDiscordId ?? undefined}
              />
            ) : undefined
          }
        />
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
            <ZoomControls zoomClass="" hideFitToScreen />
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
              styleOverrides={{
                marginLeft: "auto",
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

          </>
        )}

        {gameData && (
          <ScaledContent
            zoom={computePanelsZoom()}
            innerStyle={areaStyles}
            enabled={isMobile}
          >
            <Stack gap="md">
              {gameData.gameName && (
                <Box>
                  <Text size="lg" c="gray.1" fw={600}>
                    {gameData.gameName}
                    {gameData.gameCustomName && ` - ${gameData.gameCustomName}`}
                  </Text>
                  <Text size="md" c="gray.3">
                    Round {gameData.gameRound}
                  </Text>
                </Box>
              )}

              <ScoreTracker
                playerData={gameData.playerData}
                vpsToWin={gameData.vpsToWin || 10}
              />

              <ExpandedPublicObjectives
                objectives={gameData.objectives}
                playerData={gameData.playerData}
                lawsInPlay={gameData.lawsInPlay}
              />
            </Stack>
          </ScaledContent>
        )}

        {!DISABLE_PLAYER_AREA_RENDERING && (
          <ScaledContent
            zoom={computePanelsZoom()}
            innerStyle={playerAreaStyles}
            enabled={isMobile}
          >
            {/* Column stack: width resolves to the widest card so every card
                shares the same width and data groups align vertically */}
            <Stack gap={4} style={{ width: "max-content", minWidth: "100%" }}>
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
          >
            <PlayerScoreSummary
              playerData={gameData.playerData}
              objectives={gameData.objectives}
            />
          </ScaledContent>
        )}
        <div style={{ height: "50px", width: "100%" }} />

        <ReconnectButton gameDataState={gameDataState} />
      </Box>

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
