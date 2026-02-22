import {
  Alert,
  Anchor,
  AppShell,
  Box,
  Button,
  Card,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useMaps } from "./hooks/useMaps";
import { MapViewportLoader } from "./components/shared/primitives/Loaders";
import { Link, useNavigate } from "react-router-dom";
import { IconAlertCircle } from "@tabler/icons-react";
import { DiscordLogin } from "./components/DiscordLogin";
import { AppHeader } from "./components/shared/AppHeader";
import { useDocumentTitle } from "./hooks/useDocumentTitle";

function GamesPage() {
  useDocumentTitle("AsyncTI4");
  const navigate = useNavigate();
  const mapsQuery = useMaps();
  const games =
    mapsQuery.data
      ?.filter((v) => !v.MapName.includes("fow"))
      .sort((a, b) => a.MapName.localeCompare(b.MapName)) ?? [];

  return (
    <AppShell header={{ height: 60 }}>
      <AppHeader>
        <div style={{ flexGrow: 1 }} />
        <Box visibleFrom="sm">
          <DiscordLogin />
        </Box>
      </AppHeader>
      <AppShell.Main>
        <Box m="lg">
          {mapsQuery.isLoading && <MapViewportLoader />}
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
            cols={{ base: 2, sm: 4, md: 4, lg: 8 }}
            spacing="md"
            verticalSpacing="md"
          >
            {games.map((game) => (
              <Card
                key={game.MapName}
                shadow="sm"
                padding="xs"
                radius="sm"
                withBorder
                onClick={() => navigate(`/game/${game.MapName}`)}
                style={{ cursor: "pointer" }}
              >
                <Text fw={500} size="sm" truncate>
                  {game.MapName}
                </Text>

                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  size="compact-xs"
                  mt="xs"
                  radius="sm"
                >
                  View
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
