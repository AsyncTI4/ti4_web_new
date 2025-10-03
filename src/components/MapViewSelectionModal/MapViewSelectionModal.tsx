import { Modal, Stack, Text, Button, Group } from "@mantine/core";
import { IconLayoutGrid, IconHandMove } from "@tabler/icons-react";
import { useState } from "react";
import type { MapViewPreference } from "../../utils/mapViewPreference";

type MapViewSelectionModalProps = {
  opened: boolean;
  onClose: () => void;
  onSelect: (preference: MapViewPreference) => void;
};

export function MapViewSelectionModal({
  opened,
  onClose,
  onSelect,
}: MapViewSelectionModalProps) {
  const [selectedPreference, setSelectedPreference] =
    useState<MapViewPreference | null>(null);

  const handleConfirm = () => {
    if (selectedPreference) {
      onSelect(selectedPreference);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedPreference(null);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Choose Map View"
      size="md"
      centered
      zIndex={3500}
    >
      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          Select your preferred map view style. You can change this later in
          Settings.
        </Text>

        <Stack gap="md">
          <Button
            variant={selectedPreference === "panels" ? "filled" : "default"}
            size="lg"
            onClick={() => setSelectedPreference("panels")}
            leftSection={<IconLayoutGrid size={24} />}
            styles={{
              root: { height: "auto", padding: "1rem" },
              inner: { justifyContent: "flex-start" },
            }}
          >
            <Stack gap={4} align="flex-start">
              <Text
                size="md"
                fw={600}
                c={selectedPreference === "panels" ? "white" : undefined}
              >
                Panels
              </Text>
              <Text
                size="xs"
                c={selectedPreference === "panels" ? "white" : "dimmed"}
                fw={400}
                style={{ whiteSpace: "normal", textAlign: "left" }}
              >
                Includes objective panel and side player info panel. Allows
                seeing map and player info at the same time, but requires
                clicking tabs or the map to switch between player areas.
              </Text>
            </Stack>
          </Button>

          <Button
            variant={selectedPreference === "pannable" ? "filled" : "default"}
            size="lg"
            onClick={() => setSelectedPreference("pannable")}
            leftSection={<IconHandMove size={24} />}
            styles={{
              root: { height: "auto", padding: "1rem" },
              inner: { justifyContent: "flex-start" },
            }}
          >
            <Stack gap={4} align="flex-start">
              <Text
                size="md"
                fw={600}
                c={selectedPreference === "pannable" ? "white" : undefined}
              >
                Pannable
              </Text>
              <Text
                size="xs"
                c={selectedPreference === "pannable" ? "white" : "dimmed"}
                fw={400}
                style={{ whiteSpace: "normal", textAlign: "left" }}
              >
                Full-screen draggable map with everything on one scrollable
                canvas. More convenient for trackpad usage, or those accustomed
                to the discord image UI.
              </Text>
            </Stack>
          </Button>
        </Stack>

        <Group justify="space-between">
          <Button variant="subtle" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={!selectedPreference}
          >
            Confirm
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
