import React from "react";
import { Fill } from "../lib/stage";
import { SceneProps } from "./types";
import { Stars } from "../components/Backdrop";
import { TypingIndicator } from "../components/Discord";
import { ProfileCard } from "../components/ProfileCard";
import { LyingPhone } from "../components/Phone";
import { SleepingFlagship } from "../components/SleepingFlagship";
import { clamp, ease } from "../lib/math";
import { FONT } from "../lib/fonts";
import { AUDIO_SECONDS } from "../lib/timing";
import { G, glowOf } from "../lib/game";

const PING_AT = AUDIO_SECONDS + 2.65;

/** Silent tail after the music cuts: the deadpan punchline. */
export const EndCard: React.FC<SceneProps> = ({ t, from }) => {
  const lt = t - from;
  const a = ease.outCubic(clamp(lt / 0.6));
  const typing = t > AUDIO_SECONDS + 0.9 && t < AUDIO_SECONDS + 2.25 && !(t > AUDIO_SECONDS + 1.5 && t < AUDIO_SECONDS + 1.62);
  const text = "It's still their turn.";
  const n = Math.floor(clamp((lt - 0.25) / 0.7) * text.length);
  return (
    <Fill style={{ background: "#020205" }}>
      <Stars t={t} drift={4} opacity={0.5} />
      <div style={{ position: "absolute", right: 130, top: 120, opacity: a, transform: `translateX(${(1 - a) * 80}px) rotate(2deg)` }}>
        <ProfileCard t={t} scale={1.42} badge={50} badgeAt={PING_AT} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: a }}>
        <SleepingFlagship t={t} x={720} y={905} scale={2.5} color={G.afk.color} glow={glowOf(G.afk.hex, 0.55)} />
        <LyingPhone t={t} x={1020} y={940} w={200} pings={[PING_AT]} />
      </div>
      {t > PING_AT && t < PING_AT + 1.2 && (
        <div style={{ position: "absolute", left: 1080, top: 820, fontFamily: FONT.mono, fontSize: 30, color: "#cfe0ff", letterSpacing: "0.2em", opacity: Math.exp(-(t - PING_AT) * 1.6) }}>(ping)</div>
      )}
      <div style={{ position: "absolute", left: 140, top: 330, opacity: a }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 64, color: "#eef1ff", whiteSpace: "pre" }}>
          {text.slice(0, n)}<span style={{ opacity: Math.floor(t * 2.4) % 2 ? 1 : 0 }}>▌</span>
        </div>
        <div style={{ height: 60, marginTop: 30 }}>{typing && <TypingIndicator t={t} name={G.afk.name} scale={2.1} />}</div>
      </div>
    </Fill>
  );
};
