import React from "react";
import { Img } from "../lib/Img";
import { DISCORD, botSrc } from "../lib/assets";
import { G } from "../lib/game";
import { FONT } from "../lib/fonts";
import { clamp, ease } from "../lib/math";

export type Btn = { label: string; style: "green" | "red" | "grey" | "blurple"; pressedAt?: number };
export type Msg = {
  at: number;
  author: string;
  avatar: string;
  color?: string;
  bot?: boolean;
  time?: string;
  text: React.ReactNode;
  buttons?: Btn[];
  /** Estimated rendered height in px (for smooth scrolling). */
  h?: number;
  /** Continuation of the previous author's group (no header). */
  cont?: boolean;
  highlight?: boolean;
};

const BTN_BG = { green: DISCORD.green, red: DISCORD.red, grey: DISCORD.grey, blurple: DISCORD.blurple };

export const Mention: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ background: DISCORD.mentionBg, color: DISCORD.mentionText, borderRadius: 4, padding: "0 3px", fontWeight: 500 }}>{children}</span>
);

export const Avatar: React.FC<{ src: string; size: number; status?: "online" | "idle" | "offline" | "dnd"; bg?: string; ring?: string }> = ({ src, size, status, bg = "#5865f2", ring = DISCORD.bg }) => (
  <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
    {status && (
      <div style={{ position: "absolute", right: -size * 0.06, bottom: -size * 0.06, width: size * 0.38, height: size * 0.38, borderRadius: "50%", background: ring, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <StatusDot status={status} size={size * 0.25} bg={ring} />
      </div>
    )}
  </div>
);

export const StatusDot: React.FC<{ status: "online" | "idle" | "offline" | "dnd"; size: number; bg?: string }> = ({ status, size, bg = DISCORD.bg }) => {
  if (status === "online") return <div style={{ width: size, height: size, borderRadius: "50%", background: "#23a55a" }} />;
  if (status === "dnd") return <div style={{ width: size, height: size, borderRadius: "50%", background: "#f23f43" }} />;
  if (status === "offline") return <div style={{ width: size, height: size, borderRadius: "50%", border: `${size * 0.28}px solid #80848e`, boxSizing: "border-box" }} />;
  return (
    <div style={{ position: "relative", width: size, height: size, borderRadius: "50%", background: "#f0b232", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -size * 0.15, top: -size * 0.15, width: size * 0.7, height: size * 0.7, borderRadius: "50%", background: bg }} />
    </div>
  );
};

export const DiscordButton: React.FC<{ btn: Btn; t: number; scale: number }> = ({ btn, t, scale }) => {
  const pressed = btn.pressedAt !== undefined && t >= btn.pressedAt;
  const pp = btn.pressedAt !== undefined ? clamp((t - btn.pressedAt) / 0.12) : 0;
  return (
    <div style={{
      background: pressed ? (btn.style === "green" ? "#1a6334" : BTN_BG[btn.style]) : BTN_BG[btn.style], color: "white", fontFamily: FONT.discord, fontWeight: 500,
      fontSize: 15 * scale, padding: `${3 * scale}px ${16 * scale}px`, height: 32 * scale, display: "flex", alignItems: "center", borderRadius: 4 * scale,
      transform: `scale(${pressed ? 1 - 0.08 * Math.sin(pp * Math.PI) : 1})`, boxShadow: pressed ? `0 0 ${20 * scale}px rgba(61,255,143,${0.8 * (1 - pp) + 0.2})` : undefined,
      whiteSpace: "nowrap", boxSizing: "border-box",
    }}>
      {pressed && btn.style === "green" ? "✓ " : ""}{btn.label}
    </div>
  );
};

type MessageProps = { m: Msg; t: number; scale: number };
/** Message text never changes over time, so once a message has finished sliding in, later frames can skip it. */
const settled = ({ m, t }: MessageProps) => t - m.at >= 0.18 && !m.buttons?.some((btn) => btn.pressedAt !== undefined);
const sameMessage = (a: MessageProps, b: MessageProps) =>
  a.scale === b.scale && a.m.at === b.m.at && a.m.author === b.m.author && a.m.time === b.m.time && a.m.cont === b.m.cont && settled(a) && settled(b);

export const MessageView = React.memo(({ m, t, scale }: MessageProps) => {
  const p = ease.outCubic((t - m.at) / 0.18);
  return (
    <div style={{
      display: "flex", gap: 16 * scale, padding: `${(m.cont ? 2 : 12) * scale}px ${16 * scale}px ${3 * scale}px`, opacity: p,
      transform: `translateY(${(1 - p) * 14 * scale}px)`, background: m.highlight ? DISCORD.highlight : undefined,
      boxShadow: m.highlight ? `inset ${3 * scale}px 0 0 ${DISCORD.highlightBar}` : undefined,
    }}>
      <div style={{ width: 40 * scale, flex: "none" }}>{!m.cont && <Avatar src={m.avatar} size={40 * scale} bg={m.bot ? "#0b1020" : "#2b2d31"} />}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        {!m.cont && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 * scale, fontFamily: FONT.discord }}>
            <span style={{ color: m.color ?? DISCORD.header, fontWeight: 600, fontSize: 16 * scale }}>{m.author}</span>
            {m.bot && <span style={{ background: DISCORD.blurple, color: "white", fontSize: 10 * scale, fontWeight: 700, padding: `${1 * scale}px ${5 * scale}px`, borderRadius: 3 * scale, lineHeight: 1.3 }}>APP</span>}
            <span style={{ color: DISCORD.muted, fontSize: 12 * scale, marginLeft: 2 * scale }}>{m.time ?? "Today at 9:41 PM"}</span>
          </div>
        )}
        <div style={{ color: DISCORD.text, fontFamily: FONT.discord, fontSize: 16 * scale, lineHeight: 1.375, marginTop: 2 * scale }}>{m.text}</div>
        {m.buttons && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 * scale, marginTop: 8 * scale }}>
            {m.buttons.map((b, i) => <DiscordButton key={i} btn={b} t={t} scale={scale} />)}
          </div>
        )}
      </div>
    </div>
  );
}, sameMessage);

