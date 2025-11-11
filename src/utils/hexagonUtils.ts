export const RADIUS = 172.5; // Width = 345px

export function generateHexagonPoints(
  cx: number,
  cy: number,
  radius: number
): { x: number; y: number }[] {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = i * 60 * (Math.PI / 180); // Start at 0° for flat-top orientation
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push({ x, y });
  }
  return points;
}

export function generateHexagonSides(
  points: { x: number; y: number }[]
): Array<{ x1: number; y1: number; x2: number; y2: number }> {
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

export function generateHexagonMidpoints(
  points: { x: number; y: number }[]
): { x: number; y: number }[] {
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

