import { Unit } from "@/shared/ui/Unit";
import { Token } from "./Token";
import { Attachment } from "./Attachment";
import { EntityStack } from "@/utils/unitPositioning";
import { getUnitZIndex } from "@/utils/zIndexLayers";
import { UnitBadge } from "./UnitBadge";
import { getTextColor } from "@/entities/lookup/colors";
import type { LawInPlay } from "@/entities/data/types";
import { isBadgeUnit } from "./UnitStack/unitType";
import {
  calculateUnitArrangement,
  getRenderedStackFootprint,
} from "@/entities/renderedStackGeometry";
import { useDelayedHover } from "./UnitStack/useDelayedHover";
import { useDecalPaths } from "./UnitStack/useDecalPaths";
import { getGenericUnitDataByAsyncId } from "@/entities/lookup/units";
import { useMapFlightAnimation } from "./UnitStack/useMapFlightAnimation";
import { GalvanizeBadge } from "./UnitStack/GalvanizeBadge";
import {
  flightOptions,
  transitionClassName,
  transitionDelayStyle,
  unitSlots,
} from "./UnitStack/transition";
import type { MapUnitTransition, StateCounts } from "@/utils/mapReplay/types";
import { stateCount, unitStates } from "@/utils/mapReplay/unitState";
import classes from "./UnitStack.module.css";

const EMPTY_STATES: StateCounts = [0, 0, 0, 0];

type UnitStackProps = {
  stack: EntityStack;
  stackKey: string;
  colorAlias: string;
  onUnitMouseOver?: (stackKey: string, event: React.MouseEvent) => void;
  onUnitMouseLeave?: (stackKey: string, event: React.MouseEvent) => void;
  onUnitSelect?: (stackKey: string, event: React.MouseEvent) => void;
  lawsInPlay?: LawInPlay[];
  mapTransition?: MapUnitTransition;
  replayHidden?: boolean;
  layoutUnitStates?: StateCounts;
  layoutStateOffsets?: StateCounts;
  damageAtMs?: number;
  delayedDamageStates?: StateCounts;
};

