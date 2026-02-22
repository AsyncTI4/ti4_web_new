import { Box } from "@mantine/core";
import { CommandCounter } from "./CommandCounter";
import { getColorAlias } from "@/entities/lookup/colors";
import { useFactionColors } from "@/hooks/useFactionColors";

type MahactEdictTokensProps = {
  edictedFactions: string[];
  style?: React.CSSProperties;
};

export function MahactEdictTokens({
  edictedFactions,
  style,
}: MahactEdictTokensProps) {
  if (edictedFactions.length === 0) {
    return null;
  }

  const factionColorMap = useFactionColors();

  return (
    <Box pos="relative" style={style}>
      <Box pos="relative" style={{ height: 65 }}>
        {edictedFactions.map((faction, index) => {
          const color = factionColorMap?.[faction]?.color;
          const colorAlias = getColorAlias(color);

          return (
            <CommandCounter
              key={`mahact-edict-${faction}-${index}`}
              colorAlias={colorAlias}
              faction={faction}
              style={{
                position: "absolute",
                left: index * 20,
                zIndex: index + 1,
              }}
              type="fleet"
            />
          );
        })}
      </Box>
    </Box>
  );
}
