import { Stack, Text, Group, Button } from "@mantine/core";
import { IconLayoutGrid, IconHandMove } from "@tabler/icons-react";
import { useState } from "react";
import type { MapViewPreference } from "../../utils/mapViewPreference";
import { MapViewPreferenceOption } from "./MapViewPreferenceOption";
import { AppModal } from "@/components/shared/AppModal";

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
    <AppModal
      opened={opened}
      onClose={handleClose}
      title="Choose Map View"
      size="md"
      centered
    >
      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          Select your preferred map view style. You can change this later in
          Settings.
        </Text>

        <Stack gap="md">
          {[
            {
              value: "panels" as MapViewPreference,
              label: "Panels",
              description:
                "Includes objective panel and side player info panel. Allows seeing map and player info at the same time, but requires clicking tabs or the map to switch between player areas.",
              icon: <IconLayoutGrid size={24} />,
            },
            {
              value: "pannable" as MapViewPreference,
              label: "Pannable",
              description:
                "Full-screen draggable map with everything on one scrollable canvas. More convenient for trackpad usage, or those accustomed to the discord image UI.",
              icon: <IconHandMove size={24} />,
            },
          ].map((option) => (
            <MapViewPreferenceOption
              key={option.value}
              icon={option.icon}
              label={option.label}
              description={option.description}
              value={option.value}
              selected={selectedPreference === option.value}
              onSelect={(value) => setSelectedPreference(value)}
            />
          ))}
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
    </AppModal>
  );
}
