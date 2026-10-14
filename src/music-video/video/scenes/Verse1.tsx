import React from "react";
import { Fill } from "../lib/stage";
import { Img } from "../lib/Img";
import { SceneProps } from "./types";
import { Whip, hideLeads } from "./common";
import { World } from "../components/World";
import { Board } from "../components/Board";
import { Ship } from "../components/Ship";
import { Starfield, Stars } from "../components/Backdrop";
import { DiscordWindow, Mention, Msg } from "../components/Discord";
import { ProfileCard } from "../components/ProfileCard";
import { ActivationGlow, CommandTokenDrop, Cursor, HeartBurst, Shockwave, SparkleField, Stamp } from "../fx/Effects";
import { LINES, beatLen, bt, kick } from "../lib/timing";
import { clamp, ease, lerp } from "../lib/math";
import { danceTransform, bob, squash, snapSway } from "../lib/dance";
import { FONT } from "../lib/fonts";
import { NEON, UnitType, botSrc, spriteOf, unitSrc } from "../lib/assets";
import { G, duskOf, glowOf, nameColorOf, neonOf } from "../lib/game";
import { ringOf } from "../lib/hex";

const W = (l: number, w: number) => LINES[l].words[w].s;
const mapDance = (t: number) => ({ index, x }: { index: number; x: number }) =>
  danceTransform(t, { amp: 6, deg: 5, squashAmt: 0.08, offset: (index * 0.13 + x * 0.0004) % 1 });

/* ───────────── 1A · "Destroyer on the board, been sittin' here all week" ───────────── */
export const V1Destroyer: React.FC<SceneProps> = ({ t }) => {
  const land = bt(0);
  const dropStart = W(0, 0);
  const k = kick(t);
  const { dd: DD_POS, hero, heroPos } = G;
  const heroNeon = neonOf(hero.hex);
  const zoom = lerp(2.25, 2.6, ease.inOutCubic(t / 4.4)) * (1 + k * 0.025);
  const lit = clamp((t - land) / 0.25);
  const shake = Math.exp(-Math.max(0, t - land) * 8) * (t > land ? 1 : 0);
  const cam = { x: DD_POS.x + 10, y: DD_POS.y + 25, zoom, shakeX: Math.sin(t * 90) * 14 * shake, shakeY: Math.cos(t * 77) * 14 * shake };

  // destroyer drop-in then beat dancing
  const fallP = clamp((t - dropStart) / (land - dropStart));
  const fallY = t < land ? -720 * (1 - ease.inQuad(fallP)) : 0;
  const stretch = t < land ? 1 + 0.5 * ease.inQuad(fallP) : 1;
  const landSquash = t >= land ? Math.exp(-(t - land) * 10) * 0.35 : 0;
  const [sx, sy] = squash(t, 0.12);
  const ddTf = t < land
    ? `translateY(${fallY}px) scale(${1 / Math.sqrt(stretch)}, ${stretch})`
    : `translateY(${bob(t, 10)}px) rotate(${snapSway(t, 6)}deg) scale(${sx * (1 + landSquash)}, ${sy * (1 - landSquash)})`;

  return (
    <Whip t={t} outAt={4.26} dir={1}>
      <Fill style={{ background: "#03050b" }}>
        <Starfield t={t} brightness={0.45 + lit * 0.4} />
        <Stars t={t} drift={14} opacity={0.6} />
        <Fill style={{ opacity: 0.25 + lit * 0.75 }}>
          <World cam={cam}>
            <Board hideUnits={hideLeads()} dance={mapDance(t)} tileFilter={(pos) => (pos === heroPos ? undefined : "brightness(0.55) saturate(0.8)")} rim={(pos) => (pos === heroPos && t > land ? { a: 0.25 + k * 0.75, color: heroNeon } : null)} />
            {t >= dropStart && <Ship color={hero.color} unit="dd_eyes" x={DD_POS.x} y={DD_POS.y} scale={2.3} transform={ddTf} glow={glowOf(hero.hex, 0.7)} glowSize={14} />}
            <Shockwave t={t} at={land} x={DD_POS.x} y={DD_POS.y + 30} color={heroNeon} size={1.4} dur={0.55} width={8} />
            <Shockwave t={t} at={land + 0.06} x={DD_POS.x} y={DD_POS.y + 30} color="#ffffff" size={2.0} dur={0.7} width={4} />
          </World>
        </Fill>
        <ColdOpen t={t} />
        <WeekCalendar t={t} />
      </Fill>
    </Whip>
  );
};

