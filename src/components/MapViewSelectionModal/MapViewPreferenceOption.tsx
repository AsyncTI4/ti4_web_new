import { Button, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";
import type { MapViewPreference } from "../../utils/mapViewPreference";

export type MapViewPreferenceOptionProps = {
  icon: ReactNode;
  label: string;
  description: string;
  value: MapViewPreference;
  selected: boolean;
  onSelect: (value: MapViewPreference) => void;
};

export function MapViewPreferenceOption({
  icon,
  label,
  description,
  value,
  selected,
  onSelect,
}: MapViewPreferenceOptionProps) {
  return (
    <Button
      variant={selected ? "filled" : "default"}
      size="lg"
      onClick={() => onSelect(value)}
      leftSection={icon}
      styles={{
        root: { height: "auto", padding: "1rem" },
        inner: { justifyContent: "flex-start" },
      }}
    >
      <Stack gap={4} align="flex-start">
        <Text size="md" fw={600} c={selected ? "white" : undefined}>
          {label}
        </Text>
        <Text
          size="xs"
          c={selected ? "white" : "dimmed"}
          fw={400}
          style={{ whiteSpace: "normal", textAlign: "left" }}
        >
          {description}
        </Text>
      </Stack>
    </Button>
  );
}
