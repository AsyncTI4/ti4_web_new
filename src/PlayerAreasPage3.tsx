import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppShell, Box, Center, Alert, SimpleGrid, Tabs } from "@mantine/core";
import { Atom } from "react-loading-indicators";
import { IconAlertCircle } from "@tabler/icons-react";
import { usePlayerData } from "./hooks/usePlayerData";
// @ts-ignore
import { ZoomControls } from "./components/ZoomControls";
// @ts-ignore
import Logo from "./components/Logo";
// @ts-ignore
import { DiscordLogin } from "./components/DiscordLogin";

import TechPlayerCard from "./components/TechPlayerCard";
import ResourcesPlayerCard from "./components/ResourcesPlayerCard";
import ComponentsPlayerCard from "./components/ComponentsPlayerCard";
import "./components/ScrollMap.css";
// @ts-ignore
import * as dragscroll from "dragscroll";

// Zoom configuration from ScrollMap
const defaultZoomIndex = 2;
const zoomLevels = [0.4, 0.5, 0.75, 0.85, 1, 1.2, 1.4, 1.6, 1.8, 2];

function PlayerAreasPage3() {
  const params = useParams<{ gameId: string }>();
  const gameId = params.gameId!;

  useEffect(() => {
    document.title = `${gameId} - Player Areas | Async TI`;
  }, [gameId]);

  // Initialize dragscroll
  useEffect(() => {
    dragscroll.reset();
  }, []);

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
      setContainerWidth(window.innerWidth * 0.75);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: playerData, isLoading, isError } = usePlayerData(gameId);

  // Create color to faction mapping from player data
  const colorToFaction =
    playerData?.reduce(
      (acc, player) => {
        acc[player.color] = player.faction;
        return acc;
      },
      {} as Record<string, string>
    ) || {};

  const imageUrl = `https://ti4.westaddisonheavyindustries.com/map/pbd9302b/2025-06-04T13%3A58%3A53.674912119.jpg`;

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Box
          h="100%"
          px="sm"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Logo />
          <div className="logo-divider" />
          <Box style={{ flexGrow: 1 }} />
          <Box visibleFrom="sm">
            <DiscordLogin />
          </Box>
        </Box>
      </AppShell.Header>

      <AppShell.Main>
        <Box
          style={{
            background: "#171b2c",
            minHeight: "calc(100vh - 60px)",
            display: "flex",
          }}
        >
          {/* ScrollMap Viewport - Left Side (75% width) */}
          <Box
            className="dragscroll"
            style={{
              width: "75%",
              height: "calc(100vh - 60px)",
              position: "relative",
              overflow: "auto",
            }}
          >
            {!isTouchDevice() && (
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  left: "15px",
                  zIndex: 1000,
                }}
              >
                <ZoomControls
                  zoom={zoom}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onZoomReset={handleZoomReset}
                  onZoomScreenSize={handleZoomScreenSize}
                  zoomFitToScreen={zoomFitToScreen}
                />
              </div>
            )}

            {imageUrl ? (
              <img
                alt="map"
                src={imageUrl}
                onLoad={(e) =>
                  setImageNaturalWidth(e.currentTarget.naturalWidth)
                }
                style={{
                  ...(isFirefox ? {} : { zoom: zoom }),
                  [`-moz-transform` as string]: `scale(${zoom})`,
                  [`-moz-transform-origin` as string]: "top left",
                  ...(zoomFitToScreen ? { width: "100%", height: "100%" } : {}),
                  display: "block",
                }}
              />
            ) : (
              <Center h="100%">
                <Atom color="#3b82f6" size="medium" text="Loading Map" />
              </Center>
            )}
          </Box>

          {/* Player Areas - Right Side (25% width) */}
          <Box
            style={{
              width: "25%",
              height: "calc(100vh - 80px)",
              overflowY: "auto",
              padding: "16px",
              borderLeft: "1px solid #2c2e33",
              background: "black",
            }}
          >
            <Box mb="md" hiddenFrom="sm">
              <DiscordLogin />
            </Box>

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
                Could not load player data for game {gameId}. Please try again
                later.
              </Alert>
            )}

            {playerData && (
              <Tabs defaultValue="tech" mb="lg">
                <Tabs.List grow justify="center">
                  <Tabs.Tab
                    value="tech"
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      padding: "16px 24px",
                    }}
                  >
                    Tech
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="components"
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      padding: "16px 24px",
                    }}
                  >
                    Components
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="resources"
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      padding: "16px 24px",
                    }}
                  >
                    Resources
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="components">
                  <SimpleGrid cols={1} spacing="md">
                    {playerData.map((player) => (
                      <ComponentsPlayerCard
                        key={player.color}
                        playerData={player}
                        colorToFaction={colorToFaction}
                      />
                    ))}
                  </SimpleGrid>
                </Tabs.Panel>

                <Tabs.Panel value="tech">
                  <SimpleGrid cols={1} spacing="md">
                    {playerData.map((player) => (
                      <TechPlayerCard key={player.color} playerData={player} />
                    ))}
                  </SimpleGrid>
                </Tabs.Panel>

                <Tabs.Panel value="resources">
                  <SimpleGrid cols={1} spacing="md">
                    {playerData.map((player) => (
                      <ResourcesPlayerCard
                        key={player.color}
                        playerData={player}
                      />
                    ))}
                  </SimpleGrid>
                </Tabs.Panel>
              </Tabs>
            )}
          </Box>
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

export default PlayerAreasPage3;
