import React, { useLayoutEffect, useMemo, useRef } from "react";
import { Fill } from "../lib/stage";
import { Img } from "../lib/Img";
import { SceneProps } from "./types";
import { Starfield, Stars } from "../components/Backdrop";
import { Shockwave } from "../fx/Effects";
import textPoints from "../data/textPoints.json";
import { beatPos, bt, kick, snare } from "../lib/timing";
import { clamp, ease, fract, hash, lerp, rng } from "../lib/math";
import { NATIVE_ANGLE, UNIT_SIZE, UnitType, hexOf, miscSrc, tileSrc, unitSrc } from "../lib/assets";
import { G } from "../lib/game";
import { FINALE_PALETTE, WORD_COLORS } from "../../palette";
import { castHeroes } from "./Drop";
import { useImages } from "../lib/useImages";


/* Choreography beats (beat 0 = first downbeat). */
const B_IN = 152;
const B_RINGS = 156;
const B_HONEY = 160;
const B_TEXT = 164;
const B_SPIRAL = 168;
const B_VORTEX = 172;
const B_END = 175.6;

const RING_UNITS: UnitType[] = ["ws", "fs", "dn", "cv", "ca", "dd", "dd"];
const RING_R = [150, 225, 300, 375, 450, 525, 600];
const RX = 1.32;
const RY = 0.8;
const SPACING = 58;
/* A 19-system TI4 map outlined in ships: points along every unique hex edge. */
const HEX_R = 116;
const HEX_SY = 0.86;

type ShipDef = { ring: number; slot: number; count: number; unit: UnitType; color: string; seed: number; order: number };
type Pose = { x: number; y: number; h: number; s: number; a: number };
type HoneyCell = { x: number; y: number; d: number; a: number; h: number; ring: number };

/** The fleet and its formations, built once per cast (the six players' colours lead the palette). */
function buildFleet(palette: string[]) {
  const SHIPS: ShipDef[] = [];
  RING_R.forEach((r, ring) => {
    const per = Math.PI * Math.sqrt(((r * RX) ** 2 + (r * RY) ** 2) * 2);
    const count = Math.floor(per / SPACING);
    for (let slot = 0; slot < count; slot++) {
      SHIPS.push({ ring, slot, count, unit: RING_UNITS[ring], color: palette[(slot + ring * 3) % palette.length], seed: hash(SHIPS.length * 13.7), order: SHIPS.length });
    }
  });
  const N = SHIPS.length;

  const HONEY = (() => {
    const seen = new Map<string, HoneyCell>();
    for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) {
      if (Math.abs(q + r) > 2) continue;
      const cx = HEX_R * 1.5 * q;
      const cy = HEX_R * Math.sqrt(3) * (r + q / 2);
      const ring = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
      for (let e = 0; e < 6; e++) {
        const a0 = (e * Math.PI) / 3;
        const a1 = ((e + 1) * Math.PI) / 3;
        const v0 = [cx + HEX_R * Math.cos(a0), cy + HEX_R * Math.sin(a0)];
        const v1 = [cx + HEX_R * Math.cos(a1), cy + HEX_R * Math.sin(a1)];
        for (const f of [0.2, 0.5, 0.8]) {
          const x = v0[0] + (v1[0] - v0[0]) * f;
          const y = (v0[1] + (v1[1] - v0[1]) * f) * HEX_SY;
          const key = `${Math.round(x)},${Math.round(y)}`;
          const prev = seen.get(key);
          const h = (Math.atan2((v1[1] - v0[1]) * HEX_SY, v1[0] - v0[0]) * 180) / Math.PI;
          if (!prev || prev.ring > ring) seen.set(key, { x, y, d: Math.hypot(x, y), a: Math.atan2(y, x), h, ring });
        }
      }
    }
    const pts = [...seen.values()].sort((p1, p2) => p1.d - p2.d || p1.a - p2.a);
    // any spare ships hold Mecatol Rex at the centre
    const spare = N - pts.length;
    for (let k = 0; k < spare; k++) {
      const a = (k / Math.max(1, spare)) * Math.PI * 2;
      pts.push({ x: Math.cos(a) * 34, y: Math.sin(a) * 26, d: 0, a, h: (a * 180) / Math.PI + 90, ring: 0 });
    }
    return pts.slice(0, N);
  })();
  /* ships sorted by ring then angle so inner ships take inner honeycomb cells */
  const BY_RADIAL = [...SHIPS].sort((a, b) => a.ring - b.ring || a.slot / a.count - b.slot / b.count).map((sd) => sd.order);
  const HONEY_OF: HoneyCell[] = new Array<HoneyCell>(N);
  BY_RADIAL.forEach((shipIdx, k) => (HONEY_OF[shipIdx] = HONEY[k]));
  /* text formation: ships sorted by honeycomb x take text points sorted by x */
  const TEXT = textPoints.yourTurn.map(([x, y]) => ({ x, y })).sort((a, b) => a.x - b.x);
  const TEXT_OF: ({ x: number; y: number } | null)[] = new Array<{ x: number; y: number } | null>(N).fill(null);
  const byX = [...SHIPS.keys()].sort((a, b) => HONEY_OF[a].x - HONEY_OF[b].x);
  const step = N / TEXT.length;
  TEXT.forEach((pt, k) => {
    TEXT_OF[byX[Math.min(N - 1, Math.floor(k * step + step / 2))]] = pt;
  });
  const EXTRA = [...SHIPS.keys()].filter((i) => !TEXT_OF[i]);
  const EXTRA_RANK = new Map(EXTRA.map((i, k) => [i, k]));
  const ORDER = [...SHIPS.keys()].sort((a, b) => SHIPS[b].ring - SHIPS[a].ring);
  const SPRITE_KEYS = [...new Set([
    ...SHIPS.map((sd) => `${sd.color}/${sd.unit}`),
    ...SHIPS.flatMap((sd, i) => (TEXT_OF[i] ? [`${wordColor(TEXT_OF[i].x)}/${sd.unit}`] : [])),
  ])];
  return { SHIPS, N, HONEY_OF, TEXT_OF, EXTRA, EXTRA_RANK, ORDER, SPRITE_KEYS };
}

