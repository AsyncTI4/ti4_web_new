import React from "react";
import { Img } from "../lib/Img";
import { Fill } from "../lib/stage";
import { clamp, ease, hash, rng } from "../lib/math";
import { hexPoints, hexPath } from "../lib/hex";
import { DISCORD, NEON, tokenSrc } from "../lib/assets";
import { FONT } from "../lib/fonts";

/** Expanding hex shockwave starting at time `at`. */
export const Shockwave: React.FC<{ t: number; at: number; x?: number; y?: number; color?: string; size?: number; dur?: number; width?: number }> = ({ t, at, x = 0, y = 0, color = NEON.cyan, size = 2.2, dur = 0.6, width = 10 }) => {
  const p = (t - at) / dur;
  if (p < 0 || p > 1) return null;
  const s = 0.3 + ease.outCubic(p) * size;
  return (
    <svg style={{ position: "absolute", left: x - 600, top: y - 600, width: 1200, height: 1200, overflow: "visible", pointerEvents: "none" }} viewBox="-600 -600 1200 1200">
      <polygon points={hexPoints(s)} fill="none" stroke={color} strokeWidth={width * (1 - p) + 1} opacity={1 - p} />
      <polygon points={hexPoints(s * 0.82)} fill="none" stroke="white" strokeWidth={(width * (1 - p)) / 2} opacity={(1 - p) * 0.7} />
    </svg>
  );
};

/** Four-point twinkle star. */
export const Sparkle: React.FC<{ x: number; y: number; size: number; rot?: number; color?: string; opacity?: number }> = ({ x, y, size, rot = 0, color = "#fff", opacity = 1 }) => (
  <svg style={{ position: "absolute", left: x - size, top: y - size, width: size * 2, height: size * 2, overflow: "visible", opacity, transform: `rotate(${rot}deg)` }} viewBox="-10 -10 20 20">
    <path d="M0 -10 C1 -2 2 -1 10 0 C2 1 1 2 0 10 C-1 2 -2 1 -10 0 C-2 -1 -1 -2 0 -10Z" fill={color} style={{ filter: `drop-shadow(0 0 2px ${color})` }} />
  </svg>
);

/** A field of sparkles that twinkle with phase offsets. */
export const SparkleField: React.FC<{ t: number; seed: number; count: number; w: number; h: number; x?: number; y?: number; color?: string; size?: number; intensity?: number }> = ({ t, seed, count, w, h, x = 0, y = 0, color = "#fff6c8", size = 18, intensity = 1 }) => {
  const r = rng(seed);
  const items = Array.from({ length: count }, () => ({ x: r() * w - w / 2, y: r() * h - h / 2, ph: r(), sp: 0.8 + r() * 1.6, s: 0.5 + r() }));
  return (
    <>
      {items.map((it, i) => {
        const tw = Math.max(0, Math.sin((t * it.sp + it.ph) * Math.PI * 2));
        return <Sparkle key={i} x={x + it.x} y={y + it.y} size={size * it.s * (0.4 + tw)} rot={t * 40 * it.sp} color={color} opacity={tw * intensity} />;
      })}
    </>
  );
};

export const Heart: React.FC<{ x: number; y: number; size: number; color?: string; opacity?: number; rot?: number }> = ({ x, y, size, color = "#ff4fa8", opacity = 1, rot = 0 }) => (
  <svg style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, overflow: "visible", opacity, transform: `rotate(${rot}deg)` }} viewBox="0 0 32 30">
    <path d="M16 29 C16 29 1 19.5 1 9.5 C1 4.5 5 1 9.5 1 C12.5 1 15 3 16 5 C17 3 19.5 1 22.5 1 C27 1 31 4.5 31 9.5 C31 19.5 16 29 16 29Z" fill={color} stroke="#fff" strokeWidth={2.2} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
  </svg>
);

/** Hearts emitted at each time in `emits`, floating up and fading. */
export const HeartBurst: React.FC<{ t: number; emits: number[]; x: number; y: number; spread?: number; seed?: number; size?: number; life?: number; rise?: number }> = ({ t, emits, x, y, spread = 120, seed = 1, size = 46, life = 1.4, rise = 260 }) => (
  <>
    {emits.map((at, i) => {
      const p = (t - at) / life;
      if (p < 0 || p > 1) return null;
      const h = hash(seed * 100 + i);
      const dx = (h - 0.5) * spread * 2 + Math.sin(p * 9 + i) * 14;
      return <Heart key={i} x={x + dx} y={y - ease.outCubic(p) * rise} size={size * (0.6 + ease.outBack(clamp(p * 4)) * 0.6) * (0.7 + h * 0.6)} opacity={1 - ease.inQuad(p)} rot={(h - 0.5) * 40} color={h > 0.5 ? "#ff4fa8" : "#ff7ad9"} />;
    })}
  </>
);

