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

interface UnitStackProps {
  unitType: string;
  colorAlias: string;
  faction: string;
  count: number;
  x: number;
  y: number;
  stackKey: string;
  entityType: "unit" | "token" | "attachment";
  onUnitMouseOver?: (stackKey: string, event: React.MouseEvent) => void;
  onUnitMouseLeave?: (stackKey: string, event: React.MouseEvent) => void;
  onUnitSelect?: (stackKey: string, event: React.MouseEvent) => void;
}

export function UnitStack({
  unitType,
  colorAlias,
  faction,
  count,
  stackKey,
  entityType,
  x,
  y,
  onUnitMouseOver,
  onUnitMouseLeave,
  onUnitSelect,
}: UnitStackProps) {
  const baseZIndex = entityBaseZIndex(unitType);

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
            ? (e: React.MouseEvent<HTMLDivElement>) =>
                onUnitMouseOver(stackKey, e)
            : undefined
        }
        onMouseLeave={
          entityType === "unit" && onUnitMouseLeave
            ? (e: React.MouseEvent<HTMLDivElement>) =>
                onUnitMouseLeave(stackKey, e)
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
        // Calculate stacking offset from northeast to northwest
        const stackOffsetX = -i * SPLAY_OFFSET_X; // Move west (left) by offset per unit
        const stackOffsetY = i * SPLAY_OFFSET_Y; // Slight movement south for depth

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
            cursor: "pointer" as const,
            transform: "translate(-50%, -50%)",
            zIndex: baseZIndex + (count - 1 - i), // Higher z-index for northeast units (top of stack) + unit type priority
          },
          onMouseEnter:
            entityType === "unit" && onUnitMouseOver
              ? (e: React.MouseEvent<HTMLImageElement>) =>
                  onUnitMouseOver(stackKey, e)
              : undefined,
          onMouseLeave:
            entityType === "unit" && onUnitMouseLeave
              ? (e: React.MouseEvent<HTMLImageElement>) =>
                  onUnitMouseLeave(stackKey, e)
              : undefined,
          onMouseDown:
            entityType === "unit" && onUnitSelect
              ? (e: React.MouseEvent<HTMLImageElement>) =>
                  onUnitSelect(stackKey, e)
              : undefined,
        };

        if (entityType === "token") {
          return <Token key={unitKey} tokenId={unitType} {...commonProps} />;
        } else if (entityType === "attachment") {
          return <Attachment key={unitKey} {...commonProps} />;
        } else {
          return <Unit key={unitKey} {...commonProps} />;
        }
      })}
    </>
  );
}