const ColdOpen: React.FC<{ t: number }> = ({ t }) => {
  if (t > 1.2) return null;
  const text = `${G.tag} · ROUND ${G.round} · ${G.cast.phase}`;
  const n = Math.floor(clamp(t / 0.55) * text.length);
  const out = clamp((t - 0.95) / 0.2);
  const flick = t < 0.7 && Math.floor(t * 40) % 7 === 0 ? 0.4 : 1;
  return (
    <Fill style={{ alignItems: "center", justifyContent: "center", opacity: (1 - out) * flick }}>
      <Img src={botSrc("emojis_other_AsyncTI4Logo.png")} style={{ width: 150, height: 150, marginBottom: 24, filter: "drop-shadow(0 0 30px rgba(80,140,255,.8))", transform: `scale(${1 + out * 0.3})` }} />
      <div style={{ fontFamily: FONT.display, fontSize: 40, letterSpacing: "0.22em", color: NEON.cyan, textShadow: `0 0 18px ${NEON.cyan}` }}>
        {text.slice(0, n)}<span style={{ opacity: Math.floor(t * 8) % 2 ? 1 : 0 }}>▌</span>
      </div>
    </Fill>
  );
};

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const WeekCalendar: React.FC<{ t: number }> = ({ t }) => {
  const start = W(0, 4) - 0.02; // "been"
  if (t < start - 0.3 || t > 4.6) return null;
  const step = beatLen(t) / 2;
  const n = clamp(Math.floor((t - start) / step), 0, 6);
  const fp = clamp(((t - start) / step) - Math.floor((t - start) / step));
  const enter = ease.outBack(clamp((t - (start - 0.3)) / 0.3), 1.8);
  const x = 1420;
  const y = 170;
  const page = (i: number, extra: React.CSSProperties = {}) => (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#f8f6ef,#e4e0d6)", borderRadius: 14, boxShadow: "0 10px 30px rgba(0,0,0,.45)", overflow: "hidden", ...extra }}>
      <div style={{ height: 64, background: i === 6 ? "#e2364a" : "#1d2333", color: "white", fontFamily: FONT.display, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: "0.12em" }}>{DAYS[i]}</div>
      <div style={{ fontFamily: FONT.display, fontSize: 130, lineHeight: "150px", textAlign: "center", color: "#1b1b22" }}>{i + 1}</div>
      <div style={{ position: "absolute", bottom: 12, width: "100%", textAlign: "center", fontFamily: FONT.mono, fontSize: 18, color: "#6a6a75" }}>still waiting…</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 250, height: 280, transform: `scale(${enter * 1.35}) rotate(${4 + Math.sin(t * 3) * 1.5}deg)`, perspective: 900 }}>
      <div style={{ position: "absolute", top: -14, left: 40, right: 40, height: 28, display: "flex", justifyContent: "space-between", zIndex: 3 }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 14, height: 28, borderRadius: 7, background: "linear-gradient(#bbb,#666)" }} />)}
      </div>
      {page(Math.min(6, n))}
      {n < 6 && t >= start && page(n, { transformOrigin: "50% 0%", transform: `rotateX(${ease.inCubic(fp) * 100}deg) translateY(${ease.inQuad(fp) * -60}px)`, opacity: 1 - ease.inQuad(fp) })}
    </div>
  );
};

