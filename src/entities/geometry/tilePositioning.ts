import { TILE_COORDINATES } from "@/entities/data/tileCoordinates";
import { HEX_VERTICES } from "@/entities/positioning/constants";

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
const EXPANDED_FRACTURE_Y_BUMP = 600;

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
    x: (7 * TILE_WIDTH) / 8,
    y: (3 * TILE_HEIGHT) / 4,
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
const EXPANDED_FRACTURE_POSITIONS = new Set(
  Array.from({ length: 18 }, (_, index) => `frac${index + 8}`),
);

/**
 * True when any fracture position appears in the "position:systemId" entries, as the
 * bot's renderer decides (FractureService.isFractureRegionOnMap). A Fog of War seat
 * only gets the fracture tiles it has seen; requiring all seven dropped the shift for
 * that seat and slid the fracture row onto the regular tiles.
 */
function isFractureInPlay(tilePositions: string[]): boolean {
  const positionSet = new Set(
    tilePositions.map((entry) => entry.split(":")[0])
  );
  return FRACTURE_POSITIONS.some((pos) => positionSet.has(pos));
}

/**
 * Fog of War games can place tiles on extra maps "A"-"G" next to the main map
 * (positions a000-g1696, bot BoardPosition). Each is a full board laid out with
 * the regular ring positions, shifted right of the main map.
 */
const EXTRA_BOARDS = ["a", "b", "c", "d", "e", "f", "g"];
const BOARD_POSITION_PATTERN = /^[a-g](?:1[0-6]|[0-9])[0-9][0-9]$/;
const BOARD_MAX_RING = 16;

type BoardPosition = { index: number; local: string };

function parseBoardPosition(position: string): BoardPosition | null {
  if (!BOARD_POSITION_PATTERN.test(position)) return null;
  return {
    index: EXTRA_BOARDS.indexOf(position[0]),
    local: position.slice(1),
  };
}

/** External position IDs must match an own entry, never an Object prototype key. */
function hasCoordinates(position: string): boolean {
  return Object.hasOwn(TILE_COORDINATES, position);
}

function isSupportedTilePosition(position: string): boolean {
  if (hasCoordinates(position)) return true;
  const board = parseBoardPosition(position);
  return board !== null && hasCoordinates(board.local);
}

/**
 * Ring count the bot lays the map out with (MapPositionMapper.layoutRingCount):
 * the game's ring count, widened to the outermost ring used on an extra map.
 */
function getLayoutRingCount(
  ringCount: number,
  tilePositions: string[] | undefined,
): number {
  let layoutRings = ringCount;
  for (const entry of tilePositions ?? []) {
    const board = parseBoardPosition(entry.split(":")[0]);
    if (board) {
      layoutRings = Math.max(layoutRings, Math.floor(Number(board.local) / 100));
    }
  }
  return layoutRings;
}

/** Bot MapPositionMapper.boardWidth: horizontal room one board of that many rings takes. */
function boardWidth(ringCount: number): number {
  return (2 * ringCount + 2) * HORIZONTAL_TILE_SPACING;
}

function getBaseCoordinates(
  position: string,
  ringCount: number,
): { x: number; y: number } {
  if (hasCoordinates(position)) return { ...TILE_COORDINATES[position] };
  const board = parseBoardPosition(position);
  if (!board || !hasCoordinates(board.local)) {
    throw new Error(`Unknown position: ${position}`);
  }
  // Bot: extraBoardOffsetX minus extraBoardCompression, which nets to one
  // board width per board, sized for the layout ring count.
  const boardRings = Math.max(
    Math.min(ringCount, BOARD_MAX_RING),
    RING_MIN_COUNT,
  );
  const coords = TILE_COORDINATES[board.local];
  return {
    x: coords.x + (board.index + 1) * boardWidth(boardRings),
    y: coords.y,
  };
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
      y += fractureYbump === FRACTURE_Y_BUMP ? -50 : 250;
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
  const baseCoords = getBaseCoordinates(position, ringCount);
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
 * detected from the entries unless passed explicitly. `ringCount` is the layout
 * ring count (see getLayoutRingCount).
 */
const calculateTilePositions = (
  inputData: string[],
  ringCount: number = 3,
  fractureYbump?: number
): TilePosition[] => {
  const finalFractureYbump = fractureYbump ?? getFractureYBump(inputData);

  return inputData.flatMap((entry) => {
    const [position, systemId] = entry.split(":");
    if (!isSupportedTilePosition(position)) return [];
    const coordinates = calculateSingleTilePosition(
      position,
      ringCount,
      finalFractureYbump
    );

    return [{
      systemId,
      ringPosition: position,
      x: coordinates.x,
      y: coordinates.y,
    }];
  });
};

function getFractureYBump(tilePositions: string[] | undefined): number {
  if (!tilePositions) return 0;
  const baseBump = isFractureInPlay(tilePositions) ? FRACTURE_Y_BUMP : 0;
  const hasExpandedFracture = tilePositions.some((entry) =>
    EXPANDED_FRACTURE_POSITIONS.has(entry.split(":")[0]),
  );
  return baseBump + (hasExpandedFracture ? EXPANDED_FRACTURE_Y_BUMP : 0);
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
    getLayoutRingCount(ringCount ?? 3, gameTilePositions),
    getFractureYBump(gameTilePositions),
  );
}

export {
  calculateTilePositions,
  calculateSingleTilePosition,
  calculateStatTilePositions,
  isFractureInPlay,
  getFractureYBump,
  getLayoutRingCount,
  isSupportedTilePosition,
  type TilePosition,
};
