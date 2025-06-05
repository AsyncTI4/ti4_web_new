import { useCallback, useEffect, useState, useMemo } from "react";
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
import { usePlayerData } from "./hooks/usePlayerData";
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
import PlayerCardCompact from "./components/PlayerCard2Compact";
import { cdnImage } from "./data/cdnImage";
import FactionCoordinateBoxes from "./components/FactionCoordinateBoxes";
import classes from "./components/PlayerAreasPage4.module.css";
import { UnitDetailsCard } from "./components/PlayerArea/UnitDetailsCard";
import { units } from "./data/units";
import { PlayerData } from "./data/pbd10242";

// Zoom configuration from ScrollMap
const defaultZoomIndex = 2;
const zoomLevels = [0.4, 0.5, 0.75, 0.85, 1, 1.2, 1.4, 1.6, 1.8, 2];

// Function to lookup units.ts ID from async ID and faction
function lookupUnitId(
  asyncId: string,
  faction: string,
  playerData?: PlayerData
): string | null {
  if (!playerData?.unitsOwned) {
    // Fallback to old logic if no player data
    return lookupUnitIdFallback(asyncId, faction);
  }

  // First try to find a faction-specific unit that the player owns
  const factionSpecificUnits = units.filter(
    (unit) =>
      unit.asyncId === asyncId &&
      unit.faction &&
      unit.faction.toLowerCase() === faction.toLowerCase() &&
      playerData.unitsOwned.includes(unit.id)
  );

  if (factionSpecificUnits.length > 0) {
    // Prefer upgraded versions (they typically have upgradesFromUnitId)
    const upgradedUnit = factionSpecificUnits.find(
      (unit) => unit.upgradesFromUnitId
    );
    return upgradedUnit?.id || factionSpecificUnits[0].id;
  }

  // Fall back to generic units that the player owns
  const genericUnits = units.filter(
    (unit) =>
      unit.asyncId === asyncId &&
      !unit.faction &&
      playerData.unitsOwned.includes(unit.id)
  );

  if (genericUnits.length > 0) {
    // Prefer upgraded versions
    const upgradedUnit = genericUnits.find((unit) => unit.upgradesFromUnitId);
    return upgradedUnit?.id || genericUnits[0].id;
  }

  // Final fallback to old logic
  return lookupUnitIdFallback(asyncId, faction);
}

// Fallback function (original logic)
function lookupUnitIdFallback(asyncId: string, faction: string): string | null {
  // First try to find a faction-specific unit
  const factionSpecificUnit = units.find(
    (unit) =>
      unit.asyncId === asyncId &&
      unit.faction &&
      unit.faction.toLowerCase() === faction.toLowerCase()
  );

  if (factionSpecificUnit) {
    return factionSpecificUnit.id;
  }

  // Fall back to generic unit
  const genericUnit = units.find(
    (unit) => unit.asyncId === asyncId && !unit.faction
  );

  return genericUnit?.id || null;
}

function PlayerAreasPage4() {
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

  // Add resizable sidebar state
  const [sidebarWidth, setSidebarWidth] = useState(25); // percentage
  const [isDragging, setIsDragging] = useState(false);

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
  const [containerWidth, setContainerWidth] = useState(
    window.innerWidth * 0.75
  );

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

  const { data, isLoading, isError } = usePlayerData(gameId);
  const playerData = data?.playerData;
  const factionCoordinates = data?.factionCoordinates;

  // Create color to faction mapping from player data
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
                    <Box className={classes.factionTabBar}>
                      <Group gap={4} justify="center" wrap="wrap">
                        {playerData.map((player) => {
                          const isActive =
                            activeUnit?.faction === player.faction;
                          const isPinned = selectedFaction === player.faction;

                          return (
                            <Box
                              key={player.color}
                              onClick={() => handleTabClick(player.faction)}
                              onMouseEnter={() =>
                                handleTabMouseEnter(player.faction)
                              }
                              onMouseLeave={() => handleTabMouseLeave()}
                              className={`${classes.factionTab} ${
                                isPinned
                                  ? classes.factionTabPinned
                                  : isActive
                                    ? classes.factionTabActive
                                    : ""
                              }`}
                            >
                              <Image
                                src={cdnImage(
                                  `/factions/${player.faction}.png`
                                )}
                                alt={player.faction}
                                w={24}
                                h={24}
                                className={`${classes.factionImage} ${
                                  isPinned
                                    ? classes.factionImagePinned
                                    : isActive
                                      ? classes.factionImageActive
                                      : ""
                                }`}
                              />
                            </Box>
                          );
                        })}
                      </Group>
                    </Box>
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
                            <PlayerCardCompact
                              playerData={playerToShow}
                              colorToFaction={colorToFaction}
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
                        colorToFaction={colorToFaction}
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

// Custom zoom hook adapted from ScrollMap
function useZoom(
  imageNaturalWidth: number | undefined,
  containerWidth: number
) {
  const [zoomIndex, setZoomIndex] = useState(() => {
    const savedZoomIndex = localStorage.getItem("zoomIndex");
    if (savedZoomIndex !== null) {
      return parseInt(savedZoomIndex, 10);
    }
    return isTouchDevice() ? 0 : defaultZoomIndex;
  });

  const [zoomFitToScreen, setZoomFitToScreen] = useState(() => {
    const savedZoomFitToScreen = localStorage.getItem("zoomFitToScreen");
    return savedZoomFitToScreen === "true";
  });

  const handleZoomIn = useCallback(() => {
    setZoomIndex((prevIndex) => {
      const newIndex = Math.min(prevIndex + 1, zoomLevels.length - 1);
      changeZoomIndex(newIndex);
      changeZoomFitToScreen(false);
      return newIndex;
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomIndex((prevIndex) => {
      const newIndex = Math.max(prevIndex - 1, 0);
      changeZoomIndex(newIndex);
      changeZoomFitToScreen(false);
      return newIndex;
    });
  }, []);

  const handleZoomReset = useCallback(() => {
    const resetIndex = isTouchDevice() ? 0 : defaultZoomIndex;
    changeZoomIndex(resetIndex);
    changeZoomFitToScreen(false);
  }, []);

  const changeZoomIndex = (val: number) => {
    setZoomIndex(val);
    localStorage.setItem("zoomIndex", val.toString());
  };

  const changeZoomFitToScreen = (val: boolean) => {
    setZoomFitToScreen(val);
    localStorage.setItem("zoomFitToScreen", val.toString());
  };

  const handleZoomScreenSize = useCallback(() => {
    changeZoomFitToScreen(!zoomFitToScreen);
  }, [zoomFitToScreen]);

  const overlayZoom = imageNaturalWidth
    ? containerWidth / imageNaturalWidth
    : 1;
  const zoom = zoomLevels[zoomIndex];

  return {
    zoom: zoomFitToScreen ? 1 : zoom,
    overlayZoom: zoomFitToScreen ? overlayZoom : zoom,
    zoomFitToScreen,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleZoomScreenSize,
  };
}

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

export default PlayerAreasPage4;
