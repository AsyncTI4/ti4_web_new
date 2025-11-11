import React from "react";
import { CommodityIndicator } from "../CommodityIndicator";
import { getPlanetCoordsBySystemId } from "@/lookup/planets";
import { Tile } from "@/context/types";

type Props = {
  systemId: string;
  mapTile: Tile;
};

export function CommodityIndicatorsLayer({ systemId, mapTile }: Props) {
  const commodityIndicators = React.useMemo(() => {
    if (!mapTile?.planets) return [] as React.ReactElement[];

    const planetCoords = getPlanetCoordsBySystemId(systemId);

    return Object.entries(mapTile.planets).flatMap(([planetId, planetData]) => {
      const commodityCount = planetData.commodities ?? 0;
      if (commodityCount === 0) return [];
      if (!planetCoords[planetId]) return [];
      const [x, y] = planetCoords[planetId].split(",").map(Number);

      return [
        <CommodityIndicator
          key={`${systemId}-${planetId}-commodity`}
          commodityCount={commodityCount}
          x={x}
          y={y}
        />,
      ];
    });
  }, [systemId, mapTile]);

  return <>{commodityIndicators}</>;
}
