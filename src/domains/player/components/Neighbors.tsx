import { Box, Group } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";
import { useOriginalFactionColors } from "@/hooks/useFactionColors";
import { FactionIcon } from "@/shared/ui/FactionIcon";

type Props = {
  neighbors: string[];
};

export function Neighbors({ neighbors }: Props) {
  const factionColorMap = useOriginalFactionColors();
  const neighborFactions = neighbors
    .map((neighborColor) => factionColorMap[neighborColor]?.faction)
    .filter((faction): faction is string => Boolean(faction));

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
      {neighborFactions.map((faction, index) => (
        <FactionIcon
          key={index}
          faction={faction}
          w={20}
          h={20}
          style={{
            filter:
              "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(0.9)",
          }}
        />
      ))}
    </Group>
  );
}
