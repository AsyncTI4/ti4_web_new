import React from "react";
import { Img } from "../lib/Img";
import { G, glowOf } from "../lib/game";
import { FONT } from "../lib/fonts";
import { clamp, ease } from "../lib/math";
import { bt, kick } from "../lib/timing";

/** Seconds the AFK player has been "taking a turn" at song time t (reaches 6d 23:59:52 at the breakdown). */
export function turnSeconds(t: number): number {
  const end = 7 * 86400 - 8;
  const breakdown = bt(144);
  if (t <= breakdown) return (end * clamp(t / breakdown)) | 0;
  return end + Math.floor((t - breakdown) * 2);
}
export function formatTurn(s: number): string {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return `${d}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/** Persistent corner HUD, styled after the app's "Taking a turn" callout. */
export const TurnTimer: React.FC<{ t: number; visible: boolean }> = ({ t, visible }) => {
  const a = visible ? ease.outCubic(clamp((t - 1.1) / 0.4)) * (1 - clamp((t - (bt(144) - 0.3)) / 0.3)) : 0;
  if (a <= 0.01) return null;
  const k = kick(t);
  return (
    <div style={{ position: "absolute", right: 40, top: 34, zIndex: 60, opacity: a * 0.92, display: "grid", gridTemplateColumns: "34px auto", gap: 12, alignItems: "center", padding: "9px 16px 9px 12px", background: `linear-gradient(90deg, ${glowOf(G.afk.hex, 0.1)}, rgba(10,10,14,.86) 60%)`, border: "1px solid rgba(190,190,196,.16)", borderRadius: 4, boxShadow: `inset 3px 0 0 ${glowOf(G.afk.hex, 0.5 + k * 0.4)}, 0 8px 24px rgba(0,0,0,.5)` }}>
      <Img src={G.afk.icon} style={{ width: 34, height: 34, objectFit: "contain" }} />
      <div>
        <div style={{ fontFamily: FONT.display, fontSize: 15, letterSpacing: "0.1em", color: "#f1f3f5", maxWidth: 380, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{G.afk.name.toUpperCase()} <span style={{ color: "rgb(34 197 94 / .9)", marginLeft: 6 }}>ACTING</span></div>
        <div style={{ fontFamily: FONT.mono, fontSize: 18, color: "#adb5bd" }}>taking a turn · <span style={{ color: "#ffe28a" }}>{formatTurn(turnSeconds(t))}</span></div>
      </div>
    </div>
  );
};
