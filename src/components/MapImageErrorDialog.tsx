import { Button, Group, Paper, Text, useMantineTheme } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useRefreshMap } from "@/hooks/useRefreshMap";

type MapImageErrorDialogProps = {
  gameId: string;
};

export function MapImageErrorDialog({ gameId }: MapImageErrorDialogProps) {
  const theme = useMantineTheme();
  const refreshMutation = useRefreshMap(gameId);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 110px)",
        width: "100%",
      }}
    >
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
      </Paper>
    </div>
  );
}

export default MapImageErrorDialog;
