import {  Group, Text, Image, Stack } from "@mantine/core";
import { cdnImage } from "../../../data/cdnImage";
import { useFactionColors } from "@/hooks/useFactionColors";
import { FactionColorMap } from "@/context/GameContextProvider";

type Props = {
  neighbors: string[];
};

// Helper function to get neighbor faction icons from neighbor colors
const getNeighborFactionIcons = (
  neighbors: string[],
  factionColorMap: FactionColorMap
) => {
  return neighbors
    .map((neighborColor) => {
      return factionColorMap[neighborColor]?.faction || null;
    })
    .filter(Boolean); // Remove null values
};

export function Neighbors({ neighbors }: Props) {
  const factionColorMap = useFactionColors();
  const neighborFactions = getNeighborFactionIcons(neighbors, factionColorMap);

  return (
      <Stack gap={6} align="center" pos="relative" style={{ zIndex: 1 }}>
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
          Neighbors
        </Text>
        <Group gap={2}>
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
      </Stack>
  );
}
