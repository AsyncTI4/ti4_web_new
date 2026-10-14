import React from "react";
import { Img } from "../lib/Img";
import { G, glowOf } from "../lib/game";
import { FONT } from "../lib/fonts";

const SC_TONE: Record<number, string> = { 1: "239,68,68", 2: "249,115,22", 3: "234,179,8", 4: "34,197,94", 5: "20,184,166", 6: "6,182,212", 7: "59,130,246", 8: "147,51,234" };
const label: React.CSSProperties = { fontFamily: FONT.display, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#868e96" };

/** Replica of the web app's GameStatePanel (ACTION PHASE turn order). */
export const TurnPanel: React.FC<{ t: number; timer: string; actingPulse?: number }> = ({ t, timer, actingPulse = 0 }) => (
  <div style={{ width: 300, background: "color-mix(in oklab, #121214 94%, transparent)", border: "1px solid rgba(190,190,196,.12)", borderRadius: 4, boxShadow: "0 8px 24px rgb(0 0 0 / .5)", color: "#adb5bd", overflow: "hidden", fontFamily: FONT.text }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: 30, padding: "0 8px 0 10px", background: "linear-gradient(180deg, rgb(190 190 196 / .035), transparent), linear-gradient(180deg, rgb(255 255 255 / .025), transparent 40%)", boxShadow: "inset 0 1px 0 rgb(190 190 196 / .385)", borderBottom: "1px solid rgba(190,190,196,.12)" }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgb(34,197,94)", opacity: 0.45 + 0.4 * (0.5 + 0.5 * Math.cos(t * 2)) }} />
      <span style={{ ...label, fontSize: 10, color: "#adb5bd" }}>Action Phase</span>
      <span style={{ fontFamily: FONT.mono, fontSize: 11, color: "#868e96" }}>R{G.round}</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, padding: "8px 10px 6px" }}>
      {["Strategy", "Action", "Status", "Agenda"].map((s, i) => (
        <div key={s} style={{ display: "grid", gap: 4, textAlign: "center" }}>
          <div style={{ height: 3, borderRadius: 1, background: i === 0 ? "rgba(190,190,196,.2)" : i === 1 ? "rgb(34 197 94 / .42)" : "rgba(190,190,196,.12)" }} />
          <span style={{ ...label, fontSize: 9, color: i === 1 ? "#adb5bd" : "#868e96" }}>{s}</span>
        </div>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "28px minmax(0,1fr)", gap: 8, alignItems: "center", margin: "2px 10px 8px", padding: "7px 8px", background: `linear-gradient(90deg, ${glowOf(G.afk.hex, 0.05)}, transparent 70%)`, borderRadius: 3, boxShadow: `inset 2px 0 0 ${glowOf(G.afk.hex, 0.49)}` }}>
      <Img src={G.afk.icon} style={{ width: 26, height: 26, objectFit: "contain" }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 600, color: "#f1f3f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{G.afk.name}</div>
        <div style={{ fontSize: 11, color: "#adb5bd" }}>Taking a turn · <span style={{ fontFamily: FONT.mono }}>{timer}</span></div>
      </div>
    </div>
    <div style={{ display: "grid", gap: 1, padding: "0 10px 8px" }}>
      {G.six.map((p, i) => {
        const acting = p === G.afk;
        const s = { sc: p.sc ?? i + 1, f: p.icon, n: p.name, s: acting ? "acting" : "waiting" };
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "22px 18px minmax(0,1fr) auto", gap: 7, alignItems: "center", height: 26, padding: "0 6px 0 3px", borderRadius: 2, fontSize: 12, background: acting ? `rgba(190,190,196,${0.09 + actingPulse * 0.2})` : undefined, color: acting ? "#f1f3f5" : "#adb5bd", fontWeight: acting ? 600 : 400, boxShadow: acting && actingPulse > 0.01 ? `0 0 ${actingPulse * 18}px rgba(81,207,102,${actingPulse})` : undefined }}>
            <div style={{ display: "grid", placeItems: "center", width: 20, height: 20, borderRadius: "50%", fontFamily: FONT.mono, fontSize: 10, fontWeight: 600, color: "#f1f3f5", background: "rgba(0,0,0,.3)", boxShadow: `inset 0 0 0 1px rgba(${SC_TONE[s.sc]},.49)` }}>{s.sc}</div>
            <Img src={s.f} style={{ width: 18, height: 18, objectFit: "contain" }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.n}</span>
            <span style={{ ...label, fontSize: 9, color: acting ? "rgb(34 197 94 / .9)" : "#868e96" }}>{s.s}</span>
          </div>
        );
      })}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderTop: "1px solid rgba(190,190,196,.09)", ...label, fontSize: 9 }}>
      <span>Following 4 · Construction</span><span style={{ fontFamily: FONT.mono, letterSpacing: 0, textTransform: "none" }}>5 left</span>
    </div>
  </div>
);