/* ───────────── 1B · "My opponent's AFK, baby, they won't even speak" ───────────── */
export const V1Afk: React.FC<SceneProps> = ({ t }) => {
  const lt = t - 4.26;
  const k = kick(t);
  const { hero, afk } = G;
  const me = { author: hero.name, avatar: unitSrc(hero.color, "dd_eyes"), color: nameColorOf(hero.hex) };
  const msgs: Msg[] = [
    { at: W(1, 1), ...me, text: "hey", time: "Monday at 9:12 PM", h: 70 },
    { at: W(1, 2), ...me, text: "u there?", cont: true, h: 34 },
    { at: W(1, 3), ...me, text: <>it's your turn <span style={{ fontFamily: "Noto Emoji" }}>👀</span></>, cont: true, h: 34 },
    { at: W(1, 5), ...me, text: <>{"<"}3 <Mention>{G.mention}</Mention></>, cont: true, h: 34 },
  ];
  const [dusk, night] = duskOf(afk.hex);
  const typingOn = (t > W(1, 4) && t < W(1, 6) - 0.1) || (t > W(1, 6) + 0.12 && t < W(1, 7) - 0.04);
  const lionIn = ease.outBack(clamp(lt / 0.5), 1.3);
  return (
    <Whip t={t} inAt={4.26} outAt={8.12} dir={1}>
      <Fill style={{ background: `radial-gradient(120% 90% at 75% 60%, ${dusk} 0%, ${night} 45%, #04030a 100%)` }}>
        <Img src={afk.icon} style={{ position: "absolute", right: -120, top: -160, width: 1100, opacity: 0.07, transform: `rotate(${t * 6}deg)` }} />
        <Fill style={{ backgroundImage: `repeating-linear-gradient(115deg, ${glowOf(afk.hex, 0.05)} 0 2px, transparent 2px 22px)` }} />
        <div style={{ position: "absolute", right: 150, top: 118, transform: `translateX(${(1 - lionIn) * 700}px) rotate(${2.5 - (1 - lionIn) * 8}deg) scale(${1 + k * 0.012})`, transformOrigin: "50% 0%" }}>
          <ProfileCard t={t} scale={1.55} />
        </div>
        <DiscordWindow
          t={t} scale={1.55} width={820} height={640} variant="dm" title={afk.name} messages={msgs} dmIntro={{ avatar: afk.icon }}
          typing={typingOn ? { from: 0, to: 999, name: afk.name } : null}
          style={{ left: 80, top: 190, transform: `translateY(${(1 - ease.outCubic(clamp(lt / 0.35))) * 80}px) rotate(-1.5deg)` }}
        />
        <Stamp t={t} at={W(1, 2)} text="AFK" x={1360} y={600} size={170} rot={-14} />
        {t > W(1, 7) - 0.05 && <Stamp t={t} at={W(1, 7) - 0.05} text="NO REPLY" x={560} y={250} size={70} rot={6} color="#ffb020" />}
      </Fill>
    </Whip>
  );
};

/* ───────────── 1C · "Cruiser in the next hex, lookin' so fine" ───────────── */
export const V1Cruiser: React.FC<SceneProps> = ({ t }) => {
  const a = 8.12;
  const { dd: DD_POS, cruiser: CRUISER_POS, afk, heroPos, crushPos } = G;
  const afkNeon = neonOf(afk.hex);
  const panP = ease.inOutCubic(clamp((t - a) / 0.85));
  const fine = clamp((t - W(2, 5)) / 1.6);
  const k = kick(t);
  const zoom = lerp(2.0, 2.45, panP) + ease.inOutCubic(fine) * 0.35;
  const cx = lerp(DD_POS.x, CRUISER_POS.x - 40, panP);
  const cy = lerp(DD_POS.y, CRUISER_POS.y + 10, panP);
  const cam = { x: cx, y: cy, zoom: zoom * (1 + k * 0.015), rot: ease.inOutCubic(fine) * -2.5 };
  const reveal = clamp((t - (a + 0.55)) / 0.5);
  const float = Math.sin(t * 2.2) * 6;
  const beatsHearts = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => bt(15 + i) );
  const glintAt = [W(2, 5), W(2, 7)];
  return (
    <Whip t={t} inAt={a} dir={-1} dur={0.18}>
      <Fill style={{ background: "#03050b" }}>
        <Starfield t={t} brightness={0.75} hue={-15} />
        <Stars t={t} drift={10} />
        <World cam={cam}>
          <Board hideUnits={hideLeads()} dance={mapDance(t)} tileFilter={(pos) => (pos === crushPos ? `brightness(${1 + reveal * 0.15})` : `brightness(${0.75 - fine * 0.25}) saturate(${0.9 - fine * 0.4})`)} rim={(pos) => (pos === crushPos ? { a: reveal * (0.3 + k * 0.7), color: afkNeon } : pos === heroPos ? { a: 0.2 + k * 0.4, color: "#ff4fa8" } : null)} />
          <Ship color={G.hero.color} unit="dd_eyes" x={DD_POS.x} y={DD_POS.y} scale={2.3} transform={`translateY(${bob(t, 16, 0.5)}px) rotate(${snapSway(t, 10, 0.5)}deg)`} glow="rgba(255,90,170,0.8)" glowSize={10 + k * 16} />
          <HeartBurst t={t} emits={beatsHearts} x={DD_POS.x + 20} y={DD_POS.y - 50} spread={40} size={34} rise={200} seed={3} />
          <div style={{ position: "absolute", left: CRUISER_POS.x - 260, top: CRUISER_POS.y - 340, width: 520, height: 520, opacity: reveal, background: `radial-gradient(closest-side, ${glowOf(afk.hex, 0.55)}, ${glowOf(afk.hex, 0.18)} 55%, transparent)`, mixBlendMode: "screen" }} />
          <SparkleField t={t} seed={11} count={16} w={330} h={260} x={CRUISER_POS.x} y={CRUISER_POS.y} size={14} intensity={reveal} />
          <GlintShip t={t} x={CRUISER_POS.x} y={CRUISER_POS.y + float} scale={2.5} glints={glintAt} reveal={reveal} color={afk.color} glow={glowOf(afk.hex, 0.9)} />
        </World>
        <Spotlight t={t} a={reveal} />
        <UnitDossier t={t} at={W(2, 5) - 0.05} />
      </Fill>
    </Whip>
  );
};

