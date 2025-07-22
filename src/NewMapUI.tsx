import { useCallback, useEffect, useState, useRef } from "react";
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
import { UnitDetailsCard } from "./components/PlayerArea/UnitDetailsCard";
import { lookupUnit } from "./lookup/units";
import { PlanetDetailsCard } from "./components/PlayerArea/PlanetDetailsCard";
import ScoreBoard from "./components/ScoreBoard";
import { UpdateNeededScreen } from "./components/UpdateNeededScreen";
import { LeftSidebar } from "./components/main/LeftSidebar";
import { SettingsProvider, useSettings } from "./context/SettingsContext";
import { SettingsModal } from "./components/SettingsModal";
import { PanelToggleButton } from "./components/PanelToggleButton";
import { RightSidebar } from "./components/main/RightSidebar";
import { MapPlanetDetailsCard } from "./components/main/MapPlanetDetailsCard";
import { MapUnitDetailsCard } from "./components/main/MapUnitDetailsCard";

// Magic constant for required version schema
const REQUIRED_VERSION_SCHEMA = 5;

// TypeScript version of useTabManagement hook for NewMapUI
function useTabManagementNewUI() {
  const navigate = useNavigate();
  const params = useParams<{ mapid: string }>();
  const [activeTabs, setActiveTabs] = useState<string[]>([]);

  useEffect(() => {
    const storedTabs = JSON.parse(localStorage.getItem("activeTabs") || "[]");
    const currentGame = params.mapid;
    if (currentGame && !storedTabs.includes(currentGame)) {
      storedTabs.push(currentGame);
    }

    setActiveTabs(storedTabs.filter((tab: string) => !!tab));
  }, [params.mapid]);

  useEffect(() => {
    if (activeTabs.length === 0) return;
    localStorage.setItem("activeTabs", JSON.stringify(activeTabs));
  }, [activeTabs]);

  const changeTab = (tab: string) => {
    if (tab === params.mapid) return;
    navigate(`/game/${tab}/newui`);
  };

  const removeTab = (tabValue: string) => {
    const remaining = activeTabs.filter((tab) => tab !== tabValue);
    setActiveTabs(remaining);
    localStorage.setItem("activeTabs", JSON.stringify(remaining));

    if (params.mapid !== tabValue) return;

    if (remaining.length > 0) {
      changeTab(remaining[0]);
    } else {
      navigate("/");
    }
  };

  return { activeTabs, changeTab, removeTab };
}

const MAP_PADDING = 200;

