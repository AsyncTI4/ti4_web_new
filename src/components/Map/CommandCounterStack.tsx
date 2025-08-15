import React from "react";
import { CommandCounter } from "./CommandCounter";
import { getColorAlias } from "@/lookup/colors";
import { useFactionColors } from "@/hooks/useFactionColors";

type CommandCounterStackProps = {
  factions: string[];
  style?: React.CSSProperties;
};

const TILE_OFFSET_X = 10;
const TILE_OFFSET_Y = 90;
export const CommandCounterStack = ({
  factions,
  style,
}: CommandCounterStackProps) => {
  const factionColorMap = useFactionColors();
  if (factions.length === 0) return null;

  return (
    <div style={{ position: "relative", ...style }}>
      {factions.map((faction, index) => {
        const colorAlias = getColorAlias(factionColorMap?.[faction]?.color);
        const offsetX = index * 16;
        const offsetY = index * 16;
        const zIndex = index + 1;

        return (
          <CommandCounter
            key={`command-${faction}-${index}`}
            colorAlias={colorAlias}
            faction={faction}
            style={{
              position: "absolute",
              left: `${offsetX + TILE_OFFSET_X}px`,
              top: `${offsetY + TILE_OFFSET_Y}px`,
              zIndex: zIndex,
            }}
          />
        );
      })}
    </div>
  );
};
