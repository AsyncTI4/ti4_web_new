import React from "react";
import { PdsControlToken } from "../PdsControlToken";
import { TILE_HEIGHT, TILE_WIDTH } from "@/mapgen/tilePositioning";
import { getColorAlias } from "@/lookup/colors";

type Props = {
  ringPosition: string;
  dominantPdsFaction?: Record<
    string,
    | { color: string; faction: string; count: number; expected: number }
    | undefined
  > | null;
};

export function PdsOverlayLayer({ ringPosition, dominantPdsFaction }: Props) {
  if (!ringPosition || !dominantPdsFaction) return null;
  const pdsData = dominantPdsFaction[ringPosition];
  if (!pdsData) return null;

  return (
    <PdsControlToken
      colorAlias={getColorAlias(pdsData.color)}
      faction={pdsData.faction}
      count={pdsData.count}
      expected={pdsData.expected}
      style={{
        position: "absolute",
        left: `${TILE_WIDTH / 2}px`,
        top: `${TILE_HEIGHT / 2}px`,
        transform: "translate(-50%, -50%)",
        zIndex: 'var(--z-pds-overlay)',
      }}
    />
  );
}
