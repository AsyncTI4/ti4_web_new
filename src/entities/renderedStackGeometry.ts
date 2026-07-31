import type { EntityData } from "@/entities/data/types";
import {
  getTokenSpriteDimensions,
  getUnitSpriteDimensions,
} from "@/entities/data/renderedSpriteDimensions";
import { getTokenData } from "@/entities/lookup/tokens";

export const SPLAY_OFFSET_X = 10;
export const SPLAY_OFFSET_Y = 10;

export type RenderedFootprint = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
};

export type UnitArrangement = {
  stackOffsetX: number;
  stackOffsetY: number;
  zIndexOffset: number;
};

const DEFAULT_FOOTPRINT = centeredFootprint(60, 60);
const BADGE_FOOTPRINT = centeredFootprint(70, 35);
const DMZ_FOOTPRINT = centeredFootprint(120, 120);

export function getRenderedStackFootprint(
  entity: Pick<EntityData, "entityId" | "entityType" | "count">,
): RenderedFootprint {
  if (entity.entityId === "gf" || entity.entityId === "ff") {
    return BADGE_FOOTPRINT;
  }

  const base = getBaseFootprint(entity.entityId, entity.entityType);
  let left = Infinity;
  let right = -Infinity;
  let top = Infinity;
  let bottom = -Infinity;

  for (let index = 0; index < Math.max(entity.count, 1); index++) {
    const offset = calculateUnitArrangement(
      entity.entityId,
      entity.entityType,
      index,
      Math.max(entity.count, 1),
    );
    left = Math.min(left, offset.stackOffsetX + base.left);
    right = Math.max(right, offset.stackOffsetX + base.right);
    top = Math.min(top, offset.stackOffsetY + base.top);
    bottom = Math.max(bottom, offset.stackOffsetY + base.bottom);
  }

  return footprintFromEdges(left, right, top, bottom);
}

export function calculateUnitArrangement(
  unitType: string,
  entityType: EntityData["entityType"],
  index: number,
  count: number,
): UnitArrangement {
  if (unitType === "mf") {
    return calculateMechGridPosition(index, count);
  }

  return {
    stackOffsetX: -index * SPLAY_OFFSET_X,
    stackOffsetY: index * SPLAY_OFFSET_Y,
    zIndexOffset: entityType === "attachment" ? -index : count - 1 - index,
  };
}

function getBaseFootprint(
  entityId: string,
  entityType: EntityData["entityType"],
): RenderedFootprint {
  if (entityId === "dmz_large") return DMZ_FOOTPRINT;
  if (entityType === "unit") {
    const unit = getUnitSpriteDimensions(entityId);
    return unit
      ? centeredFootprint(unit.width, unit.height)
      : DEFAULT_FOOTPRINT;
  }

  const token =
    getTokenSpriteDimensions("token", entityId) ??
    getTokenSpriteDimensions("attachment", entityId);
  if (!token) return DEFAULT_FOOTPRINT;

  const scale = getTokenData(entityId)?.scale ?? 1;
  return centeredFootprint(token.width * scale, token.height * scale);
}

function centeredFootprint(width: number, height: number): RenderedFootprint {
  return footprintFromEdges(-width / 2, width / 2, -height / 2, height / 2);
}

function footprintFromEdges(
  left: number,
  right: number,
  top: number,
  bottom: number,
): RenderedFootprint {
  return {
    left,
    right,
    top,
    bottom,
    width: right - left,
    height: bottom - top,
  };
}

function calculateMechGridPosition(
  index: number,
  totalCount: number,
): UnitArrangement {
  const spacing = 20;
  const column = Math.floor(index / 6);
  const position = index % 6;
  const positions = [
    { x: -spacing, y: -spacing / 2 },
    { x: 0, y: -spacing / 2 },
    { x: spacing, y: -spacing / 2 },
    { x: -spacing, y: spacing / 2 },
    { x: 0, y: spacing / 2 },
    { x: spacing, y: spacing / 2 },
  ];
  const used = positions.slice(
    0,
    Math.min(totalCount - column * 6, positions.length),
  );
  const centerX = used.reduce((sum, point) => sum + point.x, 0) / used.length;
  const centerY = used.reduce((sum, point) => sum + point.y, 0) / used.length;

  return {
    stackOffsetX: column * spacing * 3 + positions[position].x - centerX,
    stackOffsetY: positions[position].y - centerY,
    zIndexOffset: Math.floor(position / 3) + column * 2,
  };
}
