import { Box, Text } from "@mantine/core";
import { CommandCounter } from "./CommandCounter";

type CommandTokenStackProps = {
  count: number;
  colorAlias: string;
  faction: string;
  type: "command" | "fleet";
};

export function CommandTokenStack({
  count,
  colorAlias,
  faction,
  type,
}: CommandTokenStackProps) {
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
