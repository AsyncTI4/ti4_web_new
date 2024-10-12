import {
  Alert,
  AppShell,
  Box,
  Button,
  Card,
  Group,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useMaps } from "./hooks/useMaps";
import { FullScreenLoader } from "./components/FullScreenLoader";
import { useNavigate } from "react-router-dom";
import { IconAlertCircle } from "@tabler/icons-react";
import Logo from "./components/Logo";
import { DiscordLogin } from "./components/DiscordLogin";
import { useEffect } from "react";

function GamesPage() {
  useEffect(() => {
    document.title = `Async TI`;
  }, []);
  const navigate = useNavigate();
  const mapsQuery = useMaps();
  const games = mapsQuery.data?.filter((v) => !v.MapName.includes("fow")) ?? [];

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group align="center" h="100%" px="sm" gap="sm">
          <Logo />
          <div className="logo-divider" />
          <div style={{ flexGrow: 1 }} />
          <Box visibleFrom="sm">
            <DiscordLogin />
          </Box>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Box m="lg">
          {mapsQuery.isLoading && <FullScreenLoader />}
          {mapsQuery.isError && (
            <Alert
              variant="light"
              color="red"
              title="Error loading maps"
              icon={<IconAlertCircle />}
            >
              Please try again later.
            </Alert>
          )}
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing="md"
            verticalSpacing="md"
          >
            {games.map((game) => (
              <Card
                key={game.MapName}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                onClick={() => navigate(`/game/${game.MapName}`)}
                style={{ cursor: "pointer" }}
              >
                <Card.Section></Card.Section>

                <Text fw={500} size="lg" mt="md">
                  {game.MapName}
                </Text>

                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  View Now
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}

export default GamesPage;
