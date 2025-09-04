import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import classes from "@/components/MapUI.module.css";
import { LeftSidebar } from "@/components/main/LeftSidebar";
import { DragHandle } from "@/components/DragHandle";
import { PanelToggleButton } from "@/components/PanelToggleButton";
import { RightSidebar } from "@/components/main/RightSidebar";
import { MapTile } from "@/components/Map/MapTile";
import { PathVisualization } from "@/components/PathVisualization";
import { MapPlanetDetailsCard } from "@/components/main/MapPlanetDetailsCard";
import { MapUnitDetailsCard } from "@/components/main/MapUnitDetailsCard";
import { useSidebarDragHandle } from "@/hooks/useSidebarDragHandle";
import { useDistanceRendering } from "@/hooks/useDistanceRendering";
import { useMapScrollPosition } from "@/hooks/useMapScrollPosition";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTabsAndTooltips } from "@/hooks/useTabsAndTooltips";
import { useGameData, useGameDataState } from "@/hooks/useGameContext";
import { ReadyState } from "react-use-websocket";
import { useSearchParams } from "react-router-dom";
import { useMovementStore } from "@/utils/movementStore";
import { useUser } from "@/hooks/useUser";
import { getDiscordOauthUrl } from "@/components/DiscordLogin.ts";
import { MovementOriginModal } from "./MovementOriginModal";
import { MovementModeBox } from "./MovementModeBox";
import { PlayerStatsArea } from "@/components/Map/PlayerStatsArea";
import { useAppStore, useSettingsStore } from "@/utils/appStore";
import ZoomControls from "@/components/ZoomControls";

const MAP_PADDING = 200;

type Props = {
  gameId: string;
};

export function MapView({ gameId }: Props) {
  const gameData = useGameData();
  const gameDataState = useGameDataState();
  const [searchParams] = useSearchParams();
  const { user } = useUser();

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

  const zoom = useAppStore((state) => state.zoomLevel);
  const handleZoomIn = useAppStore((state) => state.handleZoomIn);
  const handleZoomOut = useAppStore((state) => state.handleZoomOut);
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);

  // Movement mode handling
  const targetPositionParam =
    searchParams.get("targetPositionId") ||
    searchParams.get("targetSystem") ||
    null;
  const setTargetPositionId = useMovementStore((s) => s.setTargetPositionId);
  const draft = useMovementStore((s) => s.draft);
  const clearAll = useMovementStore((s) => s.clearAll);

  const [showAuthModal, setShowAuthModal] = useState(false);
  // Summary modal removed; confirm happens inside MovementModeBox
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

  const { mapContainerRef } = useMapScrollPosition({
    zoom,
    gameId,
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

  // Name is resolved inside MovementModeBox when rendering

  // Movement mode banner actions
  const handleResetMovement = useCallback(() => {
    // Clear only displacement; preserve targetPositionId
    useMovementStore.setState((prev) => ({
      draft: { ...prev.draft, origins: {} },
    }));
    // no-op now that summary modal is removed
  }, []);

  const handleCancelMovement = useCallback(() => {
    // Nuke everything including target
    clearAll();
    // no-op now that summary modal is removed
    setOriginModalOpen(false);
  }, [clearAll]);

  // Confirm handled directly inside MovementModeBox

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
          <ZoomControls zoomClass="" />
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
        zIndex={22000}
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
