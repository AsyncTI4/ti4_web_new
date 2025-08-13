import { useCallback, useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AppShell,
  Box,
  Alert,
  SimpleGrid,
  Tabs,
  Button,
  Group,
  Switch,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconMap2,
  IconTarget,
  IconUsers,
  IconRefresh,
  IconFlask,
  IconEye,
  IconSettings,
  IconRuler2,
  IconKeyboard,
} from "@tabler/icons-react";
import { usePlayerDataEnhanced } from "./hooks/usePlayerData";
// @ts-ignore
import { useMapSocket } from "./hooks/useMapSocket";
import { ReadyState } from "react-use-websocket";
// @ts-ignore
import { ZoomControls } from "./components/ZoomControls";
// @ts-ignore
import Logo from "./components/Logo";
// @ts-ignore
import { DiscordLogin } from "./components/DiscordLogin";
import { HeaderMenuNew } from "./components/HeaderMenuNew";
import "./components/ScrollMap.css";
// @ts-ignore
import * as dragscroll from "dragscroll";
import PlayerCard2Mid from "./components/PlayerCard2Mid";
import { MapTile } from "./components/Map/MapTile";
import { PlayerStatsArea } from "./components/Map/PlayerStatsArea";
import classes from "./components/MapUI.module.css";
import { useZoom } from "./hooks/useZoom";

import { useTabsAndTooltips } from "./hooks/useTabsAndTooltips";
import { useSidebarDragHandle } from "./hooks/useSidebarDragHandle";
import { useMapScrollPosition } from "./hooks/useMapScrollPosition";
import { DragHandle } from "./components/DragHandle";
import ScoreBoard from "./components/ScoreBoard";
import { UpdateNeededScreen } from "./components/UpdateNeededScreen";
import { LeftSidebar } from "./components/main/LeftSidebar";
import { SettingsProvider } from "./context/SettingsContext";
import { SettingsModal } from "./components/SettingsModal";
import { PanelToggleButton } from "./components/PanelToggleButton";
import { RightSidebar } from "./components/main/RightSidebar";
import { MapPlanetDetailsCard } from "./components/main/MapPlanetDetailsCard";
import { MapUnitDetailsCard } from "./components/main/MapUnitDetailsCard";
import { PathVisualization } from "./components/PathVisualization";
import { useDistanceRendering } from "./hooks/useDistanceRendering";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { KeyboardShortcutsModal } from "./components/KeyboardShortcutsModal";
import { useTabManagementNewUI } from "./hooks/useTabManagementNewUI";
import { EnhancedDataContext, GameContextProvider } from "./context/GameContextProvider";
import { useSettingsStore } from "./utils/appStore";

// Magic constant for required version schema
const REQUIRED_VERSION_SCHEMA = 5;

export const MAP_PADDING = 200;

