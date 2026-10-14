import React from "react";
import { Img } from "../lib/Img";
import { DISCORD, botSrc } from "../lib/assets";
import { G, glowOf, hueOf } from "../lib/game";
import { FONT } from "../lib/fonts";
import { clamp, ease } from "../lib/math";
import { StatusDot } from "./Discord";

type Props = {
  t: number;
  scale?: number;
  /** Red mention badge on the avatar; pops in at `badgeAt`. */
  badge?: number | string;
  badgeAt?: number;
  status?: "idle" | "offline";
};

/** Discord user popout for the AFK opponent. */
export const ProfileCard: React.FC<Props> = ({ t, scale: s = 1.5, badge, badgeAt = -Infinity, status = "idle" }) => {
  const bp = ease.outBack(clamp((t - badgeAt) / 0.25), 2.6);
  const { afk } = G;
  const roles = [
    { label: G.cast.game.toLowerCase(), color: "#5865f2" },
    { label: afk.factionName, color: afk.hex },
    { label: "AFK", color: "#80848e" },
  ];
  const handle = afk.name.toLowerCase().replace(/[^a-z0-9_.]/g, "");
  const section = (title: string, body: React.ReactNode) => (
    <div style={{ marginTop: 12 * s }}>
      <div style={{ fontSize: 12 * s, fontWeight: 700, color: "#b5bac1", letterSpacing: "0.02em", marginBottom: 4 * s }}>{title}</div>
      <div style={{ fontSize: 14 * s, color: DISCORD.text, lineHeight: 1.35 }}>{body}</div>
    </div>
  );
  return (
    <div style={{ width: 340 * s, borderRadius: 8 * s, overflow: "hidden", background: "#232428", fontFamily: FONT.discord, boxShadow: `0 ${24 * s}px ${60 * s}px rgba(0,0,0,.65), 0 0 0 ${1 * s}px rgba(255,255,255,.06)` }}>
      <div style={{ position: "relative", height: 112 * s, overflow: "hidden" }}>
        <Img src={botSrc("extra_strategybanner.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%", filter: `sepia(.35) hue-rotate(${Math.round(hueOf(afk.hex) - 45)}deg) saturate(1.3)` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${glowOf(afk.hex, 0.15)}, rgba(35,36,40,.25))` }} />
      </div>
      <div style={{ position: "relative", height: 56 * s }}>
        <div style={{ position: "absolute", left: 16 * s, top: -46 * s, width: 92 * s, height: 92 * s, borderRadius: "50%", background: "#232428", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 80 * s, height: 80 * s, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #2c2a26, #0e0d0b)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <Img src={afk.icon} style={{ width: 62 * s, height: 62 * s, objectFit: "contain" }} />
          </div>
          <div style={{ position: "absolute", right: 2 * s, bottom: 2 * s, width: 26 * s, height: 26 * s, borderRadius: "50%", background: "#232428", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <StatusDot status={status} size={16 * s} bg="#232428" />
          </div>
          {badge !== undefined && t >= badgeAt && (
            <div style={{ position: "absolute", right: -8 * s, top: -2 * s, minWidth: 30 * s, height: 30 * s, padding: `0 ${7 * s}px`, borderRadius: 15 * s, boxSizing: "border-box", background: "#f23f43", border: `${4 * s}px solid #232428`, color: "white", fontSize: 14 * s, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${bp})` }}>{badge}</div>
          )}
        </div>
        <div style={{ position: "absolute", left: 118 * s, top: -30 * s, maxWidth: 200 * s, padding: `${6 * s}px ${12 * s}px`, borderRadius: 14 * s, background: "#2b2d31", color: DISCORD.text, fontSize: 13 * s, boxShadow: `0 ${4 * s}px ${12 * s}px rgba(0,0,0,.35)` }}>
          <span style={{ fontFamily: "Noto Emoji" }}>☕</span> brb 5 min
          <div style={{ position: "absolute", left: 10 * s, bottom: -6 * s, width: 10 * s, height: 10 * s, borderRadius: "50%", background: "#2b2d31" }} />
        </div>
      </div>
      <div style={{ padding: `0 ${16 * s}px ${14 * s}px` }}>
        <div style={{ fontSize: 20 * s, fontWeight: 700, color: "#f2f3f5", lineHeight: 1.2, overflowWrap: "anywhere" }}>{afk.name}</div>
        <div style={{ fontSize: 14 * s, color: "#b5bac1" }}>{handle || "player"} · {status === "idle" ? "Idle" : "Offline"}</div>
        <div style={{ height: 1, background: "#3f4147", margin: `${12 * s}px 0 0` }} />
        {section("ABOUT ME", <>will take my turn soon™<br />pls do not ping</>)}
        {section("ROLES", (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 * s }}>
            {roles.map((r) => (
              <span key={r.label} style={{ display: "inline-flex", alignItems: "center", gap: 5 * s, padding: `${2 * s}px ${8 * s}px`, borderRadius: 4 * s, background: "#2b2d31", fontSize: 12 * s, fontWeight: 500 }}>
                <span style={{ width: 10 * s, height: 10 * s, borderRadius: "50%", background: r.color }} />{r.label}
              </span>
            ))}
          </div>
        ))}
        {section("LAST SEEN", <span style={{ color: "#fa777c" }}>Round 1 · 6 days ago</span>)}
        <div style={{ marginTop: 14 * s, height: 38 * s, borderRadius: 6 * s, border: `1px solid #3f4147`, background: "#1e1f22", display: "flex", alignItems: "center", padding: `0 ${12 * s}px`, color: "#6d6f78", fontSize: 14 * s }}>
          Message {G.mention}
        </div>
      </div>
    </div>
  );
};
