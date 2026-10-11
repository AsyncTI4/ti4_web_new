import { Button } from "@/ds";
import { IconLayoutGrid, IconHandMove } from "@tabler/icons-react";
import { useState, type ReactNode } from "react";
import type { MapViewPreference } from "@/utils/mapViewPreference";
import { MapViewPreferenceOption } from "./MapViewPreferenceOption";
import { AppModal } from "@/shared/ui/AppModal";
import classes from "./MapViewSelectionModal.module.css";

type MapViewSelectionModalProps = {
  opened: boolean;
  onClose: () => void;
  onSelect: (preference: MapViewPreference) => void;
};

const OPTIONS: {
  value: MapViewPreference;
  label: string;
  tagline: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    value: "pannable",
    label: "Pannable",
    tagline: "Dense · recommended",
    description:
      "One draggable canvas with the board and every player area. Best for comparing the whole table.",
    icon: <IconHandMove size={16} aria-hidden />,
  },
  {
    value: "panels",
    label: "Panels",
    tagline: "More room",
    description:
      "The board in the middle with objectives and players in side panels. A calmer read.",
    icon: <IconLayoutGrid size={16} aria-hidden />,
  },
];

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

  const selectedLabel =
    OPTIONS.find((option) => option.value === selectedPreference)?.label ?? "";

  return (
    <AppModal
      opened={opened}
      onClose={handleClose}
      title="Choose map view"
      size={520}
      padding={0}
    >
      <div className="overlay-modal-content">
        <div className={classes.choices}>
          {OPTIONS.map((option) => (
            <MapViewPreferenceOption
              key={option.value}
              {...option}
              selected={selectedPreference === option.value}
              onSelect={setSelectedPreference}
            />
          ))}
        </div>
        <p className="overlay-modal-note">You can change this later in Settings.</p>
      </div>
      <footer className="overlay-modal-footer">
        <Button variant="subtle" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="var(--ds-accent)" onClick={handleConfirm}>
          Use {selectedLabel.toLowerCase()}
        </Button>
      </footer>
    </AppModal>
  );
}
