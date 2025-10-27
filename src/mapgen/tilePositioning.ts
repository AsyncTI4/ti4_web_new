import { TILE_COORDINATES } from "@/data/tileCoordinates";

interface TilePosition {
  systemId: string;
  ringPosition: string;
  x: number;
  y: number;
}

// Magic constants from the Java codebase
const HORIZONTAL_TILE_SPACING = 260;
// const VERTICAL_TILE_SPACING = 160;
const SPACE_FOR_TILE_HEIGHT = 300;
// const SPACE_FOR_TILE_WIDTH = 350;
export const TILE_HEIGHT = 299;
export const TILE_WIDTH = 345;
const EXTRA_X = 300;
const EXTRA_Y = 300;
const TILE_PADDING = 100;
const RING_MAX_COUNT = 8;
const RING_MIN_COUNT = 3;

export const HEXAGON_EDGE_MIDPOINTS = [
  {
    x: TILE_WIDTH / 2,
    y: 0,
  },
  {
    x: (7 * TILE_WIDTH) / 8,
    y: TILE_HEIGHT / 4,
  },
  {
    x: (3 * TILE_WIDTH) / 4,
    y: (7 * TILE_HEIGHT) / 8,
  },
  {
    x: TILE_WIDTH / 2,
    y: TILE_HEIGHT,
  },
  {
    x: TILE_WIDTH / 8,
    y: (3 * TILE_HEIGHT) / 4,
  },
  {
    x: TILE_WIDTH / 8,
    y: TILE_HEIGHT / 4,
  },
];

/**
 * Normalize ring count to valid bounds
 */
function normalizeRingCount(ringCount: number): number {
  return Math.max(Math.min(ringCount, RING_MAX_COUNT), RING_MIN_COUNT);
}

/**
 * Get base coordinates for a position
 */
function getBaseCoordinates(position: string): { x: number; y: number } {
  const coords = TILE_COORDINATES[position];
  if (!coords) {
    throw new Error(`Unknown position: ${position}`);
  }
  return { ...coords };
}

/**
 * Apply ring-based adjustments to coordinates
 */
function applyRingAdjustments(
  x: number,
  y: number,
  position: string,
  ringCount: number
): { x: number; y: number } {
  const normalizedRingCount = normalizeRingCount(ringCount);

  // For 3-ring maps, add extra horizontal spacing
  if (normalizedRingCount === RING_MIN_COUNT) {
    x += HORIZONTAL_TILE_SPACING;
  }

  // For maps smaller than max size, adjust positioning
  if (normalizedRingCount < RING_MAX_COUNT) {
    const lower = RING_MAX_COUNT - normalizedRingCount;

    // Special handling for corner positions
    const lowerPos = position.toLowerCase();
    if (lowerPos === "tl") {
      y -= 150;
    } else if (lowerPos === "bl") {
      y -= lower * SPACE_FOR_TILE_HEIGHT * 2 - 150;
    } else if (lowerPos === "tr") {
      x -= lower * HORIZONTAL_TILE_SPACING * 2;
      y -= 150;
    } else if (lowerPos === "br") {
      x -= lower * HORIZONTAL_TILE_SPACING * 2;
      y -= lower * SPACE_FOR_TILE_HEIGHT * 2 - 150;
    } else {
      // Regular tiles: center the map by reducing coordinates
      x -= lower * HORIZONTAL_TILE_SPACING;
      y -= lower * SPACE_FOR_TILE_HEIGHT;
    }
  }

  return { x, y };
}

/**
 * Apply final padding to coordinates
 */
function applyFinalPadding(x: number, y: number): { x: number; y: number } {
  return {
    x: x + EXTRA_X - TILE_PADDING,
    y: y + EXTRA_Y - TILE_PADDING,
  };
}

/**
 * Calculate the final position for a single tile
 */
function calculateSingleTilePosition(
  position: string,
  ringCount: number = 3
): { x: number; y: number } {
  // Step 1: Get base coordinates
  const baseCoords = getBaseCoordinates(position);

  // Step 2: Apply ring-based adjustments
  const adjustedCoords = applyRingAdjustments(
    baseCoords.x,
    baseCoords.y,
    position,
    ringCount
  );

  // Step 3: Apply final padding
  return applyFinalPadding(adjustedCoords.x, adjustedCoords.y);
}

/**
 * Main function: Calculate tile positions from input data
 * @param inputData Array of strings in format "position:systemId"
 * @param ringCount Number of rings in the map (3-8, defaults to 6)
 * @returns Array of tile position objects
 */
const calculateTilePositions = (
  inputData: string[],
  ringCount: number = 3
): TilePosition[] =>
  inputData.map((entry) => {
    const [position, systemId] = entry.split(":");
    const coordinates = calculateSingleTilePosition(position, ringCount);

    return {
      systemId,
      ringPosition: position,
      x: coordinates.x,
      y: coordinates.y,
    };
  });

/**
 * Helper function to get all valid positions
 */
function getValidPositions(): string[] {
  return Object.keys(TILE_COORDINATES);
}

/**
 * Helper function to check if a position is valid
 */
function isValidPosition(position: string): boolean {
  return position in TILE_COORDINATES;
}

export {
  calculateTilePositions,
  calculateSingleTilePosition,
  getValidPositions,
  isValidPosition,
  normalizeRingCount,
  type TilePosition,
};
