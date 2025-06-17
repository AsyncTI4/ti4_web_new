import { Unit } from "../shared/Unit";
import { Token } from "./Token";
import { Attachment } from "./Attachment";
import {
  SPLAY_OFFSET_X,
  SPLAY_OFFSET_Y,
  entityBaseZIndex,
} from "../../utils/unitPositioning";
import { UnitBadge } from "./UnitBadge";
import { getTextColor } from "@/lookup/colors";
import { useRef, useCallback } from "react";
import { units } from "../../data/units";
import { lookupUnit } from "@/lookup/units";

interface UnitStackProps {
  unitType: string;
  colorAlias: string;
  faction: string;
  count: number;
  sustained?: number | null;
  x: number;
  y: number;
  stackKey: string;
  entityType: "unit" | "token" | "attachment";
  planetCenter?: { x: number; y: number };
  onUnitMouseOver?: (stackKey: string, event: React.MouseEvent) => void;
  onUnitMouseLeave?: (stackKey: string, event: React.MouseEvent) => void;
  onUnitSelect?: (stackKey: string, event: React.MouseEvent) => void;
}

export function UnitStack({
  unitType,
  colorAlias,
  faction,
  count,
  sustained,
  stackKey,
  entityType,
  x,
  y,
  planetCenter,
  onUnitMouseOver,
  onUnitMouseLeave,
  onUnitSelect,
}: UnitStackProps) {
  const baseZIndex = entityBaseZIndex(unitType);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Look up unit data to get bgDecalPath
  const unitData = lookupUnit(unitType, faction);
  const bgDecalPath = unitData?.bgDecalPath;

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      if (!onUnitMouseOver) return;

      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      // Set new timeout
      hoverTimeoutRef.current = setTimeout(() => {
        onUnitMouseOver(stackKey, e);
        hoverTimeoutRef.current = null;
      }, 100);
    },
    [onUnitMouseOver, stackKey]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      // Clear the timeout to prevent onMouseEnter from being called
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      // Call the original onMouseLeave if it exists
      if (onUnitMouseLeave) {
        onUnitMouseLeave(stackKey, e);
      }
    },
    [onUnitMouseLeave, stackKey]
  );

  // For fighters and infantry, render as a badge with count instead of individual units
  if (unitType === "ff" || unitType === "gf") {
    return [
      <UnitBadge
        key={`${stackKey}-badge`}
        unitType={unitType}
        colorAlias={colorAlias}
        faction={faction}
        count={count}
        textColor={getTextColor(colorAlias)}
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          pointerEvents: "auto",
          cursor: "pointer",
          transform: "translate(-50%, -50%)",
          zIndex: baseZIndex,
        }}
        onMouseEnter={
          entityType === "unit" && onUnitMouseOver
            ? handleMouseEnter
            : undefined
        }
        onMouseLeave={
          entityType === "unit" && onUnitMouseLeave
            ? handleMouseLeave
            : undefined
        }
        onMouseDown={
          entityType === "unit" && onUnitSelect
            ? (e: React.MouseEvent<HTMLDivElement>) => onUnitSelect(stackKey, e)
            : undefined
        }
      />,
    ];
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const { stackOffsetX, stackOffsetY, zIndexOffset } =
          calculateUnitArrangement(unitType, entityType, i, count);

        const unitKey = `${stackKey}-${i}`;

        const commonProps = {
          unitType,
          colorAlias,
          faction,
          style: {
            position: "absolute" as const,
            left: `${x + stackOffsetX}px`,
            top: `${y + stackOffsetY}px`,
            pointerEvents: "auto" as const,
            cursor:
              entityType === "unit"
                ? ("pointer" as const)
                : ("default" as const),
            transform: "translate(-50%, -50%)",
            zIndex: baseZIndex + zIndexOffset,
          },
          onMouseEnter:
            entityType === "unit" && onUnitMouseOver
              ? handleMouseEnter
              : undefined,
          onMouseLeave:
            entityType === "unit" && onUnitMouseLeave
              ? handleMouseLeave
              : undefined,
          onMouseDown:
            entityType === "unit" && onUnitSelect
              ? (e: React.MouseEvent<HTMLImageElement>) =>
                  onUnitSelect(stackKey, e)
              : undefined,
        };

        if (entityType === "token") {
          return (
            <Token
              key={unitKey}
              tokenId={unitType}
              planetCenter={planetCenter}
              {...commonProps}
            />
          );
        } else if (entityType === "attachment") {
          return <Attachment key={unitKey} {...commonProps} />;
        } else {
          return (
            <Unit
              key={unitKey}
              {...commonProps}
              sustained={sustained ? i < sustained : false}
              bgDecalPath={bgDecalPath}
            />
          );
        }
      })}
    </>
  );
}

/**
 * Calculates the positioning and z-index offset for a unit in a stack
 */
function calculateUnitArrangement(
  unitType: string,
  entityType: "unit" | "token" | "attachment",
  index: number,
  count: number
): {
  stackOffsetX: number;
  stackOffsetY: number;
  zIndexOffset: number;
} {
  let stackOffsetX: number;
  let stackOffsetY: number;
  let zIndexOffset: number;

  // Special grid arrangement for mechs
  if (unitType === "mf") {
    const { offsetX, offsetY, zOffset } = calculateMechGridPosition(index);
    stackOffsetX = offsetX;
    stackOffsetY = offsetY;
    zIndexOffset = zOffset;
  } else {
    // Default splay arrangement for other units
    stackOffsetX = -index * SPLAY_OFFSET_X; // Move west (left) by offset per unit
    stackOffsetY = index * SPLAY_OFFSET_Y; // Slight movement south for depth
    zIndexOffset = entityType === "attachment" ? index * -1 : count - 1 - index;
  }

  return { stackOffsetX, stackOffsetY, zIndexOffset };
}

/**
 * Calculates grid positioning for mech units in a 3x2 grid pattern
 */
function calculateMechGridPosition(index: number): {
  offsetX: number;
  offsetY: number;
  zOffset: number;
} {
  const gridSpacing = 20;
  const columnIndex = Math.floor(index / 6);
  const positionInColumn = index % 6;

  // Base column offset (move right for each additional 3x2 grid)
  const columnOffsetX = columnIndex * gridSpacing * 3;

  // 3x2 grid positions: NORTHWEST, NORTH, NORTHEAST, SOUTHWEST, SOUTH, SOUTHEAST
  const gridPositions = [
    { x: -gridSpacing, y: -gridSpacing / 2 }, // NORTHWEST
    { x: 0, y: -gridSpacing / 2 }, // NORTH
    { x: gridSpacing, y: -gridSpacing / 2 }, // NORTHEAST
    { x: -gridSpacing, y: gridSpacing / 2 }, // SOUTHWEST
    { x: 0, y: gridSpacing / 2 }, // SOUTH
    { x: gridSpacing, y: gridSpacing / 2 }, // SOUTHEAST
  ];

  const gridPos = gridPositions[positionInColumn];
  const offsetX = columnOffsetX + gridPos.x;
  const offsetY = gridPos.y;

  // Calculate z-index: second row gets higher z-index than first row
  const rowIndex = Math.floor(positionInColumn / 3);
  const zOffset = rowIndex + columnIndex * 2;

  return { offsetX, offsetY, zOffset };
}
