import React, { useMemo } from "react";
import { AbsoluteFill, Audio, useCurrentFrame } from "remotion";
import { assetUrl } from "../assetUrls";
import { FPS, AUDIO_SECONDS, SECTIONS, bt, snare } from "./lib/timing";
import { TurnTimer } from "./components/TurnTimer";
import { SCENES } from "./scenes";
import { Subtitles } from "./components/Subtitles";
import { PostFX } from "./fx/PostFX";
import { BleedContext, Fill, STAGE_H, STAGE_W } from "./lib/stage";

/** Big hits that get an RGB channel split. */
const CHROMA_HITS = [bt(32), bt(64), bt(80), bt(96), bt(128), bt(152), bt(156), bt(160), bt(164), bt(168)];

const ChromaFilter: React.FC<{ amount: number }> = ({ amount }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="chroma" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
      <feOffset in="r" dx={amount} dy={0} result="r2" />
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
      <feOffset in="b" dx={-amount} dy={amount * 0.3} result="b2" />
      <feBlend in="r2" in2="g" mode="screen" result="rg" />
      <feBlend in="rg" in2="b2" mode="screen" />
    </filter>
  </svg>
);

export type MusicVideoProps = { bleedX?: number; bleedY?: number };

export const MusicVideo: React.FC<MusicVideoProps> = ({ bleedX = 0, bleedY = 0 }) => {
  const bleed = useMemo(() => ({ x: bleedX, y: bleedY }), [bleedX, bleedY]);
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // neurotic twitch: during the rap verses the whole stage jolts on snare hits
  const rap = SECTIONS.some((s) => s.id.startsWith("verse") && t >= s.start && t < s.end);
  const sn = rap ? snare(t, 0.06) : 0;
  const hit = CHROMA_HITS.map((h) => t - h).filter((d) => d >= 0 && d < 0.2).sort((a, b) => a - b)[0];
  const chroma = hit === undefined ? 0 : Math.round(18 * Math.exp(-hit / 0.06));
  const twitch = sn > 0.15 ? `translate(${(frame % 2 ? 1 : -1) * sn * 5}px, ${(frame % 3 ? -1 : 1) * sn * 3}px)` : undefined;
  return (
    <BleedContext.Provider value={bleed}>
      <AbsoluteFill style={{ background: "#03050b", overflow: "hidden" }}>
        <Audio src={assetUrl("audio/song.m4a")} endAt={Math.ceil(AUDIO_SECONDS * FPS)} />
        {chroma > 1 && <ChromaFilter amount={chroma} />}
        {/* The 1920x1080 stage every scene is laid out on, centred; scene layers bleed out to the window edges. */}
        <div style={{ position: "absolute", left: bleedX, top: bleedY, width: STAGE_W, height: STAGE_H }}>
          <Fill style={{ transform: twitch, filter: chroma > 1 ? "url(#chroma)" : undefined }}>
            {SCENES.filter((s) => t >= s.from && t < s.to).map((s) => (
              <Fill key={s.id} style={{ zIndex: s.z ?? 0 }}>
                <s.C t={t} from={s.from} to={s.to} />
              </Fill>
            ))}
          </Fill>
        </div>
        {/* HUD, subtitles and grain hug the real window edges. */}
        <TurnTimer t={t} visible={!SCENES.some((s) => (s.id === "c1-bot" || s.id === "c2-bot" || s.id === "v3-phone") && t >= s.from - 0.1 && t < s.to)} />
        <Subtitles t={t} />
        <PostFX t={t} />
      </AbsoluteFill>
    </BleedContext.Provider>
  );
};