const wordColor = (x: number) => WORD_COLORS[Math.min(WORD_COLORS.length - 1, Math.floor(((x + 820) / 1640) * WORD_COLORS.length))];

let fleetFor: { cast: unknown; fleet: ReturnType<typeof buildFleet> } | null = null;
function fleet() {
  if (fleetFor?.cast !== G.cast) {
    const palette = [...new Set([...G.six.map((p) => p.color), ...FINALE_PALETTE])].slice(0, FINALE_PALETTE.length);
    fleetFor = { cast: G.cast, fleet: buildFleet(palette) };
  }
  return fleetFor.fleet;
}
/** "color/unit" for every sprite the finale draws, for the preloader. */
export const finaleSpriteKeys = () => fleet().SPRITE_KEYS;

function ringPose(i: number, t: number, k: number): Pose {
  const sd = fleet().SHIPS[i];
  const dir = sd.ring % 2 ? 1 : -1;
  const b = beatPos(t);
  const speed = 0.16 * (1 + (6 - sd.ring) * 0.08);
  const ang = (sd.slot / sd.count) * Math.PI * 2 + dir * b * speed;
  const pulse = 1 + 0.06 * k * (sd.ring % 2 ? 1 : -0.6);
  const r = RING_R[sd.ring] * pulse;
  const x = Math.cos(ang) * r * RX;
  const y = Math.sin(ang) * r * RY;
  const h = (ang * 180) / Math.PI + 90 * dir;
  const hopPh = fract(b + sd.slot * 0.5);
  return { x, y: y - Math.sin(Math.PI * hopPh) * 6, h, s: 1, a: 1 };
}
function honeyPose(i: number, t: number): Pose {
  const p = fleet().HONEY_OF[i];
  const b = beatPos(t);
  // pulse travels outward one system-ring per half beat
  const wave = fract(b - p.ring * 0.25);
  const amp = Math.exp(-wave * 5);
  const breathe = 1 + 0.05 * Math.sin(b * Math.PI * 0.5);
  if (p.ring === 3) return { x: p.x * (1 + amp * 0.04), y: p.y * (1 + amp * 0.04), h: p.h + b * 20, s: 0.9, a: 1 };
  return { x: p.x * breathe, y: p.y * breathe - amp * 14, h: p.h + Math.sin(b * Math.PI) * 6, s: 0.8 + amp * 0.35, a: 1 };
}
function textPose(i: number, t: number): Pose {
  const { TEXT_OF, EXTRA, EXTRA_RANK } = fleet();
  const b = beatPos(t);
  const tp = TEXT_OF[i];
  if (tp) {
    const letterPh = fract(b - (tp.x + 820) / 1640 * 0.5);
    const hop = Math.sin(Math.PI * clamp(letterPh * 2)) * 16;
    return { x: tp.x, y: tp.y - 30 - hop, h: -90 + Math.sin(b * Math.PI * 2 + tp.x * 0.01) * 4, s: 0.7, a: 1 };
  }
  const k = EXTRA_RANK.get(i)!;
  const ang = (k / EXTRA.length) * Math.PI * 2 + b * 0.25;
  return { x: Math.cos(ang) * 900, y: Math.sin(ang) * 430, h: (ang * 180) / Math.PI + 90, s: 0.85, a: 1 };
}
function spiralPose(i: number, t: number): Pose {
  const { SHIPS, N } = fleet();
  const sd = SHIPS[i];
  const arm = sd.order % 4;
  const s = Math.floor(sd.order / 4) / (N / 4);
  const b = beatPos(t);
  const rot = (b - B_SPIRAL) * 0.42;
  const r = 40 + s * 760;
  const th = arm * (Math.PI / 2) + s * 6.2 + rot;
  return { x: Math.cos(th) * r * 1.15, y: Math.sin(th) * r * 0.78, h: (th * 180) / Math.PI + 100, s: 0.7 + s * 0.6, a: 1 };
}
function vortexPose(i: number, t: number): Pose {
  const base = spiralPose(i, t);
  const p = clamp((beatPos(t) - B_VORTEX) / (B_END - B_VORTEX));
  const e = ease.inCubic(p);
  const { SHIPS, N } = fleet();
  const sd = SHIPS[i];
  const s = Math.floor(sd.order / 4) / (N / 4);
  const r = (40 + s * 760) * (1 - e);
  const arm = sd.order % 4;
  const b = beatPos(t);
  const th = arm * (Math.PI / 2) + s * 6.2 + (b - B_SPIRAL) * 0.42 + e * 9;
  return { x: Math.cos(th) * r * 1.15, y: Math.sin(th) * r * 0.78, h: (th * 180) / Math.PI + 100 + e * 200, s: base.s * (1 - e * 0.55), a: 1 - clamp((p - 0.9) / 0.1) };
}
function entryPose(i: number, t: number, k: number): Pose {
  const { SHIPS, N } = fleet();
  const sd = SHIPS[i];
  const stream = sd.order % 8;
  const rank = Math.floor(sd.order / 8);
  const delay = (rank / (N / 8)) * 2.6;
  const p = clamp((beatPos(t) - B_IN - delay) / 1.1);
  const target = ringPose(i, t, k);
  if (p <= 0) return { ...target, a: 0 };
  const sa = (stream / 8) * Math.PI * 2 + 0.3;
  const sx = Math.cos(sa) * 1500;
  const sy = Math.sin(sa) * 900;
  const e = ease.outCubic(p);
  const swirl = Math.sin(e * Math.PI) * 260;
  const nx = -Math.sin(sa);
  const ny = Math.cos(sa);
  const x = lerp(sx, target.x, e) + nx * swirl;
  const y = lerp(sy, target.y, e) + ny * swirl;
  const heading = p < 0.95 ? (Math.atan2(target.y - sy, target.x - sx) * 180) / Math.PI + (1 - e) * 40 : target.h;
  return { x, y, h: lerp(heading, target.h, ease.inCubic(clamp((p - 0.7) / 0.3))), s: 1, a: clamp(p * 4) };
}

