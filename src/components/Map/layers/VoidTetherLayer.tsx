import React from "react";
import { MapTileType } from "@/data/types";
import { VoidTetherIndicator } from "../VoidTetherIndicator";
import { HEXAGON_EDGE_MIDPOINTS } from "@/mapgen/tilePositioning";

type Props = {
  systemId: string;
  mapTile: MapTileType;
};


const POSSIBLE_LOCATIONS = [0, 1, 5];

export function VoidTetherLayer({ systemId, mapTile }: Props) {
  if (!mapTile?.planets) return [] as React.ReactElement[];

  const voidTetherLocations = mapTile.voidTethers || [];

  return (
    <>
      {voidTetherLocations.flatMap((edge) => {
        if (!POSSIBLE_LOCATIONS.includes(edge)) return [];

        const edgeCoords = HEXAGON_EDGE_MIDPOINTS[edge];

        return [
          <VoidTetherIndicator
            key={`${systemId}-tether-${edge}`}
            x={edgeCoords.x}
            y={edgeCoords.y}
            edge={edge}
          />,
        ];
      })}
    </>
  );
}