function NewMapUIContent() {
  const enhancedData2 = useContext(EnhancedDataContext);
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid!;

  const { activeTabs, changeTab, removeTab } = useTabManagementNewUI();

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
    systemId: string;
    planetId: string;
    coords: { x: number; y: number };
  } | null>(null);

  const handlePlanetMouseEnter = useCallback(
    (systemId: string, planetId: string, x: number, y: number) => {
      setTooltipPlanet({ systemId, planetId, coords: { x, y } });
    },
    []
  );

  const handlePlanetMouseLeave = () => setTooltipPlanet(null);

  const handleUnitMouseEnter = (faction: string, unitId: string, x: number, y: number) => {
      setTooltipPlanet(null);
      handleMouseEnter(faction, unitId, x, y);
    };

  const handleUnitMouseLeave = () => handleMouseLeave();

  const { sidebarWidth, isDragging, handleSidebarMouseDown } =
    useSidebarDragHandle(30);

  const enhancedData = usePlayerDataEnhanced(gameId);


  // const zoomLevel = useAppStore((state) => state.zoomLevel);
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const setSettingsModalOpened = useSettingsStore((state) => state.setSettingsModalOpened);
  const setKeyboardShortcutsModalOpened = useSettingsStore((state) => state.setKeyboardShortcutsModalOpened);
  const toggleTechSkipsMode = useSettingsStore((state) => state.toggleTechSkipsMode);
  const togglePdsMode = useSettingsStore((state) => state.toggleShowPDSLayer);
  const toggleOverlays = useSettingsStore((state) => state.toggleOverlays);
  const toggleDistanceMode = useSettingsStore((state) => state.toggleDistanceMode);
  const toggleLeftPanelCollapsed = useSettingsStore((state) => state.toggleLeftPanelCollapsed);
  const toggleRightPanelCollapsed = useSettingsStore((state) => state.toggleRightPanelCollapsed);

  const {
    playerData = [],
    calculatedTilePositions: tilePositions = [],
    positionToSystemId = {},
    factionToColor = {},
    colorToFaction = {},
    optimizedColors = {},
    planetAttachments = {},
    objectives = {
      stage1Objectives: [],
      stage2Objectives: [],
      customObjectives: [],
      allObjectives: [],
    },
    lawsInPlay = [],
    strategyCards = [],
    vpsToWin = 10,
    cardPool,
    isError = false,
    versionSchema,
    ringCount = 3,
    tilesWithPds,
  } = enhancedData || {};
  const data = enhancedData;

  const {
    selectedTiles,
    pathResult,
    systemsOnPath,
    activePathIndex,
    handleTileSelect,
    handleTileHover,
    handlePathIndexChange,
  } = useDistanceRendering({
    distanceMode: settings.distanceMode,
    positionToSystemId,
    tileUnitData: data?.tileUnitData,
  });

  useEffect(() => {
    document.title = `${gameId} - Async TI`;
    dragscroll.reset();
  }, [gameId]);

  const {
    zoom,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleZoomScreenSize,
  } = useZoom(undefined, undefined);

  const { mapContainerRef } = useMapScrollPosition({
    playerData,
    tilePositions,
    zoom,
    gameId
  });

  // Add keyboard shortcuts
  useKeyboardShortcuts({
    playerData,
    toggleOverlays,
    toggleTechSkipsMode,
    toggleDistanceMode,
    togglePdsMode,
    toggleLeftPanelCollapsed,
    toggleRightPanelCollapsed,
    isLeftPanelCollapsed: settings.leftPanelCollapsed,
    isRightPanelCollapsed: settings.rightPanelCollapsed,
    updateSettings,
    handleZoomIn,
    handleZoomOut,
    onAreaSelect: handleAreaSelect,
    selectedArea,
  });

  const navigate = useNavigate();

  console.log(enhancedData2);

