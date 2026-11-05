/*
 * Custom hyperlanes ("hl" tiles) carry their lanes in a 6x6 connection matrix
 * sent by the bot (`customHyperlanes` in web-data), not in the tile model.
 * Sides run clockwise from N: 0=N, 1=NE, 2=SE, 3=S, 4=SW, 5=NW. A stored
 * matrix has [i][j] = 1 when a ship may move from side i to side j, so a
 * one-way lane is [from][to] = 1 with [to][from] = 0, and [i][i] = 1 marks a
 * side joined to a central roundabout.
 *
 * The drawing is a port of the bot's HyperlaneTileGenerator and
 * OneWayHyperlaneOverlay so both UIs show the same lanes.
 */

export const CUSTOM_HYPERLANE_TILE_ID = "hl";

export type HyperlaneStyle = "DASHED" | "ARROWS" | "FADING" | "GATES";

export const HL_TILE_WIDTH = 345;
export const HL_TILE_HEIGHT = 300;

const CENTER_X = HL_TILE_WIDTH / 2;
const CENTER_Y = HL_TILE_HEIGHT / 2;
const EDGE_DISTANCE = HL_TILE_HEIGHT / 2;
const FAN_DEGREES = 14;
const MARKER_DEPTH = 32;
const STRAIGHT_HANDLE = 100;
const ROUNDABOUT_RADIUS = 60;
const BACKGROUND_COUNT = 17;

const BLUE_GLOW = "rgb(0,180,255)";
const BLUE_CORE = "rgb(180,200,240)";
const AMBER_GLOW = "rgb(255,200,40)";
const AMBER_CORE = "rgb(240,220,170)";
const ENTRY_GATE = "rgb(225,60,55)";
const EXIT_GATE = "rgb(70,230,110)";
const ARROW = "rgb(70,230,110)";
export const ARROW_OUTLINE = "rgb(5,10,25)";

const SMALL_CURVE_CONTROL: Point = { x: 197.25, y: 106.78 };
const LARGE_CURVE_CONTROL: Point = { x: 181.2, y: 144.98 };

type Point = { x: number; y: number };

export type HyperlaneStroke = {
  d: string;
  width: number;
  opacity: number;
  color: string;
  dash?: string;
};

export type HyperlaneArrow = {
  x: number;
  y: number;
  /** Degrees, clockwise from +x. */
  angle: number;
  color: string;
};

export type HyperlaneDrawing = {
  /** Wide translucent strokes, drawn first and cut by `gaps`. */
  glows: HyperlaneStroke[];
  /** 10px channels erased from the glow so the lanes read as rails. */
  gaps: string[];
  cores: HyperlaneStroke[];
  /** Junction glows where two or more lanes leave the same side. */
  nodes: Point[];
  arrows: HyperlaneArrow[];
  clipToHex: boolean;
};

export type HyperlaneBackground = {
  imagePath: string;
  flipX: boolean;
  flipY: boolean;
};

export function parseHyperlaneMatrix(matrix: string): number[][] | null {
  const rows = matrix.split(";");
  if (rows.length !== 6) return null;
  const grid: number[][] = [];
  for (const row of rows) {
    const cells = row.split(",").map((cell) => Number(cell.trim()));
    if (cells.length !== 6 || cells.some((cell) => cell !== 0 && cell !== 1)) {
      return null;
    }
    grid.push(cells);
  }
  return grid;
}

/** Sides that have at least one lane touching them. */
export function getMatrixActiveSides(matrix: string | undefined): Set<number> {
  const active = new Set<number>();
  const grid = matrix ? parseHyperlaneMatrix(matrix) : null;
  if (!grid) return active;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (!grid[i][j]) continue;
      active.add(i);
      active.add(j);
    }
  }
  return active;
}

function hasOneWayLanes(grid: number[][]): boolean {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (grid[i][j] !== grid[j][i]) return true;
    }
  }
  return false;
}

function isRoundabout(grid: number[][]): boolean {
  return grid.some((row, i) => row[i] === 1);
}

/* Java's String.hashCode, so the background matches the bot's image. */
function javaStringHashCode(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
  }
  return hash;
}

const floorMod = (value: number, modulus: number) =>
  ((value % modulus) + modulus) % modulus;

/*
 * Mirrors HyperlaneTileGenerator.getRandomTransformedBackground: the matrix
 * hash picks one of the hl_empty backgrounds, and one LCG step picks a flip.
 */
export function getHyperlaneBackground(
  matrix: string | undefined,
): HyperlaneBackground {
  if (!matrix) {
    return { imagePath: "hl_bg/hl_empty_0.png", flipX: false, flipY: false };
  }
  const seed = javaStringHashCode(matrix);
  const index = floorMod(seed, BACKGROUND_COUNT);
  const lcg =
    BigInt(seed) * 6364136223846793005n + 1442695040888963407n;
  const transform = Number(((lcg % 4n) + 4n) % 4n);
  return {
    imagePath: `hl_bg/hl_empty_${index}.png`,
    flipX: transform === 1 || transform === 3,
    flipY: transform === 2 || transform === 3,
  };
}