export function UnitStack({
  stackKey,
  stack,
  colorAlias,
  onUnitMouseOver,
  onUnitMouseLeave,
  onUnitSelect,
  lawsInPlay,
  mapTransition,
  replayHidden = false,
  layoutUnitStates,
  layoutStateOffsets,
  damageAtMs,
  delayedDamageStates,
}: UnitStackProps) {
  const { entityId: unitType, faction, count, x, y, entityType } = stack;
  const isBadge = isBadgeUnit(unitType);
  /* Combat badges are compact summaries and must stay legible above the much
     larger rotated ship silhouettes in the transition layer. */
  const baseZIndex =
    getUnitZIndex(unitType, 0) + (mapTransition && isBadge ? 200 : 0);
  const rotateInFlight =
    !isBadge && getGenericUnitDataByAsyncId(unitType)?.isShip === true;
  const flightRef = useMapFlightAnimation(
    flightOptions(mapTransition, x, y, rotateInFlight),
  );
  const wrapperClass = `${transitionClassName(mapTransition)} ${replayHidden ? classes.mapReplayHidden : ""}`;
  const delayStyle = transitionDelayStyle(mapTransition);
  const { handleMouseEnter, handleMouseLeave } = useDelayedHover(
    stackKey,
    onUnitMouseOver,
    onUnitMouseLeave,
  );
  const { bgDecalPath, decalPath } = useDecalPaths(
    unitType,
    faction,
    colorAlias,
  );

  const states = unitStates(stack);
  const galvanizedCount = states[2] + states[3];
  const isUnit = entityType === "unit";
  const handlers = {
    onMouseEnter: isUnit && onUnitMouseOver ? handleMouseEnter : undefined,
    onMouseLeave: isUnit && onUnitMouseLeave ? handleMouseLeave : undefined,
    onMouseDown:
      isUnit && onUnitSelect
        ? (e: React.MouseEvent) => onUnitSelect(stackKey, e)
        : undefined,
  };

  if (isBadge) {
    const badgeFootprint = getRenderedStackFootprint({
      entityId: unitType,
      entityType,
      count,
    });

    return (
      <div
        ref={flightRef}
        className={`${classes.badgeContainer} ${wrapperClass}`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          zIndex: baseZIndex,
          ...delayStyle,
        }}
        {...handlers}
      >
        <div
          className={classes.badgeInnerWrapper}
          style={{
            width: `${badgeFootprint.width}px`,
            height: `${badgeFootprint.height}px`,
          }}
        >
          <UnitBadge
            unitType={unitType}
            colorAlias={colorAlias}
            faction={faction}
            count={count}
            textColor={getTextColor(colorAlias)}
          />
          {galvanizedCount > 0 && (
            <GalvanizeBadge
              count={galvanizedCount}
              style={{ top: "5%", left: "100%", zIndex: baseZIndex + 100 }}
            />
          )}
        </div>
      </div>
    );
  }

  const transitionLayout = mapTransition?.layoutUnitStates ?? layoutUnitStates;
  const layoutStates = transitionLayout ?? states;
  const layoutCount = stateCount(layoutStates);
  const showIndividualGalvanized = galvanizedCount === 1 || unitType === "mf";
  const slots = unitSlots({
    states,
    layoutStates,
    layoutOffsets:
      mapTransition?.layoutStateOffsets ?? layoutStateOffsets ?? EMPTY_STATES,
    delayedDamage:
      mapTransition?.delayedDamageStates ?? delayedDamageStates ?? EMPTY_STATES,
    showIndividualGalvanized,
  });
  const damageDelayMs = mapTransition?.damageAtMs ?? damageAtMs;
  const footprint = getRenderedStackFootprint({
    entityId: unitType,
    entityType,
    count: layoutCount,
  });

  return (
    <div
      ref={flightRef}
      {...handlers}
      className={`${classes.stackWrapper} ${wrapperClass}`}
      style={{
        left: `${x + (footprint.left + footprint.right) / 2}px`,
        top: `${y + (footprint.top + footprint.bottom) / 2}px`,
        width: `${footprint.width}px`,
        height: `${footprint.height}px`,
        zIndex: baseZIndex,
        ...delayStyle,
      }}
    >
      {galvanizedCount > 1 && !showIndividualGalvanized && (
        <GalvanizeBadge
          count={galvanizedCount}
          className={classes.galvanizeBadgeContainer}
          style={{ left: "50%", top: "45%", zIndex: baseZIndex + 100 }}
        />
      )}

      {slots.map((slot) => {
        const { stackOffsetX, stackOffsetY, zIndexOffset } =
          calculateUnitArrangement(
            unitType,
            entityType,
            slot.index,
            layoutCount,
          );
        const unitKey = `${stackKey}-${slot.index}`;
        const xPos = stackOffsetX - footprint.left;
        const yPos = stackOffsetY - footprint.top;

        if (entityType === "token") {
          return (
            <Token
              key={unitKey}
              tokenId={unitType}
              faction={faction}
              x={xPos}
              y={yPos}
              zIndex={baseZIndex + zIndexOffset}
            />
          );
        }
        if (entityType === "attachment") {
          return (
            <Attachment
              key={unitKey}
              unitType={unitType}
              faction={faction}
              x={xPos}
              y={yPos}
              zIndex={baseZIndex}
            />
          );
        }
        return (
          <Unit
            key={unitKey}
            unitType={unitType}
            colorAlias={colorAlias}
            faction={faction}
            bgDecalPath={bgDecalPath}
            decalPath={decalPath || undefined}
            lawsInPlay={lawsInPlay}
            galvanized={slot.galvanized}
            sustained={slot.sustained}
            damageMarkerDelayMs={slot.delayDamage ? damageDelayMs : undefined}
            x={xPos}
            y={yPos}
            zIndex={baseZIndex + zIndexOffset}
          />
        );
      })}
    </div>
  );
}
