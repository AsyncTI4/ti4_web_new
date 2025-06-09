/**
 * Generic algorithm to check if a grid square touches the rim of any arbitrary shape.
 * Uses shape-specific methods passed as parameters to handle different geometric shapes.
 */
export const touchesShapeRim = (
  row: number,
  col: number,
  gridSize: number,
  squareWidth: number,
  squareHeight: number,
  isSquareInShape: (row: number, col: number) => boolean
): boolean => {
  // Can't be a rim square if it's not in the shape
  if (!isSquareInShape(row, col)) return false;

  // Check all 8 neighboring squares (cardinal and diagonal directions)
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1], // cardinal directions
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1], // diagonal directions
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    // Check if neighbor is out of bounds or outside the shape
    if (
      newRow < 0 ||
      newRow >= gridSize ||
      newCol < 0 ||
      newCol >= gridSize ||
      !isSquareInShape(newRow, newCol)
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Determines if a grid square touches the hexagon rim using neighbor analysis.
 *
 * Algorithm:
 * 1. Examines all 8 neighboring squares (cardinal and diagonal directions)
 * 2. A square touches the rim if any neighbor is either:
 *    - Outside the grid boundaries
 *    - Completely outside the hexagon shape
 * 3. This approach identifies rim squares by finding squares that are inside
 *    the hexagon but adjacent to squares that are outside
 */
export const touchesHexRim = (
  row: number,
  col: number,
  gridSize: number,
  squareWidth: number,
  squareHeight: number,
  hexagonVertices: HexagonVertex[]
): boolean => {
  return touchesShapeRim(
    row,
    col,
    gridSize,
    squareWidth,
    squareHeight,
    (r: number, c: number) =>
      !squareOutsideHex(r, c, squareWidth, squareHeight, hexagonVertices)
  );
};

/**
 * Determines if a grid square touches the planet circle rim using neighbor analysis.
 * Similar to touchesHexRim but for circular boundaries instead of hexagonal.
 *
 * Algorithm:
 * 1. Examines all 8 neighboring squares (cardinal and diagonal directions)
 * 2. A square touches the rim if it intersects with the circle AND any neighbor either:
 *    - Is outside the grid boundaries
 *    - Doesn't intersect with the circle
 * 3. This identifies rim squares by finding squares that are inside/intersecting
 *    the circle but adjacent to squares that are outside the circle
 */
export const touchesCircleRim = (
  row: number,
  col: number,
  gridSize: number,
  squareWidth: number,
  squareHeight: number,
  planetX: number,
  planetY: number,
  planetRadius: number
): boolean => {
  return touchesShapeRim(
    row,
    col,
    gridSize,
    squareWidth,
    squareHeight,
    (r: number, c: number) =>
      squareIntersectsCircle(
        r,
        c,
        squareWidth,
        squareHeight,
        planetX,
        planetY,
        planetRadius
      )
  );
};

/**
 * Generic algorithm to check if a grid square intersects with any arbitrary shape.
 * Uses shape-specific methods passed as parameters to handle different geometric shapes.
 */
export const squareIntersectsShape = (
  row: number,
  col: number,
  squareWidth: number,
  squareHeight: number,
  isPointInShape: (x: number, y: number) => boolean,
  doesLineIntersectShape: (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => boolean,
  shapeCenter?: { x: number; y: number }
): boolean => {
  const x = col * squareWidth;
  const y = row * squareHeight;
  const x2 = x + squareWidth;
  const y2 = y + squareHeight;

  // Check if any corner of the square is inside the shape
  const corners = [
    { x, y },
    { x: x2, y },
    { x: x2, y: y2 },
    { x, y: y2 },
  ];

  for (const corner of corners) {
    if (isPointInShape(corner.x, corner.y)) {
      return true; // Corner is inside shape
    }
  }

  // Check if shape center is inside the square (if center is provided)
  if (
    shapeCenter &&
    shapeCenter.x >= x &&
    shapeCenter.x <= x2 &&
    shapeCenter.y >= y &&
    shapeCenter.y <= y2
  ) {
    return true; // Shape center is inside square
  }

  // Check if any edge of the square intersects with the shape
  const edges = [
    [x, y, x2, y], // top edge
    [x2, y, x2, y2], // right edge
    [x2, y2, x, y2], // bottom edge
    [x, y2, x, y], // left edge
  ];

  for (const edge of edges) {
    if (doesLineIntersectShape(edge[0], edge[1], edge[2], edge[3])) {
      return true; // Edge intersects with shape
    }
  }

  return false; // No intersection
};

/**
 * Checks if a grid square intersects with or is inside a circular planet area.
 * A square is considered to intersect if:
 * - Any corner of the square is inside the circle
 * - The circle center is inside the square
 * - Any edge of the square intersects the circle
 */
export const squareIntersectsCircle = (
  row: number,
  col: number,
  squareWidth: number,
  squareHeight: number,
  planetX: number,
  planetY: number,
  planetRadius: number
): boolean => {
  // Shape-specific point containment function for circle
  const pointInCircle = (x: number, y: number): boolean => {
    const dx = x - planetX;
    const dy = y - planetY;
    const distanceSquared = dx * dx + dy * dy;
    return distanceSquared <= planetRadius * planetRadius;
  };

  // Shape-specific line intersection function for circle
  const lineIntersectsCircle = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): boolean => {
    const closestPoint = getClosestPointOnLineSegment(
      planetX,
      planetY,
      x1,
      y1,
      x2,
      y2
    );
    const dx = closestPoint.x - planetX;
    const dy = closestPoint.y - planetY;
    const distanceSquared = dx * dx + dy * dy;
    return distanceSquared <= planetRadius * planetRadius;
  };

  // Use generic algorithm with circle-specific methods
  return squareIntersectsShape(
    row,
    col,
    squareWidth,
    squareHeight,
    pointInCircle,
    lineIntersectsCircle,
    { x: planetX, y: planetY } // Circle center for additional check
  );
};

/**
 * Helper function to find the closest point on a line segment to a given point.
 */
export const getClosestPointOnLineSegment = (
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): { x: number; y: number } => {
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    // Line segment is a point
    return { x: x1, y: y1 };
  }

  const lengthSquared = dx * dx + dy * dy;
  const t = Math.max(
    0,
    Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared)
  );

  return {
    x: x1 + t * dx,
    y: y1 + t * dy,
  };
};

