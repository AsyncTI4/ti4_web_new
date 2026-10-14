import React from "react";
import { Fill } from "../lib/stage";
import { Img } from "../lib/Img";
import { SceneProps } from "./types";
import { Ship } from "../components/Ship";
import { Starfield } from "../components/Backdrop";
import { Cursor, Shockwave, SparkleField, Stamp } from "../fx/Effects";
import { LINES, bt, kick } from "../lib/timing";
import { clamp, ease, lerp, rng } from "../lib/math";
import { danceTransform } from "../lib/dance";
import { FONT } from "../lib/fonts";
import { NEON, UnitType, miscSrc, tileSrc } from "../lib/assets";
import { G } from "../lib/game";
import { hexPoints } from "../lib/hex";

const W = (l: number, w: number) => LINES[l].words[w].s;
export const V2_CUTS = [bt(64), W(9, 0) - 0.06, W(10, 0) - 0.06, W(11, 0) - 0.06, W(12, 0) - 0.06];

/** Diagonal split layout shared by the dossier panels. */
const Panel: React.FC<{ t: number; from: number; accent: string; bg: string; tile: string; children: React.ReactNode; card: React.ReactNode; tileFilter?: string }> = ({ t, from, accent, bg, tile, children, card, tileFilter }) => {
  const lt = t - from;
  const k = kick(t);
  const slam = ease.outExpo(clamp(lt / 0.25));
  return (
    <Fill style={{ background: bg, overflow: "hidden" }}>
      <Fill style={{ backgroundImage: `repeating-linear-gradient(120deg, ${accent}14 0 3px, transparent 3px 38px)`, transform: `translateX(${(lt * 80) % 44}px)` }} />
      <div style={{ position: "absolute", left: 640 - 520, top: 540 - 450, width: 1040, height: 900, transform: `scale(${(0.9 + slam * 0.1) * (1 + k * 0.02)}) rotate(${(1 - slam) * -8}deg)` }}>
        <svg viewBox="-520 -450 1040 900" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <clipPath id={`hexclip-${from}`}><polygon points={hexPoints(2.95)} /></clipPath>
          </defs>
          <polygon points={hexPoints(3.05)} fill="none" stroke={accent} strokeWidth={10} style={{ filter: `drop-shadow(0 0 18px ${accent})` }} />
          <image href={tileSrc(tile)} x={-509} y={-441} width={1018} height={882} clipPath={`url(#hexclip-${from})`} preserveAspectRatio="none" style={{ imageRendering: "pixelated", filter: tileFilter }} />
          <polygon points={hexPoints(2.95)} fill="rgba(0,0,0,0.25)" />
        </svg>
        {children}
      </div>
      <div style={{ position: "absolute", right: 70, top: 120, width: 640, transform: `translateX(${(1 - slam) * 700}px)` }}>{card}</div>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 16, background: accent, boxShadow: `0 0 30px ${accent}` }} />
    </Fill>
  );
};