/* ---------- geometry helpers ---------- */

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;
const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);
const round = (value: number) => Math.round(value * 100) / 100;

function rotateAroundCenter(point: Point, degrees: number): Point {
  const angle = toRadians(degrees);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = point.x - CENTER_X;
  const dy = point.y - CENTER_Y;
  return {
    x: CENTER_X + dx * cos - dy * sin,
    y: CENTER_Y + dx * sin + dy * cos,
  };
}

const EDGE_MIDPOINTS: Point[] = Array.from({ length: 6 }, (_, side) => {
  const angle = toRadians(side * 60);
  return {
    x: CENTER_X + EDGE_DISTANCE * Math.sin(angle),
    y: CENTER_Y - EDGE_DISTANCE * Math.cos(angle),
  };
});

function inward(side: number): Point {
  const edge = EDGE_MIDPOINTS[side];
  return {
    x: (CENTER_X - edge.x) / EDGE_DISTANCE,
    y: (CENTER_Y - edge.y) / EDGE_DISTANCE,
  };
}

function towardCenter(side: number, length: number): Point {
  const edge = EDGE_MIDPOINTS[side];
  const direction = inward(side);
  return { x: edge.x + direction.x * length, y: edge.y + direction.y * length };
}

function curveControlPoint(from: number, to: number): Point | null {
  const steps = floorMod(to - from, 6);
  if (steps === 3) return null;
  const firstSide = steps < 3 ? from : to;
  const template =
    Math.min(steps, 6 - steps) === 1 ? SMALL_CURVE_CONTROL : LARGE_CURVE_CONTROL;
  return rotateAroundCenter(template, firstSide * 60);
}