/** The web app's tactical activation outline (MapTile.module.css .tacticalActivationGlow). */
export const ActivationGlow: React.FC<{ x: number; y: number; a: number; scale?: number; color?: string }> = ({ x, y, a, scale = 1, color = "rgba(165, 243, 252, 0.98)" }) => {
  if (a <= 0.01) return null;
  return (
    <svg style={{ position: "absolute", left: x - 200 * scale, top: y - 180 * scale, width: 400 * scale, height: 360 * scale, overflow: "visible", opacity: a, filter: "drop-shadow(0 0 8px rgba(103, 232, 249, 0.95)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.72))" }} viewBox="-200 -180 400 360">
      <path d={hexPath(0.985)} fill="rgba(103, 232, 249, 0.06)" stroke={color} strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
};

/** Command token drop (MapUnitTransitionLayer commandTokenPlacement keyframes), optionally stalled. */
export const CommandTokenDrop: React.FC<{ t: number; at: number; x: number; y: number; color: string; icon: string; dur?: number; stallAt?: number; scale?: number }> = ({ t, at, x, y, color, icon, dur = 0.56, stallAt, scale = 1 }) => {
  let p = (t - at) / dur;
  if (p < 0) return null;
  if (stallAt !== undefined) p = Math.min(p, stallAt);
  const k1 = clamp(p / 0.68);
  const k2 = clamp((p - 0.68) / 0.32);
  const ty = p < 0.68 ? -64 + 69 * ease.outQuad(k1) : 5 - 5 * k2;
  const sc = p < 0.68 ? 1.18 - 0.21 * k1 : 0.97 + 0.03 * k2;
  const rot = p < 0.68 ? -10 + 12 * k1 : 2 - 2 * k2;
  return (
    <div style={{ position: "absolute", left: x - 40 * scale, top: y - 36 * scale, width: 80 * scale, height: 72 * scale, opacity: clamp(p * 3), transform: `translateY(${ty * scale}px) scale(${sc}) rotate(${rot}deg)` }}>
      <Img src={tokenSrc("command", color)} style={{ width: "100%", height: "100%" }} />
      <Img src={icon} style={{ position: "absolute", left: "50%", top: "50%", height: 34 * scale, transform: "translate(-50%,-30%)" }} />
    </div>
  );
};

/** Dashed movement path with flowing chevrons along a quadratic-ish Bézier (screen or world coords). */
export const FlightPath: React.FC<{ t: number; from: [number, number]; to: [number, number]; reveal: number; color?: string; bend?: number; width?: number }> = ({ t, from, to, reveal, color = NEON.cyan, bend = 0.25, width = 6 }) => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const d = Math.hypot(dx, dy);
  const nx = -dy / d;
  const ny = dx / d;
  const c1 = [from[0] + dx * 0.22 + nx * d * bend * 0.35, from[1] + dy * 0.22 + ny * d * bend * 0.35];
  const c2 = [from[0] + dx * 0.58 + nx * d * bend, from[1] + dy * 0.58 + ny * d * bend];
  const path = `M${from[0]},${from[1]} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${to[0]},${to[1]}`;
  const len = d * 1.25;
  const minX = Math.min(from[0], to[0]) - d;
  const minY = Math.min(from[1], to[1]) - d;
  return (
    <svg style={{ position: "absolute", left: minX, top: minY, width: d * 3, height: d * 3, overflow: "visible", pointerEvents: "none" }} viewBox={`${minX} ${minY} ${d * 3} ${d * 3}`}>
      <defs>
        <marker id="chev" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M1 1 L8 5 L1 9" fill="none" stroke={color} strokeWidth={2.2} />
        </marker>
      </defs>
      <path d={path} fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={width * 3.5} strokeLinecap="round" strokeDasharray={`${len * reveal} ${len}`} />
      <path d={path} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={`${len * reveal} ${len}`} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
      <path d={path} fill="none" stroke="white" strokeWidth={width * 0.5} strokeDasharray="18 22" strokeDashoffset={-t * 160} strokeLinecap="round" opacity={reveal > 0.98 ? 0.9 : 0} />
    </svg>
  );
};

