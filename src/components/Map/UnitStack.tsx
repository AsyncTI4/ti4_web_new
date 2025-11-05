import { Unit } from "../shared/Unit";
import { Token } from "./Token";
import { Attachment } from "./Attachment";
import { EntityStack } from "../../utils/unitPositioning";
import { getUnitZIndex } from "../../utils/zIndexLayers";
import { UnitBadge } from "./UnitBadge";
import { getTextColor } from "@/lookup/colors";
import { LawInPlay } from "../../data/types";
import { isBadgeUnit } from "./UnitStack/utils/unitType";
import { calculateUnitArrangement } from "./UnitStack/utils/unitArrangement";
import { useDelayedHover } from "./UnitStack/hooks/useDelayedHover";
import { useDecalPaths } from "./UnitStack/hooks/useDecalPaths";
import { Group, Text } from "@mantine/core";
import { cdnImage } from "@/data/cdnImage";
import classes from "./UnitStack.module.css";

interface UnitStackProps {
  stack: EntityStack;
  stackKey: string;
  colorAlias: string;
  planetCenter?: { x: number; y: number };
  onUnitMouseOver?: (stackKey: string, event: React.MouseEvent) => void;
  onUnitMouseLeave?: (stackKey: string, event: React.MouseEvent) => void;
  onUnitSelect?: (stackKey: string, event: React.MouseEvent) => void;
  lawsInPlay?: LawInPlay[];
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
}: UnitStackProps) {
  const unitType = stack.entityId;
  const faction = stack.faction;
  const count = stack.count;
  const x = stack.x;
  const y = stack.y;
  const entityType = stack.entityType;
  const baseZIndex = getUnitZIndex(unitType, 0);
  const { handleMouseEnter, handleMouseLeave } = useDelayedHover(
    stackKey,
    onUnitMouseOver,
    onUnitMouseLeave
  );

  const { bgDecalPath, decalPath } = useDecalPaths(
    unitType,
    faction,
    colorAlias
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
  const galvanizeOffset = galvanizedCount > 1 ? 1 : 0;

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
        key={`${stackKey}-badge-container`}
        className={classes.badgeContainer}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          zIndex: baseZIndex,
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

  // Pre-calculate all unit arrangements once
  const unitArrangements = Array.from({ length: count }, (_, i) =>
    calculateUnitArrangement(unitType, entityType, i, count)
  );

  // Calculate max absolute offsets in each direction
  let maxOffsetX = 0;
  let maxOffsetY = 0;

  for (const { stackOffsetX, stackOffsetY } of unitArrangements) {
    maxOffsetX = Math.max(maxOffsetX, Math.abs(stackOffsetX));
    maxOffsetY = Math.max(maxOffsetY, Math.abs(stackOffsetY));
  }

  // Wrapper needs to be large enough for max offset + half unit size on each side
  // Since wrapper is centered, we need 2x the max offset + unit size
  // If count is 0, use minimum size
  const WRAPPER_WIDTH = count > 0 ? maxOffsetX * 2 + UNIT_SIZE : UNIT_SIZE;
  const WRAPPER_HEIGHT = count > 0 ? maxOffsetY * 2 + UNIT_SIZE : UNIT_SIZE;

  type PositionedUnitProps = {
    index: number;
    galvanized: boolean;
    sustained: boolean;
  };
  const PositionedUnit = ({
    index,
    galvanized = false,
    sustained = false,
  }: PositionedUnitProps) => {
    const { stackOffsetX, stackOffsetY, zIndexOffset } =
      unitArrangements[index];

    const unitKey = `${stackKey}-${index}`;

    // Position relative to the wrapper's center (wrapper is centered at x, y)
    // Units are positioned absolutely within the wrapper, so we use calc(50% + offset)
    const xPos = WRAPPER_WIDTH / 2 + stackOffsetX;
    const yPos = WRAPPER_HEIGHT / 2 + stackOffsetY;

    if (entityType === "token") {
      return (
        <Token
          key={unitKey}
          tokenId={unitType}
          colorAlias={colorAlias}
          faction={faction}
          planetCenter={planetCenter}
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
          zIndex={baseZIndex + zIndexOffset}
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
          x={xPos}
          y={yPos}
          zIndex={baseZIndex + zIndexOffset}
        />
      );
    }
  };

  return (
    <div
      {...handlers}
      className={classes.stackWrapper}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${WRAPPER_WIDTH}px`,
        height: `${WRAPPER_HEIGHT}px`,
        zIndex: baseZIndex,
      }}
    >
      {galvanizedCount > 1 && !showIndividualGalvanized && (
        <GalvanizeBadge
          key={`${stackKey}-galvanized`}
          count={galvanizedCount}
          className={classes.galvanizeBadgeContainer}
          style={{
            left: "50%",
            top: "0%",
            zIndex: baseZIndex + 100,
          }}
        />
      )}

      {Array.from({ length: galvanizedSustained }).map((_, i) => {
        return (
          <PositionedUnit
            key={`${stackKey}-${i}`}
            index={i}
            galvanized={showIndividualGalvanized}
            sustained={true}
          />
        );
      })}

      {Array.from({ length: galvanizedNonSustained }).map((_, i) => {
        return (
          <PositionedUnit
            key={`${stackKey}-${i}`}
            index={galvanizedSustained + i}
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
              galvanizedNonSustained + galvanizedSustained + galvanizeOffset + i
            }
            galvanized={false}
            sustained={true}
          />
        );
      })}

      {Array.from({ length: nonGalvanizedNonSustained }).map((_, i) => {
        return (
          <PositionedUnit
            key={`${stackKey}-${i}`}
            index={
              galvanizedNonSustained +
              galvanizedSustained +
              galvanizeOffset +
              nonGalvanizedSustained +
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
    <Group
      bg="dark.9"
      w="45px"
      h="20px"
      gap="xs"
      className={className}
      style={style}
    >
      <div className={classes.galvanizeBadgeInner}>
        <img
          src={cdnImage("/extra/marker_galvanize.png")}
          alt="Galvanize"
          className={classes.galvanizeBadgeImage}
        />
        <Text inline pl="24px" fz="16px" fw={600} c="white">
          {count}
        </Text>
      </div>
    </Group>
  );
}
