import React from "react";
import { Fill } from "../lib/stage";
import { FONT } from "../lib/fonts";
import { clamp, ease } from "../lib/math";
import { kick } from "../lib/timing";

/** Full-screen slammed headline with neon echo outlines. */
export const BigType: React.FC<{ t: number; at: number; text: string; color: string; echo?: string[]; size?: number; rot?: number; y?: number; out?: number }> = ({ t, at, text, color, echo = ["#ff2bd6", "#22e6ff", "#ffe74a"], size = 210, rot = -4, y = 0, out = Infinity }) => {
  const p = (t - at) / 0.14;
  if (p < 0) return null;
  const outP = clamp((t - out) / 0.12);
  if (outP >= 1) return null;
  const k = kick(t);
  const s = (2.4 - 1.4 * ease.outExpo(p)) * (1 + k * 0.05) * (1 + outP * 0.6);
  const base: React.CSSProperties = { position: "absolute", left: "50%", top: `calc(50% + ${y}px)`, fontFamily: FONT.display, fontSize: size, lineHeight: 1, whiteSpace: "nowrap", letterSpacing: "0.02em" };
  return (
    <Fill style={{ opacity: clamp(p * 3) * (1 - outP), pointerEvents: "none" }}>
      {echo.map((c, i) => (
        <div key={i} style={{ ...base, color: "transparent", WebkitTextStroke: `3px ${c}`, opacity: (0.7 - i * 0.18) * (0.6 + k * 0.6), transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s * (1.08 + i * 0.1 + ease.outCubic(clamp((t - at) / 0.6)) * 0.1 * (i + 1))})`, filter: `drop-shadow(0 0 12px ${c})` }}>{text}</div>
      ))}
      <div style={{ ...base, color, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`, WebkitTextStroke: "12px #05070f", paintOrder: "stroke fill", textShadow: `0 0 40px ${color}, 0 12px 0 rgba(0,0,0,.6)` }}>{text}</div>
    </Fill>
  );
};

/** Rows of repeated text scrolling in alternating directions. */
export const Marquee: React.FC<{ t: number; text: string; rows?: number; size?: number; color?: string; opacity?: number; speed?: number; rot?: number }> = ({ t, text, rows = 7, size = 120, color = "rgba(255,255,255,.08)", opacity = 1, speed = 260, rot = -8 }) => (
  <Fill style={{ opacity, transform: `rotate(${rot}deg) scale(1.3)`, overflow: "visible" }}>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} style={{ position: "absolute", left: -400, top: r * size * 1.1 - 100, whiteSpace: "nowrap", fontFamily: FONT.display, fontSize: size, color, transform: `translateX(${((r % 2 ? 1 : -1) * t * speed) % (size * 8)}px)` }}>
        {Array.from({ length: 8 }).map(() => text + " · ").join("")}
      </div>
    ))}
  </Fill>
);