function blend(a: Pose, b: Pose, p: number, i: number): Pose {
  const e = ease.inOutCubic(p);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy) || 1;
  const arc = Math.sin(e * Math.PI) * Math.min(160, d * 0.35) * (hash(i) > 0.5 ? 1 : -1);
  const dh = ((b.h - a.h + 540) % 360) - 180;
  const travel = (Math.atan2(dy, dx) * 180) / Math.PI;
  const mid = Math.sin(e * Math.PI);
  let h = a.h + dh * e;
  const dt = ((travel - h + 540) % 360) - 180;
  h += dt * mid * 0.85;
  return { x: a.x + dx * e + (-dy / d) * arc, y: a.y + dy * e + (dx / d) * arc, h, s: lerp(a.s, b.s, e) * (1 + mid * 0.25), a: lerp(a.a, b.a, e) };
}

function transitionP(i: number, t: number, at: number, key: "radial" | "x" | "order") {
  const { SHIPS, HONEY_OF, N } = fleet();
  const sd = SHIPS[i];
  const stagger = key === "radial" ? Math.min(1, HONEY_OF[i].d / 700) : key === "x" ? clamp((HONEY_OF[i].x + 760) / 1520) : sd.order / N;
  return clamp((beatPos(t) - (at - 0.9) - stagger * 1.1) / 1.0);
}

