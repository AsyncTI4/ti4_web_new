import React from "react";
import { Fill, useBleed } from "../lib/stage";
import { Img } from "../lib/Img";
import { SceneProps } from "./types";
import { hideLeads } from "./common";
import { World } from "../components/World";
import { Board } from "../components/Board";
import { Ship } from "../components/Ship";
import { Starfield, Stars } from "../components/Backdrop";
import { TurnPanel } from "../components/TurnPanel";
import { formatTurn, turnSeconds } from "../components/TurnTimer";
import { CurvePath, PingChip, SparkleField } from "../fx/Effects";
import { LyingPhone } from "../components/Phone";
import { SleepingFlagship } from "../components/SleepingFlagship";
import { LINES, PINGS, beatPos, bt, kick, snare } from "../lib/timing";
import { clamp, ease, fract, lerp, rng } from "../lib/math";
import { bob, danceTransform, snapSway, spin, squash, sway } from "../lib/dance";
import { FONT } from "../lib/fonts";
import { NEON, UnitType, leaderSrc, miscSrc, tileSrc, usable } from "../lib/assets";
import { G, glowOf } from "../lib/game";
import { DROP_ROWS } from "../../palette";
import { hexPoints } from "../lib/hex";

const W = (l: number, w: number) => LINES[l].words[w].s;
export const TENDER_AT = W(20, 0) - 0.3;
export const BREAK_AT = bt(144);

/* ───────────── DROP · instrumental dance party ───────────── */
const ROWS: { y: number; unit: UnitType; scale: number; colors: readonly string[] }[] = DROP_ROWS.map((row, i) => ({
  ...row, y: [520, 690, 880][i], scale: [1.55, 1.75, 2.05][i],
}));

export const DropParty: React.FC<SceneProps> = ({ t, from }) => {
  const b = beatPos(t) - 128;
  const bar = Math.floor(b / 4);
  const k = kick(t);
  const sn = snare(t);
  const flip = bar % 2 ? 1 : -1;
  const camRot = flip * 2 * ease.outBack(clamp(fract(b / 4) * 4), 2) + (bar === 2 ? Math.sin(b * Math.PI / 2) * 4 : 0);
  // per-bar framing: wide → push in on the hero → wide swing
  const pushIn = bar === 1 ? ease.inOutCubic(clamp((b - 4) / 0.6)) * (1 - ease.inOutCubic(clamp((b - 7.4) / 0.6))) : 0;
  const camZoom = 1 + pushIn * 0.42;
  const camY = pushIn * -260;
  const out = clamp((t - (TENDER_AT - 0.15)) / 0.15);
  const hue = (Math.floor(b) * 47) % 360;
  return (
    <Fill style={{ background: `radial-gradient(120% 90% at 50% 10%, hsl(${280 + Math.sin(t) * 20} 70% 14%), #04020a 70%)`, overflow: "hidden" }}>
      <Fill style={{ transform: `rotate(${camRot}deg) scale(${(1.04 + k * 0.03) * camZoom}) translateY(${camY}px)`, transformOrigin: "50% 80%", opacity: 1 - out }}>
        <Stars t={t} drift={40} opacity={0.8} />
        <LightBeams t={t} />
        <HexFloor b={b} />
        <DiscoMecatol t={t} k={k} />
        <Spotlights t={t} />
        {ROWS.map((row, r) =>
          row.colors.map((c, i) => {
            if (r === 2 && i === 4) return null;
            const n = row.colors.length;
            const x = 960 + (i - (n - 1) / 2) * (r === 2 ? 190 : 200);
            let tf = "";
            if (bar === 0) {
              const side = (Math.floor(b) % 2 ? 1 : -1) * (r % 2 ? -1 : 1);
              const sp = ease.outBack(clamp(fract(b) * 2.5), 2);
              tf = `translateX(${lerp(-side, side, sp) * 34}px) translateY(${bob(t, 22)}px) rotate(${snapSway(t, 14, 1, r % 2 ? 1 : 0)}deg)`;
            } else if (bar === 1) {
              const ph = fract(b - i * 0.11 - r * 0.2);
              const hop = Math.sin(Math.PI * clamp(ph * 1.6)) * 70;
              const spinDeg = r === 2 && b >= 6 ? spin(t, 128 + 6, 2, 1) : 0;
              tf = `translateY(${-hop}px) rotate(${spinDeg + sway(t, 10, 0.5, i * 0.1)}deg)`;
            } else {
              const kickSide = (Math.floor(b * 2) % 2 ? 1 : -1) * (i % 2 ? 1 : -1);
              const slide = Math.sin((b / 2) * Math.PI) * 70 * (r % 2 ? -1 : 1);
              const [sx, sy] = squash(t, 0.22, 0.5);
              tf = `translateX(${slide}px) rotate(${kickSide * 26 * ease.outBack(clamp(fract(b * 2) * 3), 2)}deg) scale(${sx}, ${sy})`;
            }
            return <Ship key={`${r}-${i}`} color={c} unit={row.unit} x={x} y={row.y} scale={row.scale} transform={tf} glow={`hsl(${(hue + i * 40) % 360} 100% 60%)`} glowSize={8 + k * 14} />;
          }),
        )}
        <Ship color={G.hero.color} unit="dd_eyes" x={960} y={890} scale={2.9} transform={danceTransform(t, { amp: 40, deg: 22, squashAmt: 0.25, every: 0.5 })} glow={glowOf(G.hero.hex, 0.9)} glowSize={16 + k * 20} zIndex={5} />
        <LeaderPops t={t} />
        <Confetti t={t} from={from} />
      </Fill>
      <Fill style={{ background: `hsla(${hue},100%,60%,${sn * 0.12})`, mixBlendMode: "screen" }} />
    </Fill>
  );
};

