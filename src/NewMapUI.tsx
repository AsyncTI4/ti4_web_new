import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AppShell,
  Box,
  Center,
  Alert,
  Tabs,
  Stack,
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
  IconChevronLeft,
  IconChevronRight,
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
import classes from "./components/MapUI.module.css";
import { useZoom } from "./hooks/useZoom";
import { FactionTabBar } from "./components/FactionTabBar";
import { useTabsAndTooltips } from "./hooks/useTabsAndTooltips";
import { useSidebarDragHandle } from "./hooks/useSidebarDragHandle";
import PlayerCardSidebar from "./components/PlayerCardSidebar";
import { DragHandle } from "./components/DragHandle";
import { UnitDetailsCard } from "./components/PlayerArea/UnitDetailsCard";
import PlayerCardSidebarTech from "./components/PlayerCardSidebarTech";
import PlayerCardSidebarComponents from "./components/PlayerCardSidebarComponents";
import { PlanetDetailsCard } from "./components/PlayerArea/PlanetDetailsCard";
import ScoreBoard from "./components/ScoreBoard";
import { UpdateNeededScreen } from "./components/UpdateNeededScreen";
import PlayerCardSidebarStrength from "./components/PlayerCardSidebarStrength";
import { SettingsProvider, useSettings } from "./context/SettingsContext";
import { SettingsModal } from "./components/SettingsModal";
import { useUnitLookup } from "./hooks/useUnitLookup";
import { MemoizedLeftSidebar } from "./components/LeftSidebar";
import { MemoizedTileContainer } from "./components/TileContainer";
import { MemoizedPlayerAreasGrid } from "./components/PlayerAreasGrid";

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

  const changeTab = useCallback((tab: string) => {
    if (tab === params.mapid) return;
    navigate(`/game/${tab}/newui`);
  }, [params.mapid, navigate]);

  const removeTab = useCallback((tabValue: string) => {
    const remaining = activeTabs.filter((tab) => tab !== tabValue);
    setActiveTabs(remaining);
    localStorage.setItem("activeTabs", JSON.stringify(remaining));

    if (params.mapid !== tabValue) return;

    if (remaining.length > 0) {
      changeTab(remaining[0]);
    } else {
      navigate("/");
    }
  }, [activeTabs, params.mapid, changeTab, navigate]);

  return { activeTabs, changeTab, removeTab };
}

type ActiveArea =
  | {
    type: "faction";
    faction: string;
    unitId?: string;
    coords: { x: number; y: number };
  }
  | { type: "tech" }
  | { type: "components" }
  | { type: "strength" }
  | null;

type PlayerCardDisplayProps = {
  playerData: any[];
  activeArea: ActiveArea;
  factionToColor: Record<string, string>;
  colorToFaction: Record<string, string>;
  planetAttachments: Record<string, string[]>;
};

const MAP_PADDING = 200;


const MemoizedUnitDetailsCard = React.memo(UnitDetailsCard);
const MemoizedPlanetDetailsCard = React.memo(PlanetDetailsCard);

