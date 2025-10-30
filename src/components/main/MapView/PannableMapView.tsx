import { useMemo, useState } from "react";
import { Box, Grid, Stack, Text } from "@mantine/core";
import classes from "@/components/MapUI.module.css";
import { PathVisualization } from "@/components/PathVisualization";
import { MapPlanetDetailsCard } from "@/components/main/MapPlanetDetailsCard";
import { MapUnitDetailsCard } from "@/components/main/MapUnitDetailsCard";
import { useDistanceRendering } from "@/hooks/useDistanceRendering";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTabsAndTooltips } from "@/hooks/useTabsAndTooltips";
import { useGameData, useGameDataState } from "@/hooks/useGameContext";
import { useUser } from "@/hooks/useUser";
import { MovementModeBox } from "./MovementModeBox";
import { useAppStore, useSettingsStore } from "@/utils/appStore";
import ZoomControls from "@/components/ZoomControls";
import { ScoreTracker } from "@/components/Objectives";
import ExpandedPublicObjectives from "@/components/Objectives/PublicObjectives/ExpandedPublicObjectives";
import { TILE_HEIGHT, TILE_WIDTH } from "@/mapgen/tilePositioning";
import {
  shouldHideZoomControls,
  computeMapZoom,
  getScaleStyle,
  computePanelsZoom,
} from "@/utils/zoom";
import { isMobileDevice } from "@/utils/isTouchDevice";
import PlayerCardMobile from "@/components/PlayerCardMobile";
import { SecretHand } from "@/components/main/SecretHand";
import { usePlayerHand } from "@/hooks/usePlayerHand";
import secretHandClasses from "@/components/main/SecretHand/SecretHand.module.css";
import { PlayerScoreSummary } from "@/components/Objectives/PlayerScoreSummary/PlayerScoreSummary";
import { ExpeditionLayer } from "@/components/Map/ExpeditionLayer";
import { useMovementMode } from "./hooks/useMovementMode";
import { useMapTooltips } from "./hooks/useMapTooltips";
import { MovementModals } from "./components/MovementModals";
import { ReconnectButton } from "./components/ReconnectButton";
import { MapTilesRenderer } from "./components/MapTilesRenderer";

const MAP_PADDING = 0;

type Props = {
  gameId: string;
};

export function PannableMapView({ gameId }: Props) {
  const gameData = useGameData();
  const gameDataState = useGameDataState();
  const { user } = useUser();

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

  const zoom = computeMapZoom(storeZoom);

  const hideZoomControls = shouldHideZoomControls();

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
  const [isSecretHandCollapsed, setIsSecretHandCollapsed] = useState(false);

  const playerCardLayout = isMobileDevice() ? "list" : "grid";

  // Fetch player hand data
  const {
    data: handData,
    isLoading: isHandLoading,
    error: handError,
  } = usePlayerHand(gameId);

  const isUserAuthenticated = user?.authenticated;
  const isInGame = gameData?.playerData?.some(
    (p) => p.discordId === user?.discord_id
  );

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
    distanceMode: isMobileDevice() ? false : settings.distanceMode,
    mapTiles: gameData?.mapTiles || [],
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

  const contentSize = useMemo(() => {
    const tiles = gameData?.mapTiles || [];
    if (!tiles.length) return { width: 0, height: 0 };

    let maxRight = 0;
    let maxBottom = 0;

    for (const t of tiles) {
      const right = t.properties.x + TILE_WIDTH;
      const bottom = t.properties.y + TILE_HEIGHT;
      if (right > maxRight) maxRight = right;
      if (bottom > maxBottom) maxBottom = bottom;
    }

    const baseWidth = maxRight + MAP_PADDING;
    const baseHeight = maxBottom + MAP_PADDING + 320;

    // For Firefox, we need to account for the MozTransform scale
    // since it doesn't affect layout dimensions like CSS zoom does
    if (settings.isFirefox) {
      return {
        width: baseWidth * zoom,
        height: baseHeight * zoom,
      };
    }

    return {
      width: baseWidth,
      height: baseHeight,
    };
  }, [gameData?.mapTiles, settings.isFirefox, zoom]);

  const areaStyles = isMobileDevice()
    ? {
        width: "1300px",
      }
    : {
        minWidth: "2150px",
      };
  return (
    <Box className={classes.mapContainer}>
      <Box
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
            <Box
              className={classes.tileRenderingContainer}
              style={{
                ...getScaleStyle(zoom, settings.isFirefox),
                top: MAP_PADDING / zoom,
                left: MAP_PADDING / zoom,
                // offset to account for mallice meaning 'centering' looks weird
                width: contentSize.width + 400,
                height: contentSize.height,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <MapTilesRenderer
                mapTiles={gameData.mapTiles || []}
                playerData={gameData.playerData}
                statTilePositions={gameData.statTilePositions}
                isMovingMode={!!draft.targetPositionId}
                isOrigin={(position) => !!draft.origins?.[position]}
                selectedTiles={selectedTiles}
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

            {/* Secret Hand - Top left of pannable area */}
            {isUserAuthenticated && isInGame && !isMobileDevice() && (
              <Box className={secretHandClasses.pannableWrapper}>
                <SecretHand
                  isCollapsed={isSecretHandCollapsed}
                  onToggle={() =>
                    setIsSecretHandCollapsed(!isSecretHandCollapsed)
                  }
                  handData={handData}
                  isLoading={isHandLoading}
                  error={handError}
                  playerData={gameData?.playerData}
                  activeArea={null}
                  userDiscordId={user?.discord_id}
                />
              </Box>
            )}
          </>
        )}

        {/* Game info and scoreboard summary area */}
        {gameData && (
          <Box
            style={{
              ...getScaleStyle(computePanelsZoom(), settings.isFirefox),
              ...areaStyles,
              padding: "12px 8px",
            }}
          >
            <Stack gap="md">
              {/* Game Name and Round */}
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
              />
            </Stack>
          </Box>
        )}

        {/* Player cards */}
        <Grid
          gutter="md"
          columns={12}
          style={{
            ...getScaleStyle(computePanelsZoom(), settings.isFirefox),
            ...areaStyles,
            padding: "0px 8px",
          }}
        >
          {gameData?.playerData
            .filter((p) => p.faction !== "null")
            .map((player) => (
              <Grid.Col
                key={player.color}
                span={playerCardLayout === "grid" ? 6 : 12}
              >
                <PlayerCardMobile playerData={player} />
              </Grid.Col>
            ))}
        </Grid>

        {gameData && (
          <Box
            px="md"
            pt="lg"
            style={{
              ...getScaleStyle(computePanelsZoom(), settings.isFirefox),
            }}
          >
            <PlayerScoreSummary
              playerData={gameData.playerData}
              objectives={gameData.objectives}
            />
          </Box>
        )}
        <div style={{ height: "240px", width: "100%" }} />

        <ReconnectButton gameDataState={gameDataState} />
      </Box>

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
        gameData={gameData ? { mapTiles: gameData.mapTiles } : null}
      />
    </Box>
  );
}