const Confetti: React.FC<{ t: number; from: number }> = ({ t, from }) => {
  const r = rng(31);
  return (
    <>
      {Array.from({ length: 34 }, () => ({ x: r() * 1920, d: r(), s: 30 + r() * 30, sp: 0.6 + r() * 0.9, comm: r() > 0.55, rot: r() * 360 })).map((c, i) => {
        const y = ((c.d * 1300 + (t - from) * 330 * c.sp) % 1300) - 140;
        return <Img key={i} src={miscSrc(c.comm ? "comms.png" : "tg.png")} style={{ position: "absolute", left: c.x + Math.sin(t * 2 + i) * 50, top: y, width: c.s, height: c.s, transform: `rotate(${c.rot + t * 240 * c.sp}deg)`, opacity: 0.9 }} />;
      })}
    </>
  );
};

const DiscoMecatol: React.FC<{ t: number; k: number }> = ({ t, k }) => (
  <div style={{ position: "absolute", left: 960 - 150, top: 40, width: 300, height: 300, borderRadius: "50%", overflow: "hidden", transform: `scale(${1 + k * 0.06})`, boxShadow: `0 0 ${60 + k * 60}px rgba(255,255,255,.55), inset 0 0 40px rgba(0,0,0,.6)` }}>
    <Img src={tileSrc("112_Mecatol.png")} style={{ position: "absolute", left: -110, top: -95, width: 520, height: 450, transform: `rotate(${t * 40}deg)` }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)", backgroundSize: "22px 22px", backgroundPosition: `${(t * 60) % 22}px 0`, borderRadius: "50%", mixBlendMode: "overlay" }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.55), transparent 40%)" }} />
  </div>
);

const LightBeams: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 960 - 1400, top: 190 - 1400, width: 2800, height: 2800, borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, rgba(255,255,255,.08) 0deg 4deg, transparent 4deg 18deg)", transform: `rotate(${t * 25}deg)`, mixBlendMode: "screen", willChange: "transform" }} />
);

const Spotlights: React.FC<{ t: number }> = ({ t }) => (
  <>
    {[NEON.magenta, NEON.cyan, NEON.yellow, NEON.green].map((c, i) => {
      const ang = Math.sin(t * (0.9 + i * 0.23) + i * 1.7) * 32;
      return (
        <div key={i} style={{ position: "absolute", left: 300 + i * 440 - 160, top: -60, width: 320, height: 1300, transformOrigin: "50% 0", transform: `rotate(${ang}deg)`, clipPath: "polygon(44% 0, 56% 0, 100% 100%, 0 100%)", background: `linear-gradient(180deg, ${c}cc, ${c}22 70%, transparent)`, mixBlendMode: "screen", filter: "blur(10px)", opacity: 0.55, willChange: "transform" }} />
      );
    })}
  </>
);

