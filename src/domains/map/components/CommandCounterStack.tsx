import React from "react";
import { CommandCounter } from "./CommandCounter";
import { getColorAlias } from "@/entities/lookup/colors";
import { useFactionColors } from "@/hooks/useFactionColors";

type CommandCounterStackProps = {
  factions: string[];
  style?: React.CSSProperties;
  hiddenIndices?: Set<number>;
};

const TILE_OFFSET_X = 10;
const TILE_OFFSET_Y = 90;
const STACK_STEP = 16;

export const CommandCounterStack = ({
  factions,
  style,
  hiddenIndices,
}: CommandCounterStackProps) => {
  const factionColorMap = useFactionColors();
  if (factions.length === 0) return null;

  return (
    <div style={{ position: "relative", ...style }}>
      {factions.map((faction, index) => {
        const colorAlias = getColorAlias(factionColorMap?.[faction]?.color);
        const offset = index * STACK_STEP;

        return (
          <CommandCounter
            key={`command-${faction}-${index}`}
            colorAlias={colorAlias}
            faction={faction}
            style={{
              position: "absolute",
              left: `${offset + TILE_OFFSET_X}px`,
              top: `${offset + TILE_OFFSET_Y}px`,
              zIndex: index + 1,
              visibility: hiddenIndices?.has(index) ? "hidden" : undefined,
            }}
          />
        );
      })}
    </div>
  );
};