/** Ship with a specular glint sweeping across its pixels: a brightened copy of the sprite, clipped to a moving band
 * (no mask-image, which would need CORS from the sprite CDN). */
export const GlintShip: React.FC<{ t: number; x: number; y: number; scale: number; glints: number[]; reveal?: number; color: string; unit?: UnitType; glow?: string }> = ({ t, x, y, scale, glints, reveal = 1, color, unit = "ca", glow = "rgba(255,220,80,.9)" }) => {
  const w = 67 * scale;
  const { src, native } = spriteOf(color, unit);
  const rendering = native ? "pixelated" : "auto";
  const g = glints.map((at) => (t - at) / 0.45).find((p) => p >= 0 && p <= 1);
  const band = g === undefined ? 0 : g * 140 - 30;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - w / 2, width: w, height: w, transform: `scale(${0.6 + 0.4 * ease.outBack(reveal)}) rotate(${Math.sin(t * 1.3) * 3}deg)`, opacity: clamp(reveal * 2) }}>
      <Img src={src} style={{ position: "absolute", inset: 0, width: w, height: w, filter: `drop-shadow(0 0 18px ${glow})`, imageRendering: rendering }} />
      {g !== undefined && (
        <Img src={src} style={{ position: "absolute", inset: 0, width: w, height: w, imageRendering: rendering, filter: "brightness(2.6) saturate(0.3)", clipPath: `polygon(${band - 12}% 0, ${band + 4}% 0, ${band - 14}% 100%, ${band - 30}% 100%)`, mixBlendMode: "screen" }} />
      )}
    </div>
  );
};

const Spotlight: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <Fill style={{ opacity: a * 0.55, mixBlendMode: "screen", pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 760, top: -100, transform: `translateX(${Math.sin(t * 1.4) * 20}px)`, willChange: "transform", width: 420, height: 900, clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)", background: "linear-gradient(180deg, rgba(255,245,200,.85), rgba(255,220,120,.18) 70%, transparent)", filter: "blur(18px)" }} />
  </Fill>
);

