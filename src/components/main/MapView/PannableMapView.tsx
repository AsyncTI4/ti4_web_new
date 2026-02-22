import { useMemo } from "react";
import { Box, Grid, Stack, Text } from "@mantine/core";
import classes from "@/components/MapUI.module.css";
import { InteractiveMapRenderer } from "./components/InteractiveMapRenderer";
import { useDistanceRendering } from "@/hooks/useDistanceRendering";
import { useTabsAndTooltips } from "@/hooks/useTabsAndTooltips";
import { useGameData, useGameDataState } from "@/hooks/useGameContext";
import { useAppStore, useSettingsStore } from "@/utils/appStore";
import ZoomControls from "@/components/ZoomControls";
import { ScoreTracker } from "@/components/Objectives";
import ExpandedPublicObjectives from "@/components/Objectives/PublicObjectives/ExpandedPublicObjectives";
import { useMapContentSize } from "./hooks/useMapContentSize";
import {
  shouldHideZoomControls,
  computeMapZoom,
  computePanelsZoom,
} from "@/utils/zoom";
import { isMobileDevice } from "@/utils/isTouchDevice";
import PlayerCardMobile from "@/components/PlayerCardMobile";
import { SecretHand } from "@/components/main/SecretHand";
import secretHandClasses from "@/components/main/SecretHand/SecretHand.module.css";
import { PlayerScoreSummary } from "@/components/Objectives/PlayerScoreSummary/PlayerScoreSummary";
import { useMovementMode } from "./hooks/useMovementMode";
import { useMapTooltips } from "./hooks/useMapTooltips";
import { ReconnectButton } from "./components/ReconnectButton";
import { ScaledContent } from "@/components/shared/ScaledContent";
import { getMapLayoutConfig } from "./mapLayout";
import { useMapKeyboardShortcuts } from "./hooks/useMapKeyboardShortcuts";
import { filterPlayersWithAssignedFaction } from "@/utils/playerUtils";
import { useTryDecalsToggle } from "./hooks/useTryDecalsToggle";
import { MovementLayerPortal } from "./components/MovementLayerPortal";
import { useSecretHandPanel } from "@/hooks/useSecretHandPanel";

type Props = {
  gameId: string;
};

export function PannableMapView({ gameId }: Props) {
  const gameData = useGameData();
  const tilesList = useMemo(
    () => Object.values(gameData?.tiles || {}),
    [gameData?.tiles]
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
  const mapWidth = (contentSize.width + mapLayout.mapWidthExtra) * zoom;
  const mapHeight = contentSize.height * zoom;
  const hideZoomControls = shouldHideZoomControls();

  const movementState = useMovementMode();
  const { draft, targetSystemId, createTileSelectHandler } = movementState;
  const {
    canViewSecretHand,
    userDiscordId,
    handData,
    isHandLoading,
    handError,
    isSecretHandCollapsed,
    toggleSecretHandCollapsed,
  } = useSecretHandPanel({ gameId, playerData: gameData?.playerData });

  const playerCardLayout = isMobileDevice() ? "list" : "grid";

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

  const areaStyles = isMobileDevice()
    ? {
        width: "1300px",
      }
    : {
        minWidth: "2150px",
        padding: "0 16px",
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
            <InteractiveMapRenderer
              layout="pannable"
              mapLayoutConfig={mapLayout}
              zoom={zoom}
              isFirefox={settings.isFirefox}
              contentSize={contentSize}
              widthOverride={mapWidth}
              heightOverride={mapHeight}
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

            {canViewSecretHand && !isMobileDevice() && (
              <Box className={secretHandClasses.pannableWrapper}>
                <SecretHand
                  isCollapsed={isSecretHandCollapsed}
                  onToggle={toggleSecretHandCollapsed}
                  handData={handData}
                  isLoading={isHandLoading}
                  error={handError}
                  playerData={gameData?.playerData}
                  activeArea={null}
                  userDiscordId={userDiscordId ?? undefined}
                />
              </Box>
            )}
          </>
        )}

        {gameData && (
          <ScaledContent
            zoom={computePanelsZoom()}
            innerStyle={areaStyles}
            enabled={isMobileDevice()}
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
              />
            </Stack>
          </ScaledContent>
        )}

        <ScaledContent
          zoom={computePanelsZoom()}
          innerStyle={areaStyles}
          enabled={isMobileDevice()}
        >
          <Grid gutter="md" columns={12} style={{ width: "100%" }}>
            {filterPlayersWithAssignedFaction(gameData?.playerData || []).map(
              (player) => (
                <Grid.Col
                  key={player.color}
                  span={playerCardLayout === "grid" ? 6 : 12}
                >
                  <PlayerCardMobile playerData={player} />
                </Grid.Col>
              ),
            )}
          </Grid>
        </ScaledContent>

        {gameData && (
          <ScaledContent
            zoom={computePanelsZoom()}
            innerStyle={areaStyles}
            enabled={isMobileDevice()}
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
