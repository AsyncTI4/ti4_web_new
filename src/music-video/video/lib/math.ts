export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const invLerp = (a: number, b: number, v: number) => clamp((v - a) / (b - a));
export const remap = (v: number, a: number, b: number, c: number, d: number) => lerp(c, d, invLerp(a, b, v));
export const fract = (v: number) => v - Math.floor(v);
export const smoothstep = (p: number) => {
  const x = clamp(p);
  return x * x * (3 - 2 * x);
};

export const ease = {
  linear: (p: number) => clamp(p),
  inQuad: (p: number) => clamp(p) ** 2,
  outQuad: (p: number) => 1 - (1 - clamp(p)) ** 2,
  inCubic: (p: number) => clamp(p) ** 3,
  outCubic: (p: number) => 1 - (1 - clamp(p)) ** 3,
  inOutCubic: (p: number) => {
    const x = clamp(p);
    return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
  },
  outQuart: (p: number) => 1 - (1 - clamp(p)) ** 4,
  inOutQuart: (p: number) => {
    const x = clamp(p);
    return x < 0.5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2;
  },
  outExpo: (p: number) => {
    const x = clamp(p);
    return x === 1 ? 1 : 1 - 2 ** (-10 * x);
  },
  inExpo: (p: number) => {
    const x = clamp(p);
    return x === 0 ? 0 : 2 ** (10 * x - 10);
  },
  inOutExpo: (p: number) => {
    const x = clamp(p);
    if (x === 0 || x === 1) return x;
    return x < 0.5 ? 2 ** (20 * x - 10) / 2 : (2 - 2 ** (-20 * x + 10)) / 2;
  },
  outBack: (p: number, s = 1.70158) => {
    const x = clamp(p) - 1;
    return 1 + (s + 1) * x ** 3 + s * x ** 2;
  },
  inBack: (p: number, s = 1.70158) => {
    const x = clamp(p);
    return (s + 1) * x ** 3 - s * x ** 2;
  },
  outElastic: (p: number) => {
    const x = clamp(p);
    if (x === 0 || x === 1) return x;
    return 2 ** (-10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
  /** cubic-bezier(0.42, 0.05, 0.2, 1) — the web app's map flight easing (useMapFlightAnimation.ts). */
  flight: (p: number) => cubicBezier(0.42, 0.05, 0.2, 1)(p),
};

/** CSS cubic-bezier timing function. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const bx = (u: number) => 3 * x1 * u * (1 - u) ** 2 + 3 * x2 * u * u * (1 - u) + u ** 3;
  const by = (u: number) => 3 * y1 * u * (1 - u) ** 2 + 3 * y2 * u * u * (1 - u) + u ** 3;
  return (p: number) => {
    const x = clamp(p);
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (bx(mid) < x) lo = mid;
      else hi = mid;
    }
    return by((lo + hi) / 2);
  };
}

/** Deterministic PRNG. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const hash = (n: number) => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453);

/** Window helper: 0 before a, ramps to 1 over [a, a+fadeIn], holds, ramps to 0 over [b-fadeOut, b]. */
export function windowed(t: number, a: number, b: number, fadeIn = 0.15, fadeOut = 0.15) {
  if (t < a || t > b) return 0;
  return Math.min(fadeIn > 0 ? clamp((t - a) / fadeIn) : 1, fadeOut > 0 ? clamp((b - t) / fadeOut) : 1);
}

/** Cubic Bézier point & tangent. */
export function bezier(p0: number[], p1: number[], p2: number[], p3: number[], t: number) {
  const u = 1 - t;
  const pt = [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
  const tan = [0, 1].map((k) => 3 * u * u * (p1[k] - p0[k]) + 6 * u * t * (p2[k] - p1[k]) + 3 * t * t * (p3[k] - p2[k]));
  return { x: pt[0], y: pt[1], angle: (Math.atan2(tan[1], tan[0]) * 180) / Math.PI };
}