const UnitDossier: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const p = ease.outCubic(clamp((t - at) / 0.35));
  if (p <= 0) return null;
  const rows: [string, string][] = [["COST", "2"], ["COMBAT", "7"], ["MOVE", "2"], ["CAPACITY", "0"]];
  return (
    <div style={{ position: "absolute", right: 90, top: 210, width: 470, transform: `translateX(${(1 - p) * 520}px)`, background: "linear-gradient(180deg,#151517,#101012)", border: "1px solid rgba(190,190,196,.2)", borderRadius: 6, boxShadow: `0 30px 80px rgba(0,0,0,.6), 0 0 0 1px ${glowOf(G.afk.hex, 0.25)}`, overflow: "hidden", fontFamily: FONT.display }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", background: `linear-gradient(90deg, ${glowOf(G.afk.hex, 0.16)}, transparent)`, borderBottom: "1px solid rgba(190,190,196,.14)" }}>
        <Img src={G.afk.icon} style={{ width: 56, height: 56 }} />
        <div>
          <div style={{ color: "#f1f3f5", fontSize: 34, letterSpacing: "0.06em" }}>CRUISER</div>
          <div style={{ color: "#868e96", fontSize: 16, letterSpacing: "0.12em" }}>{G.afk.factionName.toUpperCase()} · SYSTEM {G.crushPos}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: "14px 18px", gap: 8 }}>
        {rows.map(([k2, v]) => (
          <div key={k2} style={{ textAlign: "center" }}>
            <div style={{ color: "#868e96", fontSize: 13, letterSpacing: "0.1em" }}>{k2}</div>
            <div style={{ color: "#f1f3f5", fontSize: 38 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px 18px", borderTop: "1px solid rgba(190,190,196,.12)" }}>
        <span style={{ color: "#868e96", fontSize: 18, letterSpacing: "0.12em" }}>LOOKIN'</span>
        <span style={{ color: neonOf(G.afk.hex), fontSize: 40, textShadow: `0 0 18px ${neonOf(G.afk.hex)}`, transform: `scale(${1 + Math.max(0, Math.sin(t * 12)) * 0.05})` }}>SO FINE ✦</span>
      </div>
    </div>
  );
};

/* ───────────── 1D · "If they'd just activate you, girl, you'd be mine" + build ───────────── */
export const V1Activate: React.FC<SceneProps> = ({ t }) => {
  const a = 12.45;
  const { dd: DD_POS, cruiser: CRUISER_POS, hero, afk } = G;
  const buildStart = bt(28);
  const mid = { x: (DD_POS.x + CRUISER_POS.x) / 2, y: (DD_POS.y + CRUISER_POS.y) / 2 + 30 };
  const k = kick(t);
  // zoom-out in 8th-note steps during the drum fill
  const steps = Array.from({ length: 8 }, (_, i) => bt(28 + i * 0.5));
  let zoomTarget = lerp(1.55, 1.7, clamp((t - a) / 2.5));
  let stepIdx = -1;
  steps.forEach((s, i) => { if (t >= s) stepIdx = i; });
  if (stepIdx >= 0) {
    const zs = [1.45, 1.2, 1.0, 0.82, 0.68, 0.57, 0.49, 0.43];
    const prev = stepIdx === 0 ? 1.7 : zs[stepIdx - 1];
    const sp = ease.outExpo(clamp((t - steps[stepIdx]) / 0.18));
    zoomTarget = lerp(prev, zs[stepIdx], sp);
  }
  const buildP = clamp((t - buildStart) / (bt(32) - buildStart));
  const cam = { x: lerp(mid.x, 0, ease.inOutCubic(buildP)), y: lerp(mid.y, 30, ease.inOutCubic(buildP)), zoom: zoomTarget * (1 + k * 0.02), rot: Math.sin(t * 0.8) * 1.2 * (1 - buildP) };
  const glowOn = t > W(3, 3) && !(t > W(3, 5) && t < W(3, 5) + 0.12) && !(t > W(3, 5) + 0.2 && t < W(3, 5) + 0.26);
  const glowA = glowOn ? 0.85 + 0.15 * Math.sin(t * 20) : 0;
  const mineAt = W(3, 8);
  const jump = t > mineAt ? Math.exp(-(t - mineAt) * 4) * Math.sin(clamp((t - mineAt) / 0.5) * Math.PI) : 0;
  const ringLit = (pos: string) => {
    if (stepIdx < 0) return null;
    const r = ringOf(pos);
    const litStep = r * 2;
    if (stepIdx < litStep) return null;
    const p = clamp((t - steps[Math.min(litStep, 7)]) / 0.3);
    return { a: 0.35 + 0.65 * (1 - p) + buildP * 0.4, color: [NEON.cyan, NEON.magenta, NEON.yellow, NEON.green, NEON.cyan][r] };
  };
  // cursor path toward the activate button
  const btn = { x: 1260, y: 300 };
  const cp = ease.inOutCubic(clamp((t - W(3, 0)) / 0.7));
  const tremble = t > W(3, 3) ? Math.sin(t * 61) * 3 + Math.sin(t * 37) * 2 : 0;
  const cur = { x: lerp(1900, btn.x + 60, cp) + tremble, y: lerp(820, btn.y + 22, cp) + tremble * 0.7 };
  const uiOut = clamp((t - buildStart) / 0.2);
  return (
    <Fill style={{ background: "#03050b" }}>
      <Starfield t={t} brightness={0.75 + buildP * 0.4} hue={buildP * 40} />
      <Stars t={t} drift={10} warp={buildP * 0.8} />
      <World cam={cam}>
        <Board hideUnits={hideLeads()} dance={mapDance(t)} rim={ringLit} />
        <ActivationGlow x={CRUISER_POS.x} y={CRUISER_POS.y} a={glowA * (1 - uiOut)} />
        <Ship color={afk.color} unit="ca" x={CRUISER_POS.x} y={CRUISER_POS.y + Math.sin(t * 2.2) * 5} scale={2.2} transform={`rotate(${Math.sin(t * 1.3) * 3}deg)`} glow={glowOf(afk.hex, 0.85)} glowSize={14} />
        <CommandTokenDrop t={t} at={W(3, 3)} x={CRUISER_POS.x - 95} y={CRUISER_POS.y - 40} color={afk.color} icon={afk.icon} dur={1.4} stallAt={0.42 + Math.sin(t * 40) * 0.01} />
        <Ship color={hero.color} unit="dd_eyes" x={DD_POS.x} y={DD_POS.y} scale={2.2} transform={`translateY(${bob(t, 10) - jump * 120}px) rotate(${snapSway(t, 7) + jump * 20}deg) scale(${1 + jump * 0.5})`} glow={glowOf(hero.hex, 0.7)} glowSize={12} />
        <HeartBurst t={t} emits={[mineAt, mineAt + 0.05, mineAt + 0.1, mineAt + 0.16, mineAt + 0.22, mineAt + 0.3]} x={DD_POS.x} y={DD_POS.y - 40} spread={150} size={50} rise={320} seed={9} />
        <Shockwave t={t} at={mineAt} x={DD_POS.x} y={DD_POS.y} color="#ff4fa8" size={1.6} />
      </World>
      <div style={{ position: "absolute", left: btn.x - 230, top: btn.y - 10, opacity: (t > W(3, 0) ? clamp((t - W(3, 0)) / 0.2) : 0) * (1 - uiOut), transform: `scale(${1 + (t > W(3, 3) ? Math.sin(t * 30) * 0.01 : 0)})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 26px", background: "linear-gradient(180deg,#1b2436,#121a2c)", border: "1px solid rgba(103,232,249,.55)", borderRadius: 6, boxShadow: glowOn ? "0 0 30px rgba(103,232,249,.55)" : "0 10px 30px rgba(0,0,0,.5)", fontFamily: FONT.display, color: "#e6f7ff", fontSize: 28, letterSpacing: "0.1em" }}>
          <span style={{ color: NEON.cyan }}>▶</span> TACTICAL ACTION · ACTIVATE {G.crushPos}
        </div>
        <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: 18, color: "#93c5fd", opacity: 0.85 }}>awaiting {afk.name}…</div>
      </div>
      {uiOut < 1 && t > W(3, 0) && <Cursor x={cur.x} y={cur.y} scale={1.3} />}
    </Fill>
  );
};
