import { beatPos, bt } from "./timing";
import { clamp, ease, fract } from "./math";

/** Bounce that lands on every beat (or every `every` beats). Returns px (negative = up). */
export const bob = (t: number, amp = 12, every = 1, offset = 0) => {
  const p = fract(beatPos(t) / every + offset);
  return -amp * Math.sin(Math.PI * p) ** 0.8;
};
/** Squash on landing: [scaleX, scaleY]. */
export const squash = (t: number, amt = 0.14, every = 1, offset = 0): [number, number] => {
  const p = fract(beatPos(t) / every + offset);
  const s = Math.exp(-p * 9) * amt;
  return [1 + s * 0.8, 1 - s];
};
/** Sway that snaps to alternating sides on each beat with overshoot. */
export const snapSway = (t: number, deg = 10, every = 1, offset = 0) => {
  const b = beatPos(t) / every + offset;
  const k = Math.floor(b);
  const p = b - k;
  const target = k % 2 === 0 ? deg : -deg;
  return -target + 2 * target * ease.outBack(clamp(p * 2.4), 2.2);
};
/** Smooth sinusoidal sway, period = 2*every beats. */
export const sway = (t: number, deg = 8, every = 1, offset = 0) => deg * Math.sin(Math.PI * (beatPos(t) / every + offset));
/** Full spin over [fromBeat, fromBeat+beats]. */
export const spin = (t: number, fromBeat: number, beats = 1, turns = 1) =>
  360 * turns * ease.inOutCubic((t - bt(fromBeat)) / (bt(fromBeat + beats) - bt(fromBeat)));
/** Progress 0..1 between two beats. */
export const beatProgress = (t: number, a: number, b: number) => clamp((t - bt(a)) / (bt(b) - bt(a)));

export const danceTransform = (t: number, opts: { amp?: number; deg?: number; squashAmt?: number; offset?: number; every?: number } = {}) => {
  const { amp = 10, deg = 6, squashAmt = 0.1, offset = 0, every = 1 } = opts;
  const [sx, sy] = squash(t, squashAmt, every, offset);
  return `translateY(${bob(t, amp, every, offset)}px) rotate(${snapSway(t, deg, every, offset)}deg) scale(${sx}, ${sy})`;
};
