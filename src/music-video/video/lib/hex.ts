/** Flat-top hex geometry matching the web app (tilePositioning.ts / tileCoordinates.ts). */
export const TILE_W = 345;
export const TILE_H = 299;
const STEPS: [number, number][] = [
  [260, 150], [0, 300], [-260, 150], [-260, -150], [0, -300], [260, -150],
];

/** Centre of a ring position (e.g. "000", "101", "318", "409") relative to Mecatol. */
export function hexCenter(pos: string): { x: number; y: number } {
  if (pos === "000") return { x: 0, y: 0 };
  if (pos === "tl") return { x: -780, y: -1200 };
  const ring = Number(pos.length === 4 ? pos.slice(0, 2) : pos[0]);
  const idx = Number(pos.length === 4 ? pos.slice(2) : pos.slice(1)) - 1;
  let x = 0;
  let y = -300 * ring;
  for (let i = 0; i < idx; i++) {
    const [dx, dy] = STEPS[Math.floor(i / ring)];
    x += dx;
    y += dy;
  }
  return { x, y };
}

export const ringOf = (pos: string) => (pos === "000" ? 0 : pos === "tl" ? 4 : Number(pos[0]));

/** SVG polygon points for a flat-top hex of the tile's footprint, centred at 0,0. */
export function hexPoints(scale = 1, w = TILE_W, h = TILE_H): string {
  const hw = (w / 2) * scale;
  const hh = (h / 2) * scale;
  const q = hw / 2;
  return [[-q, -hh], [q, -hh], [hw, 0], [q, hh], [-q, hh], [-hw, 0]].map((p) => p.join(",")).join(" ");
}
/** Same as hexPoints but as an SVG path string. */
export const hexPath = (scale = 1) => `M${hexPoints(scale).split(" ").join("L")}Z`;

/** Point on a hex-shaped ring at parameter u in [0,1), centred at 0,0 with circumradius r. */
export function hexRingPoint(u: number, r: number): { x: number; y: number } {
  const side = Math.floor(((u % 1) + 1) % 1 * 6);
  const f = (((u % 1) + 1) % 1) * 6 - side;
  const a0 = (side * Math.PI) / 3;
  const a1 = ((side + 1) * Math.PI) / 3;
  return {
    x: r * (Math.cos(a0) + (Math.cos(a1) - Math.cos(a0)) * f),
    y: r * (Math.sin(a0) + (Math.sin(a1) - Math.sin(a0)) * f),
  };
}
