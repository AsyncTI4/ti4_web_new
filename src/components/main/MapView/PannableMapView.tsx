import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, Group, Modal, Stack, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import classes from "@/components/MapUI.module.css";
import { MapTile } from "@/components/Map/MapTile";
import { PathVisualization } from "@/components/PathVisualization";
import { MapPlanetDetailsCard } from "@/components/main/MapPlanetDetailsCard";
import { MapUnitDetailsCard } from "@/components/main/MapUnitDetailsCard";
import { useDistanceRendering } from "@/hooks/useDistanceRendering";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTabsAndTooltips } from "@/hooks/useTabsAndTooltips";
import { useGameData, useGameDataState } from "@/hooks/useGameContext";
import { SocketReadyState } from "@/hooks/useGameSocket";
import { useSearchParams } from "react-router-dom";
import { useMovementStore } from "@/utils/movementStore";
import { useUser } from "@/hooks/useUser";
import { getDiscordOauthUrl } from "@/components/DiscordLogin.ts";
import { MovementOriginModal } from "./MovementOriginModal";
import { MovementModeBox } from "./MovementModeBox";
import { PlayerStatsArea } from "@/components/Map/PlayerStatsArea";
import { useAppStore, useSettingsStore } from "@/utils/appStore";
import ZoomControls from "@/components/ZoomControls";
import PlayerCard from "@/components/PlayerCard";
import { ScoreTracker } from "@/components/Objectives";
import ExpandedPublicObjectives from "@/components/Objectives/PublicObjectives/ExpandedPublicObjectives";
import { TILE_HEIGHT, TILE_WIDTH } from "@/mapgen/tilePositioning";

const MAP_PADDING = 0;

type Props = {
  gameId: string;
};

