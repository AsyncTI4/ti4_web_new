import { PathResult } from "./tileDistances";

export type PathPoint = {
  x: number;
  y: number;
  systemId: string;
  isHyperlane: boolean;
  stepNumber: number;
};

export type TilePosition = {
  systemId: string;
  x: number;
  y: number;
};

const TILE_WIDTH = 390;
const TILE_HEIGHT = 239;

export function createPositionMap(
  tilePositions: TilePosition[]
): Map<string, { x: number; y: number }> {
  const map = new Map<string, { x: number; y: number }>();
  tilePositions.forEach((tile) => {
    map.set(tile.systemId, { x: tile.x, y: tile.y });
  });
  return map;
}

export function getTileCenter(
  systemId: string,
  positionMap: Map<string, { x: number; y: number }>,
  zoom: number,
  mapPadding: number
): { x: number; y: number } | null {
  const pos = positionMap.get(systemId);
  if (!pos) return null;

  // Calculate center position without zoom/mapPadding since these are handled by CSS transforms
  const centerX = pos.x + TILE_WIDTH / 2;
  const centerY = pos.y + TILE_HEIGHT / 2;

  return { x: centerX, y: centerY };
}

export function calculatePathPoints(
  path: PathResult["paths"][0],
  systemIdToPosition: Record<string, string>,
  positionMap: Map<string, { x: number; y: number }>,
  zoom: number,
  mapPadding: number
): PathPoint[] {
  const pathPoints: PathPoint[] = [];
  let stepNumber = 1;

  for (const systemId of path.systemIds) {
    const center = getTileCenter(systemId, positionMap, zoom, mapPadding);
    if (!center) continue;

    const position = systemIdToPosition[systemId];
    const isHyperlane = position
      ? path.hyperlanePositions.has(position)
      : false;

    pathPoints.push({
      x: center.x,
      y: center.y,
      systemId,
      isHyperlane,
      stepNumber: isHyperlane ? -1 : stepNumber,
    });

    if (!isHyperlane) {
      stepNumber++;
    }
  }

  return pathPoints;
}

export function validatePathIndex(
  selectedIndex: number,
  pathsLength: number
): boolean {
  return selectedIndex >= 0 && selectedIndex < pathsLength;
}