export function poseAt(i: number, t: number): Pose {
  const b = beatPos(t);
  const k = kick(t);
  if (b < B_RINGS - 0.0) return entryPose(i, t, k);
  if (b < B_HONEY - 1.6) return ringPose(i, t, k);
  if (b < B_HONEY + 0.4) return blend(ringPose(i, t, k), honeyPose(i, t), transitionP(i, t, B_HONEY - 0.6, "radial"), i);
  if (b < B_TEXT - 1.6) return honeyPose(i, t);
  if (b < B_TEXT + 0.4) return blend(honeyPose(i, t), textPose(i, t), transitionP(i, t, B_TEXT - 0.6, "x"), i);
  if (b < B_SPIRAL - 1.6) return textPose(i, t);
  if (b < B_SPIRAL + 0.4) return blend(textPose(i, t), spiralPose(i, t), transitionP(i, t, B_SPIRAL - 0.6, "order"), i);
  if (b < B_VORTEX) return spiralPose(i, t);
  return vortexPose(i, t);
}

/** Colour used to draw a ship at time t (text ships take their letter's colour while spelling). */
function drawColor(i: number, t: number) {
  const { SHIPS, TEXT_OF } = fleet();
  const tp = TEXT_OF[i];
  if (!tp) return SHIPS[i].color;
  const b = beatPos(t);
  const inP = transitionP(i, t, B_TEXT - 0.6, "x");
  const outP = transitionP(i, t, B_SPIRAL - 0.6, "order");
  const inText = b >= B_TEXT - 1.6 && b < B_SPIRAL + 0.4 && inP > 0.5 && !(b >= B_SPIRAL - 1.6 && outP > 0.5);
  return inText ? wordColor(tp.x) : SHIPS[i].color;
}
const glowCache = new Map<string, HTMLCanvasElement>();
function glowSprite(color: string) {
  let c = glowCache.get(color);
  if (c) return c;
  c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  const hex = hexOf(color);
  grad.addColorStop(0, hex + "cc");
  grad.addColorStop(0.35, hex + "55");
  grad.addColorStop(1, hex + "00");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  glowCache.set(color, c);
  return c;
}

/** A 2x-native copy of a 4x sprite, downsampled once with high-quality smoothing. The finale draws
 * ships at 0.7-1.7x native, so per-frame draws from this small copy look the same at a fraction of the cost. */
const halfCache = new WeakMap<HTMLImageElement, HTMLCanvasElement>();
function shipBitmap(img: HTMLImageElement, w: number, h: number): CanvasImageSource {
  let c = halfCache.get(img);
  if (!c) {
    c = document.createElement("canvas");
    c.width = w * 2;
    c.height = h * 2;
    const g = c.getContext("2d")!;
    g.imageSmoothingEnabled = true;
    g.imageSmoothingQuality = "high";
    g.drawImage(img, 0, 0, w * 2, h * 2);
    halfCache.set(img, c);
  }
  return c;
}