const UnitCard: React.FC<{ t: number; title: string; sub: string; icon: string; accent: string; stats: [string, string][]; rows: { label: string; value: React.ReactNode; at?: number }[] }> = ({ t, title, sub, icon, accent, stats, rows }) => (
  <div style={{ background: "linear-gradient(180deg,#151517,#0d0d10)", border: "1px solid rgba(190,190,196,.2)", borderRadius: 8, overflow: "hidden", boxShadow: `0 40px 100px rgba(0,0,0,.65), 0 0 0 2px ${accent}55`, fontFamily: FONT.display }}>
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 26px", background: `linear-gradient(90deg, ${accent}33, transparent)`, borderBottom: "1px solid rgba(190,190,196,.14)" }}>
      <Img src={icon} style={{ width: 70, height: 70 }} />
      <div>
        <div style={{ color: "#f1f3f5", fontSize: 50, letterSpacing: "0.05em", lineHeight: 1 }}>{title}</div>
        <div style={{ color: "#868e96", fontSize: 18, letterSpacing: "0.14em", marginTop: 6 }}>{sub}</div>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length},1fr)`, padding: "16px 20px", gap: 8, borderBottom: "1px solid rgba(190,190,196,.12)" }}>
      {stats.map(([k, v]) => (
        <div key={k} style={{ textAlign: "center" }}>
          <div style={{ color: "#868e96", fontSize: 15, letterSpacing: "0.12em" }}>{k}</div>
          <div style={{ color: "#f1f3f5", fontSize: 46 }}>{v}</div>
        </div>
      ))}
    </div>
    {rows.map((r, i) => {
      const p = r.at === undefined ? 1 : ease.outBack(clamp((t - r.at) / 0.22), 2);
      return (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 26px", borderBottom: "1px solid rgba(190,190,196,.08)", opacity: clamp(p * 2), transform: `translateX(${(1 - p) * 60}px)` }}>
          <span style={{ color: "#868e96", fontSize: 20, letterSpacing: "0.14em" }}>{r.label}</span>
          <span style={{ color: accent, fontSize: 32, textShadow: `0 0 16px ${accent}` }}>{r.value}</span>
        </div>
      );
    })}
  </div>
);

const Meter: React.FC<{ v: number; color: string }> = ({ v, color }) => (
  <span style={{ display: "inline-flex", gap: 4 }}>
    {Array.from({ length: 10 }).map((_, i) => <span key={i} style={{ width: 14, height: 26, background: i < v * 10 ? color : "rgba(255,255,255,.1)", boxShadow: i < v * 10 ? `0 0 8px ${color}` : undefined }} />)}
  </span>
);

/* Carrier's got fighters, they're all fallin' asleep */
export const V2Carrier: React.FC<SceneProps> = ({ t, from }) => {
  const sleep = clamp((t - W(8, 5)) / 0.6);
  const fighters = [0, 1, 2, 3];
  return (
    <Panel t={t} from={from} accent="#5aa9ff" bg="radial-gradient(120% 100% at 30% 40%, #0f2350, #040817 70%)" tile="48_Void.png" tileFilter="hue-rotate(10deg) brightness(.8)"
      card={<UnitCard t={t} title="CARRIER II" sub={`${G.hero.factionName.toUpperCase()} · HOME FLEET`} icon={G.hero.icon} accent="#5aa9ff" stats={[["COST", "3"], ["COMBAT", "9"], ["MOVE", "2"], ["CAPACITY", "6"]]}
        rows={[{ label: "FIGHTERS", value: "4 / 4", at: W(8, 1) }, { label: "AWAKE", value: <Meter v={1 - sleep} color="#5aa9ff" />, at: W(8, 3) }, { label: "STATUS", value: sleep > 0.5 ? "ZZZ…" : "DROWSY", at: W(8, 5) }]} />}>
      <div style={{ position: "absolute", left: 520, top: 450 }}>
        <Ship color={G.hero.color} unit="cv" scale={5} x={0} y={0} transform={`translateY(${Math.sin(t * 2) * 10}px) rotate(${Math.sin(t * 1.1) * 4 + sleep * 8}deg)`} glow="rgba(90,169,255,.6)" glowSize={20} />
        {fighters.map((i) => {
          const ang = t * lerp(2.2, 0.5, sleep) + (i * Math.PI) / 2;
          const droop = sleep * (40 + i * 12);
          const x = Math.cos(ang) * 300;
          const y = Math.sin(ang) * 120 + droop;
          return <Ship key={i} color={G.hero.color} unit="ff" scale={2.6} x={x} y={y} heading={(ang * 180) / Math.PI + 90 + sleep * 60} opacity={1 - sleep * 0.25} />;
        })}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const at = W(8, 4) + i * 0.22;
          const p = (t - at) / 1.4;
          if (p < 0 || p > 1) return null;
          return <div key={i} style={{ position: "absolute", left: 60 + i * 40 + Math.sin(p * 8) * 20, top: -120 - p * 260, fontFamily: FONT.display, fontSize: 50 + i * 12, color: "#cfe3ff", opacity: 1 - p, textShadow: "0 0 20px #5aa9ff" }}>z</div>;
        })}
      </div>
    </Panel>
  );
};

/* Dreadnought's gettin' dusty, it's been three days deep */
export const V2Dread: React.FC<SceneProps> = ({ t, from }) => {
  const dust = clamp((t - from) / 1.4);
  const r = rng(77);
  const motes = Array.from({ length: 60 }, () => ({ x: r() * 900 - 450, y: r() * 800, s: 2 + r() * 5, v: 40 + r() * 90, ph: r() }));
  const days = t >= W(9, 7) ? 3 : t >= W(9, 6) ? 2 : t >= W(9, 2) ? 1 : 0;
  return (
    <Panel t={t} from={from} accent="#d6a35c" bg="radial-gradient(120% 100% at 30% 40%, #3a2a16, #0e0904 70%)" tile="50_Void.png" tileFilter={`sepia(${0.4 + dust * 0.5}) brightness(.85)`}
      card={<UnitCard t={t} title="DREADNOUGHT" sub={`${G.hero.factionName.toUpperCase()} · SUSTAIN DAMAGE`} icon={G.hero.icon} accent="#d6a35c" stats={[["COST", "4"], ["COMBAT", "5"], ["MOVE", "1"], ["CAPACITY", "1"]]}
        rows={[{ label: "DUST LEVEL", value: <Meter v={0.3 + dust * 0.67} color="#d6a35c" />, at: W(9, 2) }, { label: "DAYS IDLE", value: <span style={{ fontSize: 52 }}>{days}</span>, at: W(9, 4) }, { label: "LAST MOVED", value: "R1 · TUESDAY", at: W(9, 7) }]} />}>
      <div style={{ position: "absolute", left: 520, top: 450 }}>
        <Ship color={G.hero.color} unit="dn" scale={5.2} x={0} y={0} transform={`rotate(${Math.sin(t * 0.8) * 2}deg)`} filter={`sepia(${dust * 0.85}) saturate(${1 - dust * 0.6}) brightness(${1 - dust * 0.15})`} />
        <svg style={{ position: "absolute", left: -230, top: -230, width: 200, height: 200, overflow: "visible", opacity: dust }} viewBox="0 0 200 200">
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M0 0 L${200 - i * 30} ${i * 34}`} stroke="rgba(255,255,255,.55)" strokeWidth={1.5} />)}
          {[40, 80, 120].map((rr) => <path key={rr} d={`M${rr} 0 Q${rr * 0.7} ${rr * 0.7} 0 ${rr}`} fill="none" stroke="rgba(255,255,255,.5)" strokeWidth={1.5} />)}
        </svg>
        {motes.map((m, i) => {
          const y = ((m.y + (t - from) * m.v) % 800) - 400;
          return <div key={i} style={{ position: "absolute", left: m.x, top: y, width: m.s, height: m.s, borderRadius: "50%", background: "rgba(230,210,170,.7)", opacity: dust * (0.4 + 0.6 * Math.sin(t * 3 + m.ph * 6) ** 2) }} />;
        })}
      </div>
      <Stamp t={t} at={W(9, 6) - 0.04} text="3 DAYS" x={1010} y={190} size={110} rot={-8} color="#ffb347" />
    </Panel>
  );
};

