import React from "react";
import { UnitStack } from "../UnitStack";
import { getColorAlias } from "@/entities/lookup/colors";
import { getPlanetCoordsBySystemId } from "@/entities/lookup/planets";
import { useFactionColors } from "@/hooks/useFactionColors";
import {
  useColorOverrides,
  useGameData,
  useMapReplay,
} from "@/hooks/useGameContext";
import { Tile } from "@/app/providers/context/types";
import { mapUnitLocationKey } from "@/utils/historicalMapTransitions";
import { isBadgeUnit } from "../UnitStack/unitType";

type Props = {
  systemId: string;
  mapTile: Tile;
  position: { x: number; y: number };
  onUnitMouseOver?: (
    faction: string,
    unitId: string,
    x: number,
    y: number,
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
  const mapReplay = useMapReplay();

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
      const locationKey = mapReplay.active
        ? mapUnitLocationKey(mapTile.position, stack)
        : "";
      const baseUnitStates = mapReplay.active
        ? mapReplay.baseUnitStates.get(locationKey)
        : undefined;
      const delayedDamage = mapReplay.active
        ? mapReplay.delayedDamage.get(locationKey)
        : undefined;
      const hiddenUntilReplayEnd =
        mapReplay.active &&
        mapReplay.finalRevealLocations.has(locationKey);
      const usesSlottedReplay =
        baseUnitStates !== undefined &&
        stack.entityType === "unit" &&
        !isBadgeUnit(stack.entityId);
      const finalUnitStates = stack.unitStates ?? [
        stack.count - (stack.sustained ?? 0),
        stack.sustained ?? 0,
        0,
        0,
      ];
      const renderedStack = usesSlottedReplay
        ? {
            ...stack,
            count: baseUnitStates.reduce((total, value) => total + value, 0),
            sustained: baseUnitStates[1] + baseUnitStates[3],
            unitStates: baseUnitStates,
          }
        : stack;

      return [
        <UnitStack
          key={`${systemId}-${key}-stack-${
            hiddenUntilReplayEnd || delayedDamage ? mapReplay.key : "static"
          }`}
          stack={renderedStack}
          colorAlias={colorAlias}
          stackKey={key}
          planetCenter={planetCenter}
          lawsInPlay={lawsInPlay}
          layoutUnitStates={usesSlottedReplay ? finalUnitStates : undefined}
          damageAtMs={delayedDamage?.damageAtMs}
          delayedDamageStates={delayedDamage?.states}
          replayHidden={
            mapReplay.active &&
            (hiddenUntilReplayEnd ||
              ((isBadgeUnit(stack.entityId) || stack.entityType !== "unit") &&
                mapReplay.arrivalLocations.has(locationKey)))
          }
          onUnitMouseOver={
            onUnitMouseOver
              ? () => {
                  const worldX = position.x + stack.x;
                  const worldY = position.y + stack.y;
                  onUnitMouseOver(
                    stack.faction,
                    stack.entityId,
                    worldX,
                    worldY,
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
    mapReplay,
    onUnitMouseOver,
    onUnitMouseLeave,
    onUnitSelect,
  ]);

  return <>{unitImages}</>;
}
