import {
  Alert,
  Box,
  Button,
  Card,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useMaps } from "./hooks/useMaps";
import { MapViewportLoader } from "@/shared/ui/primitives/MapViewportLoader";
import { useNavigate } from "react-router-dom";
import { IconAlertCircle } from "@tabler/icons-react";
import { useDocumentTitle } from "./hooks/useDocumentTitle";
import { PageShell } from "@/shared/ui/PageShell";

function GamesPage() {
  useDocumentTitle("AsyncTI4");
  const navigate = useNavigate();
  const mapsQuery = useMaps();
  const games =
    mapsQuery.data
      ?.filter((v) => !v.MapName.includes("fow"))
      .sort((a, b) => a.MapName.localeCompare(b.MapName)) ?? [];

  return (
    <PageShell footer>
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
    </PageShell>
  );
}

export default GamesPage;