/* War Sun's in the corner, been there since round one */
export const V2WarSun: React.FC<SceneProps> = ({ t, from }) => {
  const lt = t - from;
  const slide = ease.outExpo(clamp(lt / 0.35));
  const rounds = [W(10, 5), W(10, 7), W(10, 8)];
  return (
    <Fill style={{ background: "linear-gradient(135deg, #2a0707, #0a0204 60%)", overflow: "hidden" }}>
      <Fill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,80,40,.05) 0 2px, transparent 2px 60px), repeating-linear-gradient(90deg, rgba(255,80,40,.05) 0 2px, transparent 2px 60px)", transform: "perspective(900px) rotateX(55deg) translateY(200px) scale(2)", transformOrigin: "50% 100%" }} />
      <div style={{ position: "absolute", left: -120, top: -120, width: 760, height: 760, background: "radial-gradient(closest-side, rgba(255,120,60,.55), transparent)", mixBlendMode: "screen", opacity: slide }} />
      <div style={{ position: "absolute", left: 200, top: 300, transform: `translateX(${(1 - slide) * -400}px)` }}>
        <Ship color={G.hero.color} unit="ws" scale={4.2} x={0} y={0} heading={-135 + 180} transform={`translateY(${Math.sin(t * 7) * 3}px)`} glow="rgba(255,120,60,.8)" glowSize={24} />
        <svg style={{ position: "absolute", left: -10, top: -260, width: 120, height: 140, overflow: "visible", transform: `rotate(${-20 + Math.sin(t * 3) * 4}deg)` }} viewBox="0 0 120 140">
          <polygon points="60,0 115,130 5,130" fill="#f2f2f2" stroke="#333" strokeWidth={3} />
          <text x={60} y={110} textAnchor="middle" fontFamily="Slider" fontSize={34} fill="#c0392b">R1</text>
        </svg>
      </div>
      <div style={{ position: "absolute", left: 330, top: 330, fontFamily: FONT.mono, fontSize: 30, color: "#ffb4a0", opacity: clamp((t - W(10, 3)) / 0.2), transform: "rotate(-8deg)" }}>↖ the corner</div>
      <div style={{ position: "absolute", right: 90, top: 300, display: "flex", gap: 22, alignItems: "center" }}>
        {["ROUND 1", "ROUND 2", "ROUND 3"].map((r, i) => {
          const on = t >= rounds[i] - 0.02;
          const p = ease.outBack(clamp((t - rounds[i]) / 0.2), 2.5);
          return (
            <div key={r} style={{ fontFamily: FONT.display, fontSize: 40, letterSpacing: "0.1em", padding: "18px 26px", borderRadius: 6, color: on ? "#1a0400" : "#7a4a40", background: on ? (i === 0 ? NEON.yellow : "#ff7a50") : "rgba(255,255,255,.04)", border: "2px solid rgba(255,140,100,.35)", transform: `scale(${on ? 1 + (1 - p) * 0.4 : 1})`, boxShadow: on ? "0 0 30px rgba(255,140,80,.7)" : undefined }}>{r}</div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 90, top: 460, width: 900, fontFamily: FONT.display, color: "#fff", fontSize: 92, lineHeight: 1, textAlign: "right", textShadow: "0 0 30px rgba(255,90,40,.6)", opacity: slide }}>
        WAR SUN<div style={{ fontSize: 30, letterSpacing: "0.16em", color: "#ff9f80", marginTop: 14 }}>LOCATION: CORNER · SINCE: ROUND 1</div>
      </div>
      <div style={{ position: "absolute", right: 90, top: 680, display: "flex", alignItems: "center", gap: 16, fontFamily: FONT.mono, fontSize: 26, color: "#ffcfbf", opacity: clamp((t - W(10, 5)) / 0.2) }}>
        <Img src={G.hero.icon} style={{ width: 48, height: 48 }} /> moves remaining this game: <b style={{ color: NEON.yellow }}>∞</b>
      </div>
    </Fill>
  );
};