function NewMapUIContent() {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid!;

  // Add ref for the scrollable map container
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Track if we've set the initial scroll position and for which game
  const hasSetInitialScroll = useRef(false);
  const lastGameId = useRef<string | null>(null);

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

  // Memoize frequently accessed values to prevent unnecessary recalculations
  const memoActiveArea = useMemo(() => activeArea, [activeArea]);
  const memoTooltipUnit = useMemo(() => tooltipUnit, [tooltipUnit]);
  const memoSelectedArea = useMemo(() => selectedArea, [selectedArea]);

  // State for tracking hovered planet
  const [tooltipPlanet, setTooltipPlanet] = useState<{
    systemId: string;
    planetId: string;
    coords: { x: number; y: number };
  } | null>(null);

  // State for law popover
  const [selectedLaw, setSelectedLaw] = useState<string | null>(null);

  // Memoized planet hover handlers to prevent recreating functions
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

  // Create stable event handlers that don't change reference on every render
  const stableHandlers = useMemo(() => ({
    handleUnitMouseEnter,
    handleUnitMouseLeave,
    handleMouseDown,
    handlePlanetMouseEnter,
    handlePlanetMouseLeave,
  }), [handleUnitMouseEnter, handleUnitMouseLeave, handleMouseDown, handlePlanetMouseEnter, handlePlanetMouseLeave]);

  const { sidebarWidth, isDragging, handleSidebarMouseDown } =
    useSidebarDragHandle(30);

  // Use enhanced player data hook that computes all derived values
  const enhancedData = usePlayerDataEnhanced(gameId);

  // Track if this is the first socket connection to avoid refetching on initial connect
  const hasConnectedBefore = useRef(false);
  
  // Memoize socket callback to prevent unnecessary effect re-runs
  const socketCallback = useCallback(() => {
    if (!hasConnectedBefore.current) {
      hasConnectedBefore.current = true;
      return; // Ignore the first update since we already loaded the data
    }
    console.log("Map update received, refetching player data...");
    enhancedData?.refetch();
  }, [enhancedData]);

  // socket connection for real-time updates
  const { readyState, reconnect, isReconnecting } = useMapSocket(gameId, socketCallback);

  // Memoize destructured data to prevent unnecessary recalculations
  const gameData = useMemo(() => {
    if (!enhancedData) return {
      systemIdToPosition: {},
      factionToColor: {},
      colorToFaction: {},
      optimizedColors: {},
      vpsToWin: 10,
      isError: true,
      ringCount: 3,
    };
    
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
    } = enhancedData;

    return {
      playerData,
      tilePositions,
      systemIdToPosition,
      factionToColor,
      colorToFaction,
      optimizedColors,
      planetAttachments,
      allExhaustedPlanets,
      objectives,
      lawsInPlay,
      strategyCards,
      vpsToWin,
      cardPool,
      isError,
      versionSchema,
      isLoading,
      ringCount,
    };
  }, [enhancedData]);

  const {
    playerData,
    tilePositions,
    systemIdToPosition,
    factionToColor,
    colorToFaction,
    optimizedColors,
    planetAttachments,
    allExhaustedPlanets,
    objectives,
    lawsInPlay,
    strategyCards,
    vpsToWin,
    cardPool,
    isError,
    versionSchema,
    isLoading,
    ringCount,
  } = gameData;

  const data = enhancedData;

  // Memoize active player lookup to prevent unnecessary recalculations
  const activePlayer = useMemo(() => {
    if (!memoTooltipUnit?.faction || !playerData) return null;
    return playerData.find(player => player.faction === memoTooltipUnit.faction);
  }, [memoTooltipUnit?.faction, playerData]);
  
  const getUnitIdToUse = useUnitLookup(memoTooltipUnit, activePlayer);

  // Memoize document title effect dependencies
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

  // Reset scroll flag when switching games
  useEffect(() => {
    if (lastGameId.current !== gameId) {
      hasSetInitialScroll.current = false;
      lastGameId.current = gameId;
    }
  }, [gameId]);

  // Set initial scroll position only once when loading a new game
  useEffect(() => {
    if (
      mapContainerRef.current &&
      playerData &&
      tilePositions.length > 0 &&
      !hasSetInitialScroll.current
    ) {
      // Use requestAnimationFrame to ensure DOM is updated after rendering
      requestAnimationFrame(() => {
        if (mapContainerRef.current) {
          const container = mapContainerRef.current;

          // Calculate center position based on actual content dimensions
          const centerX = (container.scrollWidth - container.clientWidth) / 2;
          const centerY = (container.scrollHeight - container.clientHeight) / 2;

          container.scrollLeft = centerX + MAP_PADDING * zoom;
          container.scrollTop = centerY + MAP_PADDING * zoom;
          hasSetInitialScroll.current = true;
        }
      });
    }
  }, [playerData, tilePositions, zoom]);

  // Memoize browser detection
  const isFirefox = useMemo(() => 
    typeof navigator !== "undefined" &&
    navigator.userAgent.toLowerCase().indexOf("firefox") > -1
  , []);

  const navigate = useNavigate();


  // Memoize old UI navigation handler
  const handleOldUINavigation = useCallback(() => {
    localStorage.setItem("showOldUI", "true");
    navigate(`/game/${gameId}`);
  }, [navigate, gameId]);

  // Memoize law selection handlers
  const handleLawSelect = useCallback((lawId: string) => {
    setSelectedLaw(lawId);
  }, []);

  const handleLawDeselect = useCallback(() => {
    setSelectedLaw(null);
  }, []);

  // Memoize zoom controls style to prevent object recreation
  const zoomControlsStyle = useMemo(() => ({
    right: settings.isRightPanelCollapsed
      ? "35px"
      : `calc(${sidebarWidth}vw + 35px)`,
    transition: isDragging ? "none" : "right 0.1s ease",
  }), [settings.isRightPanelCollapsed, sidebarWidth, isDragging]);

  // Memoize right panel toggle style
  const rightPanelToggleStyle = useMemo(() => ({
    right: settings.isRightPanelCollapsed
      ? "10px"
      : `calc(${sidebarWidth}vw + 14px)`,
    transition: isDragging ? "none" : "right 0.1s ease",
  }), [settings.isRightPanelCollapsed, sidebarWidth, isDragging]);

  // Memoize sidebar style
  const sidebarStyle = useMemo(() => ({
    width: settings.isRightPanelCollapsed
      ? "0%"
      : `${sidebarWidth}%`,
  }), [settings.isRightPanelCollapsed, sidebarWidth]);

  // Memoize map area style
  const mapAreaStyle = useMemo(() => ({
    width: settings.isRightPanelCollapsed
      ? "100%"
      : `${100 - sidebarWidth}%`,
  }), [settings.isRightPanelCollapsed, sidebarWidth]);

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
            removeTab={removeTab}
          />

          <Button
            variant="light"
            size="xs"
            color="cyan"
            onClick={handleOldUINavigation}
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
                  style={mapAreaStyle}
                >
                  {/* Left Panel */}
                  <MemoizedLeftSidebar
                    objectives={objectives}
                    playerData={playerData}
                    data={data}
                    vpsToWin={vpsToWin}
                    lawsInPlay={lawsInPlay}
                    selectedLaw={selectedLaw}
                    handleLawSelect={handleLawSelect}
                    handleLawDeselect={handleLawDeselect}
                    settings={settings}
                    toggleLeftPanelCollapsed={toggleLeftPanelCollapsed}
                    classes={classes}
                  />

                  <div
                    className={classes.zoomControlsDynamic}
                    style={zoomControlsStyle}
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
                  <MemoizedTileContainer
                    playerData={playerData}
                    data={data}
                    tilePositions={tilePositions}
                    systemIdToPosition={systemIdToPosition}
                    factionToColor={factionToColor}
                    optimizedColors={optimizedColors}
                    settings={settings}
                    lawsInPlay={lawsInPlay}
                    allExhaustedPlanets={allExhaustedPlanets}
                    vpsToWin={vpsToWin}
                    ringCount={ringCount}
                    stableHandlers={stableHandlers}
                    isFirefox={isFirefox}
                    zoom={zoom}
                    classes={classes}
                  />

                  {/* Unit Details Tooltip */}
                  {useMemo(() => {
                    if (
                      !memoTooltipUnit ||
                      !memoTooltipUnit.unitId ||
                      !memoTooltipUnit.faction ||
                      !activePlayer
                    ) return null;

                    // Scale the coordinates by zoom to match the zoomed content position
                    const scaledX = memoTooltipUnit.coords.x * zoom;
                    const scaledY = memoTooltipUnit.coords.y * zoom;

                    return (
                      <Box
                        key="tooltip"
                        style={{
                          position: "absolute",
                          left: `${scaledX + MAP_PADDING}px`,
                          top: `${scaledY + MAP_PADDING - 25}px`,
                          zIndex: 10000000,
                          pointerEvents: "none",
                          transform: "translate(-50%, -100%)",
                        }}
                      >
                        <MemoizedUnitDetailsCard
                          unitId={getUnitIdToUse}
                          color={activePlayer.color}
                        />
                      </Box>
                    );
                  }, [memoTooltipUnit, activePlayer, zoom, getUnitIdToUse])}

                  {/* Planet Details Tooltip */}
                  {useMemo(() => {
                    if (!tooltipPlanet || !tooltipPlanet.planetId) return null;

                    // Scale the coordinates by zoom to match the zoomed content position
                    const scaledX = tooltipPlanet.coords.x * zoom;
                    const scaledY = tooltipPlanet.coords.y * zoom;

                    // Get planet attachments for this planet
                    const planetAttachmentIds =
                      planetAttachments![tooltipPlanet.planetId] || [];

                    return (
                      <Box
                        key="planet-tooltip"
                        style={{
                          position: "absolute",
                          left: `${scaledX + MAP_PADDING}px`,
                          top: `${scaledY + MAP_PADDING - 25}px`,
                          zIndex: 10000000,
                          pointerEvents: "none",
                          transform: "translate(-50%, -100%)",
                        }}
                      >
                        <MemoizedPlanetDetailsCard
                          planetId={tooltipPlanet.planetId}
                          attachments={planetAttachmentIds}
                        />
                      </Box>
                    );
                  }, [tooltipPlanet, zoom, planetAttachments])}

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

                {/* Drag Handle */}
                <DragHandle onMouseDown={handleSidebarMouseDown} />

                {/* Right Panel Toggle Button */}
                <Box
                  className={`${classes.rightPanelToggle} ${settings.isRightPanelCollapsed ? classes.collapsed : ""}`}
                  onClick={toggleRightPanelCollapsed}
                  style={rightPanelToggleStyle}
                >
                  {settings.isRightPanelCollapsed ? (
                    <IconChevronLeft
                      size={16}
                      className={classes.rightPanelToggleIcon}
                    />
                  ) : (
                    <IconChevronRight
                      size={16}
                      className={classes.rightPanelToggleIcon}
                    />
                  )}
                </Box>

                {/* Sidebar - Right Side (dynamic width) */}
                <Box
                  className={`${classes.sidebar} ${settings.isRightPanelCollapsed ? classes.collapsedRight : ""}`}
                  style={sidebarStyle}
                >
                  {/* Faction Tab Bar */}
                  {playerData && (
                    <FactionTabBar
                      playerData={playerData}
                      selectedArea={memoSelectedArea}
                      activeArea={memoActiveArea}
                      onAreaSelect={handleAreaSelect}
                      onAreaMouseEnter={handleAreaMouseEnter}
                      onAreaMouseLeave={handleAreaMouseLeave}
                    />
                  )}

                  {/* Show player card based on active or selected faction */}
                  {playerData && (
                    <PlayerCardDisplay
                      playerData={playerData}
                      activeArea={memoActiveArea || memoSelectedArea}
                      factionToColor={factionToColor}
                      colorToFaction={colorToFaction}
                      planetAttachments={planetAttachments}
                    />
                  )}

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

                  {playerData && !selectedFaction && !activeUnit && (
                    <Center h="200px" className={classes.hoverInstructions}>
                      <Box>
                        <div>Hover over a unit</div>
                        <div>on the map to view</div>
                        <div>player details</div>
                        <div className={classes.hoverInstructionsLine}>
                          Click to pin a player
                        </div>
                      </Box>
                    </Center>
                  )}
                </Box>
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
                  <MemoizedPlayerAreasGrid
                    playerData={playerData}
                    colorToFaction={colorToFaction}
                    factionToColor={factionToColor}
                    planetAttachments={planetAttachments}
                  />
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