export const TypingIndicator: React.FC<{ t: number; name: string; scale: number }> = ({ t, name, scale }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 * scale, fontFamily: FONT.discord, fontSize: 13 * scale, color: DISCORD.text, height: 24 * scale }}>
    <div style={{ display: "flex", gap: 3 * scale, marginRight: 2 * scale }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 6 * scale, height: 6 * scale, borderRadius: "50%", background: DISCORD.text, opacity: 0.4 + 0.6 * Math.max(0, Math.sin(t * 9 - i * 0.9)), transform: `translateY(${-Math.max(0, Math.sin(t * 9 - i * 0.9)) * 3 * scale}px)` }} />
      ))}
    </div>
    <span><b>{name}</b> is typing…</span>
  </div>
);

type WindowProps = {
  t: number;
  scale?: number;
  width: number;
  height: number;
  variant: "dm" | "channel";
  title: string;
  messages: Msg[];
  typing?: { from: number; to: number; name: string } | null;
  members?: { name: string; avatar: string; status: "online" | "idle" | "offline" | "dnd"; color?: string; sub?: string }[];
  style?: React.CSSProperties;
  inputPlaceholder?: string;
  dmIntro?: { avatar: string };
};

export const DiscordWindow: React.FC<WindowProps> = ({ t, scale = 1.6, width, height, variant, title, messages, typing, members, style, inputPlaceholder, dmIntro }) => {
  const visible = messages.filter((m) => t >= m.at);
  const last = visible[visible.length - 1];
  const scrollIn = last ? (1 - ease.outCubic((t - last.at) / 0.2)) * (last.h ?? 64) * scale : 0;
  const sidebarW = variant === "channel" ? 240 * scale : 0;
  const railW = variant === "channel" ? 72 * scale : 0;
  const memberW = members ? 240 * scale : 0;
  const icons = ["asyncti_icon", "asyncti_icon_fighterclub", "asyncti_icon_dreadnot", "asyncti_icon_warsuntzu", "asyncti_icon_whatsupdock", "asyncti_icon_greatcarrierreef", "asyncti_icon_hub"];
  return (
    <div style={{ position: "absolute", width, height, borderRadius: 12 * scale * 0.6, overflow: "hidden", display: "flex", background: DISCORD.bg, boxShadow: "0 40px 120px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.06)", fontFamily: FONT.discord, ...style }}>
      {variant === "channel" && (
        <div style={{ width: railW, background: DISCORD.rail, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 * scale, paddingTop: 12 * scale, flex: "none" }}>
          {icons.map((ic, i) => (
            <div key={ic} style={{ position: "relative" }}>
              {i === 1 && <div style={{ position: "absolute", left: -16 * scale, top: 8 * scale, width: 8 * scale, height: 32 * scale, borderRadius: 4 * scale, background: "white" }} />}
              <Img src={botSrc(`server_icons_${ic}.png`)} style={{ width: 48 * scale, height: 48 * scale, borderRadius: i === 1 ? 16 * scale : "50%" }} />
              {i > 2 && <div style={{ position: "absolute", right: -4 * scale, bottom: -4 * scale, minWidth: 16 * scale, height: 16 * scale, borderRadius: 8 * scale, background: "#f23f43", border: `${3 * scale}px solid ${DISCORD.rail}`, color: "white", fontSize: 10 * scale, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: `0 ${3 * scale}px` }}>{(i * 7) % 23 + 2}</div>}
            </div>
          ))}
        </div>
      )}
      {variant === "channel" && (
        <div style={{ width: sidebarW, background: DISCORD.sidebar, flex: "none", padding: `${12 * scale}px ${8 * scale}px`, boxSizing: "border-box" }}>
          <div style={{ color: DISCORD.header, fontWeight: 700, fontSize: 15 * scale, padding: `${4 * scale}px ${8 * scale}px ${14 * scale}px`, borderBottom: `1px solid #1f2023`, marginBottom: 10 * scale }}>AsyncTI4 (Fighter Club)</div>
          <div style={{ color: DISCORD.muted, fontSize: 11 * scale, fontWeight: 700, letterSpacing: "0.02em", padding: `${6 * scale}px ${8 * scale}px` }}>⌄ {G.tag}</div>
          {[G.cast.game.toLowerCase(), G.channel, `${G.cast.game.toLowerCase()}-bot-map-updates`, `cards-info-${G.cast.game.toLowerCase()}`].map((c, i) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 6 * scale, padding: `${6 * scale}px ${8 * scale}px`, borderRadius: 4 * scale, background: c === title ? "rgba(78,80,88,.6)" : undefined, color: c === title ? DISCORD.header : DISCORD.muted, fontSize: 15 * scale, fontWeight: c === title ? 600 : 500 }}>
              <span style={{ fontSize: 20 * scale, opacity: 0.7 }}>#</span>{c}
              {i === 0 && <span style={{ marginLeft: "auto", background: "#f23f43", color: "white", borderRadius: 8 * scale, fontSize: 11 * scale, fontWeight: 700, padding: `0 ${6 * scale}px` }}>{Math.min(99, 3 + visible.length * 4)}</span>}
            </div>
          ))}
        </div>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ height: 48 * scale, display: "flex", alignItems: "center", gap: 8 * scale, padding: `0 ${16 * scale}px`, borderBottom: "1px solid #1f2023", color: DISCORD.header, fontWeight: 600, fontSize: 16 * scale, flex: "none" }}>
          <span style={{ color: DISCORD.muted, fontSize: 24 * scale, fontWeight: 400 }}>{variant === "dm" ? "@" : "#"}</span>
          {title}
          {variant === "dm" && <StatusDot status="idle" size={10 * scale} />}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden", paddingBottom: 8 * scale }}>
          <div style={{ transform: `translateY(${scrollIn}px)` }}>
            {variant === "dm" && dmIntro && (
              <div style={{ padding: `${16 * scale}px ${16 * scale}px ${10 * scale}px` }}>
                <Avatar src={dmIntro.avatar} size={80 * scale} bg="#2b2d31" />
                <div style={{ color: DISCORD.header, fontWeight: 700, fontSize: 28 * scale, marginTop: 8 * scale }}>{title}</div>
                <div style={{ color: DISCORD.muted, fontSize: 14 * scale, marginTop: 4 * scale }}>This is the beginning of your direct message history with <b style={{ color: DISCORD.text }}>{title}</b>.</div>
                <div style={{ height: 1, background: "#3f4147", margin: `${14 * scale}px 0 ${4 * scale}px` }} />
              </div>
            )}
            {visible.map((m, i) => <MessageView key={i} m={m} t={t} scale={scale} />)}
          </div>
        </div>
        <div style={{ padding: `0 ${16 * scale}px ${8 * scale}px`, flex: "none" }}>
          <div style={{ height: 44 * scale, borderRadius: 8 * scale, background: DISCORD.input, display: "flex", alignItems: "center", padding: `0 ${16 * scale}px`, color: "#6d6f78", fontSize: 15 * scale }}>
            <span style={{ width: 24 * scale, height: 24 * scale, borderRadius: "50%", background: "#b5bac1", color: DISCORD.input, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, marginRight: 14 * scale, fontSize: 18 * scale }}>+</span>
            {inputPlaceholder ?? `Message ${variant === "dm" ? "@" : "#"}${title}`}
          </div>
          <div style={{ height: 24 * scale, paddingTop: 2 * scale }}>{typing && t >= typing.from && t < typing.to && <TypingIndicator t={t} name={typing.name} scale={scale} />}</div>
        </div>
      </div>
      {members && (
        <div style={{ width: memberW, background: DISCORD.sidebar, flex: "none", padding: `${18 * scale}px ${8 * scale}px` }}>
          <div style={{ color: DISCORD.muted, fontSize: 11 * scale, fontWeight: 700, padding: `0 ${8 * scale}px ${8 * scale}px` }}>PLAYERS — {members.length}</div>
          {members.map((mb) => (
            <div key={mb.name} style={{ display: "flex", alignItems: "center", gap: 12 * scale, padding: `${5 * scale}px ${8 * scale}px`, opacity: mb.status === "offline" ? 0.4 : 1 }}>
              <Avatar src={mb.avatar} size={32 * scale} status={mb.status} ring={DISCORD.sidebar} bg="#111" />
              <div>
                <div style={{ color: mb.color ?? DISCORD.text, fontSize: 15 * scale, fontWeight: 500 }}>{mb.name}</div>
                {mb.sub && <div style={{ color: DISCORD.muted, fontSize: 12 * scale }}>{mb.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/** The bot's phase banner embed (art from the bot's extra/*banner.png). */
export const BannerEmbed: React.FC<{ art: string; title: string; sub: string; scale: number }> = ({ art, title, sub, scale }) => (
  <div style={{ position: "relative", width: 420 * scale, height: 272 * scale, borderRadius: 8 * scale, overflow: "hidden", marginTop: 6 * scale }}>
    <Img src={botSrc(art)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 * scale, fontFamily: "Slider", color: "white", WebkitTextStroke: `${3 * scale}px #000`, paintOrder: "stroke fill", textShadow: `0 ${3 * scale}px ${8 * scale}px rgba(0,0,0,.8)` }}>
      <div style={{ fontSize: 44 * scale, letterSpacing: "0.04em" }}>{title}</div>
      <div style={{ fontSize: 26 * scale, letterSpacing: "0.04em" }}>{sub}</div>
    </div>
  </div>
);
