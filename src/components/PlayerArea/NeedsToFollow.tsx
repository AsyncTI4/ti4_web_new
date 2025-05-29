import { Group, Text, Box } from "@mantine/core";
import { Caption } from "./Caption";

type Props = {
  values: number[];
};

// Strategy card color mapping
const SC_COLORS = {
  1: "red",
  2: "orange",
  3: "yellow",
  4: "green",
  5: "teal",
  6: "cyan",
  7: "blue",
  8: "purple",
} as const;

export function NeedsToFollow({ values }: Props) {
  return (
    <Group gap={8} align="center">
      {values.length > 0 && (
        <Box style={{ alignSelf: "center" }}>
          <Caption>Needs to Follow</Caption>
        </Box>
      )}
      <Group gap={6}>
        {values.map((scNumber, index) => (
          <Text
            key={index}
            size="lg"
            fw={700}
            c={`${SC_COLORS[scNumber as keyof typeof SC_COLORS]}.3`}
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
            }}
          >
            {scNumber}
          </Text>
        ))}
      </Group>
    </Group>
  );
}
