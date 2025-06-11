import { Box } from "@mantine/core";
import { CommandCounter } from "./CommandCounter";
import { getColorAlias } from "../../lookup/colors";

type MahactEdictTokensProps = {
  edictedFactions: string[];
  factionToColor: Record<string, string>;
  style?: React.CSSProperties;
};

export function MahactEdictTokens({
  edictedFactions,
  factionToColor,
  style,
}: MahactEdictTokensProps) {
  if (edictedFactions.length === 0) {
    return null;
  }

  return (
    <Box pos="relative" style={style}>
      <Box pos="relative" style={{ height: 65 }}>
        {edictedFactions.map((faction, index) => {
          const color = factionToColor[faction];
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
