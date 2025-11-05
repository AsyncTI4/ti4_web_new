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

  // For fighters and infantry, render as a badge with count instead of individual units
  if (isBadgeUnit(unitType)) {
    const badgeType = unitType as "ff" | "gf";

    return (
      <div
        key={`${stackKey}-badge-container`}
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          transform: "translate(-50%, -50%)",
          zIndex: baseZIndex,
        }}
      >
        <div style={{ position: "relative" }}>
          <UnitBadge
            key={`${stackKey}-badge`}
            unitType={badgeType}
            colorAlias={colorAlias}
            faction={faction}
            count={count}
            textColor={getTextColor(colorAlias)}
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
                ? (e: React.MouseEvent<HTMLDivElement>) =>
                    onUnitSelect(stackKey, e)
                : undefined
            }
          />
          {galvanizedCount > 0 && (
            <GalvanizeBadge
              key={`${stackKey}-galvanized`}
              count={galvanizedCount}
              style={{
                position: "absolute",
                top: "5%",
                left: "100%",
                transform: "translate(-50%, -50%)",
                zIndex: baseZIndex + 100,
              }}
            />
          )}
        </div>
      </div>
    );
  }

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
      calculateUnitArrangement(unitType, entityType, index, count);

    const unitKey = `${stackKey}-${index}`;

    const unitStyle = {
      position: "absolute" as const,
      pointerEvents: "auto" as const,
      cursor:
        entityType === "unit" ? ("pointer" as const) : ("default" as const),

      zIndex: baseZIndex + zIndexOffset,
    };

    const xPos = x + stackOffsetX;
    const yPos = y + stackOffsetY;

    if (entityType === "token") {
      return (
        <Token
          key={unitKey}
          tokenId={unitType}
          colorAlias={colorAlias}
          faction={faction}
          planetCenter={planetCenter}
          style={unitStyle}
          x={xPos}
          y={yPos}
        />
      );
    } else if (entityType === "attachment") {
      return (
        <Attachment
          key={unitKey}
          unitType={unitType}
          faction={faction}
          style={unitStyle}
          x={xPos}
          y={yPos}
        />
      );
    } else {
      return (
        <Unit
          key={unitKey}
          unitType={unitType}
          colorAlias={colorAlias}
          faction={faction}
          onMouseEnter={onUnitMouseOver ? handleMouseEnter : undefined}
          onMouseLeave={onUnitMouseLeave ? handleMouseLeave : undefined}
          onMouseDown={
            onUnitSelect
              ? (e: React.MouseEvent<HTMLImageElement>) =>
                  onUnitSelect(stackKey, e)
              : undefined
          }
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
    <>
      {galvanizedCount > 1 && !showIndividualGalvanized && (
        <GalvanizeBadge
          key={`${stackKey}-galvanized`}
          count={galvanizedCount}
          style={{
            position: "absolute",
            left: `${x}px`,
            top: `${y}px`,
            transform: "translate(0%, -110%)",
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
    </>
  );
}

type GalvanizeBadgeProps = {
  count: number;
  style: React.CSSProperties;
};
function GalvanizeBadge({ count, style }: GalvanizeBadgeProps) {
  return (
    <Group
      bg="dark.9"
      w="45px"
      h="20px"
      gap="xs"
      style={{
        position: "relative",
        borderRadius: 8,
        border: "1px solid var(--mantine-color-dark-3)",
        ...style,
      }}
    >
      <img
        src={cdnImage("/extra/marker_galvanize.png")}
        alt="Galvanize"
        style={{ width: "28px", position: "absolute", left: -8, top: -6 }}
      />
      <Text inline pl="24px" fz="16px" fw={600} c="white">
        {count}
      </Text>
    </Group>
  );
}
