import React from "react";
import { Ship } from "./Ship";
import { FONT } from "../lib/fonts";
import { clamp } from "../lib/math";

/** The AFK player's flagship asleep on a pillow, breathing, with drifting Zzz. */
export const SleepingFlagship: React.FC<{ t: number; x: number; y: number; scale?: number; opacity?: number; color: string; glow: string }> = ({ t, x, y, scale = 3, opacity = 1, color, glow }) => {
  const w = 80 * scale;
  const breathe = 1 + 0.03 * Math.sin(t * 1.9);
  const zs = [0, 1, 2, 3, 4, 5].map((i) => {
    const period = 2.4;
    const p = (((t + i * (period / 3)) % period) + period) % period / period;
    return { p, i };
  });
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity }}>
      <div style={{ position: "absolute", left: -w * 0.62, top: w * 0.05, width: w * 1.15, height: w * 0.5, borderRadius: w * 0.22, background: "linear-gradient(160deg, #f1edff, #b9b2e8 70%, #8f86c9)", transform: "rotate(-10deg)", boxShadow: `inset 0 ${-w * 0.06}px ${w * 0.1}px rgba(80,60,160,.35), 0 ${w * 0.08}px ${w * 0.2}px rgba(0,0,0,.45)` }}>
        <div style={{ position: "absolute", left: "48%", top: "18%", width: "4%", height: "64%", borderRadius: 8, background: "rgba(120,100,200,.25)" }} />
      </div>
      <Ship color={color} unit="fs" x={0} y={0} scale={scale} heading={-28} transform={`scale(${breathe}, ${2 - breathe}) translateY(${Math.sin(t * 1.9) * 3}px)`} glow={glow} glowSize={12} />
      {zs.map(({ p, i }) => (
        <div key={i} style={{ position: "absolute", left: w * 0.32 + p * w * 0.55 + Math.sin(p * 9 + i) * w * 0.05, top: -w * 0.45 - p * w * 0.85, fontFamily: FONT.display, fontSize: w * (0.14 + p * 0.16), color: "#ffe9a8", opacity: clamp(p * 5) * (1 - p), textShadow: "0 0 14px rgba(255,210,90,.8)", transform: `rotate(${-12 + p * 18}deg)` }}>z</div>
      ))}
    </div>
  );
};
