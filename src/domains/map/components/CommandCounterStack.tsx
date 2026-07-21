import React from "react";
import { CommandCounter } from "./CommandCounter";
import { getColorAlias } from "@/entities/lookup/colors";
import { useFactionColors } from "@/hooks/useFactionColors";
import { resolveFactionIdentity } from "@/utils/fowIdentity";

type CommandCounterStackProps = {
  factions: string[];
  style?: React.CSSProperties;
  hiddenIndices?: Set<number>;
};

const TILE_OFFSET_X = 10;
const TILE_OFFSET_Y = 90;
export const CommandCounterStack = ({
  factions,
  style,
  hiddenIndices,
}: CommandCounterStackProps) => {
  const factionColorMap = useFactionColors();
  if (factions.length === 0) return null;

  return (
    <div style={{ position: "relative", ...style }}>
      {factions.map((rawFaction, index) => {
        const { faction, rawColor } = resolveFactionIdentity(rawFaction);
        const colorAlias = getColorAlias(
          rawColor ?? factionColorMap?.[faction ?? ""]?.color
        );
        const offsetX = index * 16;
        const offsetY = index * 16;
        const zIndex = index + 1;

        return (
          <CommandCounter
            key={`command-${rawFaction}-${index}`}
            colorAlias={colorAlias}
            faction={faction}
            style={{
              position: "absolute",
              left: `${offsetX + TILE_OFFSET_X}px`,
              top: `${offsetY + TILE_OFFSET_Y}px`,
              zIndex: zIndex,
              visibility: hiddenIndices?.has(index) ? "hidden" : undefined,
            }}
          />
        );
      })}
    </div>
  );
};