/* Somebody hit "end turn" so the dancin' can come */
export const V2EndTurn: React.FC<SceneProps> = ({ t, from }) => {
  const hitAt = W(11, 2);
  const lt = t - from;
  const cp = ease.inOutCubic(clamp((t - from) / (hitAt - from - 0.02)));
  const pressed = t >= hitAt && t < hitAt + 0.16;
  const after = clamp((t - hitAt) / 0.3);
  const danceAt = W(11, 6);
  const hero = G.hero.color;
  const dancers: { unit: UnitType; color: string }[] = [
    { unit: "cv", color: hero }, { unit: "dn", color: hero }, { unit: "dd_eyes", color: hero }, { unit: "ws", color: hero }, { unit: "ca", color: G.afk.color },
  ];
  const btnScale = pressed ? 0.93 : 1 + Math.sin(t * 10) * 0.01 * (1 - after);
  const r = rng(5);
  const coins = Array.from({ length: 26 }, () => ({ a: r() * Math.PI * 2, v: 500 + r() * 700, s: 40 + r() * 40, spin: r() * 720 - 360, comm: r() > 0.6 }));
  return (
    <Fill style={{ background: `radial-gradient(90% 90% at 50% 45%, ${after > 0 ? "#0e3b22" : "#0b1a12"}, #020604 75%)`, overflow: "hidden" }}>
      <Starfield t={t} brightness={0.35 + after * 0.3} hue={90} opacity={0.6} />
      <SparkleField t={t} seed={3} count={30} w={1800} h={1000} x={960} y={540} color="#bfffd8" size={14} intensity={after} />
      <div style={{ position: "absolute", left: 960, top: 470, transform: `translate(-50%,-50%) scale(${btnScale * (1 - clamp((t - danceAt + 0.2) / 0.3) * 0.45)}) translateY(${-clamp((t - danceAt + 0.2) / 0.3) * 380}px)` }}>
        <div style={{ fontFamily: FONT.discord, fontWeight: 700, fontSize: 130, color: "white", background: pressed ? "#1a6334" : "#248046", padding: "34px 110px", borderRadius: 26, letterSpacing: "0.02em", boxShadow: `0 ${pressed ? 4 : 18}px 0 #13482a, 0 0 ${60 + after * 120}px rgba(61,255,143,${0.35 + after * 0.4})`, whiteSpace: "nowrap" }}>
          End Turn
        </div>
      </div>
      <Shockwave t={t} at={hitAt} x={960} y={470} color={NEON.green} size={4} dur={0.7} width={18} />
      <Shockwave t={t} at={hitAt + 0.08} x={960} y={470} color="#ffffff" size={5.5} dur={0.8} width={8} />
      {coins.map((c, i) => {
        const p = (t - hitAt) / 1.6;
        if (p < 0 || p > 1) return null;
        const x = 960 + Math.cos(c.a) * c.v * p;
        const y = 470 + Math.sin(c.a) * c.v * p + 900 * p * p;
        return <Img key={i} src={miscSrc(c.comm ? "comms.png" : "tg.png")} style={{ position: "absolute", left: x - c.s / 2, top: y - c.s / 2, width: c.s, height: c.s, transform: `rotate(${c.spin * p}deg)`, opacity: 1 - p * 0.5 }} />;
      })}
      {lt < 3 && t < hitAt + 0.05 && <Cursor x={lerp(1700, 1010, cp)} y={lerp(1000, 500, cp)} scale={2.2} pressed={t > hitAt - 0.06} />}
      {dancers.map((d, i) => {
        const p = ease.outBack(clamp((t - danceAt - i * 0.05) / 0.35), 1.6);
        if (p <= 0) return null;
        const x = 960 + (i - 2) * 290;
        return <Ship key={i} color={d.color} unit={d.unit} scale={2.8} x={x} y={lerp(1300, 700, p)} transform={danceTransform(t, { amp: 30, deg: 18, squashAmt: 0.2, every: 0.5, offset: i % 2 ? 0.5 : 0 })} glow="rgba(61,255,143,.6)" glowSize={14} />;
      })}
    </Fill>
  );
};
