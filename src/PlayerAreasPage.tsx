import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppShell, Box, Stack, Center, Alert, SimpleGrid } from "@mantine/core";
import { Atom } from "react-loading-indicators";
import { IconAlertCircle } from "@tabler/icons-react";
import { usePlayerData } from "./hooks/usePlayerData";
import PlayerCard2 from "./components/PlayerCard2";
// @ts-ignore
import Logo from "./components/Logo";
// @ts-ignore
import { DiscordLogin } from "./components/DiscordLogin";

function PlayerAreasPage() {
  const params = useParams<{ gameId: string }>();
  const gameId = params.gameId!;

  useEffect(() => {
    document.title = `${gameId} - Player Areas | Async TI`;
  }, [gameId]);

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
        <Box p="md" style={{ background: "#171b2c", minHeight: "100vh" }}>
          <Box p="xs" hiddenFrom="sm">
            <DiscordLogin />
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
