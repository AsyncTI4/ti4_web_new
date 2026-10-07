import type { Point } from "@/entities/data/types";

export type HexSide = { x1: number; y1: number; x2: number; y2: number };

export const RADIUS = 172.5; // Width = 345px

export function generateHexagonPoints(
  cx: number,
  cy: number,
  radius: number
): Point[] {
  const points = [];
  for (let i = 0; i < 6; i++) {
    // Flat-top orientation starts at 0°.
    const angle = i * 60 * (Math.PI / 180);
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push({ x, y });
  }
  return points;
}

export function generateHexagonSides(points: Point[]): HexSide[] {
  const sides = [];
  for (let i = 0; i < 6; i++) {
    const nextI = (i + 1) % 6;
    sides.push({
      x1: points[i].x,
      y1: points[i].y,
      x2: points[nextI].x,
      y2: points[nextI].y,
    });
  }
  return sides;
}

export function generateHexagonMidpoints(points: Point[]): Point[] {
  const midpoints = [];
  for (let i = 0; i < 6; i++) {
    const nextI = (i + 1) % 6;
    midpoints.push({
      x: (points[i].x + points[nextI].x) / 2,
      y: (points[i].y + points[nextI].y) / 2,
    });
  }
  return midpoints;
}

export const HEX_SIDE_TO_TILE_DIRECTION = [2, 3, 4, 5, 0, 1];