const HexFloor: React.FC<{ b: number }> = ({ b }) => {
  const cells: React.ReactNode[] = [];
  const beat = Math.floor(b);
  for (let row = 0; row < 7; row++) {
    for (let col = -8; col <= 8; col++) {
      const x = col * 120 + (row % 2 ? 60 : 0);
      const y = row * 70;
      const pattern = (beat % 4 === 0) ? (col + row) % 2 === 0 : beat % 4 === 1 ? Math.abs(col) === (beat % 8) : beat % 4 === 2 ? row === beat % 7 : (Math.abs(col) + row + beat) % 3 === 0;
      const lit = pattern ? Math.exp(-fract(b) * 2.5) : 0;
      const hue = (col * 25 + row * 40 + beat * 60) % 360;
      cells.push(<polygon key={`${row}-${col}`} points={hexPoints(0.33)} transform={`translate(${x} ${y})`} fill={`hsla(${hue},100%,60%,${0.06 + lit * 0.55})`} stroke={`hsla(${hue},100%,70%,${0.35 + lit * 0.5})`} strokeWidth={3} />);
    }
  }
  return (
    <div style={{ position: "absolute", left: 0, top: 470, width: 1920, height: 700, perspective: 900 }}>
      <svg viewBox="-1000 -60 2000 560" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "rotateX(58deg) scale(1.6)", transformOrigin: "50% 0" }}>
        {cells}
      </svg>
    </div>
  );
};

