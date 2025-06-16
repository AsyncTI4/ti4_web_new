import { Box, Text } from "@mantine/core";
import { CommandCounter } from "./CommandCounter";
import { getColorAlias } from "../../lookup/colors";

type MahactFleetTokenStackProps = {
  count: number;
  colorAlias: string;
  faction: string;
  mahactEdict?: string[];
};

export function MahactFleetTokenStack({
  count,
  colorAlias,
  faction,
  mahactEdict = [],
}: MahactFleetTokenStackProps) {
  const totalCount = count + mahactEdict.length;
  const hasEdict = mahactEdict.length > 0;

  return (
    <Box pos="relative">
      <Text ff="heading" pos="absolute" left={0} top={0} fz={24} c="white">
        {totalCount}
        {hasEdict ? "*" : ""}
      </Text>
      <Box pos="relative" style={{ height: 65 }}>
        {/* Render blank token when regular count is 0 */}
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
        {/* Render regular fleet tokens */}
        {Array.from({ length: count }).map((_, index) => (
          <CommandCounter
            key={`mahact-fleet-${index}`}
            colorAlias={colorAlias}
            faction={faction}
            style={{
              position: "absolute",
              left: index * 20,
              zIndex: index + 1,
            }}
            type="fleet"
          />
        ))}
        {/* Render mahact edict tokens */}
        {mahactEdict.map((edictColor, index) => {
          const edictColorAlias = getColorAlias(edictColor);

          return (
            <CommandCounter
              key={`mahact-edict-${edictColor}-${index}`}
              colorAlias={edictColorAlias}
              style={{
                position: "absolute",
                left: count * 20 + 20 + index * 20,
                zIndex: count + index + 1,
              }}
              type="fleet"
            />
          );
        })}
      </Box>
    </Box>
  );
}
