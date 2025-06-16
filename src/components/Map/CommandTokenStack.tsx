import { Box, Text } from "@mantine/core";
import { CommandCounter } from "./CommandCounter";
import { LetnevFleetTokenStack } from "./LetnevFleetTokenStack";
import { MahactFleetTokenStack } from "./MahactFleetTokenStack";

type CommandTokenStackProps = {
  count: number;
  colorAlias: string;
  faction: string;
  type: "command" | "fleet";
  mahactEdict?: string[];
  factionToColor?: Record<string, string>;
};

export function CommandTokenStack({
  count,
  colorAlias,
  faction,
  type,
  mahactEdict = [],
}: CommandTokenStackProps) {
  // Use specialized components for fleet tokens
  if (type === "fleet") {
    if (faction === "letnev") {
      return (
        <LetnevFleetTokenStack
          count={count}
          colorAlias={colorAlias}
          faction={faction}
        />
      );
    }

    if (mahactEdict.length > 0) {
      return (
        <MahactFleetTokenStack
          count={count}
          colorAlias={colorAlias}
          faction={faction}
          mahactEdict={mahactEdict}
        />
      );
    }
  }

  // Default behavior for command tokens and regular fleet tokens
  return (
    <Box pos="relative">
      <Text ff="heading" pos="absolute" left={0} top={0} fz={24} c="white">
        {count}
      </Text>
      <Box pos="relative" style={{ height: 65 }}>
        {count === 0 && (
          <CommandCounter
            colorAlias="blank"
            style={{
              position: "absolute",
              left: 0,
              zIndex: 1,
            }}
          />
        )}
        {Array.from({ length: count }).map((_, index) => (
          <CommandCounter
            key={`${type}-cc-${index}`}
            colorAlias={colorAlias}
            faction={faction}
            style={{
              position: "absolute",
              left: index * 20,
              zIndex: index + 1,
            }}
            type={type}
          />
        ))}
      </Box>
    </Box>
  );
}
