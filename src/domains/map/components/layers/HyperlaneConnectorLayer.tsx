import { TILE_WIDTH, TILE_HEIGHT } from "@/domains/map/model/mapgen/tilePositioning";
import classes from "./HyperlaneConnectorLayer.module.css";

type Props = {
  /** Raw connection matrix from the backend ("i,j,...;..." rows), or null/undefined if unconfigured. */
  matrix?: string | null;
};

const CENTER_X = TILE_WIDTH / 2;
const CENTER_Y = TILE_HEIGHT / 2;
const ROUNDABOUT_RADIUS = 60;

// Angle (degrees) to rotate each shape template for a given edge pair. Edge 0 points straight up;
// edges are numbered clockwise 60 degrees apart. Ported from the bot's HyperlaneTileGenerator so
// the web view matches the Discord-rendered map exactly.
const STRAIGHT: Record<string, number> = { "0,3": 0, "1,4": 60, "2,5": 120 };
const SMALL_CURVE: Record<string, number> = {
  "0,1": 0,
  "1,2": 60,
  "2,3": 120,
  "3,4": 180,
  "4,5": 240,
  "0,5": 300,
};
const LARGE_CURVE: Record<string, number> = {
  "0,2": 0,
  "1,3": 60,
  "2,4": 120,
  "3,5": 180,
  "0,4": 240,
  "1,5": 300,
};
const ROUNDABOUT_CONNECTOR: Record<string, number> = {
  "0,0": 0,
  "1,1": 60,
  "2,2": 120,
  "3,3": 180,
  "4,4": 240,
  "5,5": 300,
};

const SMALL_CURVE_PATH = `M ${CENTER_X} 0 Q 197.25 106.78 302 75`;
const LARGE_CURVE_PATH = `M ${CENTER_X} 0 Q 181.2 144.98 302 225`;

function parseMatrix(matrix: string): boolean[][] | null {
  const rows = matrix.split(";");
  if (rows.length !== 6) return null;
  return rows.map((row) => row.split(",").map((cell) => cell.trim() === "1"));
}

function hasSelfConnection(grid: boolean[][]): boolean {
  return grid.some((row, i) => row[i]);
}

// Unique edge pairs that are connected. selfOnly picks out i===j "roundabout" connections instead.
function getConnections(grid: boolean[][], selfOnly: boolean): [number, number][] {
  const seen = new Set<string>();
  const pairs: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (!grid[i][j]) continue;
      if (selfOnly !== (i === j)) continue;
      const a = Math.min(i, j);
      const b = Math.max(i, j);
      const key = `${a},${b}`;
      if (!seen.has(key)) {
        seen.add(key);
        pairs.push([a, b]);
      }
    }
  }
  return pairs;
}

export function HyperlaneConnectorLayer({ matrix }: Props) {
  const grid = matrix ? parseMatrix(matrix) : null;
  const asRoundabout = grid ? hasSelfConnection(grid) : false;
  const showCenterCircle = !grid || asRoundabout;

  const elements: React.ReactNode[] = [];

  if (showCenterCircle) {
    elements.push(
      <circle
        key="center"
        cx={CENTER_X}
        cy={CENTER_Y}
        r={ROUNDABOUT_RADIUS}
        className={classes.hyperlaneShape}
      />
    );
  }

  if (grid) {
    for (const [i, j] of getConnections(grid, false)) {
      const key = `${i},${j}`;
      if (key in STRAIGHT) {
        elements.push(
          <line
            key={`straight-${key}`}
            x1={CENTER_X}
            y1={0}
            x2={CENTER_X}
            y2={TILE_HEIGHT}
            className={classes.hyperlaneShape}
            transform={`rotate(${STRAIGHT[key]} ${CENTER_X} ${CENTER_Y})`}
          />
        );
      } else if (key in SMALL_CURVE) {
        elements.push(
          <path
            key={`small-${key}`}
            d={SMALL_CURVE_PATH}
            className={classes.hyperlaneShape}
            transform={`rotate(${SMALL_CURVE[key]} ${CENTER_X} ${CENTER_Y})`}
          />
        );
      } else if (key in LARGE_CURVE) {
        elements.push(
          <path
            key={`large-${key}`}
            d={LARGE_CURVE_PATH}
            className={classes.hyperlaneShape}
            transform={`rotate(${LARGE_CURVE[key]} ${CENTER_X} ${CENTER_Y})`}
          />
        );
      }
    }

    for (const [i] of getConnections(grid, true)) {
      const key = `${i},${i}`;
      const angle = ROUNDABOUT_CONNECTOR[key];
      if (angle !== undefined) {
        elements.push(
          <line
            key={`roundabout-${key}`}
            x1={CENTER_X}
            y1={0}
            x2={CENTER_X}
            y2={CENTER_Y - ROUNDABOUT_RADIUS}
            className={classes.hyperlaneShape}
            transform={`rotate(${angle} ${CENTER_X} ${CENTER_Y})`}
          />
        );
      }
    }
  }

  if (elements.length === 0) return null;

  return (
    <svg
      className={classes.hyperlaneLayer}
      viewBox={`0 0 ${TILE_WIDTH} ${TILE_HEIGHT}`}
      aria-hidden="true"
    >
      {elements}
    </svg>
  );
}
