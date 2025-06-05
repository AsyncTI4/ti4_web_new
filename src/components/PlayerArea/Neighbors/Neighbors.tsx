import { Box, Group, Text, Image } from "@mantine/core";
import { cdnImage } from "../../../data/cdnImage";

type Props = {
  neighbors: string[];
  colorToFaction: Record<string, string>;
};

// Helper function to get neighbor faction icons from neighbor colors
const getNeighborFactionIcons = (
  neighbors: string[],
  colorToFaction: Record<string, string>
) => {
  return neighbors
    .map((neighborColor) => {
      return colorToFaction[neighborColor] || null;
    })
    .filter(Boolean); // Remove null values
};

export function Neighbors({ neighbors, colorToFaction }: Props) {
  const neighborFactions = getNeighborFactionIcons(neighbors, colorToFaction);

  return (
    <Box
      px={8}
      py={4}
      ml={8}
      pos="relative"
      style={{
        borderRadius: "8px",
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        boxShadow:
          "0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
        overflow: "hidden",
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

      <Group gap={6} align="center" pos="relative" style={{ zIndex: 1 }}>
        <Text
          size="xs"
          fw={600}
          c="gray.4"
          style={{
            textTransform: "uppercase",
            fontSize: "9px",
            letterSpacing: "0.5px",
            marginRight: "4px",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
          }}
        >
          Neighbors:
        </Text>
        {neighborFactions.map((neighborFaction, index) => (
          <Image
            key={index}
            src={cdnImage(`/factions/${neighborFaction}.png`)}
            w={18}
            h={18}
            style={{
              filter:
                "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(0.9)",
            }}
          />
        ))}
      </Group>
    </Box>
  );
}