const ShipCanvas: React.FC<{ t: number }> = ({ t }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { SHIPS, ORDER: order, SPRITE_KEYS } = fleet();
  const srcs = useMemo(() => SPRITE_KEYS.map((key) => { const [c, u] = key.split("/"); return unitSrc(c, u as UnitType); }), [SPRITE_KEYS]);
  const imgs = useImages(srcs);
  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv || !imgs) return;
    const ctx = cv.getContext("2d")!;
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const b = beatPos(t);
    const fast = (b > B_HONEY - 1.7 && b < B_HONEY + 0.5) || (b > B_TEXT - 1.7 && b < B_TEXT + 0.5) || (b > B_SPIRAL - 1.7 && b < B_SPIRAL + 0.5) || b > B_VORTEX || b < B_RINGS;
    const k = kick(t);
    // one pose and colour per ship per frame, shared by both passes
    const poses = order.map((i) => poseAt(i, t));
    const colors = order.map((i) => drawColor(i, t));
    // glow pass
    ctx.globalCompositeOperation = "lighter";
    order.forEach((i, n) => {
      const p = poses[n];
      if (p.a <= 0.01) return;
      const [w] = UNIT_SIZE[SHIPS[i].unit];
      const glow = glowSprite(colors[n]);
      const gs = w * p.s * (1.7 + k * 0.7);
      ctx.globalAlpha = p.a * (0.32 + k * 0.28);
      ctx.drawImage(glow, 960 + p.x - gs / 2, 540 + p.y - gs / 2, gs, gs);
      if (fast) {
        for (let j = 1; j <= 3; j++) {
          const q = poseAt(i, t - j * 0.022);
          ctx.globalAlpha = (p.a * 0.28) / j;
          const qs = w * q.s * 1.4;
          ctx.drawImage(glow, 960 + q.x - qs / 2, 540 + q.y - qs / 2, qs, qs);
        }
      }
    });
    // ships
    ctx.globalCompositeOperation = "source-over";
    order.forEach((i, n) => {
      const p = poses[n];
      if (p.a <= 0.01) return;
      const unit = SHIPS[i].unit;
      const img = imgs.get(unitSrc(colors[n], unit))!;
      const [w, h] = UNIT_SIZE[unit];
      const rad = ((p.h - NATIVE_ANGLE(unit)) * Math.PI) / 180;
      const cos = Math.cos(rad) * p.s;
      const sin = Math.sin(rad) * p.s;
      ctx.globalAlpha = p.a;
      ctx.setTransform(cos, sin, -sin, cos, 960 + p.x, 540 + p.y);
      ctx.drawImage(shipBitmap(img, w, h), -w / 2, -h / 2, w, h);
    });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
  }, [t, imgs, SHIPS, order]);
  return <canvas ref={ref} width={1920} height={1080} style={{ position: "absolute", inset: 0 }} />;
};


