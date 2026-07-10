import { Unit } from "@/shared/ui/Unit";
import { Token } from "./Token";
import { Attachment } from "./Attachment";
import { EntityStack } from "@/utils/unitPositioning";
import { getUnitZIndex } from "@/utils/zIndexLayers";
import { UnitBadge } from "./UnitBadge";
import { getTextColor } from "@/entities/lookup/colors";
import { LawInPlay } from "@/entities/data/types";
import { isBadgeUnit } from "./UnitStack/unitType";
import { calculateUnitArrangement } from "./UnitStack/unitArrangement";
import { useDelayedHover } from "./UnitStack/useDelayedHover";
import { useDecalPaths } from "./UnitStack/useDecalPaths";
import { Group, Text } from "@mantine/core";
import { cdnImage } from "@/entities/data/cdnImage";
import { getGenericUnitDataByAsyncId } from "@/entities/lookup/units";
import { useMapFlightAnimation } from "./UnitStack/useMapFlightAnimation";
import type {
  MapUnitTransition,
  StateCounts,
} from "@/utils/historicalMapTransitions";
import classes from "./UnitStack.module.css";

const EMPTY_STATES: StateCounts = [0, 0, 0, 0];
const TRANSITION_CLASS: Record<MapUnitTransition["kind"], string> = {
  moved: classes.mapTransitionMoved,
  settled: classes.mapTransitionMoved,
  retreated: classes.mapTransitionRetreated,
  removed: classes.mapTransitionRemoved,
  added: classes.mapTransitionAdded,
};

function getTransitionClass(transition: MapUnitTransition): string {
  if (transition.badgeCountChange) return classes.mapTransitionBadgeCount;
  if (transition.sourceHold) {
    if (transition.hideAfterMs !== undefined)
      return classes.mapTransitionSourcePreHold;
    return transition.appearAtMs !== undefined
      ? classes.mapTransitionSourceHoldDelayed
      : classes.mapTransitionSourceHold;
  }
  if (transition.residualAsset && transition.kind === "removed")
    return classes.mapTransitionResidualRemoved;
  return TRANSITION_CLASS[transition.kind];
}

interface UnitStackProps {
  stack: EntityStack;
  stackKey: string;
  colorAlias: string;
  planetCenter?: { x: number; y: number };
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
}