/* Evenly spaced points (about 3px apart) along a polyline. */
function resample(corners: Point[]): Point[] {
  const points: Point[] = [];
  for (let i = 1; i < corners.length; i++) {
    const a = corners[i - 1];
    const b = corners[i];
    const steps = Math.max(1, Math.floor(distance(a, b) / 3));
    for (let k = 0; k < steps; k++) {
      const t = k / steps;
      points.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  points.push(corners[corners.length - 1]);
  return points;
}

function cubicPoints(p0: Point, p1: Point, p2: Point, p3: Point): Point[] {
  const corners: Point[] = [];
  const segments = 48;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const u = 1 - t;
    corners.push({
      x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
      y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
    });
  }
  return resample(corners);
}

function pathFromPoints(points: Point[]): string {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${round(p.x)} ${round(p.y)}`)
    .join("");
}

function polylineLength(points: Point[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += distance(points[i - 1], points[i]);
  return total;
}

/** Point and heading (radians) at a given distance along the polyline. */
function pointAt(points: Point[], at: number): [number, number, number] {
  let run = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const segment = distance(a, b);
    if (segment > 0 && run + segment >= at) {
      const t = (at - run) / segment;
      return [
        a.x + (b.x - a.x) * t,
        a.y + (b.y - a.y) * t,
        Math.atan2(b.y - a.y, b.x - a.x),
      ];
    }
    run += segment;
  }
  const a = points[points.length - 2];
  const b = points[points.length - 1];
  return [b.x, b.y, Math.atan2(b.y - a.y, b.x - a.x)];
}

const depthInto = (p: Point, side: number) => {
  const edge = EDGE_MIDPOINTS[side];
  const direction = inward(side);
  return (p.x - edge.x) * direction.x + (p.y - edge.y) * direction.y;
};

function atDepthFromEnd(points: Point[], side: number): [number, number, number] {
  for (let i = points.length - 1; i > 0; i--) {
    const p = points[i];
    if (depthInto(p, side) >= MARKER_DEPTH) {
      const next = points[Math.min(i + 1, points.length - 1)];
      return [p.x, p.y, Math.atan2(next.y - p.y, next.x - p.x)];
    }
  }
  return pointAt(points, polylineLength(points) - 13);
}

function atDepthFromStart(points: Point[], side: number): [number, number, number] {
  for (let i = 0; i < points.length - 1; i++) {
    const p = points[i];
    if (depthInto(p, side) >= MARKER_DEPTH) {
      const next = points[i + 1];
      return [p.x, p.y, Math.atan2(next.y - p.y, next.x - p.x)];
    }
  }
  return pointAt(points, 13);
}

const arrow = (
  [x, y, heading]: [number, number, number],
  color: string,
): HyperlaneArrow => ({ x, y, angle: toDegrees(heading), color });

function rampStrokes(
  points: Point[],
  startWidth: number,
  endWidth: number,
  startAlpha: number,
  endAlpha: number,
  color: string,
): HyperlaneStroke[] {
  const segments = points.length - 1;
  const strokes: HyperlaneStroke[] = [];
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    strokes.push({
      d: pathFromPoints([points[i], points[i + 1]]),
      width: startWidth + (endWidth - startWidth) * t,
      opacity: startAlpha + (endAlpha - startAlpha) * t,
      color,
    });
  }
  return strokes;
}

function oneWayCore(
  points: Point[],
  oneWay: boolean,
  style: HyperlaneStyle,
): HyperlaneStroke[] {
  const d = pathFromPoints(points);
  if (!oneWay) return [{ d, width: 4, opacity: 0.8, color: BLUE_CORE }];
  switch (style) {
    case "DASHED":
      return [{ d, width: 4, opacity: 0.9, color: AMBER_CORE, dash: "9 7" }];
    case "FADING":
      return rampStrokes(points, 1.5, 5, 0.2, 1, AMBER_CORE);
    default:
      return [{ d, width: 4, opacity: 0.85, color: AMBER_CORE }];
  }
}

function laneGlow(
  points: Point[],
  oneWay: boolean,
  style: HyperlaneStyle,
): HyperlaneStroke[] {
  if (oneWay && style === "FADING") {
    return rampStrokes(points, 20, 20, 0.08, 0.5, AMBER_GLOW);
  }
  return [
    {
      d: pathFromPoints(points),
      width: 20,
      opacity: 0.4,
      color: oneWay ? AMBER_GLOW : BLUE_GLOW,
    },
  ];
}

const circlePath = (cx: number, cy: number, r: number) =>
  `M${round(cx - r)} ${round(cy)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

/* ---------- two-way lanes (HyperlaneTileGenerator) ---------- */

function twoWayDrawing(grid: number[][] | null): HyperlaneDrawing {
  const shapes: string[] = [];
  const roundabout = !grid || isRoundabout(grid);
  if (roundabout) shapes.push(circlePath(CENTER_X, CENTER_Y, ROUNDABOUT_RADIUS));

  const top = EDGE_MIDPOINTS[0];
  for (let i = 0; i < 6 && grid; i++) {
    for (let j = i; j < 6; j++) {
      if (!grid[i][j] && !grid[j][i]) continue;
      if (roundabout !== (i === j)) continue;
      shapes.push(twoWayShape(i, j, top));
    }
  }

  return {
    glows: shapes.map((d) => ({ d, width: 20, opacity: 0.4, color: BLUE_GLOW })),
    gaps: shapes,
    cores: shapes.map((d) => ({ d, width: 4, opacity: 0.8, color: BLUE_CORE })),
    nodes: [],
    arrows: [],
    clipToHex: false,
  };
}

function twoWayShape(from: number, to: number, top: Point): string {
  if (from === to) {
    const start = rotateAroundCenter(top, from * 60);
    const end = rotateAroundCenter({ x: CENTER_X, y: CENTER_Y - ROUNDABOUT_RADIUS }, from * 60);
    return `M${round(start.x)} ${round(start.y)}L${round(end.x)} ${round(end.y)}`;
  }
  const start = EDGE_MIDPOINTS[from];
  const end = EDGE_MIDPOINTS[to];
  const control = curveControlPoint(from, to);
  if (!control) {
    return `M${round(start.x)} ${round(start.y)}L${round(end.x)} ${round(end.y)}`;
  }
  return `M${round(start.x)} ${round(start.y)}Q${round(control.x)} ${round(control.y)} ${round(end.x)} ${round(end.y)}`;
}

/* ---------- one-way lanes (OneWayHyperlaneOverlay) ---------- */

function lanePoints(from: number, to: number, lanesPerSide: number[]): Point[] {
  const start = EDGE_MIDPOINTS[from];
  const end = EDGE_MIDPOINTS[to];
  const control = curveControlPoint(from, to);
  const handleStart = handle(start, control, from, to, lanesPerSide[from] >= 2);
  const handleEnd = handle(end, control, to, from, lanesPerSide[to] >= 2);
  return cubicPoints(start, handleStart, handleEnd, end);
}

function handle(
  end: Point,
  control: Point | null,
  side: number,
  other: number,
  fan: boolean,
): Point {
  let hx: number;
  let hy: number;
  if (!control) {
    const direction = inward(side);
    hx = direction.x * STRAIGHT_HANDLE;
    hy = direction.y * STRAIGHT_HANDLE;
  } else {
    hx = ((control.x - end.x) * 2) / 3;
    hy = ((control.y - end.y) * 2) / 3;
  }
  if (fan) {
    const angle = -toRadians((3 - floorMod(other - side, 6)) * FAN_DEGREES);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rotatedX = hx * cos - hy * sin;
    hy = hx * sin + hy * cos;
    hx = rotatedX;
  }
  return { x: end.x + hx, y: end.y + hy };
}

function oneWayLanesDrawing(grid: number[][], style: HyperlaneStyle): HyperlaneDrawing {
  const pairs: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    for (let j = i + 1; j < 6; j++) {
      if (grid[i][j] || grid[j][i]) pairs.push([i, j]);
    }
  }
  const lanesPerSide = [0, 0, 0, 0, 0, 0];
  for (const [a, b] of pairs) {
    lanesPerSide[a]++;
    lanesPerSide[b]++;
  }

  const lanes = pairs.map(([a, b]) => {
    const oneWay = grid[a][b] !== grid[b][a];
    const [from, to] = grid[a][b] === 0 ? [b, a] : [a, b];
    return { from, to, oneWay, points: lanePoints(from, to, lanesPerSide) };
  });

  const arrows: HyperlaneArrow[] = [];
  for (const lane of lanes) {
    if (!lane.oneWay) continue;
    if (style === "GATES") {
      arrows.push(arrow(atDepthFromStart(lane.points, lane.from), ENTRY_GATE));
      arrows.push(arrow(atDepthFromEnd(lane.points, lane.to), EXIT_GATE));
    } else {
      arrows.push(arrow(atDepthFromEnd(lane.points, lane.to), ARROW));
    }
  }

  return {
    glows: lanes.flatMap((lane) => laneGlow(lane.points, lane.oneWay, style)),
    gaps: lanes.map((lane) => pathFromPoints(lane.points)),
    cores: lanes.flatMap((lane) => oneWayCore(lane.points, lane.oneWay, style)),
    nodes: EDGE_MIDPOINTS.filter((_, side) => lanesPerSide[side] >= 2),
    arrows,
    clipToHex: true,
  };
}

function oneWayRoundaboutDrawing(
  grid: number[][],
  style: HyperlaneStyle,
): HyperlaneDrawing {
  const entry = [false, false, false, false, false, false];
  const exit = [false, false, false, false, false, false];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (i === j || !grid[i][j]) continue;
      entry[i] = true;
      exit[j] = true;
    }
  }

  const circle = circlePath(CENTER_X, CENTER_Y, ROUNDABOUT_RADIUS);
  const connectors: { side: number; oneWay: boolean; points: Point[] }[] = [];
  for (let side = 0; side < 6; side++) {
    if (!grid[side][side]) continue;
    const points = resample([
      EDGE_MIDPOINTS[side],
      towardCenter(side, EDGE_DISTANCE - ROUNDABOUT_RADIUS),
    ]);
    if (exit[side] && !entry[side]) points.reverse();
    connectors.push({ side, oneWay: entry[side] !== exit[side], points });
  }

  const arrows: HyperlaneArrow[] = [];
  for (const { side, oneWay, points } of connectors) {
    if (!oneWay) continue;
    if (style === "GATES") {
      const fromEdge = entry[side] ? points : [...points].reverse();
      const [x, y, heading] = pointAt(fromEdge, 14);
      const angle = entry[side] ? heading : heading + Math.PI;
      arrows.push(arrow([x, y, angle], entry[side] ? ENTRY_GATE : EXIT_GATE));
    } else {
      arrows.push(arrow(pointAt(points, polylineLength(points) - 13), ARROW));
    }
  }

  return {
    glows: [
      { d: circle, width: 20, opacity: 0.4, color: BLUE_GLOW },
      ...connectors.flatMap((c) => laneGlow(c.points, c.oneWay, style)),
    ],
    gaps: [circle, ...connectors.map((c) => pathFromPoints(c.points))],
    cores: [
      { d: circle, width: 4, opacity: 0.8, color: BLUE_CORE },
      ...connectors.flatMap((c) => oneWayCore(c.points, c.oneWay, style)),
    ],
    nodes: [],
    arrows,
    clipToHex: true,
  };
}

/**
 * Everything needed to draw a custom hyperlane tile's lanes, in a
 * 345x300 tile-local coordinate space. A tile without a matrix shows the
 * bare roundabout, as the bot does.
 */
export function buildHyperlaneDrawing(
  matrix: string | undefined,
  style: HyperlaneStyle = "DASHED",
): HyperlaneDrawing {
  const grid = matrix ? parseHyperlaneMatrix(matrix) : null;
  if (!grid || !hasOneWayLanes(grid)) return twoWayDrawing(grid);
  return isRoundabout(grid)
    ? oneWayRoundaboutDrawing(grid, style)
    : oneWayLanesDrawing(grid, style);
}

export function toHyperlaneStyle(value: string | undefined): HyperlaneStyle {
  switch (value?.toUpperCase()) {
    case "ARROWS":
      return "ARROWS";
    case "FADING":
      return "FADING";
    case "GATES":
      return "GATES";
    default:
      return "DASHED";
  }
}
