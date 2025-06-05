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

// Zoom configuration from ScrollMap
const defaultZoomIndex = 2;
const zoomLevels = [0.4, 0.5, 0.75, 0.85, 1, 1.2, 1.4, 1.6, 1.8, 2];

function PlayerAreasPage4() {
  const params = useParams<{ gameId: string }>();
  const gameId = params.gameId!;

  // Add active faction state
  const [activeFaction, setActiveFaction] = useState<string | null>(null);
  // Add selected faction state for pinned player
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);

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
  console.log(factionCoordinates);

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

  // Optimized hover handlers
  const handleMouseEnter = useCallback((faction: string) => {
    setActiveFaction(faction);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveFaction(null);
  }, []);

  // Add click handler for pinning players
  const handleClick = useCallback((faction: string) => {
    setSelectedFaction(faction);
  }, []);

  // Add tab click handler
  const handleTabClick = useCallback((faction: string) => {
    setSelectedFaction(faction);
    setActiveFaction(null); // Clear any hover state
  }, []);

  // Create optimized faction coordinate handlers
  const factionHandlers = useMemo(() => {
    if (!factionCoordinates) return {};

    const handlers: Record<
      string,
      {
        onMouseEnter: () => void;
        onClick: () => void;
        onMouseLeave: () => void;
      }
    > = {};

    Object.keys(factionCoordinates).forEach((faction) => {
      handlers[faction] = {
        onMouseEnter: () => handleMouseEnter(faction),
        onClick: () => handleClick(faction),
        onMouseLeave: handleMouseLeave,
      };
    });

    return handlers;
  }, [factionCoordinates, handleMouseEnter, handleClick, handleMouseLeave]);

  // Add drag handlers for resizing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
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
                        factionHandlers={factionHandlers}
                        zoom={zoom}
                        zoomFitToScreen={zoomFitToScreen}
                      />
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
                  onMouseDown={handleMouseDown}
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
                          const isActive = activeFaction === player.faction;
                          const isPinned = selectedFaction === player.faction;

                          return (
                            <Box
                              key={player.color}
                              onClick={() => handleTabClick(player.faction)}
                              onMouseEnter={() =>
                                handleMouseEnter(player.faction)
                              }
                              onMouseLeave={handleMouseLeave}
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
                          (player) => player.faction === activeFaction
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

                  {playerData && !activeFaction && !selectedFaction && (
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
