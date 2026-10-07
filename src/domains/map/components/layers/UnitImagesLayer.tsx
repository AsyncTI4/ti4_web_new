import { UnitStack } from "../UnitStack";
import { useGameData, useMapReplay } from "@/hooks/useGameContext";
import { useResolveColorAlias } from "../hooks/useResolveColorAlias";
import type { Tile } from "@/app/providers/context/types";
import { mapUnitLocationKey } from "@/utils/mapReplay/unitState";
import { stateCount, unitStates } from "@/utils/mapReplay/unitState";
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
  const lawsInPlay = useGameData()?.lawsInPlay;
  const resolveColorAlias = useResolveColorAlias();
  const mapReplay = useMapReplay();

  const unitImages = Object.entries(mapTile.entityPlacements).map(
    ([key, stack]) => {
      const colorAlias = resolveColorAlias(stack.faction);
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
        mapReplay.active && mapReplay.finalRevealLocations.has(locationKey);
      const usesSlottedReplay =
        baseUnitStates !== undefined &&
        stack.entityType === "unit" &&
        !isBadgeUnit(stack.entityId);
      const finalUnitStates = unitStates(stack);
      const renderedStack = usesSlottedReplay
        ? {
            ...stack,
            count: stateCount(baseUnitStates),
            sustained: baseUnitStates[1] + baseUnitStates[3],
            unitStates: baseUnitStates,
          }
        : stack;

      return (
        <UnitStack
          key={`${systemId}-${key}-stack-${
            hiddenUntilReplayEnd || delayedDamage ? mapReplay.key : "static"
          }`}
          stack={renderedStack}
          colorAlias={colorAlias}
          stackKey={key}
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
              ? () =>
                  onUnitMouseOver(
                    stack.faction,
                    stack.entityId,
                    position.x + stack.x,
                    position.y + stack.y,
                  )
              : undefined
          }
          onUnitMouseLeave={
            onUnitMouseLeave ? () => onUnitMouseLeave() : undefined
          }
          onUnitSelect={
            onUnitSelect ? () => onUnitSelect(stack.faction) : undefined
          }
        />
      );
    },
  );

  return <>{unitImages}</>;
}
