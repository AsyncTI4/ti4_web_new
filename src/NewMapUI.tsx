import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AppShell,
  Box,
  Center,
  Alert,
  SimpleGrid,
  Tabs,
  Button,
  Group,
  Image,
} from "@mantine/core";
import { Atom } from "react-loading-indicators";
import {
  IconAlertCircle,
  IconRefresh,
  IconGripVertical,
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
import "./components/ScrollMap.css";
// @ts-ignore
import * as dragscroll from "dragscroll";
import PlayerCard2Mid from "./components/PlayerCard2Mid";
import PlayerCardSidebar from "./components/PlayerCardSidebar";
import FactionCoordinateBoxes from "./components/FactionCoordinateBoxes";
import classes from "./components/PlayerAreasPage4.module.css";
import { UnitDetailsCard } from "./components/PlayerArea/UnitDetailsCard";
import { lookupUnitId } from "./lookup/units";
import { FactionTabBar } from "./components/FactionTabBar";

// Custom hook for resizable sidebar
function useResizableSidebar(initialWidth: number = 25) {
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(
    window.innerWidth * ((100 - initialWidth) / 100)
  );

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

  // Handle window resize to update container width
  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(window.innerWidth * ((100 - sidebarWidth) / 100));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarWidth]);

  // Update container width when sidebar width changes
  useEffect(() => {
    setContainerWidth(window.innerWidth * ((100 - sidebarWidth) / 100));
  }, [sidebarWidth]);

  return {
    sidebarWidth,
    isDragging,
    containerWidth,
    handleSidebarMouseDown,
  };
}

