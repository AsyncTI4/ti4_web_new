import { Stack, Text, Box } from "@mantine/core";

type Props = {
  tacticalCC: number;
  fleetCC: number;
  strategicCC: number;
  mahactEdict?: string[];
};

export function CCPool({
  tacticalCC,
  fleetCC,
  strategicCC,
  mahactEdict = [],
}: Props) {
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
      <Box
        p="sm"
        h="100%"
        style={{
          borderRightWidth: 0,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          background:
            "linear-gradient(135deg, rgba(148, 163, 184, 0.06) 0%, rgba(148, 163, 184, 0.04) 100%)",
          border: "1px solid rgba(148, 163, 184, 0.18)",
          borderRightStyle: "none",
          boxShadow:
            "0 2px 8px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          minHeight: 54,
          position: "relative",
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
            {tacticalCC}/{fleetCC + mahactEdict.length}
            {mahactEdict.length > 0 ? "*" : ""}/{strategicCC}
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
}
