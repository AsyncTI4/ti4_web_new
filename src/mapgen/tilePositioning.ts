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

/**
 * Normalize ring count to valid bounds
 */
function normalizeRingCount(ringCount: number): number {
  return Math.max(Math.min(ringCount, RING_MAX_COUNT), RING_MIN_COUNT);
}

/**
 * Check if fracture is in play by verifying all 7 fracture positions exist
 * @param tilePositions Array of strings in format "position:systemId"
 * @returns true if all fracture positions (frac1-frac7) are present
 */
function isFractureInPlay(tilePositions: string[]): boolean {
  const fracturePositions = ["frac1", "frac2", "frac3", "frac4", "frac5", "frac6", "frac7"];
  const positionSet = new Set(
    tilePositions.map((entry) => entry.split(":")[0])
  );
  return fracturePositions.every((pos) => positionSet.has(pos));
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
  ringCount: number,
  fractureYbump: number = 0
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
      y += fractureYbump;
    } else if (lowerPos === "tr") {
      x -= lower * HORIZONTAL_TILE_SPACING * 2;
      y -= 150;
    } else if (lowerPos === "br") {
      x -= lower * HORIZONTAL_TILE_SPACING * 2;
      y -= lower * SPACE_FOR_TILE_HEIGHT * 2 - 150;
      y += fractureYbump;
    } else if (position.startsWith("frac")) {
      // Fracture positions: special handling matching Java implementation
      x -= lower * HORIZONTAL_TILE_SPACING;
      y -= (fractureYbump - 300) / 2; // equals 50 when fractureYbump is 400
    } else {
      // Regular tiles: center the map by reducing coordinates
      x -= lower * HORIZONTAL_TILE_SPACING;
      y -= lower * SPACE_FOR_TILE_HEIGHT;
      y += fractureYbump;
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
  ringCount: number = 3,
  fractureYbump: number = 0
): { x: number; y: number } {
  // Step 1: Get base coordinates
  const baseCoords = getBaseCoordinates(position);

  // Step 2: Apply ring-based adjustments
  const adjustedCoords = applyRingAdjustments(
    baseCoords.x,
    baseCoords.y,
    position,
    ringCount,
    fractureYbump
  );

  // Step 3: Apply final padding
  return applyFinalPadding(adjustedCoords.x, adjustedCoords.y);
}

/**
 * Main function: Calculate tile positions from input data
 * @param inputData Array of strings in format "position:systemId"
 * @param ringCount Number of rings in the map (3-8, defaults to 6)
 * @param fractureYbump Optional fracture Y offset. If not provided, will be detected automatically.
 *                       Pass 0 explicitly to skip fracture detection (e.g., for stat tiles).
 * @returns Array of tile position objects
 */
const calculateTilePositions = (
  inputData: string[],
  ringCount: number = 3,
  fractureYbump?: number
): TilePosition[] => {
  // Detect if fracture is in play and set fractureYbump accordingly
  // Only auto-detect if fractureYbump wasn't explicitly provided
  const finalFractureYbump =
    fractureYbump !== undefined
      ? fractureYbump
      : isFractureInPlay(inputData)
      ? 400
      : 0;

  return inputData.map((entry) => {
    const [position, systemId] = entry.split(":");
    const coordinates = calculateSingleTilePosition(
      position,
      ringCount,
      finalFractureYbump
    );

    return {
      systemId,
      ringPosition: position,
      x: coordinates.x,
      y: coordinates.y,
    };
  });
};

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
  isFractureInPlay,
  type TilePosition,
};
