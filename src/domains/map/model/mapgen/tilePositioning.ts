import { TILE_COORDINATES } from "@/entities/data/tileCoordinates";
import { HEX_VERTICES } from "@/utils/unitPositioning/constants";

type TilePosition = {
  systemId: string;
  ringPosition: string;
  x: number;
  y: number;
};

// Magic constants from the Java codebase
const HORIZONTAL_TILE_SPACING = 260;
const SPACE_FOR_TILE_HEIGHT = 300;
export const TILE_HEIGHT = 299;
export const TILE_WIDTH = 345;
const EXTRA_X = 300;
const EXTRA_Y = 300;
const TILE_PADDING = 100;
const RING_MAX_COUNT = 8;
const RING_MIN_COUNT = 3;
const FRACTURE_Y_BUMP = 400;

/** SVG path tracing the hex outline in tile-local coordinates. */
export const HEX_PATH = `${HEX_VERTICES.map(
  ({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x} ${y}`,
).join(" ")} Z`;

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

function normalizeRingCount(ringCount: number): number {
  return Math.max(Math.min(ringCount, RING_MAX_COUNT), RING_MIN_COUNT);
}

const FRACTURE_POSITIONS = ["frac1", "frac2", "frac3", "frac4", "frac5", "frac6", "frac7"];

/** True when all seven fracture positions appear in the "position:systemId" entries. */
function isFractureInPlay(tilePositions: string[]): boolean {
  const positionSet = new Set(
    tilePositions.map((entry) => entry.split(":")[0])
  );
  return FRACTURE_POSITIONS.every((pos) => positionSet.has(pos));
}

function getBaseCoordinates(position: string): { x: number; y: number } {
  const coords = TILE_COORDINATES[position];
  if (!coords) {
    throw new Error(`Unknown position: ${position}`);
  }
  return { ...coords };
}

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

function applyFinalPadding(x: number, y: number): { x: number; y: number } {
  return {
    x: x + EXTRA_X - TILE_PADDING,
    y: y + EXTRA_Y - TILE_PADDING,
  };
}

function calculateSingleTilePosition(
  position: string,
  ringCount: number = 3,
  fractureYbump: number = 0
): { x: number; y: number } {
  const baseCoords = getBaseCoordinates(position);
  const adjustedCoords = applyRingAdjustments(
    baseCoords.x,
    baseCoords.y,
    position,
    ringCount,
    fractureYbump
  );
  return applyFinalPadding(adjustedCoords.x, adjustedCoords.y);
}

/**
 * Positions "position:systemId" entries on the board. The fracture Y offset is
 * detected from the entries unless passed explicitly.
 */
const calculateTilePositions = (
  inputData: string[],
  ringCount: number = 3,
  fractureYbump?: number
): TilePosition[] => {
  const finalFractureYbump = fractureYbump ?? getFractureYBump(inputData);

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

function getFractureYBump(tilePositions: string[] | undefined): number {
  return tilePositions && isFractureInPlay(tilePositions) ? FRACTURE_Y_BUMP : 0;
}

/**
 * Positions a player's stat tiles, shifted the same way as the map's tiles
 * when the fracture is in play.
 */
function calculateStatTilePositions(
  statPositions: string[],
  ringCount: number | undefined,
  gameTilePositions: string[] | undefined,
): TilePosition[] {
  return calculateTilePositions(
    statPositions.map((position) => `${position}:stat_${position}`),
    ringCount,
    getFractureYBump(gameTilePositions),
  );
}

export {
  calculateTilePositions,
  calculateSingleTilePosition,
  calculateStatTilePositions,
  isFractureInPlay,
  type TilePosition,
};