function NewMapUI() {
  const params = useParams<{ gameId: string }>();
  const gameId = params.gameId!;

  // Add active unit state (combines faction, unitId, and coordinates)
  const [activeUnit, setActiveUnit] = useState<{
    faction: string;
    unitId?: string;
    coords: { x: number; y: number };
  } | null>(null);

  // Add separate state for delayed map tooltip
  const [tooltipUnit, setTooltipUnit] = useState<{
    faction: string;
    unitId?: string;
    coords: { x: number; y: number };
  } | null>(null);

  // Add selected faction state for pinned player
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);

  // Add hover delay state and ref for timeout
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);

  // Use the resizable sidebar hook
  const { sidebarWidth, isDragging, containerWidth, handleSidebarMouseDown } =
    useResizableSidebar(25);

  useEffect(() => {
    document.title = `${gameId} - Player Areas | Async TI`;
  }, [gameId]);

  // Initialize dragscroll
  useEffect(() => {
    dragscroll.reset();
  }, []);

  // Clean up hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Dynamic image loading like MapUI
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => setImageUrl(null), [gameId]);

  const { readyState, reconnect, isReconnecting } = useMapSocket(
    gameId,
    setImageUrl
  );

  const [imageNaturalWidth, setImageNaturalWidth] = useState<
    number | undefined
  >(undefined);

  const {
    zoom,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleZoomScreenSize,
    zoomFitToScreen,
  } = useZoom(imageNaturalWidth, containerWidth);

  const isFirefox =
    typeof navigator !== "undefined" &&
    navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

  const {
    playerData,
    colorToFaction,
    factionToColor,
    factionCoordinates,
    isLoading,
    isError,
  } = usePlayerDataEnhanced(gameId);

  // Optimized hover handlers - now include unit ID with delay
  const handleMouseEnter = useCallback(
    (faction: string, unitId: string, x: number, y: number) => {
      // Immediately set activeUnit for sidebar (no delay)
      setActiveUnit({ faction, unitId, coords: { x, y } });

      // Clear any existing timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }

      // Set a new timeout for 300ms delay for map tooltip
      const newTimeout = setTimeout(() => {
        setTooltipUnit({ faction, unitId, coords: { x, y } });
        setHoverTimeout(null);
      }, 300);

      setHoverTimeout(newTimeout);
    },
    [hoverTimeout]
  );

  const handleMouseLeave = useCallback(() => {
    // Clear any pending timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    // Immediately clear both states
    setActiveUnit(null);
    setTooltipUnit(null);
  }, [hoverTimeout]);

  // Add click handler for pinning players
  const handleMouseDown = useCallback((faction: string) => {
    setSelectedFaction(faction);
  }, []);

  // Add tab click handler
  const handleTabClick = useCallback((faction: string) => {
    setSelectedFaction(faction);
    setActiveUnit(null); // Clear any hover state
  }, []);

  // Separate handlers for faction tabs (which don't have specific unit IDs)
  const handleTabMouseEnter = useCallback((faction: string) => {
    setActiveUnit({ faction, coords: { x: 0, y: 0 } });
  }, []);

  const handleTabMouseLeave = useCallback(() => {
    setActiveUnit(null);
  }, []);

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
            <Tabs.Panel value="map" h="calc(100% - 60px)">
              <Box className={classes.mapContainer}>
                {/* Map Container - Left Side (dynamic width) */}
                <Box
                  className={`dragscroll ${classes.mapArea}`}
                  style={{ width: `${100 - sidebarWidth}%` }}
                >
                  {!isTouchDevice() && (
                    <div
                      className={classes.zoomControlsFixed}
                      style={{
                        right: `calc(${sidebarWidth}vw + 35px)`,
                        transition: isDragging ? "none" : "right 0.1s ease",
                      }}
                    >
                      <ZoomControls
                        zoom={zoom}
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        onZoomReset={handleZoomReset}
                        onZoomScreenSize={handleZoomScreenSize}
                        zoomFitToScreen={zoomFitToScreen}
                        zoomClass=""
                      />
                    </div>
                  )}

                  {imageUrl ? (
                    <>
                      <img
                        alt="map"
                        src={imageUrl}
                        onLoad={(e) =>
                          setImageNaturalWidth(e.currentTarget.naturalWidth)
                        }
                        className={classes.mapImage}
                        style={{
                          ...(isFirefox ? {} : { zoom: zoom }),
                          [`-moz-transform` as string]: `scale(${zoom})`,
                          [`-moz-transform-origin` as string]: "top left",
                          ...(zoomFitToScreen
                            ? { width: "100%", height: "100%" }
                            : {}),
                        }}
                      />

                      {/* Faction coordinate boxes */}
                      <FactionCoordinateBoxes
                        factionCoordinates={factionCoordinates}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onMouseDown={handleMouseDown}
                        zoom={zoom}
                        zoomFitToScreen={zoomFitToScreen}
                      />

                      {/* Absolutely positioned UnitDetailsCard over hovered unit */}
                      {tooltipUnit &&
                        tooltipUnit.unitId &&
                        tooltipUnit.faction &&
                        (() => {
                          const activePlayer = playerData?.find(
                            (player) => player.faction === tooltipUnit.faction
                          );
                          if (!activePlayer) return null;

                          const scaledX =
                            tooltipUnit.coords.x * (zoomFitToScreen ? 1 : zoom);
                          const scaledY =
                            tooltipUnit.coords.y * (zoomFitToScreen ? 1 : zoom);

                          return (
                            <Box
                              style={{
                                position: "absolute",
                                left: `${scaledX}px`,
                                top: `${scaledY}px`,
                                zIndex: 1000,
                                pointerEvents: "none",
                                transform: "translate(-50%, -100%)", // Center horizontally, position above the unit
                              }}
                            >
                              <UnitDetailsCard
                                unitId={
                                  lookupUnitId(
                                    tooltipUnit.unitId,
                                    activePlayer.faction,
                                    activePlayer
                                  ) || tooltipUnit.unitId
                                }
                                color={activePlayer.color}
                              />
                            </Box>
                          );
                        })()}
                    </>
                  ) : (
                    <Center h="100%">
                      <Atom color="#3b82f6" size="medium" text="Loading Map" />
                    </Center>
                  )}

                  {/* Refresh button when connection is closed, like MapUI */}
                  {readyState === ReadyState.CLOSED && (
                    <Button
                      variant="filled"
                      size="md"
                      radius="xl"
                      leftSection={<IconRefresh size={20} />}
                      className={classes.refreshButton}
                      onClick={reconnect}
                      loading={isReconnecting}
                    >
                      Refresh
                    </Button>
                  )}
                </Box>

                {/* Drag Handle */}
                <Box
                  className={classes.dragHandle}
                  onMouseDown={handleSidebarMouseDown}
                >
                  <IconGripVertical
                    size={32}
                    className={classes.dragHandleIcon}
                  />
                </Box>

                {/* Sidebar - Right Side (dynamic width) */}
                <Box
                  className={classes.sidebar}
                  style={{ width: `${sidebarWidth}%` }}
                >
                  {/* Faction Tab Bar */}
                  {playerData && (
                    <FactionTabBar
                      playerData={playerData}
                      activeUnit={activeUnit}
                      selectedFaction={selectedFaction}
                      onTabClick={handleTabClick}
                      onTabMouseEnter={handleTabMouseEnter}
                      onTabMouseLeave={handleTabMouseLeave}
                    />
                  )}

                  {isLoading && (
                    <Center h="200px">
                      <Atom
                        color="#3b82f6"
                        size="medium"
                        text="Loading Player Areas"
                      />
                    </Center>
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

                  {/* Pre-render all player cards and show/hide based on activeFaction or selectedFaction */}
                  {playerData && (
                    <Box className={classes.playerCardsContainer}>
                      {(() => {
                        // Find the player to show - hover takes priority over pinned
                        const activePlayer = playerData.find(
                          (player) => player.faction === activeUnit?.faction
                        );
                        const selectedPlayer = playerData.find(
                          (player) => player.faction === selectedFaction
                        );
                        const playerToShow = activePlayer || selectedPlayer;

                        if (!playerToShow) return null;

                        return (
                          <Box className={classes.playerCard}>
                            <PlayerCardSidebar
                              playerData={playerToShow}
                              factionToColor={factionToColor!}
                              colorToFaction={colorToFaction!}
                            />
                          </Box>
                        );
                      })()}
                    </Box>
                  )}

                  {playerData && !activeUnit && !selectedFaction && (
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
                {isLoading && (
                  <Center h="200px">
                    <Atom
                      color="#3b82f6"
                      size="medium"
                      text="Loading Player Areas"
                    />
                  </Center>
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

                {playerData && (
                  <SimpleGrid cols={{ base: 1, xl3: 2 }} spacing="md">
                    {playerData.map((player) => (
                      <PlayerCard2Mid
                        key={player.color}
                        playerData={player}
                        factionToColor={factionToColor!}
                        colorToFaction={colorToFaction!}
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

export default NewMapUI;
