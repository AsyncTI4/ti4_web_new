import type { Point } from "@/entities/data/types";

export type HexagonVertex = Point;

const NEIGHBOR_OFFSETS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

/**
 * A grid square touches the hexagon rim when it is inside the hexagon and any
 * of its 8 neighbors is off the grid or entirely outside the hexagon.
 */
export const touchesHexRim = (
  row: number,
  col: number,
  gridSize: number,
  squareWidth: number,
  squareHeight: number,
  hexagonVertices: HexagonVertex[],
): boolean => {
  const isInside = (r: number, c: number) =>
    !squareOutsideHex(r, c, squareWidth, squareHeight, hexagonVertices);

  if (!isInside(row, col)) return false;

  return NEIGHBOR_OFFSETS.some(([dr, dc]) => {
    const r = row + dr;
    const c = col + dc;
    return r < 0 || r >= gridSize || c < 0 || c >= gridSize || !isInside(r, c);
  });
};

/**
 * True when no corner of the grid square is inside the hexagon and no square
 * edge crosses a hexagon edge.
 */
export const squareOutsideHex = (
  row: number,
  col: number,
  squareWidth: number,
  squareHeight: number,
  hexagonVertices: HexagonVertex[],
): boolean => {
  const x = col * squareWidth;
  const y = row * squareHeight;
  const x2 = x + squareWidth;
  const y2 = y + squareHeight;

  const corners: [number, number][] = [
    [x, y],
    [x2, y],
    [x2, y2],
    [x, y2],
  ];
  if (corners.some(([cx, cy]) => isPointInHexagon(cx, cy, hexagonVertices))) {
    return false;
  }

  const edges: [number, number, number, number][] = [
    [x, y, x2, y],
    [x2, y, x2, y2],
    [x2, y2, x, y2],
    [x, y2, x, y],
  ];
  return !edges.some(([x1, y1, ex2, ey2]) =>
    lineIntersectsHexagon(x1, y1, ex2, ey2, hexagonVertices),
  );
};

/** Ray casting point-in-polygon test. */
const isPointInHexagon = (
  x: number,
  y: number,
  hexagonVertices: HexagonVertex[],
): boolean => {
  let inside = false;
  for (
    let i = 0, j = hexagonVertices.length - 1;
    i < hexagonVertices.length;
    j = i++
  ) {
    const xi = hexagonVertices[i].x;
    const yi = hexagonVertices[i].y;
    const xj = hexagonVertices[j].x;
    const yj = hexagonVertices[j].y;

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
};

/** Parametric segment intersection against each hexagon edge. */
const lineIntersectsHexagon = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  hexagonVertices: HexagonVertex[],
): boolean => {
  for (let i = 0; i < hexagonVertices.length; i++) {
    const next = (i + 1) % hexagonVertices.length;
    const hx1 = hexagonVertices[i].x;
    const hy1 = hexagonVertices[i].y;
    const hx2 = hexagonVertices[next].x;
    const hy2 = hexagonVertices[next].y;

    const denom = (x1 - x2) * (hy1 - hy2) - (y1 - y2) * (hx1 - hx2);
    if (Math.abs(denom) < 1e-10) continue;

    const t = ((x1 - hx1) * (hy1 - hy2) - (y1 - hy1) * (hx1 - hx2)) / denom;
    const u = -((x1 - x2) * (y1 - hy1) - (y1 - y2) * (x1 - hx1)) / denom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return true;
  }
  return false;
};
