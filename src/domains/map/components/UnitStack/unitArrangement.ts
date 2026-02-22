import {
  SPLAY_OFFSET_X,
  SPLAY_OFFSET_Y,
} from "@/utils/unitPositioning";

/**
 * Calculates the positioning and z-index offset for a unit in a stack
 */
export function calculateUnitArrangement(
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