function NewMapUIContent() {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid!;

  // Use tab management hook for NewMapUI
  const { activeTabs, changeTab, removeTab } = useTabManagementNewUI();

  // Use settings from context
  const {
    settings,
    toggleOverlays,
    toggleTechSkipsMode,
    toggleLeftPanelCollapsed,
    toggleRightPanelCollapsed,
  } = useSettings();

  // State for settings modal
  const [settingsModalOpened, setSettingsModalOpened] = useState(false);

  // Use tabs and tooltips hook
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

  // State for tracking hovered planet
  const [tooltipPlanet, setTooltipPlanet] = useState<{
    systemId: string;
    planetId: string;
    coords: { x: number; y: number };
  } | null>(null);

  // Left panel collapse state now managed by settings context

  // Planet hover handlers
  const handlePlanetMouseEnter = useCallback(
    (systemId: string, planetId: string, x: number, y: number) => {
      setTooltipPlanet({ systemId, planetId, coords: { x, y } });
    },
    []
  );

  const handlePlanetMouseLeave = useCallback(() => {
    setTooltipPlanet(null);
  }, []);

  // Enhanced unit mouse handlers to clear planet tooltip
  const handleUnitMouseEnter = useCallback(
    (faction: string, unitId: string, x: number, y: number) => {
      setTooltipPlanet(null); // Clear planet tooltip when hovering unit
      handleMouseEnter(faction, unitId, x, y);
    },
    [handleMouseEnter]
  );

  const handleUnitMouseLeave = useCallback(() => {
    handleMouseLeave();
  }, [handleMouseLeave]);

  const { sidebarWidth, isDragging, handleSidebarMouseDown } =
    useSidebarDragHandle(30);

  const enhancedData = usePlayerDataEnhanced(gameId);

  const hasConnectedBefore = useRef(false);

  const { readyState, reconnect, isReconnecting } = useMapSocket(gameId, () => {
    if (!hasConnectedBefore.current) {
      hasConnectedBefore.current = true;
      return; // Ignore the first update since we already loaded the data
    }
    console.log("Map update received, refetching player data...");
    enhancedData?.refetch();
  });

  const {
    playerData = [],
    calculatedTilePositions: tilePositions = [],
    systemIdToPosition = {},
    factionToColor = {},
    colorToFaction = {},
    optimizedColors = {},
    planetAttachments = {},
    allExhaustedPlanets = [],
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
    isLoading,
    ringCount = 3,
  } = enhancedData || {};
  const data = enhancedData;

  useEffect(() => {
    document.title = `${gameId} - Async TI`;
  }, [gameId]);

  useEffect(() => {
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
    gameId,
    mapPadding: MAP_PADDING,
  });

  const isFirefox =
    typeof navigator !== "undefined" &&
    navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

  const navigate = useNavigate();

  // Early return for version check - render update needed page
  if (
    enhancedData &&
    !isLoading &&
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
                    width: settings.isRightPanelCollapsed
                      ? "100%"
                      : `${100 - sidebarWidth}%`,
                  }}
                >
                  <LeftSidebar enhancedData={enhancedData} />

                  {/* Left Panel Toggle Button */}
                  {((objectives && playerData) ||
                    (lawsInPlay && lawsInPlay.length > 0)) && (
                    <PanelToggleButton
                      isCollapsed={settings.isLeftPanelCollapsed}
                      onClick={toggleLeftPanelCollapsed}
                      position="left"
                    />
                  )}

                  <div
                    className={classes.zoomControlsDynamic}
                    style={{
                      right: settings.isRightPanelCollapsed
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
                      ...(isFirefox ? {} : { zoom: zoom }),
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
                    {tilePositions.map((tile, index) => {
                      const tileKey = `${tile.systemId}-${index}`;
                      const position = systemIdToPosition[tile.systemId];
                      const tileData =
                        position && data?.tileUnitData
                          ? (data.tileUnitData as any)[position]
                          : undefined;

                      return (
                        <MapTile
                          key={tileKey}
                          ringPosition={tile.ringPosition}
                          systemId={tile.systemId}
                          position={{ x: tile.x, y: tile.y }}
                          tileUnitData={tileData}
                          factionToColor={factionToColor}
                          optimizedColors={optimizedColors}
                          onUnitMouseOver={handleUnitMouseEnter}
                          onUnitMouseLeave={handleUnitMouseLeave}
                          onUnitSelect={handleMouseDown}
                          onPlanetHover={handlePlanetMouseEnter}
                          onPlanetMouseLeave={handlePlanetMouseLeave}
                          techSkipsMode={settings.techSkipsMode}
                          overlaysEnabled={settings.overlaysEnabled}
                          lawsInPlay={lawsInPlay}
                          exhaustedPlanets={allExhaustedPlanets}
                          alwaysShowControlTokens={
                            settings.alwaysShowControlTokens
                          }
                          showExhaustedPlanets={settings.showExhaustedPlanets}
                        />
                      );
                    })}
                  </Box>

                  <MapUnitDetailsCard
                    tooltipUnit={tooltipUnit}
                    playerData={playerData}
                    zoom={zoom}
                    mapPadding={MAP_PADDING}
                  />

                  <MapPlanetDetailsCard
                    tooltipPlanet={tooltipPlanet}
                    zoom={zoom}
                    mapPadding={MAP_PADDING}
                    planetAttachments={planetAttachments}
                  />

                  {/* Reconnect button when disconnected */}
                  {readyState === ReadyState.CLOSED && (
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
                      onClick={reconnect}
                      loading={isReconnecting}
                    >
                      Refresh
                    </Button>
                  )}
                </Box>

                <DragHandle onMouseDown={handleSidebarMouseDown} />

                <PanelToggleButton
                  isCollapsed={settings.isRightPanelCollapsed}
                  onClick={toggleRightPanelCollapsed}
                  position="right"
                  style={{
                    right: settings.isRightPanelCollapsed
                      ? "10px"
                      : `calc(${sidebarWidth}vw + 14px)`,
                    transition: isDragging ? "none" : "right 0.1s ease",
                  }}
                />

                <RightSidebar
                  isRightPanelCollapsed={settings.isRightPanelCollapsed}
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
        opened={settingsModalOpened}
        onClose={() => setSettingsModalOpened(false)}
      />
    </AppShell>
  );
}

export function NewMapUI() {
  return (
    <SettingsProvider>
      <NewMapUIContent />
    </SettingsProvider>
  );
}

export default NewMapUI;
