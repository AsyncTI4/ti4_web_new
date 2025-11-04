import { Unit } from "../shared/Unit";
import { Token } from "./Token";
import { Attachment } from "./Attachment";
import {
  EntityStack,
  SPLAY_OFFSET_X,
  SPLAY_OFFSET_Y,
} from "../../utils/unitPositioning";
import { getUnitZIndex } from "../../utils/zIndexLayers";
import { UnitBadge } from "./UnitBadge";
import { getTextColor } from "@/lookup/colors";
import { useRef, useCallback } from "react";
import { LawInPlay } from "../../data/types";
import { lookupUnit } from "@/lookup/units";
import { useGameData } from "@/hooks/useGameContext";
import { getUnitDecalPath } from "@/lookup/decals";

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
  const sustained = stack.sustained;
  const entityType = stack.entityType;
  const baseZIndex = getUnitZIndex(unitType, 0);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Look up unit data to get bgDecalPath
  const unitData = lookupUnit(unitType, faction);
  const bgDecalPath = unitData?.bgDecalPath;

  // Get player data for decal overlay
  const gameData = useGameData();
  const playerData = gameData?.playerData?.find((p) => p.faction === faction);
  const decalPath = getUnitDecalPath(playerData, unitType, colorAlias);

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
              decalPath={decalPath || undefined}
              lawsInPlay={lawsInPlay}
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
    const { offsetX, offsetY, zOffset } = calculateMechGridPosition(
      index,
      count
    );
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
 * Centers the used positions around (0,0) based on total count
 */
function calculateMechGridPosition(
  index: number,
  totalCount: number
): {
  offsetX: number;
  offsetY: number;
  zOffset: number;
} {
  const gridSpacing = 20;
  const columnIndex = Math.floor(index / 6);
  const positionInColumn = index % 6;
  const mechsInCurrentColumn = Math.min(totalCount - columnIndex * 6, 6);

  // Base column offset (move right for each additional 3x2 grid)
  const columnOffsetX = columnIndex * gridSpacing * 3;

  // 3x2 grid positions: NORTHWEST, NORTH, NORTHEAST, SOUTHWEST, SOUTH, SOUTHEAST
  const allGridPositions = [
    { x: -gridSpacing, y: -gridSpacing / 2 }, // NORTHWEST
    { x: 0, y: -gridSpacing / 2 }, // NORTH
    { x: gridSpacing, y: -gridSpacing / 2 }, // NORTHEAST
    { x: -gridSpacing, y: gridSpacing / 2 }, // SOUTHWEST
    { x: 0, y: gridSpacing / 2 }, // SOUTH
    { x: gridSpacing, y: gridSpacing / 2 }, // SOUTHEAST
  ];

  // Get only the positions that will be used in this column
  const usedPositions = allGridPositions.slice(0, mechsInCurrentColumn);

  // Calculate centroid of used positions
  const centroidX =
    usedPositions.reduce((sum, pos) => sum + pos.x, 0) / usedPositions.length;
  const centroidY =
    usedPositions.reduce((sum, pos) => sum + pos.y, 0) / usedPositions.length;

  // Get the position for this specific mech and center it
  const gridPos = allGridPositions[positionInColumn];
  const offsetX = columnOffsetX + gridPos.x - centroidX;
  const offsetY = gridPos.y - centroidY;

  // Calculate z-index: second row gets higher z-index than first row
  const rowIndex = Math.floor(positionInColumn / 3);
  const zOffset = rowIndex + columnIndex * 2;

  return { offsetX, offsetY, zOffset };
}
