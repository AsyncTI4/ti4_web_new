import { Badge, Button, Group, Stack, Text } from "@/ds";
import type { ReactNode } from "react";
import type { MapViewPreference } from "@/utils/mapViewPreference";

type MapViewPreferenceOptionProps = {
  icon: ReactNode;
  label: string;
  badge?: string;
  description: string;
  value: MapViewPreference;
  selected: boolean;
  onSelect: (value: MapViewPreference) => void;
};

export function MapViewPreferenceOption({
  icon,
  label,
  badge,
  description,
  value,
  selected,
  onSelect,
}: MapViewPreferenceOptionProps) {
  const recommended = value === "pannable";

  return (
    <Button
      variant={selected ? "filled" : "default"}
      color={recommended ? "blue" : undefined}
      size="lg"
      onClick={() => onSelect(value)}
      leftSection={icon}
      justify="flex-start"
      style={{
        height: "auto",
        padding: "1rem",
        textTransform: "none",
        letterSpacing: 0,
        whiteSpace: "normal",
        borderColor: recommended ? "var(--ds-blue-5)" : undefined,
      }}
    >
      <Stack gap={4} align="flex-start">
        <Group gap="xs">
          <Text size="md" fw={600} c={selected ? "white" : undefined}>
            {label}
          </Text>
          {badge && (
            <Badge
              size="xs"
              variant={selected ? "white" : "filled"}
              color="blue"
            >
              {badge}
            </Badge>
          )}
        </Group>
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
