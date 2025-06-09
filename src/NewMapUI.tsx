import { useCallback, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  AppShell,
  Box,
  Center,
  Alert,
  SimpleGrid,
  Tabs,
  Stack,
} from "@mantine/core";
import { Atom } from "react-loading-indicators";
import { IconAlertCircle } from "@tabler/icons-react";
import { usePlayerData } from "./hooks/usePlayerData";
// @ts-ignore
import { useMapSocket } from "./hooks/useMapSocket";
// @ts-ignore
import { ZoomControls } from "./components/ZoomControls";
// @ts-ignore
import Logo from "./components/Logo";
// @ts-ignore
import { DiscordLogin } from "./components/DiscordLogin";
import "./components/ScrollMap.css";
// @ts-ignore
import * as dragscroll from "dragscroll";
import PlayerCard2Mid from "./components/PlayerCard2Mid";
import { MapTile } from "./components/Map/MapTile";
import { PlayerStatsArea } from "./components/Map/PlayerStatsArea";
import classes from "./components/MapUI.module.css";
import { calculateTilePositions } from "./mapgen/tilePositioning";
import { useZoom } from "./hooks/useZoom";
import { FactionTabBar } from "./components/FactionTabBar";
import { useTabsAndTooltips } from "./hooks/useTabsAndTooltips";
import PlayerCardSidebar from "./components/PlayerCardSidebar";
import { DragHandle } from "./components/DragHandle";
import { UnitDetailsCard } from "./components/PlayerArea/UnitDetailsCard";
import { lookupUnitId } from "./lookup/units";
import PlayerCardSidebarTech from "./components/PlayerCardSidebarTech";
import PlayerCardSidebarComponents from "./components/PlayerCardSidebarComponents";

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
};

export function NewMapUI() {
  const params = useParams<{ gameId: string }>();
  const gameId = params.gameId!;

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

  const [sidebarWidth, setSidebarWidth] = useState(25);
  const [isDragging, setIsDragging] = useState(false);

  const { data, isLoading, isError } = usePlayerData(gameId);
  const playerData = data?.playerData;

  // Calculate tile positions from playerData response
  const tilePositions = useMemo(() => {
    if (!data?.tilePositions) return [];
    return calculateTilePositions(data.tilePositions, 6);
  }, [data?.tilePositions]);

  // Create a mapping from systemId to position for unit lookup
  const systemIdToPosition = useMemo(() => {
    if (!data?.tilePositions) return {};
    const mapping: Record<string, string> = {};
    data.tilePositions.forEach((entry: string) => {
      const [position, systemId] = entry.split(":");
      mapping[systemId] = position;
    });
    return mapping;
  }, [data?.tilePositions]);

  const factionToColor = useMemo(
    () =>
      playerData?.reduce(
        (acc, player) => {
          acc[player.faction] = player.color;
          return acc;
        },
        {} as Record<string, string>
      ) || {},
    [playerData]
  );

  const colorToFaction = useMemo(
    () =>
      playerData?.reduce(
        (acc, player) => {
          acc[player.color] = player.faction;
          return acc;
        },
        {} as Record<string, string>
      ) || {},
    [playerData]
  );

  useEffect(() => {
    document.title = `${gameId} - Map Rendering | Async TI`;
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

  // Add drag handlers for resizing
  const handleSidebarMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const containerWidth = window.innerWidth;
      const newSidebarWidth = Math.max(
        15,
        Math.min(50, ((containerWidth - e.clientX) / containerWidth) * 100)
      );
      setSidebarWidth(newSidebarWidth);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Box className={classes.headerContainer}>
          <Logo />
          <div className="logo-divider" />
          <Box className={classes.flexGrow} />
          <Box visibleFrom="sm">
            <DiscordLogin />
          </Box>
        </Box>
      </AppShell.Header>

      <AppShell.Main>
        <Box className={classes.mainBackground}>
          <Box mb="md" hiddenFrom="sm" p="md">
            <DiscordLogin />
          </Box>

          {/* Global Tabs */}
          <Tabs defaultValue="map" h="calc(100vh - 60px)">
            <Tabs.List grow justify="center" className={classes.tabsList}>
              <Tabs.Tab value="map" className={classes.tabsTab}>
                Map
              </Tabs.Tab>
              <Tabs.Tab value="players" className={classes.tabsTab}>
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
                      [`-moz-transform` as string]: `scale(${zoom})`,
                      [`-moz-transform-origin` as string]: "top left",
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
                              vpsToWin={data.vpsToWin}
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
                          onUnitMouseOver={handleMouseEnter}
                          onUnitMouseLeave={handleMouseLeave}
                          onUnitSelect={handleMouseDown}
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
                          top: `${scaledY - 50}px`,
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
                      />
                    ))}
                  </SimpleGrid>
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
          />
        </Box>
      </Box>
    );
  }

  // For tech mode (when not hovering over a unit), show all players
  if (activeArea?.type === "tech") {
    return (
      <Stack className={classes.playerCardsContainer}>
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
