import { Group, Image, Stack } from "@mantine/core";
import { cdnImage } from "../../../data/cdnImage";
import {
  useFactionColors,
  useOriginalFactionColors,
} from "@/hooks/useFactionColors";
import { FactionColorMap } from "@/context/GameContextProvider";
import Caption from "@/components/shared/Caption/Caption";
import { useFactionImages } from "@/hooks/useFactionImages";

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
  const factionColorMap = useOriginalFactionColors();
  const neighborFactions = getNeighborFactionIcons(neighbors, factionColorMap);

  const factionImages = useFactionImages();

  return (
    <Stack gap={6} pos="relative">
      <Caption size="xs">Neighbors</Caption>
      <Group gap={2}>
        {neighborFactions.map((neighborFaction, index) => (
          <Image
            key={index}
            src={factionImages[neighborFaction!]?.image}
            w={24}
            h={24}
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
