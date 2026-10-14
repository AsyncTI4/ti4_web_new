import React from "react";
import { Fill } from "../lib/stage";
import { Img } from "../lib/Img";
import { SceneProps } from "./types";
import { Whip } from "./common";
import { World } from "../components/World";
import { Board } from "../components/Board";
import { Starfield, Stars } from "../components/Backdrop";
import { DiscordButton } from "../components/Discord";
import { PhoneMock } from "../components/Phone";
import { SleepingFlagship } from "../components/SleepingFlagship";
import { Stamp } from "../fx/Effects";
import { LINES, beatPos, kick } from "../lib/timing";
import { clamp, ease, fract, lerp } from "../lib/math";
import { squash } from "../lib/dance";
import { FONT } from "../lib/fonts";
import { NEON, cardSrc, usable } from "../lib/assets";
import { G, glowOf, nameColorOf, neonOf } from "../lib/game";

const W = (l: number, w: number) => LINES[l].words[w].s;
export const V3_CUTS = [W(12, 0) - 0.06, W(13, 0) - 0.06, W(14, 0) - 0.06, W(15, 0) - 0.06];

/* Fleet's on the map, just waitin' for a sign */
export const V3Fleet: React.FC<SceneProps> = ({ t, from }) => {
  const lt = t - from;
  const k = kick(t);
  const p = fract(beatPos(t));
  const hopY = -(Math.sin(Math.PI * p) ** 0.7) * 18;
  const [sx, sy] = squash(t, 0.18);
  const cam = { x: 0, y: 120, zoom: lerp(0.62, 0.7, lt / 2) * (1 + k * 0.02), rot: -20 + lt * 6, tilt: 52 };
  const signAt = W(12, 8) - 0.08;
  const signOn = t >= signAt && !(t > signAt + 0.08 && t < signAt + 0.14) && !(t > signAt + 0.22 && t < signAt + 0.26);
  return (
    <Whip t={t} inAt={from} dir={-1} dur={0.18}>
      <Fill style={{ background: "#03050b" }}>
        <Starfield t={t} brightness={0.75} hue={200} />
        <Stars t={t} drift={16} />
        <World cam={cam} perspective={1500}>
          <Board dance={() => `translateY(${hopY}px) scale(${sx}, ${sy})`} rim={() => ({ a: 0.25 + k * 0.4, color: NEON.cyan })} />
        </World>
        <div style={{ position: "absolute", left: "50%", top: 120, transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{ fontFamily: FONT.neon, fontSize: 104, color: signOn ? "#ffe9fb" : "rgba(255,120,220,.12)", textShadow: signOn ? "0 0 12px #ff2bd6, 0 0 36px #ff2bd6, 0 0 90px #ff2bd6" : "none", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
            WAITING FOR A SIGN
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 24, color: signOn ? "#9ff3ff" : "transparent", textShadow: "0 0 12px #22e6ff", marginTop: 6, letterSpacing: "0.3em" }}>open 24/7 · round {G.round} · day 7</div>
        </div>
      </Fill>
    </Whip>
  );
};

/* Six players clickin' "No Sabo," but one is takin' time */
export const V3NoSabo: React.FC<SceneProps> = ({ t, from }) => {
  const clicks = [W(13, 0), W(13, 1), W(13, 2), W(13, 3), W(13, 4), W(13, 5)];
  const k = kick(t);
  const lt = t - from;
  const oneAt = W(13, 6);
  const { afk } = G;
  // the five who answer click on the beat; the one whose turn it is gets the sixth beat and never clicks
  const cards = [...G.six.filter((p) => p !== afk), afk];
  const afkNeon = neonOf(afk.hex);
  return (
    <Fill style={{ background: "linear-gradient(160deg, #0d1022, #05060d)" }}>
      <Fill style={{ backgroundImage: "radial-gradient(rgba(88,101,242,.18) 1.5px, transparent 1.5px)", backgroundSize: "36px 36px", transform: `translateY(${(lt * 30) % 36}px)` }} />
      <div style={{ position: "absolute", left: 70, top: 120, display: "grid", gridTemplateColumns: "repeat(3, 360px)", gap: 26 }}>
        {cards.map((p, i) => {
          const ap = ease.outBack(clamp((lt - i * 0.04) / 0.3), 1.7);
          const stalling = p === afk;
          const clicked = !stalling && t >= clicks[i];
          const cp = clamp((t - clicks[i]) / 0.3);
          const nudge = stalling && t >= clicks[i] ? Math.sin((t - clicks[i]) * 40) * 6 * Math.exp(-(t - clicks[i]) * 4) : 0;
          return (
            <div key={i} style={{ height: 330, borderRadius: 10, background: "linear-gradient(180deg,#1b1d24,#121318)", border: `1px solid ${clicked ? "rgba(61,255,143,.55)" : stalling && t >= clicks[i] ? glowOf(afk.hex, 0.55) : "rgba(190,190,196,.16)"}`, boxShadow: clicked ? `0 0 ${30 * (1 - cp) + 14}px rgba(61,255,143,.45)` : "0 20px 50px rgba(0,0,0,.5)", transform: `scale(${ap * (clicked ? 1 + (1 - cp) * 0.06 : 1)}) translateX(${nudge}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, position: "relative", overflow: "hidden" }}>
              <Img src={p.icon} style={{ width: 120, height: 120, objectFit: "contain", filter: clicked ? "drop-shadow(0 0 16px rgba(61,255,143,.6))" : undefined }} />
              <div style={{ fontFamily: FONT.discord, fontWeight: 700, fontSize: 28, color: nameColorOf(p.hex), maxWidth: 330, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
              {stalling ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, height: 57.6, fontFamily: FONT.mono, fontSize: 26, color: afkNeon, opacity: t >= clicks[i] ? 0.6 + 0.4 * Math.sin(t * 9) : 0.35 }}>
                  ⧗ thinking…
                </div>
              ) : (
                <DiscordButton btn={{ label: "No Sabo", style: "green", pressedAt: clicks[i] }} t={t} scale={1.8} />
              )}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 70, top: 120, width: 600, height: 686, borderRadius: 12, background: "linear-gradient(180deg,#1d1a14,#0c0b08)", border: `2px solid ${glowOf(afk.hex, 0.3 + 0.4 * clamp((t - oneAt) / 0.2))}`, boxShadow: `0 0 ${40 + k * 40}px ${glowOf(afk.hex, 0.25)}`, overflow: "hidden", transform: `scale(${ease.outBack(clamp((lt - 0.2) / 0.35), 1.6)})` }}>
        {usable(afk.leaders.commander) ? (
          <Img src={afk.leaders.commander} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated", transform: `scale(${1.02 + Math.sin(t * 1.5) * 0.01})` }} />
        ) : (
          <Img src={afk.icon} style={{ position: "absolute", left: 60, top: 140, width: 480, height: 480, objectFit: "contain", opacity: 0.85, transform: `scale(${1.02 + Math.sin(t * 1.5) * 0.02})` }} />
        )}
        <Fill style={{ background: "linear-gradient(180deg, rgba(12,10,6,.85), transparent 40%, rgba(12,10,6,.9))" }} />
        <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
          <div style={{ fontFamily: FONT.discord, fontWeight: 700, fontSize: afk.name.length > 18 ? 28 : 36, color: nameColorOf(afk.hex), padding: "0 20px", overflowWrap: "anywhere" }}>{afk.name}</div>
          <div style={{ fontFamily: FONT.display, fontSize: 22, color: "#c9b88a", letterSpacing: "0.16em", marginTop: 4 }}>DECIDING… </div>
        </div>
        <div style={{ position: "absolute", bottom: 40, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <svg width={110} height={110} viewBox="0 0 120 120" style={{ transform: `rotate(${t * 300}deg)` }}>
            <circle cx={60} cy={60} r={46} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={10} />
            <circle cx={60} cy={60} r={46} fill="none" stroke={afkNeon} strokeWidth={10} strokeDasharray="70 220" strokeLinecap="round" />
          </svg>
          <div style={{ fontFamily: FONT.mono, fontSize: 40, color: "#fff2d0" }}>{fmt(lt * 3600 * 7 + 3 * 86400)}</div>
        </div>
      </div>
      {t >= W(13, 8) - 0.05 && <Stamp t={t} at={W(13, 8) - 0.05} text="TAKIN' TIME" x={1450} y={470} size={70} rot={-10} color={NEON.yellow} />}
    </Fill>
  );
};
const fmt = (s: number) => {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/* Bot pinged at midnight, bot pinged again at four */
export const V3Phone: React.FC<SceneProps> = ({ t, from }) => {
  const lt = t - from;
  const midnight = W(14, 3);
  const fourAt = W(14, 8);
  const flipStart = W(14, 4);
  const flipP = clamp((t - flipStart) / (fourAt - flipStart));
  const hour = flipP >= 1 ? "4:00" : flipP > 0 ? ["12:00", "1:00", "2:00", "3:00"][Math.min(3, Math.floor(flipP * 4))] : "12:00";
  const k = kick(t);
  const enter = ease.outExpo(clamp(lt / 0.35));
  const notifs = [
    { at: midnight - 0.04, time: "12:00 AM" },
    { at: fourAt - 0.04, time: "4:00 AM" },
  ];
  const buzz = notifs.some((n) => t >= n.at && t < n.at + 0.35) ? Math.sin(t * 120) * 6 : 0;
  return (
    <Fill style={{ background: "radial-gradient(90% 80% at 50% 30%, #13183a, #04050d 70%)", overflow: "hidden" }}>
      <Stars t={t} drift={6} tint="#dfe8ff" />
      <div style={{ position: "absolute", right: 220, top: 110, width: 170, height: 170, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fffbe6, #e8dcae 60%, #b8a774)", boxShadow: "0 0 80px rgba(255,245,200,.5)" }} />
      <div style={{ position: "absolute", right: 170, top: 90, width: 170, height: 170, borderRadius: "50%", background: "#0b0f26" }} />
      <SleepingFlagship t={t} x={330} y={800} scale={3.6} opacity={0.92} color={G.afk.color} glow={glowOf(G.afk.hex, 0.55)} />
      <div style={{ position: "absolute", left: 960 - 270, top: 70, transform: `translateY(${(1 - enter) * 600}px) rotate(${-3 + buzz * 0.3}deg) translateX(${buzz}px)` }}>
        <PhoneMock t={t} w={540} hour={hour} notifs={notifs} glowK={k} />
      </div>
      {[midnight, fourAt].map((at, i) => (
        <div key={i} style={{ position: "absolute", left: i === 0 ? 300 : 1460, top: i === 0 ? 330 : 520, fontFamily: FONT.display, fontSize: 120, color: NEON.magenta, opacity: t >= at ? Math.exp(-(t - at) * 1.2) : 0, transform: `scale(${t >= at ? ease.outBack(clamp((t - at) / 0.2), 3) : 0}) rotate(${i ? 10 : -10}deg)`, textShadow: `0 0 30px ${NEON.magenta}`, WebkitTextStroke: "6px #05070f", paintOrder: "stroke fill" }}>
          PING!
        </div>
      ))}
    </Fill>
  );
};

/* Still waitin' on your "whens" and "afters," baby, what's this for? */
export const V3WhensAfters: React.FC<SceneProps> = ({ t, from }) => {
  const lt = t - from;
  const k = kick(t);
  const whenAt = W(15, 4);
  const afterAt = W(15, 6);
  const whatAt = W(15, 8);
  const n = 7;
  const shake = t > whatAt ? Math.sin(t * 70) * 8 * Math.exp(-(t - whatAt) * 3) : 0;
  return (
    <Fill style={{ background: "radial-gradient(100% 90% at 50% 60%, #2a0d18, #07030a 70%)", overflow: "hidden" }}>
      <Starfield t={t} brightness={0.35} hue={300} opacity={0.6} />
      <div style={{ position: "absolute", left: 960, top: 1180, transform: `translateX(${shake}px)` }}>
        {Array.from({ length: n }).map((_, i) => {
          const fan = ease.outBack(clamp((lt - i * 0.04) / 0.45), 1.4);
          const ang = (i - (n - 1) / 2) * 11 * fan;
          const lift = i === 2 && t > whenAt ? -60 : i === 4 && t > afterAt ? -60 : 0;
          return (
            <div key={i} style={{ position: "absolute", left: -150, top: -900, width: 300, height: 450, transformOrigin: "50% 200%", transform: `rotate(${ang}deg) translateY(${lift - fan * 40 + (k * 8 * (i % 2 ? 1 : -1))}px)`, borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.6), 0 0 0 2px rgba(255,140,80,.25)" }}>
              <Img src={cardSrc("cardback_action")} style={{ width: "100%", height: "100%" }} />
            </div>
          );
        })}
      </div>
      <Stamp t={t} at={whenAt - 0.03} text="WHEN…" x={760} y={420} size={110} rot={-14} color={NEON.cyan} />
      <Stamp t={t} at={afterAt - 0.03} text="AFTER…" x={1180} y={470} size={110} rot={10} color={NEON.magenta} />
      <div style={{ position: "absolute", left: 360, right: 360, top: 90 }}>
        <div style={{ fontFamily: FONT.display, fontSize: 30, color: "#ffd2e4", letterSpacing: "0.14em", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
          <span>RESOLVING WHENS &amp; AFTERS…</span><span>{t > whatAt ? "99%" : `${Math.min(99, Math.floor(lt * 70 + 40))}%`}</span>
        </div>
        <div style={{ height: 26, borderRadius: 13, background: "rgba(255,255,255,.08)", overflow: "hidden", border: "1px solid rgba(255,255,255,.15)" }}>
          <div style={{ height: "100%", width: `${Math.min(99, lt * 70 + 40) + Math.sin(t * 40) * 0.6}%`, background: `linear-gradient(90deg, ${NEON.magenta}, ${NEON.cyan})`, boxShadow: `0 0 20px ${NEON.magenta}` }} />
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 20, color: "#a78" , marginTop: 10, textAlign: "center" }}>waiting on: {G.afk.name}</div>
      </div>
      {t >= whatAt && [0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 560 + i * 400, top: 250 + (i % 2) * 120, fontFamily: FONT.display, fontSize: 220, color: NEON.yellow, transform: `scale(${ease.outBack(clamp((t - whatAt - i * 0.07) / 0.2), 3)}) rotate(${(i - 1) * 16}deg)`, textShadow: `0 0 40px ${NEON.yellow}`, WebkitTextStroke: "8px #05070f", paintOrder: "stroke fill" }}>?</div>
      ))}
    </Fill>
  );
};
