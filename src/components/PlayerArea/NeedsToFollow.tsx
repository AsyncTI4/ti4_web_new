import { Group, Text, Box } from "@mantine/core";
import { Caption } from "./Caption";

type Props = {
  values: number[];
};

// Color mapping for the needs to follow values
const COLOR_MAP = {
  0: "blue.3",
  1: "green.3",
  2: "violet.3",
} as const;

export function NeedsToFollow({ values }: Props) {
  return (
    <Group gap={8} align="center">
      <Box style={{ alignSelf: "center" }}>
        <Caption>Needs to Follow</Caption>
      </Box>
      <Group gap={6}>
        {values.map((value, index) => (
          <Text
            key={index}
            size="lg"
            fw={700}
            c={COLOR_MAP[index as keyof typeof COLOR_MAP]}
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
            }}
          >
            {value}
          </Text>
        ))}
      </Group>
    </Group>
  );
}
