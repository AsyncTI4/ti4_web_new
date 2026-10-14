import type { CastPlayer, CastTile, MusicVideoCast } from "../../cast";

export type Pt = { x: number; y: number };

export type Game = {
  cast: MusicVideoCast;
  players: CastPlayer[];
  /** The six cast players, in seat order. */
  six: CastPlayer[];
  hero: CastPlayer;
  afk: CastPlayer;
  heroIndex: number;
  afkIndex: number;
  heroPos: string;
  crushPos: string;
  /** World positions of the destroyer and cruiser. */
  dd: Pt;
  cruiser: Pt;
  /** The AFK player's home system (ring position + world centre). */
  afkHomePos: string | null;
  afkHome: Pt;
  /** Where the chorus camera goes looking for the AFK player: their player area, else home. */
  afkSeat: Pt;
  tiles: CastTile[];
  center: (pos: string) => Pt;
  /** "PBD29698" */
  tag: string;
  /** "pbd29698-actions" */
  channel: string;
  round: number;
  mention: string;
};

/** The live game. Set once, before the player mounts; scenes read it while rendering. */
export let G: Game = undefined as unknown as Game;

export function setCast(cast: MusicVideoCast) {
  const byPos = new Map(cast.tiles.map((t) => [t.pos, t]));
  const center = (pos: string): Pt => {
    const t = byPos.get(pos);
    return t ? { x: t.x, y: t.y } : { x: 0, y: 0 };
  };
  const afk = cast.players[cast.afk];
  const hero = cast.players[cast.hero];
  const afkHome = afk.home ? center(afk.home) : cast.crushAt;
  const game = cast.game.toLowerCase();
  G = {
    cast,
    players: cast.players,
    six: cast.six.map((i) => cast.players[i]),
    hero,
    afk,
    heroIndex: cast.hero,
    afkIndex: cast.afk,
    heroPos: cast.heroPos,
    crushPos: cast.crushPos,
    dd: cast.heroAt,
    cruiser: cast.crushAt,
    afkHomePos: afk.home,
    afkHome,
    afkSeat: afk.stats?.[0] ?? afkHome,
    tiles: cast.tiles,
    center,
    tag: cast.game.toUpperCase(),
    channel: `${game}-actions`,
    round: cast.round,
    mention: `@${afk.name}`,
  };
}

/* ── colour helpers for player-tinted glows and text ── */

function hsl(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

/** Hue in degrees (0 for greys). */
export const hueOf = (hex: string) => hsl(hex)[0];

/** A bright, saturated version of a player colour for glows and rims. Greys go near-white. */
export function neonOf(hex: string): string {
  const [h, s, l] = hsl(hex);
  if (s < 0.12) return `hsl(225, 40%, ${Math.round(Math.max(l, 0.82) * 100)}%)`;
  return `hsl(${Math.round(h)}, ${Math.round(Math.max(s, 0.85) * 100)}%, ${Math.round(Math.min(0.7, Math.max(l, 0.6)) * 100)}%)`;
}

/** The colour as an `hsla()` glow at alpha a. */
export function glowOf(hex: string, a: number): string {
  const [h, s, l] = hsl(hex);
  if (s < 0.12) return `hsla(225, 40%, 85%, ${a})`;
  return `hsla(${Math.round(h)}, ${Math.round(Math.max(s, 0.85) * 100)}%, ${Math.round(Math.min(0.68, Math.max(l, 0.58)) * 100)}%, ${a})`;
}

/** A name colour that stays legible on Discord's dark grey. */
export function nameColorOf(hex: string): string {
  const [h, s, l] = hsl(hex);
  if (s < 0.12) return `hsl(0, 0%, ${Math.round(Math.max(l, 0.75) * 100)}%)`;
  return `hsl(${Math.round(h)}, ${Math.round(Math.min(1, s) * 100)}%, ${Math.round(Math.min(0.78, Math.max(l, 0.66)) * 100)}%)`;
}

/** Deep background tint in the player's hue: [inner, outer]. */
export function duskOf(hex: string): [string, string] {
  const [h, s] = hsl(hex);
  const sat = s < 0.12 ? 10 : 70;
  return [`hsl(${Math.round(h)}, ${sat}%, 13%)`, `hsl(${Math.round(h)}, ${sat}%, 4%)`];
}

const WORDS = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE"];
export const roundWord = (n: number) => WORDS[n] ?? String(n);
