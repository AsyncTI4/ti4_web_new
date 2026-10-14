import React from "react";
import { Fill, useBleed } from "../lib/stage";
import { Img } from "../lib/Img";
import { SceneProps } from "./types";
import { Whip, hideLeads } from "./common";
import { World } from "../components/World";
import { Board } from "../components/Board";
import { Ship } from "../components/Ship";
import { Starfield, Stars } from "../components/Backdrop";
import { BannerEmbed, DiscordWindow, Mention, Msg } from "../components/Discord";
import { BigType, Marquee } from "../components/KineticText";
import { CurvePath, Glitch, HeartBurst, PingChip, Shockwave, SparkleField, Stamp } from "../fx/Effects";
import { LINES, beatPos, bt, kick } from "../lib/timing";
import { bezier, clamp, ease, fract, hash, lerp } from "../lib/math";
import { bob, danceTransform, sway } from "../lib/dance";
import { FONT } from "../lib/fonts";
import { DISCORD, NEON, botSrc, unitSrc, usable } from "../lib/assets";
import { ringOf } from "../lib/hex";
import { G, glowOf, nameColorOf, neonOf, roundWord } from "../lib/game";
import { CHOIR } from "../../palette";
import type { CastPlayer } from "../../cast";

type V = 1 | 2;
const L = (v: V) => (v === 1 ? { a: 4, b: 5, c: 6, d: 7, cb: 32 } : { a: 16, b: 17, c: 18, d: 19, cb: 96 });
const W = (l: number, w: number) => LINES[l].words[w].s;
const RING_COLORS = [NEON.yellow, NEON.magenta, NEON.cyan, NEON.green, NEON.violet];

const partyDance = (t: number, energy: number) => ({ index, x, y, unit }: { index: number; x: number; y: number; unit: string }) => {
  const off = fract(index * 0.37 + (x + y) * 0.0007);
  const big = unit === "ws" || unit === "fs" || unit === "dn";
  return danceTransform(t, { amp: (big ? 10 : 16) * energy, deg: (big ? 6 : 12) * energy, squashAmt: 0.16 * energy, offset: Math.round(off * 2) / 2 });
};

