import { Stack, Text, Group, Button } from "@mantine/core";
import { IconLayoutGrid, IconHandMove } from "@tabler/icons-react";
import { useState } from "react";
import type { MapViewPreference } from "@/utils/mapViewPreference";
import { MapViewPreferenceOption } from "./MapViewPreferenceOption";
import { AppModal } from "@/shared/ui/AppModal";

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
    useState<MapViewPreference>("pannable");

  const handleConfirm = () => {
    onSelect(selectedPreference);
    onClose();
  };

  const handleClose = () => {
    setSelectedPreference("pannable");
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
          Select your preferred map view style. Pannable is denser and built
          for cross-comparing the whole table quickly. Panels gives everything
          more breathing room when you want a calmer read. You can change this
          later in Settings.
        </Text>

        <Stack gap="md">
          {[
            {
              value: "pannable" as MapViewPreference,
              label: "Pannable",
              badge: "Recommended / Dense",
              description:
                "A full-screen draggable map with everything on one canvas. Best when you want to scan relationships and compare players quickly.",
              icon: <IconHandMove size={24} />,
            },
            {
              value: "panels" as MapViewPreference,
              label: "Panels",
              badge: "More Breathing Room",
              description:
                "A separated panel layout with more spacing and clearer focus areas. Better when you want the interface to feel less packed.",
              icon: <IconLayoutGrid size={24} />,
            },
          ].map((option) => (
            <MapViewPreferenceOption
              key={option.value}
              icon={option.icon}
              label={option.label}
              badge={option.badge}
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
          >
            Confirm
          </Button>
        </Group>
      </Stack>
    </AppModal>
  );
}