export const Finale: React.FC<SceneProps> = ({ t, from }) => {
  const b = beatPos(t);
  // the six players' faction icons, twice round the ring
  const ring = [...G.six, ...G.six].map((p) => p.icon);
  const k = kick(t);
  const sn = snare(t);
  const ringsA = clamp((b - B_IN) / 2) * (1 - clamp((b - (B_HONEY - 1)) / 1.5));
  const spiralA = clamp((b - (B_SPIRAL - 0.5)) / 1);
  const vortex = clamp((b - B_VORTEX) / (B_END - B_VORTEX));
  const hue = (b - B_IN) * 22;
  const r = rng(99);
  const confetti = Array.from({ length: 40 }, () => ({ x: r() * 1920, d: r(), s: 34 + r() * 30, sp: 0.6 + r() * 0.8, comm: r() > 0.6, rot: r() * 360 }));
  const confettiA = clamp((b - (B_SPIRAL - 0.5)) / 1) * (1 - vortex);
  return (
    <Fill style={{ background: "#030208", overflow: "hidden" }}>
      <Fill style={{ transform: `scale(${1 + k * 0.025}) rotate(${Math.sin(b * Math.PI / 4) * 1.2}deg)` }}>
        <Starfield t={t} brightness={0.55 + k * 0.25} hue={hue} />
        <Stars t={t} drift={20} warp={b < B_RINGS ? 0.8 * (1 - clamp((b - B_IN) / 4)) : vortex * 1.2} />
        <div style={{ position: "absolute", left: 960 - 1500, top: 540 - 1500, width: 3000, height: 3000, borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, hsla(0,100%,60%,.08) 0deg 5deg, transparent 5deg 15deg)", transform: `rotate(${t * 30}deg)`, filter: `hue-rotate(${hue % 360}deg)`, mixBlendMode: "screen", opacity: 0.6, willChange: "transform, filter" }} />
        <Img src={tileSrc("112_Mecatol.png")} style={{ position: "absolute", left: 960 - 172.5, top: 540 - 149.5, width: 345, height: 299, opacity: ringsA, transform: `scale(${0.68 + k * 0.08}) rotate(${t * 12}deg)`, filter: `drop-shadow(0 0 ${30 + k * 40}px hsla(${hue},100%,65%,.9))` }} />
        {ring.map((icon, i) => {
          const ang = (i / ring.length) * Math.PI * 2 - b * 0.12;
          return <Img key={i} src={icon} style={{ position: "absolute", left: 960 + Math.cos(ang) * 880 - 50, top: 540 + Math.sin(ang) * 470 - 50, width: 100, height: 100, opacity: spiralA * 0.7 * (1 - vortex), transform: `rotate(${-ang * 57}deg) scale(${1 + k * 0.2})`, filter: "drop-shadow(0 0 12px rgba(255,255,255,.6))" }} />;
        })}
        {confettiA > 0 && confetti.map((c, i) => {
          const y = ((c.d * 1300 + (t - from) * 380 * c.sp) % 1300) - 120;
          return <Img key={i} src={miscSrc(c.comm ? "comms.png" : "tg.png")} style={{ position: "absolute", left: c.x + Math.sin(t * 2 + i) * 40, top: y, width: c.s, height: c.s, opacity: confettiA, transform: `rotate(${c.rot + t * 200 * c.sp}deg)` }} />;
        })}
        <ShipCanvas t={t} />
        <FinalePops t={t} />
        <Shockwave t={t} at={bt(B_RINGS)} x={960} y={540} color="#ffffff" size={7} dur={0.8} width={14} />
        <Shockwave t={t} at={bt(B_HONEY)} x={960} y={540} color="#22e6ff" size={7} dur={0.8} width={14} />
        <Shockwave t={t} at={bt(B_TEXT)} x={960} y={540} color="#ff2bd6" size={7} dur={0.8} width={14} />
        <Shockwave t={t} at={bt(B_SPIRAL)} x={960} y={540} color="#ffe74a" size={7} dur={0.8} width={14} />
        {vortex > 0 && <div style={{ position: "absolute", left: 960 - 400, top: 540 - 400, width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,${ease.inExpo(vortex)}) 0%, hsla(${hue},100%,70%,${vortex * 0.6}) 25%, transparent 60%)`, transform: `scale(${0.3 + ease.inCubic(vortex) * 2.5})`, mixBlendMode: "screen" }} />}
      </Fill>
      <Fill style={{ background: `hsla(${hue + 180},100%,60%,${sn * 0.1})`, mixBlendMode: "screen" }} />
    </Fill>
  );
};

/** Leader portraits that pop in hex frames around the edges on every downbeat. */
const FinalePops: React.FC<{ t: number }> = ({ t }) => {
  const heroes = castHeroes();
  const items: React.ReactNode[] = [];
  for (let bar = 0; bar < 6; bar++) {
    const at = bt(B_IN + bar * 4);
    const p = (t - at) / (bt(B_IN + bar * 4 + 4) - at);
    if (p < 0 || p > 1) continue;
    for (let j = 0; j < 4; j++) {
      const lp = clamp((t - at - j * 0.06) / 0.3);
      const s = ease.outBack(lp, 2.2) * (1 - ease.inQuad(clamp((p - 0.8) / 0.2)));
      const pos = [[80, 70], [1640, 70], [80, 790], [1640, 790]][j];
      items.push(
        <div key={`${bar}-${j}`} style={{ position: "absolute", left: pos[0], top: pos[1], width: 200, height: 220, transform: `scale(${s}) rotate(${(j % 2 ? 1 : -1) * 8}deg)`, filter: `drop-shadow(0 0 18px ${["#ff2bd6", "#22e6ff", "#ffe74a", "#3dff8f"][(bar + j) % 4]})` }}>
          <div style={{ width: "100%", height: "100%", clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)", background: "#000" }}>
            <Img src={heroes[(bar * 4 + j) % heroes.length]} style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated" }} />
          </div>
        </div>,
      );
    }
  }
  return <>{items}</>;
};

export const FINALE_FROM = bt(B_IN);
export const FINALE_END = bt(B_END) + 0.1;
