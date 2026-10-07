import { CommodityIndicator } from "../CommodityIndicator";
import { getPlanetPositionsBySystemId } from "@/entities/lookup/planets";
import type { Tile } from "@/app/providers/context/types";

type Props = {
  systemId: string;
  mapTile: Tile;
};

export function CommodityIndicatorsLayer({ systemId, mapTile }: Props) {
  if (!mapTile?.planets) return null;
  const planetPositions = getPlanetPositionsBySystemId(systemId);

  const commodityIndicators = Object.entries(mapTile.planets).flatMap(
    ([planetId, planetData]) => {
      const commodityCount = planetData.commodities ?? 0;
      if (commodityCount === 0) return [];
      const position = planetPositions[planetId];
      if (!position) return [];
      const { x, y } = position;

      return [
        <CommodityIndicator
          key={`${systemId}-${planetId}-commodity`}
          commodityCount={commodityCount}
          x={x}
          y={y}
        />,
      ];
    },
  );

  return <>{commodityIndicators}</>;
}