// Memoized PlayerCardDisplay component to prevent unnecessary re-renders
const PlayerCardDisplay = React.memo(function PlayerCardDisplay({
  playerData,
  activeArea,
  factionToColor,
  colorToFaction,
  planetAttachments,
}: PlayerCardDisplayProps) {
  if (activeArea?.type === "faction") {
    const playerToShow = useMemo(() => 
      playerData.find((player) => player.faction === activeArea.faction),
      [playerData, activeArea.faction]
    );
    
    if (!playerToShow) return null;

    return (
      <Box className={classes.playerCardsContainer}>
        <Box className={classes.playerCard}>
          <PlayerCardSidebar
            playerData={playerToShow}
            factionToColor={factionToColor}
            colorToFaction={colorToFaction}
            planetAttachments={planetAttachments}
          />
        </Box>
      </Box>
    );
  }

  // For tech mode (when not hovering over a unit), show all players
  if (activeArea?.type === "tech") {
    return (
      <Stack className={classes.playerCardsContainer} gap={0}>
        {playerData.map((player) => (
          <Box key={player.faction} className={classes.playerCard}>
            <PlayerCardSidebarTech
              playerData={player}
              factionToColor={factionToColor}
              colorToFaction={colorToFaction}
            />
          </Box>
        ))}
      </Stack>
    );
  }

  // For components mode (when not hovering over a unit), show all players
  if (activeArea?.type === "components") {
    return (
      <Stack className={classes.playerCardsContainer}>
        {playerData.map((player) => (
          <Box key={player.faction} className={classes.playerCard}>
            <PlayerCardSidebarComponents
              playerData={player}
              factionToColor={factionToColor}
              colorToFaction={colorToFaction}
            />
          </Box>
        ))}
      </Stack>
    );
  }

  if (activeArea?.type === "strength") {
    return (
      <Stack className={classes.playerCardsContainer}>
        {playerData.map((player) => (
          <Box key={player.faction} className={classes.playerCard}>
            <PlayerCardSidebarStrength playerData={player} />
          </Box>
        ))}
      </Stack>
    );
  }

  return null;
}, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.playerData) === JSON.stringify(nextProps.playerData) &&
    JSON.stringify(prevProps.activeArea) === JSON.stringify(nextProps.activeArea) &&
    JSON.stringify(prevProps.factionToColor) === JSON.stringify(nextProps.factionToColor) &&
    JSON.stringify(prevProps.colorToFaction) === JSON.stringify(nextProps.colorToFaction) &&
    JSON.stringify(prevProps.planetAttachments) === JSON.stringify(nextProps.planetAttachments)
  );
});

export function NewMapUI() {
  return (
    <SettingsProvider>
      <NewMapUIContent />
    </SettingsProvider>
  );
}

export default NewMapUI;