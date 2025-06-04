import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { AppShell, Box, Center, Alert, SimpleGrid } from "@mantine/core";
import { Atom } from "react-loading-indicators";
import { IconAlertCircle } from "@tabler/icons-react";
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { usePlayerData } from "./hooks/usePlayerData";
import PlayerCard2 from "./components/PlayerCard2";
// @ts-ignore
import Logo from "./components/Logo";
// @ts-ignore
import { DiscordLogin } from "./components/DiscordLogin";

function PlayerAreasPage() {
  const params = useParams<{ gameId: string }>();
  const gameId = params.gameId!;
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const pixiAppRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    document.title = `${gameId} - Player Areas | Async TI`;
  }, [gameId]);

  // Initialize PIXI viewport outside React render cycle
  useEffect(() => {
    if (!pixiContainerRef.current || pixiAppRef.current) return;

    const initPixi = async () => {
      // Wait a frame to ensure container is properly mounted
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const getViewportSize = () => ({
        width: Math.floor(window.innerWidth),
        height: Math.floor(window.innerHeight * 0.85),
      });

      const initialSize = getViewportSize();

      // Create and initialize PIXI application
      const app = new PIXI.Application();
      await app.init({
        width: initialSize.width,
        height: initialSize.height,
        backgroundColor: 0x1e1e1e,
        antialias: true,
        resizeTo: undefined,
      });

      pixiAppRef.current = app;
      pixiContainerRef.current!.appendChild(app.canvas);
      pixiContainerRef.current!.style.width = `${initialSize.width}px`;
      pixiContainerRef.current!.style.height = `${initialSize.height}px`;

      // Create viewport
      const viewport = new Viewport({
        screenWidth: initialSize.width,
        screenHeight: initialSize.height,
        worldWidth: initialSize.width,
        worldHeight: initialSize.height,
        events: app.renderer.events,
        passiveWheel: false,
        stopPropagation: true,
      });

      app.stage.addChild(viewport);

      // Enable viewport plugins
      viewport.drag().pinch().wheel().decelerate().clampZoom({
        minScale: 0.1,
        maxScale: 5,
      });

      // Resize handler
      const handleResize = () => {
        const newSize = getViewportSize();
        app.renderer.resize(newSize.width, newSize.height);
        viewport.screenWidth = newSize.width;
        viewport.screenHeight = newSize.height;
        viewport.worldWidth = newSize.width;
        viewport.worldHeight = newSize.height;

        if (pixiContainerRef.current) {
          pixiContainerRef.current.style.width = `${newSize.width}px`;
          pixiContainerRef.current.style.height = `${newSize.height}px`;
        }
      };

      window.addEventListener("resize", handleResize);

      // Load content
      await loadViewportContent(viewport, initialSize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    };

    const loadViewportContent = async (
      viewport: Viewport,
      size: { width: number; height: number }
    ) => {
      try {
        const imageUrl = `https://ti4.westaddisonheavyindustries.com/map/pbd9302b/2025-06-04T13%3A58%3A53.674912119.jpg`;
        const texture = await loadImageTexture(imageUrl);

        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0, 0);
        sprite.x = 0;
        sprite.y = 0;
        viewport.addChild(sprite);

        // Calculate zoom level to fit image width to viewport width
        const fitZoom = size.width / texture.width;
        viewport.setZoom(fitZoom);
      } catch (error) {
        // Fallback content
        const fallbackContainer = createFallbackContent();
        fallbackContainer.x = size.width / 2 - 200;
        fallbackContainer.y = size.height / 2 - 150;
        viewport.addChild(fallbackContainer);

        // Set zoom level to fit fallback content width (400px) to viewport width
        const fitZoom = size.width / 400;
        viewport.setZoom(fitZoom);
      }
    };

    const loadImageTexture = (imageUrl: string): Promise<PIXI.Texture> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          try {
            resolve(PIXI.Texture.from(img));
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = imageUrl;
      });
    };

    const createFallbackContent = () => {
      const container = new PIXI.Container();

      const graphics = new PIXI.Graphics();
      graphics
        .roundRect(0, 0, 400, 300, 20)
        .fill(0x3b82f6)
        .stroke({ width: 4, color: 0xffffff });

      const text = new PIXI.Text({
        text: "Image failed to load\nViewport is working!",
        style: {
          fontFamily: "Arial",
          fontSize: 24,
          fill: 0xffffff,
          align: "center",
        },
      });
      text.anchor.set(0.5);
      text.x = 200;
      text.y = 150;

      container.addChild(graphics, text);
      return container;
    };

    let cleanup: (() => void) | undefined;

    initPixi()
      .then((cleanupFn) => {
        cleanup = cleanupFn;
      })
      .catch(console.error);

    return () => {
      if (cleanup) cleanup();
      if (pixiAppRef.current) {
        pixiAppRef.current.destroy(true);
        pixiAppRef.current = null;
      }
    };
  }, []);

  const { data, isLoading, isError } = usePlayerData(gameId);
  const playerData = data?.playerData;

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
        <Box p="md" style={{ background: "#171b2c", minHeight: "100vh" }}>
          <Box p="xs" hiddenFrom="sm">
            <DiscordLogin />
          </Box>

          {/* PIXI Viewport Container */}
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <div
              ref={pixiContainerRef}
              style={{
                overflow: "hidden",
              }}
            />
          </Box>

          {isLoading && (
            <Center h="calc(100vh - 200px)">
              <Atom color="#3b82f6" size="large" text="Loading Player Areas" />
            </Center>
          )}

          {isError && (
            <Center h="calc(100vh - 200px)">
              <Alert
                variant="light"
                color="red"
                title="Error loading player data"
                icon={<IconAlertCircle />}
              >
                Could not load player data for game {gameId}. Please try again
                later.
              </Alert>
            </Center>
          )}

          {playerData && (
            <SimpleGrid
              cols={{
                base: 1,
                xl5: 2,
              }}
              // gutter="lg"
            >
              {playerData.map((player) => (
                <PlayerCard2
                  key={player.color}
                  playerData={player}
                  colorToFaction={colorToFaction}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}

export default PlayerAreasPage;