export function PannableMapView({ gameId }: Props) {
  const gameData = useGameData();
  const gameDataState = useGameDataState();
  const [searchParams] = useSearchParams();
  const { user } = useUser();

  const {
    selectedArea,
    tooltipUnit,
    handleAreaSelect,
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

  const zoom = useAppStore((state) => state.zoomLevel);
  const handleZoomIn = useAppStore((state) => state.handleZoomIn);
  const handleZoomOut = useAppStore((state) => state.handleZoomOut);
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);

  const targetPositionParam =
    searchParams.get("targetPositionId") ||
    searchParams.get("targetSystem") ||
    null;
  const setTargetPositionId = useMovementStore((s) => s.setTargetPositionId);
  const draft = useMovementStore((s) => s.draft);
  const clearAll = useMovementStore((s) => s.clearAll);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [originModalOpen, setOriginModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeOrigin, setActiveOrigin] = useState<{
    position: string;
    systemId: string;
  } | null>(null);

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

  // Initialize movement mode from URL param
  useEffect(() => {
    if (!targetPositionParam) {
      setTargetPositionId(null);
      return;
    }
    if (!user?.authenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowAuthModal(false);
    setTargetPositionId(targetPositionParam);
  }, [targetPositionParam, setTargetPositionId, user?.authenticated]);

  const targetSystemId = useMemo(() => {
    if (!gameData || !draft.targetPositionId) return null;
    const entry = (gameData.tilePositions || []).find((p: string) =>
      p.startsWith(`${draft.targetPositionId}:`)
    );
    return entry ? entry.split(":")[1] : null;
  }, [gameData, draft.targetPositionId]);

  const handleResetMovement = useCallback(() => {
    useMovementStore.setState((prev) => ({
      draft: { ...prev.draft, origins: {} },
    }));
  }, []);

  const handleCancelMovement = useCallback(() => {
    clearAll();
    setOriginModalOpen(false);
  }, [clearAll]);

  // Compute content bounds so the absolute-positioned tiles live inside a
  // container with real width/height, allowing following elements to flow below
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

    // Add right/bottom padding. Left/top padding are applied via style.top/left below.
    return {
      width: maxRight + MAP_PADDING,
      height: maxBottom + MAP_PADDING + 180,
    };
  }, [gameData?.mapTiles]);

  return (
    <Box className={classes.mapContainer}>
      {/* Map Container - Full Width */}
      <Box
        className={`dragscroll ${classes.mapArea}`}
        style={{ width: "100%" }}
      >
        <div className={classes.zoomControlsDynamic} style={{ right: "35px" }}>
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
                width: contentSize.width,
                height: contentSize.height,
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
              {gameData.mapTiles?.map((tile, index) => {
                return (
                  <MapTile
                    key={`${tile.systemId}-${index}`}
                    mapTile={tile}
                    isMovingMode={!!draft.targetPositionId}
                    isOrigin={!!draft.origins?.[tile.position]}
                    selectedTiles={selectedTiles}
                    isOnPath={
                      targetSystemId ? true : systemsOnPath.has(tile.systemId)
                    }
                    isTargetSelected={
                      targetSystemId ? tile.systemId === targetSystemId : false
                    }
                    hoveredTilePosition={hoveredTile}
                    onUnitMouseOver={handleUnitMouseEnter}
                    onUnitMouseLeave={handleUnitMouseLeave}
                    onUnitSelect={handleMouseDown}
                    onPlanetMouseEnter={handlePlanetMouseEnter}
                    onPlanetMouseLeave={handlePlanetMouseLeave}
                    onTileSelect={(position, systemId) => {
                      if (draft.targetPositionId) {
                        // Movement mode: open origin modal
                        setActiveOrigin({ position, systemId });
                        setOriginModalOpen(true);
                        return;
                      }
                      handleTileSelect(position);
                    }}
                    onTileHover={handleTileHover}
                  />
                );
              })}
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

        {/* Scoreboard summary area */}
        {gameData && (
          <Box
            style={{
              width: contentSize.width * zoom,
              minWidth: "max(100vw, 100%)",
              padding: "12px 8px",
            }}
          >
            <Stack gap="md">
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
            width: contentSize.width * zoom,
            minWidth: "max(100vw, 100%)",
            padding: "12px 8px",
          }}
        >
          {gameData?.playerData
            .filter((p) => p.faction !== "null")
            .map((player) => (
              <Grid.Col key={player.color} span={4}>
                <PlayerCard playerData={player} />
              </Grid.Col>
            ))}
        </Grid>

        {/* Reconnect button when disconnected */}
        {gameDataState?.readyState === SocketReadyState.CLOSED && (
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

      {/* Movement Mode Box (bottom-left) */}
      {draft.targetPositionId && (
        <MovementModeBox
          gameId={gameId}
          onCancel={handleCancelMovement}
          onReset={handleResetMovement}
          onSuccess={() => setShowSuccessModal(true)}
        />
      )}

      {/* Auth Required Modal */}
      <Modal
        opened={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Login Required"
        // Hardcoded to match --z-settings-modal; see src/utils/zIndexVariables.css
        zIndex={3500}
      >
        <Stack>
          <Text size="sm">
            You must be logged into Discord to use movement mode.
          </Text>
          <Button
            component="a"
            href={getDiscordOauthUrl()}
            leftSection={<IconRefresh size={16} />}
          >
            Login with Discord
          </Button>
        </Stack>
      </Modal>

      {/* Movement success modal */}
      <Modal
        opened={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Movement Posted"
        size="lg"
        // Hardcoded above all map UI; related to src/utils/zIndexVariables.css
        zIndex={22000}
        classNames={{
          content: classes.detailsModalContent,
          header: classes.detailsModalHeader,
          title: classes.detailsModalTitle,
          body: classes.detailsModalBody,
        }}
      >
        <Stack className={classes.detailsModalBody}>
          <Text size="xl" c="gray.3" mt="lg">
            Head back to Discord to continue.
          </Text>
          <Group justify="flex-end" mt="sm">
            <Button onClick={() => setShowSuccessModal(false)} size="sm">
              Close
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Origin selection modal */}
      {activeOrigin && (
        <MovementOriginModal
          opened={originModalOpen}
          onClose={() => setOriginModalOpen(false)}
          originTile={
            gameData!.mapTiles.find(
              (t) => t.position === activeOrigin.position
            )!
          }
          originPosition={activeOrigin.position}
        />
      )}
    </Box>
  );
}
