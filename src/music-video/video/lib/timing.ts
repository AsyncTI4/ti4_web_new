import timing from "../data/timing.json";

/** All timing in this project is in absolute song seconds; beat 0 is the first downbeat. */
export const FPS = timing.fps;
export const AUDIO_SECONDS = timing.duration;
export const TAIL_SECONDS = 3.8;
export const TOTAL_SECONDS = AUDIO_SECONDS + TAIL_SECONDS;
export const TOTAL_FRAMES = Math.ceil(TOTAL_SECONDS * FPS);

const BEATS: number[] = timing.beats;
const D = timing.downbeatIndex;

/** Index of the last element <= t (or -1). */
function floorIndex(arr: number[], t: number): number {
  let lo = 0;
  let hi = arr.length - 1;
  if (hi < 0 || t < arr[0]) return -1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (arr[mid] <= t) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/** Seconds of beat k (fractional k interpolates within the beat). */
export function bt(k: number): number {
  const i = k + D;
  const n = BEATS.length;
  if (i <= 0) return BEATS[0] + i * (BEATS[1] - BEATS[0]);
  if (i >= n - 1) return BEATS[n - 1] + (i - (n - 1)) * (BEATS[n - 1] - BEATS[n - 2]);
  const f = Math.floor(i);
  return BEATS[f] + (i - f) * (BEATS[f + 1] - BEATS[f]);
}

/** Continuous beat position at time t. */
export function beatPos(t: number): number {
  const n = BEATS.length;
  if (t <= BEATS[0]) return (t - BEATS[0]) / (BEATS[1] - BEATS[0]) - D;
  if (t >= BEATS[n - 1]) return n - 1 - D + (t - BEATS[n - 1]) / (BEATS[n - 1] - BEATS[n - 2]);
  const i = floorIndex(BEATS, t);
  return i + (t - BEATS[i]) / (BEATS[i + 1] - BEATS[i]) - D;
}

export const barPos = (t: number) => beatPos(t) / 4;
/** Seconds per beat around t. */
export function beatLen(t: number): number {
  const k = Math.floor(beatPos(t));
  return bt(k + 1) - bt(k);
}

type Hit = [number, number];
const KICKS = timing.kicks as Hit[];
const SNARES = timing.snares as Hit[];
const HATS = timing.hats as Hit[];
const KICK_T = KICKS.map((h) => h[0]);
const SNARE_T = SNARES.map((h) => h[0]);
const HAT_T = HATS.map((h) => h[0]);

function hitEnvelope(times: number[], hits: Hit[], t: number, tau: number, lookahead = 0): number {
  const i = floorIndex(times, t + lookahead);
  if (i < 0) return 0;
  let v = 0;
  for (let j = i; j >= 0 && j > i - 3; j--) {
    const dt = t - times[j];
    if (dt < -lookahead) continue;
    const attack = dt < 0 ? 1 + dt / Math.max(lookahead, 1e-3) : 1;
    v = Math.max(v, hits[j][1] * attack * Math.exp(-Math.max(dt, 0) / tau));
  }
  return v;
}
export const kick = (t: number, tau = 0.11) => hitEnvelope(KICK_T, KICKS, t, tau, 0.012);
export const snare = (t: number, tau = 0.13) => hitEnvelope(SNARE_T, SNARES, t, tau, 0.012);
export const hat = (t: number, tau = 0.05) => hitEnvelope(HAT_T, HATS, t, tau);
export const lastKickTime = (t: number) => {
  const i = floorIndex(KICK_T, t);
  return i < 0 ? -Infinity : KICK_T[i];
};
export const kickCount = (t: number) => floorIndex(KICK_T, t) + 1;
export const snareCount = (t: number) => floorIndex(SNARE_T, t) + 1;

/** Regular-grid pulse: 1 on each beat decaying with tau seconds. */
export function beatPulse(t: number, tau = 0.14, every = 1): number {
  const p = beatPos(t) / every;
  const k = Math.floor(p);
  const dt = t - bt(k * every);
  return Math.exp(-dt / tau);
}

type Stem = "drums" | "bass" | "other" | "vocals" | "mix";
const ENERGY = timing.energy as Record<Stem, number[]>;
export function energy(stem: Stem, t: number): number {
  const arr = ENERGY[stem];
  const f = t * FPS;
  const i = Math.floor(f);
  if (i < 0) return 0;
  if (i >= arr.length - 1) return arr[arr.length - 1] ?? 0;
  return arr[i] + (arr[i + 1] - arr[i]) * (f - i);
}
/** Smoothed energy (box average over +-w seconds). */
export function energySmooth(stem: Stem, t: number, w = 0.12): number {
  let s = 0;
  const n = 7;
  for (let k = 0; k < n; k++) s += energy(stem, t - w + (2 * w * k) / (n - 1));
  return s / n;
}

export type Word = { w: string; s: number; e: number };
export type Line = { section: string; start: number; end: number; words: Word[] };
export const LINES = timing.lines as Line[];
export const PINGS = timing.pings;
export const SECTIONS = timing.sections as { id: string; start: number; end: number }[];
export const section = (id: string) => SECTIONS.find((s) => s.id === id)!;