/* ───────────── "Ping ping, where'd my opponent go?" — board drop + searchlight ───────────── */
const ChorusBoard: React.FC<SceneProps & { v: V }> = ({ t, v }) => {
  const { a, cb } = L(v);
  const drop = bt(cb);
  const k = kick(t);
  const dropP = clamp((t - drop) / 0.5);
  const tilt = v === 2 ? lerp(0, 46, ease.outCubic(dropP)) : 0;
  const findStart = W(a, 2);
  const findP = ease.inOutCubic(clamp((t - findStart) / (W(a, 5) - findStart + 0.2)));
  const seat = G.afkSeat;
  const camZoom = (v === 1 ? lerp(0.43, 0.5, ease.outExpo(dropP)) : lerp(0.43, 0.62, ease.outExpo(dropP))) * (1 + k * 0.03) + findP * (v === 1 ? 0.12 : 0.05);
  const cam = {
    x: lerp(0, seat.x * 0.45, findP), y: lerp(30, seat.y * 0.45 + 30, findP) + (v === 2 ? 150 : 0),
    zoom: camZoom, rot: v === 2 ? (t - drop) * 5 : Math.sin(t * 0.7) * 1.5, tilt,
  };
  const wave = fract(beatPos(t)) * 4.5;
  const bar = Math.floor(beatPos(t) / 4);
  const rim = (pos: string) => {
    if (t < drop) return null;
    const r = ringOf(pos);
    const aV = Math.exp(-((wave - r) ** 2) * 2.2) * (0.5 + k * 0.5);
    return { a: aV + (pos === G.afkHomePos && findP > 0.9 ? 0.8 : 0), color: RING_COLORS[(r + bar) % RING_COLORS.length] };
  };
  // ping chips
  const pingTimes = [W(a, 0), W(a, 1)];
  const chips = v === 1
    ? [{ at: pingTimes[0], x: 640, y: 380, c: 1, r: -8 }, { at: pingTimes[1], x: 1260, y: 560, c: 2, r: 7 }]
    : [
      { at: pingTimes[0], x: 520, y: 300, c: 12, r: -9 }, { at: pingTimes[0] + 0.07, x: 1380, y: 260, c: 23, r: 8 },
      { at: pingTimes[1], x: 700, y: 640, c: 64, r: 5 }, { at: pingTimes[1] + 0.07, x: 1300, y: 700, c: "99+", r: -6 },
    ];
  const chipOut = clamp((t - drop) / 0.25);
  // searchlight in screen space, sweeping from the far side onto the AFK player's seat
  const endZoom = v === 1 ? 0.62 : 0.67;
  const target = { x: clamp(960 + seat.x * 0.55 * endZoom, 200, 1720), y: clamp(510 + seat.y * 0.55 * endZoom, 160, 900) };
  const origin = { x: target.x < 960 ? 1660 : 260, y: target.y < 540 ? 760 : 330 };
  const sl = { x: lerp(origin.x, target.x, findP) + Math.sin(t * 3) * 40 * (1 - findP), y: lerp(origin.y, target.y, findP) + Math.cos(t * 2.3) * 50 * (1 - findP) };
  const slA = clamp((t - findStart + 0.15) / 0.25) * (v === 1 ? 1 : 0.0);
  return (
    <Fill style={{ background: "#03050b" }}>
      <Starfield t={t} brightness={0.8 + k * 0.3} hue={(t - drop) * 20} />
      <Stars t={t} drift={30} warp={Math.max(0, 0.6 - dropP)} />
      <World cam={cam} perspective={1600}>
        <Board dance={t > drop ? partyDance(t, v === 2 ? 1.25 : 1) : undefined} rim={rim}
          statusText={{ [G.afkIndex]: findP > 0.95 ? { text: "AFK?", color: "#ff6b6b" } : { text: "ACTIVE", color: "#51cf66" } }} />
        <Shockwave t={t} at={drop} x={0} y={0} color={NEON.magenta} size={9} dur={0.9} width={30} />
        <Shockwave t={t} at={drop + 0.08} x={0} y={0} color={NEON.cyan} size={12} dur={1.1} width={20} />
      </World>
      {slA > 0 && (
        <Fill style={{ background: `radial-gradient(circle at ${sl.x}px ${sl.y}px, rgba(255,255,230,0.2) 0px, transparent 280px, rgba(0,0,8,0.48) 420px)`, opacity: slA }} />
      )}
      {findP > 0.9 && v === 1 && <Stamp t={t} at={W(a, 5) + 0.05} text="?" x={sl.x} y={sl.y - 40} size={190} rot={8} color={NEON.yellow} />}
      {v === 2 && <MissingPoster t={t} at={W(a, 4) - 0.1} />}
      {chips.map((c, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, opacity: 1 - chipOut, transform: `translateY(${-chipOut * 300 * (i % 2 ? -1 : 1)}px) scale(${1 + chipOut * 0.4})` }}>
          <PingChip t={t} at={c.at} text={G.mention} x={c.x} y={c.y} count={c.c as number} rot={c.r} size={v === 1 ? 1 : 0.8} />
        </div>
      ))}
    </Fill>
  );
};

const MissingPoster: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const p = ease.outBack(clamp((t - at) / 0.35), 1.6);
  if (t < at) return null;
  return (
    <div style={{ position: "absolute", right: 120, top: 120, width: 420, transform: `translateY(${(1 - p) * -700}px) rotate(${6 + Math.sin(t * 4) * 2}deg)`, background: "linear-gradient(180deg,#f3e6c4,#dccb9e)", padding: "22px 26px 26px", boxShadow: "0 30px 80px rgba(0,0,0,.6)", fontFamily: FONT.display, color: "#2a1a08", textAlign: "center" }}>
      <div style={{ fontSize: 76, letterSpacing: "0.08em", lineHeight: 1 }}>MISSING</div>
      <div style={{ margin: "14px auto", width: 300, height: 320, background: "#1b1208", overflow: "hidden", border: "6px solid #2a1a08" }}>
        {usable(G.afk.leaders.agent) ? (
          <Img src={G.afk.leaders.agent} style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated", filter: "sepia(.5) contrast(1.1)" }} />
        ) : (
          <Img src={G.afk.icon} style={{ width: "86%", height: "86%", margin: "7%", objectFit: "contain", filter: "sepia(.6) contrast(1.1)" }} />
        )}
      </div>
      <div style={{ fontSize: G.afk.name.length > 14 ? 24 : 30, overflowWrap: "anywhere" }}>{G.afk.name.toUpperCase()}</div>
      <div style={{ fontFamily: FONT.mono, fontSize: 18, marginTop: 6 }}>LAST SEEN: ROUND 1<br />REWARD: 3 TRADE GOODS</div>
    </div>
  );
};