export function UnitStack({
  stackKey,
  stack,
  colorAlias,
  planetCenter,
  onUnitMouseOver,
  onUnitMouseLeave,
  onUnitSelect,
  lawsInPlay,
  mapTransition,
  replayHidden = false,
  layoutUnitStates: staticLayoutUnitStates,
  layoutStateOffsets: staticLayoutStateOffsets,
  damageAtMs: staticDamageAtMs,
  delayedDamageStates: staticDelayedDamageStates,
}: UnitStackProps) {
  const unitType = stack.entityId;
  const faction = stack.faction;
  const count = stack.count;
  const x = stack.x;
  const y = stack.y;
  const entityType = stack.entityType;
  const layoutUnitStates =
    mapTransition?.layoutUnitStates ?? staticLayoutUnitStates;
  const layoutStateOffsets =
    mapTransition?.layoutStateOffsets ??
    staticLayoutStateOffsets ??
    EMPTY_STATES;
  const damageAtMs = mapTransition?.damageAtMs ?? staticDamageAtMs;
  const delayedDamageStates =
    mapTransition?.delayedDamageStates ??
    staticDelayedDamageStates ??
    EMPTY_STATES;
  // Combat badges are compact summaries and must stay legible above the much
  // larger rotated ship silhouettes in the transition layer.
  const baseZIndex =
    getUnitZIndex(unitType, 0) +
    (mapTransition && isBadgeUnit(unitType) ? 200 : 0);
  const isMovingTransition =
    mapTransition?.kind === "moved" ||
    mapTransition?.kind === "retreated" ||
    mapTransition?.kind === "settled";
  const shouldRotateInFlight =
    !isBadgeUnit(unitType) &&
    getGenericUnitDataByAsyncId(unitType)?.isShip === true;
  const flightRef = useMapFlightAnimation({
    enabled: isMovingTransition,
    deltaX: mapTransition ? mapTransition.toX - x : 0,
    deltaY: mapTransition ? mapTransition.toY - y : 0,
    rotateToTrajectory: shouldRotateInFlight,
    delayMs: mapTransition?.delayMs ?? 0,
    holdFromMs: mapTransition?.holdFromMs,
    hideAfterMs: mapTransition?.hideAfterMs,
    startRotationDeg: shouldRotateInFlight
      ? mapTransition?.startRotationDeg
      : undefined,
    holdRotationDeg: shouldRotateInFlight
      ? mapTransition?.holdRotationDeg
      : undefined,
    parkRotationDeg: shouldRotateInFlight
      ? mapTransition?.parkRotationDeg
      : undefined,
    continuation: mapTransition?.continuation
      ? {
          deltaX: mapTransition.continuation.toX - x,
          deltaY: mapTransition.continuation.toY - y,
          delayMs: mapTransition.continuation.delayMs,
          startRotationDeg: shouldRotateInFlight
            ? mapTransition.continuation.startRotationDeg
            : undefined,
          parkRotationDeg: shouldRotateInFlight
            ? mapTransition.continuation.parkRotationDeg
            : undefined,
        }
      : undefined,
  });
  const transitionClass = mapTransition
    ? `${classes.mapTransition} ${getTransitionClass(mapTransition)}`
    : "";
  const transitionDelayStyle = mapTransition
    ? ({
        "--map-transition-delay": `${mapTransition.delayMs ?? 0}ms`,
        "--map-appear-delay": `${mapTransition.appearAtMs ?? 0}ms`,
        "--map-start-rotation": `${mapTransition.startRotationDeg ?? 0}deg`,
      } as React.CSSProperties)
    : undefined;
  const replayVisibilityClass = replayHidden ? classes.mapReplayHidden : "";
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

  let nonGalvanizedNonSustained = 0;
  let nonGalvanizedSustained = 0;
  let galvanizedNonSustained = 0;
  let galvanizedSustained = 0;

  if (!!stack.unitStates) {
    nonGalvanizedNonSustained = stack.unitStates[0];
    nonGalvanizedSustained = stack.unitStates[1];
    galvanizedNonSustained = stack.unitStates[2];
    galvanizedSustained = stack.unitStates[3];
  } else {
    nonGalvanizedNonSustained = stack.count - (stack.sustained || 0);
    nonGalvanizedSustained = stack.sustained || 0;
    galvanizedNonSustained = 0;
    galvanizedSustained = 0;
  }
  const galvanizedCount = galvanizedNonSustained + galvanizedSustained;
  const effectiveLayoutStates: StateCounts = layoutUnitStates ?? [
    nonGalvanizedNonSustained,
    nonGalvanizedSustained,
    galvanizedNonSustained,
    galvanizedSustained,
  ];
  const layoutCount = effectiveLayoutStates.reduce(
    (total, value) => total + value,
    0,
  );
  const layoutGalvanizeOffset =
    effectiveLayoutStates[2] + effectiveLayoutStates[3] > 1 ? 1 : 0;

  const showIndividualGalvanized = galvanizedCount === 1 || unitType === "mf";

  const handlers = {
    onMouseEnter:
      entityType === "unit" && onUnitMouseOver ? handleMouseEnter : undefined,
    onMouseLeave:
      entityType === "unit" && onUnitMouseLeave ? handleMouseLeave : undefined,
    onMouseDown:
      entityType === "unit" && onUnitSelect
        ? (e: React.MouseEvent) => onUnitSelect(stackKey, e)
        : undefined,
  };

  // For fighters and infantry, render as a badge with count instead of individual units
  if (isBadgeUnit(unitType)) {
    const badgeType = unitType as "ff" | "gf";

    return (
      <div
        ref={flightRef}
        key={`${stackKey}-badge-container`}
        className={`${classes.badgeContainer} ${transitionClass} ${replayVisibilityClass}`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          zIndex: baseZIndex,
          ...transitionDelayStyle,
        }}
        {...handlers}
      >
        <div className={classes.badgeInnerWrapper}>
          <UnitBadge
            key={`${stackKey}-badge`}
            unitType={badgeType}
            colorAlias={colorAlias}
            faction={faction}
            count={count}
            textColor={getTextColor(colorAlias)}
          />
          {galvanizedCount > 0 && (
            <GalvanizeBadge
              key={`${stackKey}-galvanized`}
              count={galvanizedCount}
              style={{
                top: "5%",
                left: "100%",
                zIndex: baseZIndex + 100,
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // Calculate wrapper size to contain all units
  // Units are positioned absolutely within the wrapper, which is centered at (x, y)
  // We need to account for both positive and negative offsets
  const UNIT_SIZE = 60; // Approximate unit image size

  // Calculate max absolute offsets in each direction by iterating through all possible indices
  let maxOffsetX = 0;
  let maxOffsetY = 0;

  for (let i = 0; i < layoutCount; i++) {
    const { stackOffsetX, stackOffsetY } = calculateUnitArrangement(
      unitType,
      entityType,
      i,
      layoutCount,
    );
    maxOffsetX = Math.max(maxOffsetX, Math.abs(stackOffsetX));
    maxOffsetY = Math.max(maxOffsetY, Math.abs(stackOffsetY));
  }

  // Wrapper needs to be large enough for max offset + half unit size on each side
  // Since wrapper is centered, we need 2x the max offset + unit size
  // If count is 0, use minimum size
  const WRAPPER_WIDTH =
    layoutCount > 0 ? maxOffsetX * 2 + UNIT_SIZE : UNIT_SIZE;
  const WRAPPER_HEIGHT =
    layoutCount > 0 ? maxOffsetY * 2 + UNIT_SIZE : UNIT_SIZE;

  type PositionedUnitProps = {
    index: number;
    galvanized: boolean;
    sustained: boolean;
    delayDamage?: boolean;
  };
  const PositionedUnit = ({
    index,
    galvanized = false,
    sustained = false,
    delayDamage = false,
  }: PositionedUnitProps) => {
    const { stackOffsetX, stackOffsetY, zIndexOffset } =
      calculateUnitArrangement(unitType, entityType, index, layoutCount);

    const unitKey = `${stackKey}-${index}`;

    // Position relative to the wrapper's center (wrapper is centered at x, y)
    // Units are positioned absolutely within the wrapper, so we use calc(50% + offset)
    const xPos = WRAPPER_WIDTH / 2 + stackOffsetX;
    const yPos = WRAPPER_HEIGHT / 2 + stackOffsetY;

    if (entityType === "token") {
      // Convert planetCenter from tile-relative to wrapper-relative coordinates
      // The wrapper is positioned at (x, y) relative to the tile
      const wrapperRelativePlanetCenter = planetCenter
        ? {
            x: planetCenter.x - x,
            y: planetCenter.y - y,
          }
        : undefined;

      return (
        <Token
          key={unitKey}
          tokenId={unitType}
          faction={faction}
          planetCenter={wrapperRelativePlanetCenter}
          x={xPos}
          y={yPos}
          zIndex={baseZIndex + zIndexOffset}
        />
      );
    } else if (entityType === "attachment") {
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
    } else {
      return (
        <Unit
          key={unitKey}
          unitType={unitType}
          colorAlias={colorAlias}
          faction={faction}
          bgDecalPath={bgDecalPath}
          decalPath={decalPath || undefined}
          lawsInPlay={lawsInPlay}
          galvanized={galvanized}
          sustained={sustained}
          damageMarkerDelayMs={delayDamage ? damageAtMs : undefined}
          x={xPos}
          y={yPos}
          zIndex={baseZIndex + zIndexOffset}
        />
      );
    }
  };

  return (
    <div
      ref={flightRef}
      {...handlers}
      className={`${classes.stackWrapper} ${transitionClass} ${replayVisibilityClass}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${WRAPPER_WIDTH}px`,
        height: `${WRAPPER_HEIGHT}px`,
        zIndex: baseZIndex,
        ...transitionDelayStyle,
      }}
    >
      {galvanizedCount > 1 && !showIndividualGalvanized && (
        <GalvanizeBadge
          key={`${stackKey}-galvanized`}
          count={galvanizedCount}
          className={classes.galvanizeBadgeContainer}
          style={{
            left: "50%",
            top: "45%",
            zIndex: baseZIndex + 100,
          }}
        />
      )}

      {Array.from({ length: galvanizedSustained }).map((_, i) => {
        return (
          <PositionedUnit
            key={`${stackKey}-${i}`}
            index={layoutStateOffsets[3] + i}
            galvanized={showIndividualGalvanized}
            sustained={true}
            delayDamage={i >= galvanizedSustained - delayedDamageStates[3]}
          />
        );
      })}

      {Array.from({ length: galvanizedNonSustained }).map((_, i) => {
        return (
          <PositionedUnit
            key={`${stackKey}-${i}`}
            index={effectiveLayoutStates[3] + layoutStateOffsets[2] + i}
            galvanized={showIndividualGalvanized}
            sustained={false}
          />
        );
      })}

      {Array.from({ length: nonGalvanizedSustained }).map((_, i) => {
        return (
          <PositionedUnit
            key={`${stackKey}-${i}`}
            index={
              effectiveLayoutStates[3] +
              effectiveLayoutStates[2] +
              layoutGalvanizeOffset +
              layoutStateOffsets[1] +
              i
            }
            galvanized={false}
            sustained={true}
            delayDamage={i >= nonGalvanizedSustained - delayedDamageStates[1]}
          />
        );
      })}

      {Array.from({ length: nonGalvanizedNonSustained }).map((_, i) => {
        return (
          <PositionedUnit
            key={`${stackKey}-${i}`}
            index={
              effectiveLayoutStates[3] +
              effectiveLayoutStates[2] +
              layoutGalvanizeOffset +
              effectiveLayoutStates[1] +
              layoutStateOffsets[0] +
              i
            }
            galvanized={false}
            sustained={false}
          />
        );
      })}
    </div>
  );
}

type GalvanizeBadgeProps = {
  count: number;
  style?: React.CSSProperties;
  className?: string;
};
function GalvanizeBadge({ count, style, className }: GalvanizeBadgeProps) {
  return (
    <Group w="45px" h="20px" gap="xs" className={className} style={style}>
      <div className={classes.galvanizeBadgeInner}>
        <img
          src={cdnImage("/extra/marker_galvanize.png")}
          alt="Galvanize"
          className={classes.galvanizeBadgeImage}
        />
        <Text inline pl="22px" fz="18px" fw={600} c="white" ff="'SLIDER'">
          {count}
        </Text>
      </div>
    </Group>
  );
}
