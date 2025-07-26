import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AppShell,
  Box,
  Center,
  Alert,
  SimpleGrid,
  Tabs,
  Stack,
  Button,
  Group,
  Text,
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
  IconLinkPlus,
  IconCrosshair,
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
import { FactionTabBar } from "./components/FactionTabBar";
import { useTabsAndTooltips } from "./hooks/useTabsAndTooltips";
import { useSidebarDragHandle } from "./hooks/useSidebarDragHandle";
import PlayerCardSidebar from "./components/PlayerCardSidebar";
import { DragHandle } from "./components/DragHandle";
import { UnitDetailsCard } from "./components/PlayerArea/UnitDetailsCard";
import { lookupUnit } from "./lookup/units";
import PlayerCardSidebarTech from "./components/PlayerCardSidebarTech";
import PlayerCardSidebarComponents from "./components/PlayerCardSidebarComponents";
import { PlanetDetailsCard } from "./components/PlayerArea/PlanetDetailsCard";
import ScoreBoard from "./components/ScoreBoard";
import { UpdateNeededScreen } from "./components/UpdateNeededScreen";
import { CompactObjectives } from "./components/PlayerArea/CompactObjectives";
import { CompactLaw } from "./components/PlayerArea/CompactLaw";
import { LawDetailsCard } from "./components/PlayerArea/LawDetailsCard";
import { PointTotals } from "./components/PlayerArea/PointTotals";
import { SmoothPopover } from "./components/shared/SmoothPopover";
import PlayerCardSidebarStrength from "./components/PlayerCardSidebarStrength";
import { SettingsProvider, useSettings } from "./context/SettingsContext";
import { SettingsModal } from "./components/SettingsModal";
import { processSystemSpaceCannon } from "./utils/spaceCannonProcessor";

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
    toggleAttachmentsMode,
    togglePDSMode,
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

  // State for law popover
  const [selectedLaw, setSelectedLaw] = useState<string | null>(null);

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

  // Panel collapse toggle now managed by settings context

  const { sidebarWidth, isDragging, handleSidebarMouseDown } =
    useSidebarDragHandle(30);

  // Use enhanced player data hook that computes all derived values
  const enhancedData = usePlayerDataEnhanced(gameId);

  // Track if this is the first socket connection to avoid refetching on initial connect
  const hasConnectedBefore = useRef(false);
  // socket connection for real-time updates
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

  // Reset scroll flag when switching games
  useEffect(() => {
    if (lastGameId.current !== gameId) {
      hasSetInitialScroll.current = false;
      lastGameId.current = gameId;
    }
  }, [gameId]);

  // Set initial scroll positicurson only once when loading a new game
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
              <Button
                variant={settings.attachmentsMode ? "filled" : "subtle"}
                size="sm"
                color={settings.attachmentsMode ? "cyan" : "gray"}
                style={{ height: "36px", minWidth: "36px" }}
                px={8}
                onClick={toggleAttachmentsMode}
              >
                <IconLinkPlus size={16} />
              </Button>
              <Button
                variant={settings.pdsMode ? "filled" : "subtle"}
                size="sm"
                color={settings.pdsMode ? "cyan" : "gray"}
                style={{ height: "36px", minWidth: "36px" }}
                px={8}
                onClick={togglePDSMode}
              >
                <IconCrosshair size={16} />
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
                  {/* Left Panel - Only render when there's data */}
                  {(objectives && playerData) ||
                    (lawsInPlay && lawsInPlay.length > 0) ? (
                    <>
                      {/* Left Sidebar Overlay */}
                      <Box
                        className={`${classes.leftSidebarOverlay} ${settings.isLeftPanelCollapsed ? classes.collapsed : ""}`}
                      >
                        <Stack p="md" gap="md">
                          {objectives && playerData && (
                            <Box>
                              {/* Game Info */}
                              {playerData[0] && (
                                <Stack gap={1} mb="xs">
                                  <Text size="md" c="gray.1" ff="heading">
                                    {data.gameName}
                                    {data.gameCustomName &&
                                      ` - ${data.gameCustomName}`}
                                  </Text>
                                  <Text size="md" c="gray.3">
                                    Round {data.gameRound}
                                  </Text>
                                </Stack>
                              )}
                              <h3 className={classes.sectionHeading}>
                                Public Objectives
                              </h3>

                              <CompactObjectives
                                objectives={objectives}
                                playerData={playerData}
                              />
                            </Box>
                          )}

                          {/* Point Totals */}
                          {playerData && (
                            <Box>
                              <h3 className={classes.sectionHeading}>
                                Point Totals ({vpsToWin} VP)
                              </h3>
                              <PointTotals
                                playerData={playerData}
                                vpsToWin={vpsToWin}
                              />
                            </Box>
                          )}

                          {/* Laws in Play */}
                          {lawsInPlay && lawsInPlay.length > 0 && (
                            <Box>
                              <h3 className={classes.sectionHeading}>
                                Laws in Play
                              </h3>
                              <Stack gap={2}>
                                {lawsInPlay.map((law, index) => (
                                  <SmoothPopover
                                    key={`${law.id}-${index}`}
                                    position="right"
                                    opened={
                                      selectedLaw === `${law.id}-${index}`
                                    }
                                    onChange={(opened) =>
                                      setSelectedLaw(
                                        opened ? `${law.id}-${index}` : null
                                      )
                                    }
                                  >
                                    <SmoothPopover.Target>
                                      <div>
                                        <CompactLaw
                                          law={law}
                                          onClick={() =>
                                            setSelectedLaw(`${law.id}-${index}`)
                                          }
                                        />
                                      </div>
                                    </SmoothPopover.Target>
                                    <SmoothPopover.Dropdown p={0}>
                                      <LawDetailsCard law={law} />
                                    </SmoothPopover.Dropdown>
                                  </SmoothPopover>
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </Stack>
                      </Box>

                      {/* Left Panel Toggle Button */}
                      <Box
                        className={`${classes.leftPanelToggle} ${settings.isLeftPanelCollapsed ? classes.collapsed : ""}`}
                        onClick={toggleLeftPanelCollapsed}
                      >
                        {settings.isLeftPanelCollapsed ? (
                          <IconChevronRight
                            size={16}
                            className={classes.leftPanelToggleIcon}
                          />
                        ) : (
                          <IconChevronLeft
                            size={16}
                            className={classes.leftPanelToggleIcon}
                          />
                        )}
                      </Box>
                    </>
                  ) : null}

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
                      const tileUnitData =
                        position && data?.tileUnitData
                          ? (data.tileUnitData as any)[position]
                          : undefined;
                      const spaceCannonData = data?.tileUnitData && data?.playerData ? {
                        enabled: settings.pdsMode,
                        systemSpaceCannons: processSystemSpaceCannon(tile.systemId, position, data?.tileUnitData, data?.playerData)
                      }
                        : undefined

                      return (
                        <MapTile
                          key={tileKey}
                          ringPosition={tile.ringPosition}
                          systemId={tile.systemId}
                          position={{ x: tile.x, y: tile.y }}
                          tileUnitData={tileUnitData}
                          factionToColor={factionToColor}
                          optimizedColors={optimizedColors}
                          onUnitMouseOver={handleUnitMouseEnter}
                          onUnitMouseLeave={handleUnitMouseLeave}
                          onUnitSelect={handleMouseDown}
                          onPlanetHover={handlePlanetMouseEnter}
                          onPlanetMouseLeave={handlePlanetMouseLeave}
                          techSkipsMode={settings.techSkipsMode}
                          attachmentsMode={settings.attachmentsMode}
                          pdsMode={spaceCannonData}
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

                  {/* Absolutely positioned UnitDetailsCard over hovered unit - outside zoom container */}
                  {(() => {
                    if (
                      !tooltipUnit ||
                      !tooltipUnit.unitId ||
                      !tooltipUnit.faction
                    )
                      return null;

                    const activePlayer = playerData?.find(
                      (player) => player.faction === tooltipUnit.faction
                    );
                    if (!activePlayer) return null;

                    // Scale the coordinates by zoom to match the zoomed content position
                    const scaledX = tooltipUnit.coords.x * zoom;
                    const scaledY = tooltipUnit.coords.y * zoom;

                    const unitIdToUse =
                      lookupUnit(
                        tooltipUnit.unitId,
                        activePlayer.faction,
                        activePlayer
                      )?.id || tooltipUnit.unitId;

                    return (
                      <Box
                        key="tooltip"
                        style={{
                          position: "absolute",
                          left: `${scaledX + MAP_PADDING}px`,
                          top: `${scaledY + MAP_PADDING - 25}px`,
                          zIndex: 10000000,
                          pointerEvents: "none",
                          transform: "translate(-50%, -100%)", // Center horizontally, position above the unit
                        }}
                      >
                        <UnitDetailsCard
                          unitId={unitIdToUse}
                          color={activePlayer.color}
                        />
                      </Box>
                    );
                  })()}

                  {/* Absolutely positioned PlanetDetailsCard over hovered planet - outside zoom container */}
                  {(() => {
                    if (!tooltipPlanet || !tooltipPlanet.planetId) return null;

                    // Scale the coordinates by zoom to match the zoomed content position
                    const scaledX = tooltipPlanet.coords.x * zoom;
                    const scaledY = tooltipPlanet.coords.y * zoom;

                    // Get planet attachments for this planet
                    const planetAttachmentIds =
                      planetAttachments[tooltipPlanet.planetId] || [];

                    return (
                      <Box
                        key="planet-tooltip"
                        style={{
                          position: "absolute",
                          left: `${scaledX + MAP_PADDING}px`,
                          top: `${scaledY + MAP_PADDING - 25}px`,
                          zIndex: 10000000,
                          pointerEvents: "none",
                          transform: "translate(-50%, -100%)", // Center horizontally, position above the planet
                        }}
                      >
                        <PlanetDetailsCard
                          planetId={tooltipPlanet.planetId}
                          attachments={planetAttachmentIds}
                        />
                      </Box>
                    );
                  })()}

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
                  style={{
                    right: settings.isRightPanelCollapsed
                      ? "10px"
                      : `calc(${sidebarWidth}vw + 14px)`,
                    transition: isDragging ? "none" : "right 0.1s ease",
                  }}
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
                  style={{
                    width: settings.isRightPanelCollapsed
                      ? "0%"
                      : `${sidebarWidth}%`,
                  }}
                >
                  {/* Faction Tab Bar */}
                  {playerData && (
                    <FactionTabBar
                      playerData={playerData}
                      selectedArea={selectedArea}
                      activeArea={activeArea}
                      onAreaSelect={handleAreaSelect}
                      onAreaMouseEnter={handleAreaMouseEnter}
                      onAreaMouseLeave={handleAreaMouseLeave}
                    />
                  )}

                  {/* Show player card based on active or selected faction */}
                  {playerData && (
                    <PlayerCardDisplay
                      playerData={playerData}
                      activeArea={activeArea || selectedArea}
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

function PlayerCardDisplay({
  playerData,
  activeArea,
  factionToColor,
  colorToFaction,
  planetAttachments,
}: PlayerCardDisplayProps) {
  if (activeArea?.type === "faction") {
    const playerToShow = playerData.find(
      (player) => player.faction === activeArea.faction
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
}

export function NewMapUI() {
  return (
    <SettingsProvider>
      <NewMapUIContent />
    </SettingsProvider>
  );
}

export default NewMapUI;