/* ───────────── "Bot keeps callin', but they never show" ───────────── */
const BOT_AVATAR = botSrc("emojis_other_AsyncTI4Logo.png");
/** Seated cast members other than the two leads, in seat order. */
const bystanders = () => G.six.filter((p) => p !== G.hero && p !== G.afk);
const author = (p: CastPlayer) => ({ author: p.name, avatar: p === G.hero ? unitSrc(p.color, "dd_eyes") : p.icon, color: nameColorOf(p.hex) });

const botMsgs = (v: V): Msg[] => {
  const { b } = L(v);
  const at = (i: number) => W(b, Math.min(i, LINES[b].words.length - 1));
  const ping = <Mention>{G.mention}</Mention>;
  const old = -1000;
  const [first, second] = bystanders();
  const bot = { author: "AsyncTI4", avatar: BOT_AVATAR, bot: true, color: "#ffffff" };
  return [
    { at: old, ...bot, time: "Monday at 8:30 PM", text: <BannerEmbed art="extra_actionbanner.jpg" title={G.cast.phase} sub={`ROUND ${roundWord(G.round)}`} scale={1.22} />, h: 400 },
    { at: old, ...author(first), time: "Monday at 8:51 PM", text: "no sabo", h: 70 },
    { at: old, ...author(second), time: "Monday at 8:52 PM", text: "no sabo. who's up?", h: 70 },
    { at: old, ...bot, time: "Monday at 9:02 PM", text: <><b>{G.hero.name}</b> ended their turn. Next up: {ping}</>, h: 70 },
    { at: old, ...author(G.hero), time: "Monday at 9:03 PM", text: "gl hf :)", h: 70 },
    { at: at(0) - 0.05, ...bot, time: "Monday at 9:14 PM", text: <>{ping} it is your turn! Use the buttons below to take your turn.</>, buttons: [{ label: "Tactical Action", style: "green" }, { label: "Component Action", style: "grey" }, { label: "Play Strategy Card", style: "blurple" }, { label: "Pass", style: "red" }], h: 142, highlight: true },
    { at: at(1), ...bot, time: "Tuesday at 12:00 AM", text: <>{ping} reminder: it is still your turn. <span style={{ color: DISCORD.muted }}>(turn timer 1d 2h)</span></>, h: 82, highlight: true },
    { at: at(2), ...bot, time: "Wednesday at 4:00 AM", text: <>{ping} <span style={{ fontFamily: "Noto Emoji" }}>🔔</span> your fleet has been waiting for 2 days</>, h: 82, highlight: true },
    { at: at(3), ...bot, time: "Thursday at 4:00 AM", text: <>{ping} <span style={{ fontFamily: "Noto Emoji" }}>🔔</span> the dreadnought is getting dusty</>, h: 82, highlight: true },
    { at: at(4), ...bot, time: "Friday at 4:00 AM", text: <>{ping} hello?</>, h: 82, highlight: true },
    { at: at(5), ...bot, time: "Saturday at 4:00 AM", text: <>{ping} {ping} {ping}</>, h: 82, highlight: true },
    { at: at(6), ...bot, time: "Today at 4:00 AM", text: <><b>Ping #47.</b> {ping} has not been seen since Round 1.</>, h: 82, highlight: true },
  ];
};
type Member = { name: string; avatar: string; status: "online" | "idle" | "offline" | "dnd"; color?: string; sub?: string };
const MEMBERS = (t: number, offlineAt: number): Member[] => [
  { ...memberOf(G.afk), status: t >= offlineAt ? "offline" : "idle", sub: t >= offlineAt ? "" : "Idle · 4d" },
  { ...memberOf(G.hero), status: "online", sub: "waiting…" },
  ...bystanders().map((p, i): Member => ({ ...memberOf(p), status: i === 2 ? "dnd" : "online" })),
];
const memberOf = (p: CastPlayer) => ({ name: p.name, avatar: p === G.hero ? unitSrc(p.color, "dd_eyes") : p.icon, color: nameColorOf(p.hex) });

const ChorusBot: React.FC<SceneProps & { v: V }> = ({ t, from, v }) => {
  const bleed = useBleed();
  const { b } = L(v);
  const msgs = botMsgs(v);
  const k = kick(t);
  const offlineAt = W(b, 5);
  const enter = ease.outExpo(clamp((t - from) / 0.3));
  if (v === 1) {
    return (
      <Fill style={{ background: "radial-gradient(100% 100% at 50% 0%, #1b1f4a, #07081a 70%)" }}>
        <Marquee t={t} text="IT'S YOUR TURN" color="rgba(88,101,242,.12)" size={110} />
        <Fill style={{ perspective: 1800 }}>
          <div style={{ position: "absolute", left: 100, top: 120, transformOrigin: "35% 85%", transform: `rotateY(${lerp(-25, -6, enter)}deg) rotateX(4deg) translateZ(${(1 - enter) * -400}px) scale(${(1 + k * 0.01) * lerp(1, 1.32, ease.inOutCubic(clamp((t - from - 0.4) / 3.2)))})`, transformStyle: "preserve-3d" }}>
            <DiscordWindow t={t} scale={1.22} width={1720} height={880} variant="channel" title={G.channel} messages={msgs} members={MEMBERS(t, offlineAt)} />
          </div>
        </Fill>
        <NotifStorm t={t} times={msgs.map((m) => m.at)} />
      </Fill>
    );
  }
  // chorus 2: windows multiply 1 → 2 → 4 → 8
  const cells = [1, 2, 4, 8, 8];
  const stage = clamp(Math.floor((t - from) / ((W(b, 6) + 0.6 - from) / 4)), 0, 4);
  const n = cells[stage];
  const cols = n <= 1 ? 1 : n <= 2 ? 2 : n <= 4 ? 2 : 4;
  const rows = Math.ceil(n / cols);
  // the windows multiply to fill the whole window, bleed included
  const cw = (1920 + 2 * bleed.x) / cols;
  const ch = (1080 + 2 * bleed.y) / rows;
  return (
    <Fill style={{ background: "#07081a" }}>
      {Array.from({ length: n }).map((_, i) => {
        const cx = (i % cols) * cw - bleed.x;
        const cy = Math.floor(i / cols) * ch - bleed.y;
        const sc = Math.min(cw / 1720, ch / 940) * 0.94;
        const born = from + ((W(b, 6) + 0.6 - from) / 4) * [0, 1, 2, 2, 3, 3, 3, 3][i];
        const pop = ease.outBack(clamp((t - born) / 0.22), 1.8);
        const jx = Math.sin(t * 53 + i * 7) * 4 * k;
        const jy = Math.cos(t * 47 + i * 3) * 4 * k;
        return (
          <div key={i} style={{ position: "absolute", left: cx + cw / 2 - 860 + jx, top: cy + ch / 2 - 470 + jy, width: 1720, height: 940, transform: `scale(${sc * pop}) rotate(${(hash(i) - 0.5) * 3}deg)`, transformOrigin: "50% 50%", borderRadius: 12, boxShadow: `0 0 0 ${6 + k * 10}px rgba(242,63,67,${0.25 + k * 0.6})` }}>
            <DiscordWindow t={t - i * 0.06} scale={1.22} width={1720} height={940} variant="channel" title={G.channel} messages={msgs} members={MEMBERS(t, offlineAt)} />
          </div>
        );
      })}
      <Fill style={{ background: `rgba(242,63,67,${k * 0.22})`, mixBlendMode: "screen" }} />
      <PingCounter t={t} words={LINES[b].words.map((w) => w.s)} />
    </Fill>
  );
};

/** Giant unread-mentions badge that climbs with every word. */
const PingCounter: React.FC<{ t: number; words: number[] }> = ({ t, words }) => {
  const n = words.filter((w) => t >= w).length;
  const last = words[n - 1] ?? 0;
  const p = clamp((t - last) / 0.18);
  const count = n === 0 ? 47 : n >= words.length ? "99+" : 47 + Math.round(n * n * 2.2);
  return (
    <Fill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ minWidth: 300, height: 300, padding: "0 70px", borderRadius: 150, background: "#f23f43", border: "22px solid #1e1f22", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", fontFamily: FONT.discord, fontWeight: 800, fontSize: 180, color: "white", transform: `scale(${(n ? 1 + (1 - ease.outCubic(p)) * 0.35 : 0.0) * (1 + kick(t) * 0.05)}) rotate(${Math.sin(t * 9) * 3}deg)`, boxShadow: "0 30px 90px rgba(0,0,0,.7), 0 0 120px rgba(242,63,67,.7)" }}>
        {count}
      </div>
    </Fill>
  );
};

/** OS-style notification toasts stacking on each message. */
const NotifStorm: React.FC<{ t: number; times: number[] }> = ({ t, times }) => (
  <div style={{ position: "absolute", left: 1150, top: 30, width: 470, display: "flex", flexDirection: "column", gap: 12 }}>
    {times.filter((x) => t >= x).slice(-4).map((x, i) => {
      const p = ease.outBack(clamp((t - x) / 0.25), 1.8);
      return (
        <div key={x} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 18px", background: "rgba(30,31,34,.92)", borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,.6)", transform: `translateX(${(1 - p) * 520}px)`, fontFamily: FONT.discord }}>
          <Img src={botSrc("emojis_other_AsyncTI4Logo.png")} style={{ width: 46, height: 46, borderRadius: 10 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "white", fontWeight: 700, fontSize: 19 }}>AsyncTI4 <span style={{ color: DISCORD.muted, fontWeight: 400, fontSize: 15 }}>#{G.channel}</span></div>
            <div style={{ color: DISCORD.text, fontSize: 17, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{G.mention} it is your turn{"!".repeat(i + 1)}</div>
          </div>
        </div>
      );
    })}
  </div>
);

/* ───────────── "I'm waitin' here for you, I saved you a place" ───────────── */
const ChorusWait: React.FC<SceneProps & { v: V }> = ({ t, from, v }) => {
  const { c } = L(v);
  const k = kick(t);
  const zoomIn = ease.outCubic(clamp((t - from) / 0.6));
  // laid out around the middle of the destroyer's system, wherever the destroyer itself sits on the map
  const { heroHex: HEX, hero, afk, heroPos } = G;
  const cam = { x: HEX.x + 40, y: HEX.y + 10, zoom: lerp(1.6, 2.35, zoomIn) + (t - from) * 0.04, rot: sway(t, 1.5, 2) };
  const savedAt = W(c, 6);
  const ghost = { x: HEX.x + 95, y: HEX.y - 35 };
  const ghostA = 0.35 + 0.25 * Math.sin(t * 6) + k * 0.2;
  const sign = ease.outBack(clamp((t - savedAt) / 0.3), 2);
  const choir: readonly string[] = v === 2 ? CHOIR : [];
  return (
    <Whip t={t} inAt={from} dir={1} dur={0.16}>
      <Fill style={{ background: "#05030c" }}>
        <Starfield t={t} brightness={0.7} hue={-40} />
        <Stars t={t} drift={8} tint="#ffd0f4" />
        <World cam={cam}>
          <Board hideUnits={hideLeads()} dance={partyDance(t, 0.6)} tileFilter={(pos) => (pos === heroPos ? "brightness(1.1)" : "brightness(0.5) saturate(0.7)")} />
          {choir.map((col, i) => {
            const ang = Math.PI * (0.8 + (i / (choir.length - 1)) * 1.4);
            const x = HEX.x + Math.cos(ang) * 150;
            const y = HEX.y + Math.sin(ang) * 110 - 10;
            return <Ship key={col} color={col} unit="dd" x={x} y={y} scale={1.25} transform={`translateY(${bob(t, 8, 2, i * 0.08)}px) rotate(${sway(t, 14, 2, i * 0.08)}deg)`} opacity={clamp((t - from - 0.1 - i * 0.05) / 0.3)} />;
          })}
          <div style={{ position: "absolute", left: HEX.x - 240, top: HEX.y - 260, width: 480, height: 480, background: "radial-gradient(closest-side, rgba(255,80,180,.32), transparent)", mixBlendMode: "screen" }} />
          <Ship color={afk.color} unit="ca" x={ghost.x} y={ghost.y} scale={1.9} opacity={ghostA} filter={`brightness(0) invert(1) drop-shadow(0 0 3px ${neonOf(afk.hex)}) drop-shadow(0 0 10px #ff2bd6)`} />
          <VelvetRope x={ghost.x} y={ghost.y + 70} t={t} />
          <Ship color={hero.color} unit="dd_eyes" x={HEX.x - 55} y={HEX.y + 25} scale={2.0} transform={`translateY(${bob(t, 8, 2)}px) rotate(${sway(t, 12, 2)}deg)`} glow="rgba(255,90,170,.8)" glowSize={10 + k * 10} />
          <HeartBurst t={t} emits={[0, 1, 2, 3, 4, 5, 6, 7].map((i) => from + 0.3 + i * 0.5)} x={HEX.x - 55} y={HEX.y - 20} spread={50} size={28} rise={170} seed={21} />
          {sign > 0 && (
            <div style={{ position: "absolute", left: ghost.x - 120, top: ghost.y - 150, width: 240, transform: `scale(${sign}) rotate(${-4 + Math.sin(t * 5) * 2}deg)`, transformOrigin: "50% 100%", textAlign: "center", fontFamily: FONT.display, fontSize: 24, color: "#1a0f00", background: "linear-gradient(180deg,#ffe58a,#f0b232)", borderRadius: 8, padding: "8px 10px", boxShadow: "0 0 24px rgba(255,200,60,.8)", letterSpacing: "0.06em" }}>
              RESERVED<div style={{ fontSize: 15, fontFamily: FONT.mono }}>for: cruiser ♥</div>
            </div>
          )}
          <SparkleField t={t} seed={5} count={14} w={420} h={300} x={HEX.x + 20} y={HEX.y} color="#ffc8f0" size={12} intensity={0.8} />
        </World>
      </Fill>
    </Whip>
  );
};

const VelvetRope: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <svg style={{ position: "absolute", left: x - 90, top: y - 40, width: 180, height: 70, overflow: "visible" }} viewBox="0 0 180 70">
    <path d={`M14 18 Q90 ${46 + Math.sin(t * 4) * 4} 166 18`} fill="none" stroke="#c4102e" strokeWidth={7} strokeLinecap="round" />
    {[14, 166].map((px) => (
      <g key={px}>
        <rect x={px - 4} y={14} width={8} height={48} rx={3} fill="#e8c35a" />
        <circle cx={px} cy={12} r={8} fill="#ffe08a" />
        <ellipse cx={px} cy={64} rx={16} ry={5} fill="#b8902e" />
      </g>
    ))}
  </svg>
);

