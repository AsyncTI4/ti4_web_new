import { Button, Group, Paper, Text, useMantineTheme } from "@mantine/core";
import { IconRefresh, IconLogin, IconLock } from "@tabler/icons-react";
import { useRefreshMap } from "@/hooks/useRefreshMap";
import { DiscordLogin } from "@/domains/auth/DiscordLogin";
import { MapViewportCenter } from "@/shared/ui/MapViewportCenter";
import type { MapImageError } from "@/hooks/useMapImage";

type MapImageErrorDialogProps = {
  gameId: string;
  error?: MapImageError | Error | null;
};

function isMapImageError(error: unknown): error is MapImageError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as MapImageError).status === "number"
  );
}

export function MapImageErrorDialog({ gameId, error }: MapImageErrorDialogProps) {
  const theme = useMantineTheme();
  const refreshMutation = useRefreshMap(gameId);

  const mapError = isMapImageError(error) ? error : null;
  const requiresAuth = mapError?.requiresAuth;
  const notParticipant = mapError?.notParticipant;

  return (
    <MapViewportCenter>
      <Paper
        shadow="md"
        radius="md"
        p="lg"
        withBorder
        style={{
          background: theme.colors.dark[7],
          maxWidth: 520,
          width: "90%",
        }}
      >
        {requiresAuth ? (
          <>
            <Group gap="xs" mb="xs">
              <IconLogin size={24} color={theme.colors.blue[4]} />
              <Text fw={700} fz="lg" c={theme.colors.blue[4]}>
                Login Required
              </Text>
            </Group>
            <Text mb="md">
              This is a Fog of War game. Please log in with Discord to view your
              personalized map.
            </Text>
            <Group justify="center">
              <DiscordLogin />
            </Group>
          </>
        ) : notParticipant ? (
          <>
            <Group gap="xs" mb="xs">
              <IconLock size={24} color={theme.colors.orange[4]} />
              <Text fw={700} fz="lg" c={theme.colors.orange[4]}>
                Access Restricted
              </Text>
            </Group>
            <Text mb="md">
              This is a Fog of War game and you are not a participant. Only
              players in this game can view the map.
            </Text>
          </>
        ) : (
          <>
            <Text fw={700} fz="lg" mb="xs" c={theme.colors.red[4]}>
              Could not load the map image
            </Text>
            <Text mb="md">
              The server did not provide a map image for game {gameId}. You can
              request a refresh to generate a new image.
            </Text>
            {refreshMutation.isError ? (
              <Text c={theme.colors.red[5]} mb="sm">
                {refreshMutation.error?.message ||
                  "Failed to request refresh. Please try again."}
              </Text>
            ) : undefined}
            {!refreshMutation.isSuccess ? (
              <Group justify="center">
                <Button
                  variant="filled"
                  size="md"
                  radius="xl"
                  leftSection={<IconRefresh size={20} />}
                  onClick={() => refreshMutation.mutate()}
                  loading={refreshMutation.isPending}
                  disabled={refreshMutation.isPending}
                >
                  Request Refresh
                </Button>
              </Group>
            ) : (
              <Group justify="center">
                <Text c={theme.colors.green[4]}>
                  Refresh requested. Waiting for update...
                </Text>
              </Group>
            )}
          </>
        )}
      </Paper>
    </MapViewportCenter>
  );
}

export default MapImageErrorDialog;