export const Cursor: React.FC<{ x: number; y: number; scale?: number; pressed?: boolean }> = ({ x, y, scale = 1, pressed }) => (
  <svg style={{ position: "absolute", left: x, top: y, width: 44 * scale, height: 60 * scale, overflow: "visible", transform: `scale(${pressed ? 0.86 : 1})`, transformOrigin: "0 0", filter: "drop-shadow(0 4px 6px rgba(0,0,0,.6))" }} viewBox="0 0 22 30">
    <path d="M1 1 L1 23 L6.5 17.5 L10.5 27 L14 25.5 L10 16.5 L18 16.5 Z" fill="white" stroke="#111" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

/** Rubber stamp that slams in at `at`. */
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; color?: string; size?: number; rot?: number }> = ({ t, at, text, x, y, color = NEON.red, size = 120, rot = -12 }) => {
  const p = (t - at) / 0.16;
  if (p < 0) return null;
  const s = 2.6 - 1.6 * ease.outCubic(p);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`, opacity: clamp(p * 2) }}>
      <div style={{ fontFamily: FONT.display, fontSize: size, color, border: `${size * 0.08}px solid ${color}`, borderRadius: size * 0.12, padding: `${size * 0.02}px ${size * 0.18}px`, lineHeight: 1.05, letterSpacing: "0.06em", textShadow: `0 0 ${size * 0.2}px ${color}`, boxShadow: `0 0 ${size * 0.25}px ${color}, inset 0 0 ${size * 0.2}px ${color}`, background: "rgba(10,0,4,0.35)", mixBlendMode: "screen", whiteSpace: "nowrap" }}>
        {text}
      </div>
    </div>
  );
};

/** Discord-style @mention pill with a red notification badge. */
export const PingChip: React.FC<{ t: number; at: number; text: string; x: number; y: number; count?: number; size?: number; rot?: number }> = ({ t, at, text, x, y, count = 1, size = 1, rot = 0 }) => {
  const p = (t - at) / 0.22;
  if (p < 0) return null;
  const s = ease.outBack(p, 2.6);
  const wob = Math.sin((t - at) * 30) * Math.exp(-(t - at) * 6) * 6;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot + wob}deg) scale(${s * size})` }}>
      <div style={{ position: "relative", fontFamily: FONT.discord, fontWeight: 700, fontSize: 84, color: DISCORD.mentionText, background: "rgba(88, 101, 242, 0.42)", borderRadius: 18, padding: "6px 30px 10px", boxShadow: "0 0 0 4px rgba(88,101,242,.65), 0 20px 60px rgba(0,0,0,.6), 0 0 60px rgba(88,101,242,.5)", whiteSpace: "nowrap", backdropFilter: "blur(2px)" }}>
        {text}
        <div style={{ position: "absolute", right: -34, top: -34, minWidth: 76, height: 76, padding: "0 14px", borderRadius: 38, background: "#f23f43", border: "8px solid #1e1f22", color: "white", fontSize: 46, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
          {count}
        </div>
      </div>
    </div>
  );
};

/** Horizontal slice glitch: renders children several times, clipped and offset. */
export const Glitch: React.FC<{ t: number; amount: number; seed?: number; children: React.ReactNode }> = ({ t, amount, seed = 1, children }) => {
  if (amount <= 0.01) return <>{children}</>;
  const frame = Math.floor(t * 30);
  const r = rng(seed * 997 + frame);
  const slices = 7;
  const cuts = Array.from({ length: slices - 1 }, () => r()).sort();
  const bounds = [0, ...cuts, 1];
  return (
    <>
      {bounds.slice(0, -1).map((b, i) => {
        const off = (r() - 0.5) * 160 * amount;
        const hue = r() > 0.6 ? `hue-rotate(${(r() - 0.5) * 120 * amount}deg)` : "";
        return (
          <Fill key={i} style={{ clipPath: `inset(${b * 100}% 0 ${(1 - bounds[i + 1]) * 100}% 0)`, transform: `translateX(${off}px)`, filter: hue || undefined }}>
            {children}
          </Fill>
        );
      })}
    </>
  );
};

/** Dashed glowing path through explicit cubic Bézier control points. */
export const CurvePath: React.FC<{ t: number; pts: number[][]; reveal: number; color?: string; width?: number }> = ({ t, pts, reveal, color = NEON.cyan, width = 6 }) => {
  const [a, b, c, d] = pts;
  const path = `M${a[0]},${a[1]} C${b[0]},${b[1]} ${c[0]},${c[1]} ${d[0]},${d[1]}`;
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + Math.hypot(c[0] - b[0], c[1] - b[1]) + Math.hypot(d[0] - c[0], d[1] - c[1]);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs) - 100;
  const minY = Math.min(...ys) - 100;
  const w = Math.max(...xs) - minX + 100;
  const h = Math.max(...ys) - minY + 100;
  return (
    <svg style={{ position: "absolute", left: minX, top: minY, width: w, height: h, overflow: "visible", pointerEvents: "none" }} viewBox={`${minX} ${minY} ${w} ${h}`}>
      <path d={path} fill="none" stroke={color} strokeOpacity={0.22} strokeWidth={width * 3.5} strokeLinecap="round" strokeDasharray={`${len * reveal} ${len * 2}`} />
      <path d={path} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={`${len * reveal} ${len * 2}`} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
      <path d={path} fill="none" stroke="white" strokeWidth={width * 0.45} strokeDasharray="16 22" strokeDashoffset={-t * 170} strokeLinecap="round" opacity={reveal > 0.98 ? 0.9 : 0} />
    </svg>
  );
};