/* ───────────── "It's your turn, it's your turn, come move into my space" ───────────── */
const ChorusTurn: React.FC<SceneProps & { v: V }> = ({ t, to, v }) => {
  const { d } = L(v);
  const t1 = W(d, 0);
  const t2 = W(d, 3);
  const moveAt = W(d, 6);
  const spaceAt = W(d, 10);
  const k = kick(t);
  const typeOut = moveAt - 0.08;
  const showBoard = t >= typeOut;
  const fieldColor = t < t2 ? "#c2187f" : "#0b6e8a";
  // flight
  const flyP = clamp((t - (moveAt + 0.05)) / (spaceAt - moveAt + 0.15));
  const breakAt = v === 2 ? bt(124) - 0.02 : Infinity;
  const frozen = t >= breakAt;
  const tf = frozen ? breakAt : t;
  const snapAt = v === 1 ? spaceAt + 0.5 : Infinity;
  const snapP = clamp((tf - snapAt) / 0.25);
  const { heroHex: HEX, cruiser: CRUISER_POS, hero, afk, heroPos, crushPos } = G;
  const from2 = [CRUISER_POS.x, CRUISER_POS.y];
  const to2 = [HEX.x + 95, HEX.y - 35];
  // the flight loops out behind the cruiser and swoops in from above, whatever side the systems touch on
  const dist = Math.hypot(to2[0] - from2[0], to2[1] - from2[1]) || 1;
  const u = [(to2[0] - from2[0]) / dist, (to2[1] - from2[1]) / dist];
  const n = u[0] > 0 ? [u[1], -u[0]] : [-u[1], u[0]];
  const c1 = [from2[0] - 420 * u[0] + 25 * n[0], from2[1] - 420 * u[1] + 25 * n[1]];
  const c2 = [to2[0] + 156 * u[0] + 511 * n[0], to2[1] + 156 * u[1] + 511 * n[1]];
  const fp = ease.flight(clamp((tf - (moveAt + 0.05)) / (spaceAt - moveAt + 0.15)));
  const pos = bezier(from2, c1, c2, to2, snapP > 0 ? fp * (1 - ease.inExpo(snapP)) : fp);
  const glitchAmt = v === 1 ? Math.max(clamp(1 - Math.abs(tf - snapAt - 0.1) / 0.15), clamp((t - (to - 0.35)) / 0.35)) : 0;
  const camZ = lerp(0.95, 1.2, ease.inOutCubic(clamp((tf - moveAt) / 2)));
  const cam = { x: (CRUISER_POS.x + HEX.x) / 2 + 30, y: (CRUISER_POS.y + HEX.y) / 2 - 90, zoom: camZ * (1 + (frozen ? 0 : k * 0.02)), rot: frozen ? 0 : Math.sin(t) * 1 };
  const freezeA = frozen ? clamp((t - breakAt) / 0.2) : 0;
  return (
    <Fill style={{ background: "#03050b" }}>
      {showBoard && (
        <Glitch t={t} amount={glitchAmt} seed={v}>
          <Fill style={{ filter: frozen ? `saturate(${1 - freezeA * 0.85}) brightness(${1 - freezeA * 0.35})` : undefined }}>
            <Starfield t={tf} brightness={0.8} />
            <Stars t={tf} drift={12} />
            <World cam={cam}>
              <Board hideUnits={hideLeads()} dance={partyDance(tf, 0.9)} rim={(pos) => (pos === crushPos || pos === heroPos ? { a: 0.7 + k * 0.3, color: pos === crushPos ? neonOf(afk.hex) : neonOf(hero.hex) } : null)} />
              <CurvePath t={tf} pts={[from2, c1, c2, to2]} reveal={ease.outCubic(clamp((tf - moveAt) / 0.45))} color={NEON.cyan} width={7} />
              <Ship color={afk.color} unit="ca" x={CRUISER_POS.x} y={CRUISER_POS.y} scale={2.0} glow={glowOf(afk.hex, 0.8)} glowSize={12} transform={`rotate(${Math.sin(t * 1.3) * 3}deg)`} />
              {flyP > 0 && <Ship color={afk.color} unit="ca" x={pos.x} y={pos.y} scale={2.0} heading={pos.angle} opacity={0.55} filter="brightness(1.6) saturate(0.5)" glow="rgba(103,232,249,.95)" glowSize={16} />}
              <Ship color={hero.color} unit="dd_eyes" x={HEX.x - 40} y={HEX.y + 25} scale={2.0} transform={danceTransform(tf, { amp: 12, deg: 10 })} glow={glowOf(hero.hex, 0.7)} glowSize={12} />
            </World>
          </Fill>
        </Glitch>
      )}
      {!showBoard && (
        <Fill style={{ background: fieldColor }}>
          <Marquee t={t} text="YOUR TURN" color="rgba(255,255,255,.12)" size={130} speed={420} />
          <Fill style={{ background: `radial-gradient(circle, transparent 30%, rgba(0,0,0,.55))` }} />
        </Fill>
      )}
      {!showBoard && <BigType t={t} at={t1} text="IT'S YOUR TURN" color="#ffffff" rot={-5} size={180} out={t2 - 0.02} />}
      {!showBoard && <BigType t={t} at={t2} text="IT'S YOUR TURN" color={NEON.yellow} echo={["#22e6ff", "#ffffff", "#ff2bd6"]} rot={4} size={185} out={typeOut} />}
      {v === 1 && snapP > 0 && (
        <div style={{ position: "absolute", left: "50%", top: 150, transform: `translateX(-50%) scale(${ease.outBack(clamp((t - snapAt) / 0.2))})`, fontFamily: FONT.display, fontSize: 40, color: "#ff6b6b", letterSpacing: "0.12em", background: "rgba(20,4,8,.8)", border: "2px solid #ff6b6b", padding: "10px 26px", borderRadius: 6, boxShadow: "0 0 30px rgba(255,80,100,.6)" }}>
          MOVE REJECTED · STILL THEIR TURN
        </div>
      )}
      {frozen && <WaitingSpinner t={t} a={freezeA} />}
    </Fill>
  );
};

