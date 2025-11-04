import React from "react";
import { UnitStack } from "../UnitStack";
import { getColorAlias } from "@/lookup/colors";
import { getPlanetCoordsBySystemId } from "@/lookup/planets";
import { MapTileType } from "@/data/types";
import { useFactionColors } from "@/hooks/useFactionColors";
import { useGameData, useColorOverrides } from "@/hooks/useGameContext";

type Props = {
  systemId: string;
  mapTile: MapTileType;
  position: { x: number; y: number };
  onUnitMouseOver?: (
    faction: string,
    unitId: string,
    x: number,
    y: number
  ) => void;
  onUnitMouseLeave?: () => void;
  onUnitSelect?: (faction: string) => void;
};

export function UnitImagesLayer({
  systemId,
  mapTile,
  position,
  onUnitMouseOver,
  onUnitMouseLeave,
  onUnitSelect,
}: Props) {
  const factionColorMap = useFactionColors();
  const lawsInPlay = useGameData()?.lawsInPlay;
  const { colorOverrides } = useColorOverrides();

  const unitImages = React.useMemo(() => {
    const planetCoords = getPlanetCoordsBySystemId(systemId);

    return Object.entries(mapTile.entityPlacements).flatMap(([key, stack]) => {
      let planetCenter: { x: number; y: number } | undefined;
      if (stack.planetName && planetCoords[stack.planetName]) {
        const [x, y] = planetCoords[stack.planetName].split(",").map(Number);
        planetCenter = { x, y };
      }

      // Check for color override, otherwise use faction color
      const overrideColorAlias = colorOverrides[stack.faction];
      const colorAlias = overrideColorAlias
        ? overrideColorAlias
        : getColorAlias(factionColorMap?.[stack.faction]?.color);

      return [
        <UnitStack
          key={`${systemId}-${key}-stack`}
          stack={stack}
          colorAlias={colorAlias}
          stackKey={key}
          planetCenter={planetCenter}
          lawsInPlay={lawsInPlay}
          onUnitMouseOver={
            onUnitMouseOver
              ? () => {
                  const worldX = position.x + stack.x;
                  const worldY = position.y + stack.y;
                  onUnitMouseOver(
                    stack.faction,
                    stack.entityId,
                    worldX,
                    worldY
                  );
                }
              : undefined
          }
          onUnitMouseLeave={
            onUnitMouseLeave ? () => onUnitMouseLeave() : undefined
          }
          onUnitSelect={
            onUnitSelect ? () => onUnitSelect(stack.faction) : undefined
          }
        />,
      ];
    });
  }, [
    systemId,
    mapTile,
    position.x,
    position.y,
    factionColorMap,
    lawsInPlay,
    colorOverrides,
    onUnitMouseOver,
    onUnitMouseLeave,
    onUnitSelect,
  ]);

  return <>{unitImages}</>;
}