/**
 * Geometric containment algorithm to determine if a grid square is completely outside
 * the hexagon and doesn't touch any hexagon edges.
 */
export const squareOutsideHex = (
  row: number,
  col: number,
  squareWidth: number,
  squareHeight: number,
  hexagonVertices: HexagonVertex[]
): boolean =>
  !squareIntersectsShape(
    row,
    col,
    squareWidth,
    squareHeight,
    (x: number, y: number): boolean => {
      return isPointInHexagon(x, y, hexagonVertices);
    },
    (x1: number, y1: number, x2: number, y2: number): boolean => {
      return lineIntersectsHexagon(x1, y1, x2, y2, hexagonVertices);
    }
    // No shape center provided - hexagon center check not needed
  );

/**
 * Ray casting algorithm to determine if a point is inside a polygon (hexagon).
 * Uses the ray casting algorithm which counts intersections of a horizontal ray
 * extending from the point to infinity with the polygon edges.
 */
export const isPointInHexagon = (
  x: number,
  y: number,
  hexagonVertices: HexagonVertex[]
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

/**
 * Line segment intersection algorithm to check if a line intersects with any edge of the hexagon.
 * Uses parametric line equations to find intersection points between two line segments.
 */
export const lineIntersectsHexagon = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  hexagonVertices: HexagonVertex[]
): boolean => {
  for (let i = 0; i < hexagonVertices.length; i++) {
    const next = (i + 1) % hexagonVertices.length;
    const hx1 = hexagonVertices[i].x;
    const hy1 = hexagonVertices[i].y;
    const hx2 = hexagonVertices[next].x;
    const hy2 = hexagonVertices[next].y;

    // Check if line segments intersect using parametric equations
    const denom = (x1 - x2) * (hy1 - hy2) - (y1 - y2) * (hx1 - hx2);
    if (Math.abs(denom) < 1e-10) continue; // Lines are parallel

    const t = ((x1 - hx1) * (hy1 - hy2) - (y1 - hy1) * (hx1 - hx2)) / denom;
    const u = -((x1 - x2) * (y1 - hy1) - (y1 - y2) * (x1 - hx1)) / denom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return true;
    }
  }
  return false;
};

export interface HexagonVertex {
  x: number;
  y: number;
}
