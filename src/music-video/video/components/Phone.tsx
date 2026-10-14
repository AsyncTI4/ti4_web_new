import React from "react";
import { Img } from "../lib/Img";
import { botSrc } from "../lib/assets";
import { G } from "../lib/game";
import { FONT } from "../lib/fonts";
import { clamp, ease } from "../lib/math";
import { Mention } from "./Discord";

export type PhoneNotif = { at: number; time: string };

/** Phone lock screen: AsyncTI4 notifications stack in as they arrive. Width w, height ~1.96w. */
export const PhoneMock: React.FC<{ t: number; w: number; hour: string; notifs: PhoneNotif[]; screenOn?: number; glowK?: number }> = ({ t, w, hour, notifs, screenOn = 1, glowK = 0 }) => {
  const s = w / 540;
  return (
    <div style={{ position: "relative", width: w, height: 1060 * s, borderRadius: 70 * s, background: "#0a0a0c", boxShadow: `0 0 0 ${10 * s}px #22232a, 0 ${60 * s}px ${120 * s}px rgba(0,0,0,.7)`, overflow: "hidden" }}>
      <Img src={botSrc("extra_starfield.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
      <div style={{ position: "absolute", top: 22 * s, left: "50%", width: 150 * s, height: 40 * s, borderRadius: 20 * s, background: "#000", transform: "translateX(-50%)" }} />
      <div style={{ position: "absolute", top: 110 * s, width: "100%", textAlign: "center", color: "white", fontFamily: FONT.text }}>
        <div style={{ fontSize: 26 * s, fontWeight: 600, opacity: 0.85 }}>Thursday, Round {G.round}</div>
        <div style={{ fontSize: 150 * s, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", textShadow: `0 0 ${glowK * 30 * s}px rgba(140,180,255,.8)` }}>{hour}</div>
        <div style={{ fontSize: 22 * s, opacity: 0.7 }}>☾ Do Not Disturb</div>
      </div>
      <div style={{ position: "absolute", top: 420 * s, left: 22 * s, right: 22 * s, display: "flex", flexDirection: "column", gap: 14 * s }}>
        {notifs.filter((n) => t >= n.at).reverse().map((n) => {
          const p = ease.outBack(clamp((t - n.at) / 0.3), 1.6);
          return (
            <div key={n.time + n.at} style={{ display: "flex", gap: 14 * s, padding: 16 * s, borderRadius: 26 * s, background: "rgba(40,40,52,.82)", transform: `translateY(${(1 - p) * -80 * s}px) scale(${0.85 + p * 0.15})`, opacity: clamp(p * 2), fontFamily: FONT.text, color: "white" }}>
              <Img src={botSrc("emojis_other_AsyncTI4Logo.png")} style={{ width: 54 * s, height: 54 * s, borderRadius: 12 * s }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 19 * s, fontWeight: 700 }}><span>AsyncTI4</span><span style={{ opacity: 0.6, fontWeight: 500 }}>{n.time}</span></div>
                <div style={{ fontSize: 19 * s, marginTop: 2 * s, lineHeight: 1.3 }}>#{G.channel}: <Mention>{G.mention}</Mention> it is your turn</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#030305", opacity: 1 - screenOn }} />
    </div>
  );
};

/** A phone lying face-up on the table: dark until a ping lights it up (and buzzes it). */
export const LyingPhone: React.FC<{ t: number; x: number; y: number; w: number; pings: number[]; time?: string }> = ({ t, x, y, w, pings, time = "4:00 AM" }) => {
  const last = pings.filter((p) => t >= p).pop();
  const since = last === undefined ? Infinity : t - last;
  const lit = since === Infinity ? 0 : Math.max(0, Math.min(1, since / 0.05)) * (since < 1.2 ? 1 : Math.exp(-(since - 1.2) * 2.5));
  const buzz = since < 0.35 ? Math.sin(t * 140) * 5 * (1 - since / 0.35) : 0;
  const h = w * 1.963;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, perspective: 1200 }}>
      <div style={{ position: "absolute", left: -w * 0.9, top: -h * 0.15, width: w * 2.8, height: h * 1.3, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(150,190,255,.55), rgba(120,150,255,.18) 55%, transparent)", opacity: lit, transform: "rotateX(62deg) rotateZ(-18deg)", mixBlendMode: "screen" }} />
      <div style={{ transform: `rotateX(58deg) rotateZ(-18deg) translateX(${buzz}px)`, transformOrigin: "50% 60%", filter: `drop-shadow(0 30px 30px rgba(0,0,0,.6))` }}>
        <PhoneMock t={t} w={w} hour={time.replace(" AM", "")} notifs={pings.filter((p) => t >= p).map((p, i) => ({ at: p, time: i === 0 ? "now" : "now" }))} screenOn={0.04 + lit * 0.96} />
      </div>
    </div>
  );
};
