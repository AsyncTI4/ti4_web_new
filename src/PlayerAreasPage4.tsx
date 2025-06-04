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
} from "@mantine/core";
import { Atom } from "react-loading-indicators";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
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

// Zoom configuration from ScrollMap
const defaultZoomIndex = 2;
const zoomLevels = [0.4, 0.5, 0.75, 0.85, 1, 1.2, 1.4, 1.6, 1.8, 2];

function PlayerAreasPage4() {
  const params = useParams<{ gameId: string }>();
  const gameId = params.gameId!;

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
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);

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
      setContainerWidth(window.innerWidth);
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
          }}
        >
          <Box mb="md" hiddenFrom="sm" p="md">
            <DiscordLogin />
          </Box>

          {/* Global Tabs */}
          <Tabs defaultValue="map" h="calc(100vh - 60px)">
            <Tabs.List
              grow
              justify="center"
              style={{
                borderBottom: "1px solid #2c2e33",
                background: "#1a1b23",
              }}
            >
              <Tabs.Tab
                value="map"
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  padding: "16px 24px",
                }}
              >
                Map
              </Tabs.Tab>
              <Tabs.Tab
                value="players"
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  padding: "16px 24px",
                }}
              >
                Player Areas
              </Tabs.Tab>
            </Tabs.List>

            {/* Map Tab */}
            <Tabs.Panel value="map" h="calc(100% - 60px)">
              <Box
                className="dragscroll"
                style={{
                  width: "100%",
                  height: "100%",
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
                      zoomClass="zoomContainer3"
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
                      ...(zoomFitToScreen
                        ? { width: "100%", height: "100%" }
                        : {}),
                      display: "block",
                    }}
                  />
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
                    style={{
                      position: "fixed",
                      top: "200px",
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
            </Tabs.Panel>

            {/* Player Areas Tab */}
            <Tabs.Panel value="players" h="calc(100% - 60px)">
              <Box
                style={{
                  height: "100%",
                  overflowY: "auto",
                  padding: "16px",
                  background: "black",
                }}
              >
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
