import { Stack, Text, Box } from "@mantine/core";
import { Surface } from "../Surface";

type Props = {
  tacticalCC: number;
  fleetCC: number;
  strategicCC: number;
};

export function CCPool({ tacticalCC, fleetCC, strategicCC }: Props) {
  return (
    <Stack gap={4} align="center">
      <Text
        ff="heading"
        size="xs"
        fw={600}
        c="gray.4"
        style={{
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontSize: "9px",
          opacity: 0.8,
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
        }}
      >
        CCs
      </Text>
      <Surface
        p="sm"
        h="100%"
        style={{
          borderRightWidth: 0,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        {/* Subtle inner glow */}
        <Box
          pos="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(148, 163, 184, 0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Stack
          gap={2}
          align="center"
          justify="center"
          pos="relative"
          h="100%"
          style={{ zIndex: 1 }}
        >
          <Text
            ff="mono"
            size="xs"
            fw={600}
            c="gray.3"
            style={{
              textTransform: "uppercase",
              letterSpacing: "1px",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
            }}
          >
            T/F/S
          </Text>
          <Text
            ff="mono"
            size="sm"
            fw={600}
            c="white"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
            }}
          >
            {tacticalCC}/{fleetCC}/{strategicCC}
          </Text>
        </Stack>
      </Surface>
    </Stack>
  );
}
