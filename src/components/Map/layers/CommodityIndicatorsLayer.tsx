import React from "react";
import { CommodityIndicator } from "../CommodityIndicator";
import { MapTileType } from "@/data/types";
import { getPlanetCoordsBySystemId } from "@/lookup/planets";

type Props = {
  systemId: string;
  mapTile: MapTileType;
};

export function CommodityIndicatorsLayer({ systemId, mapTile }: Props) {
  const commodityIndicators = React.useMemo(() => {
    if (!mapTile?.planets) return [] as React.ReactElement[];

    const planetCoords = getPlanetCoordsBySystemId(systemId);

    return mapTile.planets.flatMap((planetData) => {
      const planetId = planetData.name;
      if (!planetData.commodities || planetData.commodities === 0) return [];
      if (!planetCoords[planetId]) return [];
      const [x, y] = planetCoords[planetId].split(",").map(Number);

      return [
        <CommodityIndicator
          key={`${systemId}-${planetId}-commodity`}
          commodityCount={planetData.commodities}
          x={x}
          y={y}
        />,
      ];
    });
  }, [systemId, mapTile]);

  return <>{commodityIndicators}</>;
}