if (!enhancedData2) {
  return <div>Loading...</div>; // or your loading component
}

  if (
    enhancedData2 &&
    !enhancedData2.dataState.isLoading &&
    (!versionSchema || versionSchema < REQUIRED_VERSION_SCHEMA)
  ) {
    return (
      <UpdateNeededScreen
        gameId={gameId}
        activeTabs={activeTabs}
        changeTab={changeTab}
        removeTab={removeTab}
      />
    );
  }

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group
          align="center"
          h="100%"
          px="sm"
          gap="sm"
          className={classes.newHeaderGroup}
        >
          <Logo />
          <div className="logo-divider" />
          <HeaderMenuNew
            mapId={gameId}
            activeTabs={activeTabs}
            changeTab={changeTab}
            removeTab={removeTab} // eslint-disable-line @typescript-eslint/no-unused-vars
          />

          <Button
            variant="light"
            size="xs"
            color="cyan"
            onClick={() => {
              localStorage.setItem("showOldUI", "true");
              navigate(`/game/${gameId}`);
            }}
          >
            GO TO OLD UI
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Box className={classes.mainBackground}>
          {/* Global Tabs */}
          <Tabs defaultValue="map" h="calc(100vh - 68px)">
            <Tabs.List className={classes.tabsList}>
              <Tabs.Tab
                value="map"
                className={classes.tabsTab}
                leftSection={<IconMap2 size={16} />}
              >
                Map
              </Tabs.Tab>
              <Tabs.Tab
                value="objectives"
                className={classes.tabsTab}
                leftSection={<IconTarget size={16} />}
              >
                Objectives
              </Tabs.Tab>
              <Tabs.Tab
                value="players"
                className={classes.tabsTab}
                leftSection={<IconUsers size={16} />}
              >
                Player Areas
              </Tabs.Tab>
              <Button
                variant={settings.techSkipsMode ? "filled" : "subtle"}
                size="sm"
                color={settings.techSkipsMode ? "cyan" : "gray"}
                style={{ height: "36px", minWidth: "36px" }}
                px={8}
                onClick={toggleTechSkipsMode}
              >
                <IconFlask size={16} />
              </Button>
              <Button
                variant={settings.distanceMode ? "filled" : "subtle"}
                size="sm"
                color={settings.distanceMode ? "orange" : "gray"}
                style={{ height: "36px", minWidth: "36px" }}
                px={8}
                onClick={toggleDistanceMode}
              >
                <IconRuler2 size={16} />
              </Button>
              {tilesWithPds && tilesWithPds.size > 0 && (
                <Button
                  variant={settings.showPDSLayer ? "filled" : "subtle"}
                  size="sm"
                  color={settings.showPDSLayer ? "blue" : "gray"}
                  style={{ height: "36px", minWidth: "36px" }}
                  px={8}
                  onClick={togglePdsMode}
                >
                  PDS
                </Button>
              )}
              <Button
                variant="subtle"
                size="sm"
                color="gray"
                style={{ height: "36px", minWidth: "36px" }}
                px={8}
                onClick={() => setKeyboardShortcutsModalOpened(true)}
              >
                <IconKeyboard size={16} />
              </Button>
              <Box
                style={{
                  borderLeft: "1px solid var(--mantine-color-dark-4)",
                  height: "24px",
                  marginLeft: "12px",
                  marginRight: "12px",
                }}
              />
              <Switch
                checked={settings.overlaysEnabled}
                onChange={toggleOverlays}
                size="sm"
                thumbIcon={
                  settings.overlaysEnabled ? (
                    <IconEye size={12} />
                  ) : (
                    <IconEye size={12} style={{ opacity: 0.5 }} />
                  )
                }
                label="Overlays"
                labelPosition="right"
              />
              <Box
                style={{
                  borderLeft: "1px solid var(--mantine-color-dark-4)",
                  height: "24px",
                  marginLeft: "12px",
                  marginRight: "12px",
                }}
              />
              <Button
                variant="light"
                size="sm"
                color="gray"
                style={{ height: "36px", minWidth: "36px" }}
                px={8}
                onClick={() => setSettingsModalOpened(true)}
              >
                <IconSettings size={16} />
              </Button>
            </Tabs.List>

            {/* Map Tab */}
            <Tabs.Panel value="map" h="calc(100% - 37px)">
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
                  <LeftSidebar enhancedData={enhancedData} />

                  {/* Left Panel Toggle Button */}
                  {((objectives && playerData) ||
                    (lawsInPlay && lawsInPlay.length > 0)) && (
                    <PanelToggleButton
                      isCollapsed={settings.leftPanelCollapsed}
                      onClick={toggleLeftPanelCollapsed}
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
                    <ZoomControls
                      zoom={zoom}
                      onZoomIn={handleZoomIn}
                      onZoomOut={handleZoomOut}
                      onZoomReset={handleZoomReset}
                      onZoomScreenSize={handleZoomScreenSize}
                      zoomClass=""
                    />
                  </div>

                  {/* Tile-based rendering */}
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
                    {playerData &&
                      data?.statTilePositions &&
                      Object.entries(data.statTilePositions).map(
                        ([faction, statTiles]) => {
                          const player = playerData.find(
                            (p) => p.faction === faction
                          );
                          if (!player) return null;

                          return (
                            <PlayerStatsArea
                              key={faction}
                              faction={faction}
                              playerData={player as any}
                              statTilePositions={statTiles as string[]}
                              color={factionToColor[faction]}
                              vpsToWin={vpsToWin}
                              factionToColor={factionToColor}
                              ringCount={ringCount}
                            />
                          );
                        }
                      )}
                    {/* Render tiles */}
                    
                    
                    {enhancedData2?.data?.mapTiles?.map((tile, index) => {
                      // const position = enhancedData2!.data!.systemIdToPosition[tile.systemId];
                      
                      const tileData =
                        tile.position && data?.tileUnitData
                          ? (data.tileUnitData as any)[tile.position]
                          : undefined;

                      return (
                        <MapTile
                          key={`${tile.systemId}-${index}`}
                          mapTile={tile}
                          tileUnitData={tileData}
                          factionToColor={factionToColor}
                          optimizedColors={optimizedColors}
                          selectedTiles={selectedTiles}
                          lawsInPlay={lawsInPlay}
                          isOnPath={systemsOnPath.has(tile.systemId)}
                          onUnitMouseOver={handleUnitMouseEnter}
                          onUnitMouseLeave={handleUnitMouseLeave}
                          onUnitSelect={handleMouseDown}
                          onPlanetMouseEnter={handlePlanetMouseEnter}
                          onPlanetMouseLeave={handlePlanetMouseLeave}
                          onTileSelect={handleTileSelect}
                          onTileHover={handleTileHover}
                        />
                      );
                    })}
                  </Box>

                  <PathVisualization
                    pathResult={pathResult}
                    positionToSystemId={positionToSystemId}
                    tilePositions={tilePositions}
                    zoom={zoom}
                    activePathIndex={activePathIndex}
                    onPathIndexChange={handlePathIndexChange}
                  />

                  <MapUnitDetailsCard
                    tooltipUnit={tooltipUnit}
                    playerData={playerData}
                    zoom={zoom}
                  />

                  <MapPlanetDetailsCard
                    tooltipPlanet={tooltipPlanet}
                    zoom={zoom}
                    planetAttachments={planetAttachments}
                  />

                  {/* Reconnect button when disconnected */}
                  {enhancedData2!.dataState.readyState === ReadyState.CLOSED && (
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
                      onClick={enhancedData2!.dataState.reconnect}
                      loading={enhancedData2!.dataState.isReconnecting}
                    >
                      Refresh
                    </Button>
                  )}
                </Box>

                <DragHandle onMouseDown={handleSidebarMouseDown} />

                <PanelToggleButton
                  isCollapsed={settings.rightPanelCollapsed}
                  onClick={toggleRightPanelCollapsed}
                  position="right"
                  style={{
                    right: settings.rightPanelCollapsed
                      ? "10px"
                      : `calc(${sidebarWidth}vw + 14px)`,
                    transition: isDragging ? "none" : "right 0.1s ease",
                  }}
                />

                <RightSidebar
                  isRightPanelCollapsed={settings.rightPanelCollapsed}
                  sidebarWidth={sidebarWidth}
                  enhancedData={enhancedData}
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
            </Tabs.Panel>

            {/* Player Areas Tab */}
            <Tabs.Panel value="players" h="calc(100% - 60px)">
              <Box className={classes.playersTabContent}>
                {isError && (
                  <Alert
                    variant="light"
                    color="red"
                    title="Error loading player data"
                    icon={<IconAlertCircle />}
                    mb="md"
                  >
                    Could not load player data for game {gameId}. Please try
                    again later.
                  </Alert>
                )}

                {playerData && (
                  <SimpleGrid cols={{ base: 1, xl3: 2 }} spacing="md">
                    {playerData.map((player) => (
                      <PlayerCard2Mid
                        key={player.color}
                        playerData={player}
                        colorToFaction={colorToFaction}
                        factionToColor={factionToColor}
                        planetAttachments={planetAttachments}
                      />
                    ))}
                  </SimpleGrid>
                )}
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="objectives" h="calc(100% - 60px)">
              <Box className={classes.playersTabContent}>
                {objectives && playerData && (
                  <ScoreBoard
                    objectives={objectives}
                    playerData={playerData}
                    lawsInPlay={lawsInPlay}
                    strategyCards={strategyCards}
                    vpsToWin={vpsToWin}
                    cardPool={cardPool}
                  />
                )}
              </Box>
            </Tabs.Panel>
          </Tabs>
        </Box>
      </AppShell.Main>

      {/* Settings Modal */}
      <SettingsModal
        opened={settings.settingsModalOpened}
        onClose={() => setSettingsModalOpened(false)}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        opened={settings.keyboardShortcutsModalOpened}
        onClose={() => setKeyboardShortcutsModalOpened(false)}
      />
    </AppShell>
  );
}

export function NewMapUI() {
  return (
    <SettingsProvider>
      <GameContextProvider>
        <NewMapUIContent />
      </GameContextProvider>
    </SettingsProvider>
  );
}

export default NewMapUI;
