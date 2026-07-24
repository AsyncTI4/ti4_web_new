import { Box, Group } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";
import { useOriginalFactionColors } from "@/hooks/useFactionColors";
import { FactionColorMap } from "@/app/providers/context/types";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { UnidentifiedPlayerDot } from "@/shared/ui/UnidentifiedPlayerDot";

type Props = {
  neighbors: string[];
};

// Helper function to get neighbor faction icons from neighbor colors. A neighbor whose faction
// isn't in factionColorMap is one the viewer can't yet identify (FoW) - keep their color so we
// can still render a colored placeholder instead of a broken/missing icon.
const getNeighborFactionIcons = (
  neighbors: string[],
  factionColorMap: FactionColorMap
) => {
  return neighbors.map((neighborColor) => ({
    color: neighborColor,
    faction: factionColorMap[neighborColor]?.faction || null,
  }));
};

export function Neighbors({ neighbors }: Props) {
  const factionColorMap = useOriginalFactionColors();
  const neighborFactions = getNeighborFactionIcons(neighbors, factionColorMap);

  return (
    <Group
      gap={2}
      wrap="nowrap"
      align="center"
      style={{
        width: 152,
        minWidth: 152,
        maxWidth: 152,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <Box
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          borderRadius: 999,
          background: "rgba(2, 6, 23, 0.86)",
          border: "1px solid rgba(148, 163, 184, 0.35)",
          flexShrink: 0,
        }}
        aria-label="Neighbors"
      >
        <IconUsers size={12} stroke={2.4} color="rgba(226, 232, 240, 0.9)" />
      </Box>
      {neighborFactions.map((neighbor, index) =>
        neighbor.faction ? (
          <FactionIcon
            key={index}
            faction={neighbor.faction}
            w={20}
            h={20}
            style={{
              filter:
                "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(0.9)",
            }}
          />
        ) : (
          <UnidentifiedPlayerDot key={index} color={neighbor.color} size={20} />
        )
      )}
    </Group>
  );
}