const WaitingSpinner: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <Fill style={{ alignItems: "center", justifyContent: "center", opacity: a }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, padding: "40px 60px", background: "rgba(10,12,22,.82)", border: "1px solid rgba(190,190,196,.2)", borderRadius: 10, boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
      <svg width={120} height={120} viewBox="0 0 120 120" style={{ transform: `rotate(${t * 400}deg)` }}>
        <circle cx={60} cy={60} r={48} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={10} />
        <circle cx={60} cy={60} r={48} fill="none" stroke={NEON.cyan} strokeWidth={10} strokeDasharray="80 222" strokeLinecap="round" />
      </svg>
      <div style={{ fontFamily: FONT.display, fontSize: 34, letterSpacing: "0.14em", color: "#e6f7ff", maxWidth: 1100, textAlign: "center" }}>WAITING FOR {G.afk.name.toUpperCase()}</div>
      <div style={{ fontFamily: FONT.mono, fontSize: 22, color: "#93c5fd" }}>turn timer · 6d 23h 59m {String(59 - (Math.floor(t * 7) % 60)).padStart(2, "0")}s</div>
    </div>
  </Fill>
);

export const C1Board: React.FC<SceneProps> = (p) => <ChorusBoard {...p} v={1} />;
export const C1Bot: React.FC<SceneProps> = (p) => <ChorusBot {...p} v={1} />;
export const C1Wait: React.FC<SceneProps> = (p) => <ChorusWait {...p} v={1} />;
export const C1Turn: React.FC<SceneProps> = (p) => <ChorusTurn {...p} v={1} />;
export const C2Board: React.FC<SceneProps> = (p) => <ChorusBoard {...p} v={2} />;
export const C2Bot: React.FC<SceneProps> = (p) => <ChorusBot {...p} v={2} />;
export const C2Wait: React.FC<SceneProps> = (p) => <ChorusWait {...p} v={2} />;
export const C2Turn: React.FC<SceneProps> = (p) => <ChorusTurn {...p} v={2} />;

export const chorusWindows = (v: V) => {
  const { a, b, c, d, cb } = L(v);
  return {
    board: [W(a, 0) - 0.06, W(b, 0) - 0.12] as const,
    bot: [W(b, 0) - 0.12, W(c, 0) - 0.12] as const,
    wait: [W(c, 0) - 0.12, W(d, 0) - 0.04] as const,
    turn: [W(d, 0) - 0.04, bt(cb + 32)] as const,
  };
};