const FALLBACK_HEROES = ["solhero", "letnevhero", "muaathero", "jolnarhero", "mentakhero", "saarhero", "hacanhero", "naaluhero"].map(leaderSrc);
/** Hero portraits: the cast's own first, then base-game stand-ins. */
export const castHeroes = () => [...new Set([...G.six.map((p) => p.leaders.hero).filter(usable), ...FALLBACK_HEROES.filter(usable)])];
const LeaderPops: React.FC<{ t: number }> = ({ t }) => {
  const heroes = castHeroes();
  return (
  <>
    {[0, 1, 2, 3].map((i) => {
      const at = bt(128 + i * 4);
      const p = (t - at) / 1.6;
      if (p < 0 || p > 1) return null;
      const left = i % 2 === 0;
      const s = ease.outBack(clamp(p * 5), 2) * (1 - ease.inQuad(clamp((p - 0.7) / 0.3)));
      return (
        <div key={i} style={{ position: "absolute", left: left ? 60 : 1920 - 60 - 250, top: 120 + (i > 1 ? 120 : 0), width: 250, height: 290, transform: `scale(${s}) rotate(${left ? -6 : 6}deg)`, clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)", background: "#000" }}>
          <Img src={heroes[i % heroes.length]} style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated" }} />
        </div>
      );
    })}
  </>
  );
};

/* ───────────── "Cruiser… baby… One day they'll move you…" ───────────── */
export const Tender: React.FC<SceneProps> = ({ t, from, to }) => {
  const bleed = useBleed();
  const lt = t - from;
  const enter = ease.outCubic(clamp(lt / 0.4));
  const out = clamp((t - (to - 0.25)) / 0.25);
  const { dd: DD_POS, cruiser: CRUISER_POS, crushPos, afk } = G;
  const cam = { x: CRUISER_POS.x - 60 + lt * 10, y: CRUISER_POS.y + 20, zoom: lerp(2.9, 3.3, lt / 2.8) };
  const moveAt = W(21, 3);
  const r = rng(12);
  const bokeh = Array.from({ length: 18 }, () => ({ x: r() * 1920, y: r() * 1080, s: 40 + r() * 140, v: 10 + r() * 30, c: r() > 0.5 ? "255,200,120" : "255,120,200" }));
  return (
    <Fill style={{ background: "#0a0503", opacity: 1 - out }}>
      <Fill style={{ filter: "sepia(.35) saturate(1.3) brightness(1.05) contrast(1.05)", opacity: enter }}>
        <Starfield t={t} brightness={0.6} hue={-30} />
        <Fill style={{ filter: "blur(3px) brightness(.6)" }}>
          <World cam={cam}>
            <Board hideUnits={hideLeads()} showStats={false} hidden={new Set([crushPos])} />
          </World>
        </Fill>
        <World cam={cam}>
          <Board hideUnits={new Set([crushPos])} showStats={false} showLabels={false} hidden={new Set(G.tiles.map((x) => x.pos).filter((p) => p !== crushPos))} />
          <div style={{ position: "absolute", left: CRUISER_POS.x - 200, top: CRUISER_POS.y - 200, width: 400, height: 400, background: "radial-gradient(closest-side, rgba(255,210,140,.45), transparent)", mixBlendMode: "screen" }} />
          <CurvePath t={t} pts={[[CRUISER_POS.x, CRUISER_POS.y], [CRUISER_POS.x - 60, CRUISER_POS.y + 120], [DD_POS.x + 160, DD_POS.y - 40], [DD_POS.x + 40, DD_POS.y]]} reveal={ease.inOutCubic(clamp((t - moveAt) / 0.8))} color="#ffd27a" width={4} />
          <Ship color={afk.color} unit="ca" x={CRUISER_POS.x} y={CRUISER_POS.y + Math.sin(t * 1.6) * 4} scale={2.1} transform={`rotate(${Math.sin(t * 0.9) * 4}deg)`} glow={glowOf(afk.hex, 0.9)} glowSize={18} />
          <SparkleField t={t} seed={41} count={10} w={260} h={220} x={CRUISER_POS.x} y={CRUISER_POS.y} color="#ffe6b0" size={9} />
        </World>
        {bokeh.map((bk, i) => (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${bk.x + Math.sin(t * 0.5 + i) * 30}px, ${bk.y - lt * bk.v}px)`, willChange: "transform", width: bk.s, height: bk.s, borderRadius: "50%", background: `radial-gradient(circle, rgba(${bk.c},.35), rgba(${bk.c},.12) 60%, transparent 70%)`, filter: "blur(2px)", mixBlendMode: "screen" }} />
        ))}
      </Fill>
      <div style={{ position: "absolute", left: -bleed.x, right: -bleed.x, top: -bleed.y, height: (110 + bleed.y) * enter, background: "#000" }} />
      <div style={{ position: "absolute", left: -bleed.x, right: -bleed.x, bottom: -bleed.y, height: (110 + bleed.y) * enter, background: "#000" }} />
    </Fill>
  );
};

/* ───────────── breakdown · (ping) (ping) (ping) · "It's still their turn" ───────────── */
export const Breakdown: React.FC<SceneProps> = ({ t, from }) => {
  const lt = t - from;
  const stillAt = W(22, 0);
  const turnAt = W(22, 3);
  const pingIdx = PINGS.filter((p) => t >= p).length;
  const dim = 0.55 + pingIdx * 0.1;
  const lastPing = PINGS[pingIdx - 1] ?? -10;
  const pk = Math.exp(-(t - lastPing) * 7) * (pingIdx > 0 ? 1 : 0);
  const zoomIn = ease.inOutCubic(clamp((t - stillAt + 0.1) / 0.8));
  const rolled = t >= turnAt;
  const timer = rolled ? "7d 00:00:00" : formatTurn(Math.min(7 * 86400 - 1, turnSeconds(t)));
  const panelScale = lerp(2.3, 4.1, zoomIn) * (1 + pk * 0.03);
  const shakeX = Math.sin(t * 80) * 10 * pk;
  return (
    <Fill style={{ background: "#04050b" }}>
      <Fill style={{ transform: `scale(1.15) rotate(${lt * 2}deg)`, opacity: 1 - pingIdx * 0.18, willChange: "transform, opacity" }}>
        <Fill style={{ filter: "blur(14px) brightness(0.45)" }}>
          <World cam={{ x: 0, y: 0, zoom: 0.55 }}>
            <Board showLabels={false} />
          </World>
        </Fill>
      </Fill>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - zoomIn, transform: `translateX(${zoomIn * 300}px)` }}>
        <div style={{ position: "absolute", left: 1000, top: 760, width: 1000, height: 380, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,210,120,.10), transparent)" }} />
        <SleepingFlagship t={t} x={1660} y={860} scale={3} opacity={0.9} color={G.afk.color} glow={glowOf(G.afk.hex, 0.55)} />
        <LyingPhone t={t} x={1240} y={915} w={260} pings={PINGS} />
      </div>
      <div style={{ position: "absolute", left: lerp(330, 960, zoomIn), top: lerp(540, 520, zoomIn), transform: `translate(-50%, -50%) translate(${shakeX}px, ${lerp(0, 230, zoomIn) * 0}px) scale(${panelScale})`, transformOrigin: zoomIn > 0 ? "50% 64%" : "50% 50%" }}>
        <TurnPanel t={t} timer={timer} actingPulse={pk} />
      </div>
      {PINGS.map((p, i) => (
        <React.Fragment key={i}>
          {t >= p && <PingChip t={t} at={p} text={G.mention} x={[1340, 1420, 1250][i]} y={[260, 470, 720][i]} count={[47, 48, 49][i]} size={[0.55, 0.75, 1.0][i] * (1 - zoomIn)} rot={[6, -5, 3][i]} />}
          {t >= p && <div style={{ position: "absolute", left: [1340, 1420, 1250][i], top: [180, 390, 620][i] - 60, transform: `translateX(-50%) scale(${ease.outBack(clamp((t - p) / 0.2), 3)})`, fontFamily: FONT.mono, fontSize: [34, 46, 64][i], color: "#ffd0d4", opacity: Math.exp(-(t - p) * 1.5) * (1 - zoomIn), letterSpacing: "0.2em" }}>{i === 2 ? "PING" : "ping"}</div>}
        </React.Fragment>
      ))}
      <Fill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,.85))", opacity: dim }} />
    </Fill>
  );
};
