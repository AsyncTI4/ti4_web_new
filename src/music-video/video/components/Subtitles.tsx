import React from "react";
import { LINES, Line, kick } from "../lib/timing";
import { clamp, ease, hash } from "../lib/math";
import { FONT } from "../lib/fonts";
import { NEON } from "../lib/assets";

/** Visible window for each line: from just before its first word until the next line takes over. */
const WINDOWS = LINES.map((ln, i) => {
  const next = LINES[i + 1];
  const tail = ln.section === "outro" ? 1.6 : 0.9;
  const end = Math.min(ln.end + tail, next ? next.start - 0.06 : ln.end + tail);
  return { start: ln.words[0].s - 0.12, end: Math.max(end, ln.end + 0.05) };
});

export const Subtitles: React.FC<{ t: number }> = ({ t }) => {
  const idx = WINDOWS.findIndex((w) => t >= w.start && t < w.end + 0.16);
  if (idx < 0) return null;
  const line = LINES[idx];
  const win = WINDOWS[idx];
  const exitP = clamp((t - win.end) / 0.16);
  const bandIn = clamp((t - win.start) / 0.2) * (1 - exitP);
  const band = <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 300, background: "linear-gradient(180deg, transparent, rgba(2,3,10,0.62) 70%, rgba(2,3,10,0.78))", opacity: bandIn, zIndex: 49, pointerEvents: "none" }} />;
  if (line.section.startsWith("verse")) return <>{band}<RapLine line={line} t={t} exitP={exitP} index={idx} /></>;
  if (line.section.startsWith("chorus")) return <>{band}<SungLine line={line} t={t} exitP={exitP} enterAt={win.start} /></>;
  return <>{band}<SpokenLine line={line} t={t} exitP={exitP} /></>;
};

const wrap: React.CSSProperties = {
  position: "absolute", left: 120, right: 120, bottom: 70, display: "flex", flexWrap: "wrap", justifyContent: "center",
  alignItems: "baseline", columnGap: 20, rowGap: 0, pointerEvents: "none", zIndex: 50,
};

const RapLine: React.FC<{ line: Line; t: number; exitP: number; index: number }> = ({ line, t, exitP, index }) => {
  const k = kick(t);
  return (
    <div style={{ ...wrap, opacity: 1 - exitP, transform: `translateY(${-exitP * 40}px) skewX(${-exitP * 12}deg)` }}>
      {line.words.map((w, i) => {
        const p = (t - w.s) / 0.2;
        if (p < 0) return <span key={i} style={{ fontFamily: FONT.display, fontSize: 64, opacity: 0 }}>{w.w}</span>;
        const s = 1.65 - 0.65 * ease.outBack(p, 2.4);
        const nextS = line.words[i + 1]?.s ?? w.e + 0.25;
        const active = t >= w.s && t < nextS;
        const jitter = (hash(index * 31 + i) - 0.5) * 10 * (1 - ease.outCubic(p));
        const accent = i % 3 === 0 ? NEON.yellow : i % 3 === 1 ? NEON.cyan : NEON.magenta;
        return (
          <span
            key={i}
            style={{
              display: "inline-block", fontFamily: FONT.display, fontSize: 64, lineHeight: 1.12, textTransform: "uppercase",
              color: active ? accent : "#ffffff", opacity: clamp(p * 3),
              transform: `translateY(${(1 - ease.outCubic(p)) * -26}px) scale(${s * (active ? 1 + k * 0.06 : 1)}) rotate(${jitter}deg)`,
              WebkitTextStroke: "10px #05070f", paintOrder: "stroke fill",
              textShadow: active ? `0 0 26px ${accent}, 0 0 4px ${accent}` : "0 6px 0 rgba(0,0,0,.55)",
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

const SungLine: React.FC<{ line: Line; t: number; exitP: number; enterAt: number }> = ({ line, t, exitP, enterAt }) => {
  const enter = ease.outCubic((t - enterAt) / 0.35);
  return (
    <div
      style={{
        ...wrap, bottom: 64, opacity: enter * (1 - exitP),
        filter: `blur(${(1 - enter) * 10 + exitP * 8}px)`,
        transform: `translateY(${(1 - enter) * 30 - exitP * 20}px) scale(${1 + exitP * 0.06})`,
        letterSpacing: `${(1 - enter) * 0.18}em`,
      }}
    >
      {line.words.map((w, i) => {
        const prog = clamp((t - w.s) / Math.max(0.12, w.e - w.s));
        const lift = ease.outBack(clamp((t - w.s) / 0.25), 3) * (1 - clamp((t - w.e) / 0.4));
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", fontFamily: FONT.text, fontStyle: "italic", fontWeight: 700, fontSize: 66, lineHeight: 1.15, transform: `translateY(${-lift * 8}px)` }}>
            <span style={{ color: "rgba(255,255,255,0.5)", WebkitTextStroke: "9px rgba(5,7,15,.9)", paintOrder: "stroke fill" }}>{w.w}</span>
            <span
              style={{
                position: "absolute", left: 0, top: 0, whiteSpace: "nowrap",
                backgroundImage: `linear-gradient(90deg, ${NEON.magenta}, #ffd1f6 45%, ${NEON.cyan})`,
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
                clipPath: `inset(-20% ${100 - prog * 100}% -20% -5%)`,
                filter: `drop-shadow(0 0 ${10 + lift * 14}px rgba(255, 43, 214, 0.85))`,
              }}
            >
              {w.w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

const SpokenLine: React.FC<{ line: Line; t: number; exitP: number }> = ({ line, t, exitP }) => {
  const chars: { c: string; at: number }[] = [];
  line.words.forEach((w, i) => {
    const dur = Math.max(0.15, (w.e - w.s) * 0.9);
    [...w.w].forEach((c, j) => chars.push({ c, at: w.s + (dur * j) / w.w.length }));
    if (i < line.words.length - 1) chars.push({ c: " ", at: w.e });
  });
  const shown = chars.filter((c) => t >= c.at).length;
  const caretOn = Math.floor(t * 2.4) % 2 === 0 || shown < chars.length;
  return (
    <div style={{ ...wrap, bottom: 80, opacity: 1 - exitP }}>
      <span style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: 48, color: "#e8ecff", textShadow: "0 0 18px rgba(140,170,255,.55), 0 3px 0 #000", whiteSpace: "pre" }}>
        {chars.slice(0, shown).map((c) => c.c).join("")}
        <span style={{ display: "inline-block", width: "0.6em", height: "0.95em", marginLeft: 4, verticalAlign: "-0.12em", background: caretOn ? "#e8ecff" : "transparent" }} />
      </span>
    </div>
  );
};
