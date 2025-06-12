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
} from "@mantine/core";
import {
  IconAlertCircle,
  IconMap2,
  IconTarget,
  IconUsers,
  IconRefresh,
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
import { lookupUnitId } from "./lookup/units";
import PlayerCardSidebarTech from "./components/PlayerCardSidebarTech";
import PlayerCardSidebarComponents from "./components/PlayerCardSidebarComponents";
import { PlanetDetailsCard } from "./components/PlayerArea/PlanetDetailsCard";
import ScoreBoard from "./components/ScoreBoard";
import { UpdateNeededScreen } from "./components/UpdateNeededScreen";

// Magic constant for required version schema
const REQUIRED_VERSION_SCHEMA = 2;

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
  | null;

type PlayerCardDisplayProps = {
  playerData: any[];
  activeArea: ActiveArea;
  factionToColor: Record<string, string>;
  colorToFaction: Record<string, string>;
  planetAttachments: Record<string, string[]>;
};

export function NewMapUI() {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid!;

  // Use tab management hook for NewMapUI
  const { activeTabs, changeTab, removeTab } = useTabManagementNewUI();

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
    isLoading,
    ringCount = 3,
  } = enhancedData || {};
  const data = enhancedData;

  useEffect(() => {
    document.title = `${gameId} - Async TI`;
  }, [gameId]);

  // Initialize dragscroll
  useEffect(() => {
    dragscroll.reset();
  }, []);

  const {
    zoom,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleZoomScreenSize,
  } = useZoom(undefined, undefined);

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
          style={{
            flexWrap: "nowrap",
            maxWidth: "100vw",
            background:
              "linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
            borderBottom: "1px solid rgba(59, 130, 246, 0.15)",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
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
          <Tabs defaultValue="map" h="calc(100vh - 60px)">
            <Tabs.List grow justify="center" className={classes.tabsList}>
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
            </Tabs.List>

            {/* Map Tab */}
            <Tabs.Panel value="map" h="calc(100% - 37px)">
              <Box className={classes.mapContainer}>
                {/* Map Container - Left Side (dynamic width) */}
                <Box
                  className={`dragscroll ${classes.mapArea}`}
                  style={{ width: `${100 - sidebarWidth}%` }}
                >
                  <div
                    className={classes.zoomControlsFixed}
                    style={{
                      right: `calc(${sidebarWidth}vw + 35px)`,
                      transition: isDragging ? "none" : "right 0.1s ease",
                      zIndex: 10000,
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
                    style={{
                      position: "relative",
                      ...(isFirefox ? {} : { zoom: zoom }),
                      MozTransform: `scale(${zoom})`,
                      MozTransformOrigin: "top left",
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
                          onUnitMouseOver={handleUnitMouseEnter}
                          onUnitMouseLeave={handleUnitMouseLeave}
                          onUnitSelect={handleMouseDown}
                          onPlanetHover={handlePlanetMouseEnter}
                          onPlanetMouseLeave={handlePlanetMouseLeave}
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
                      lookupUnitId(
                        tooltipUnit.unitId,
                        activePlayer.faction,
                        activePlayer
                      ) || tooltipUnit.unitId;

                    return (
                      <Box
                        key="tooltip"
                        style={{
                          position: "absolute",
                          left: `${scaledX}px`,
                          top: `${scaledY - 25}px`,
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
                          left: `${scaledX}px`,
                          top: `${scaledY - 25}px`,
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

                {/* Sidebar - Right Side (dynamic width) */}
                <Box
                  className={classes.sidebar}
                  style={{ width: `${sidebarWidth}%` }}
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

  return null;
}

export default NewMapUI;
