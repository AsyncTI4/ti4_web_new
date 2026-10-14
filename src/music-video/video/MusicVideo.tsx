import React, { useMemo } from "react";
import { AbsoluteFill, Audio, useCurrentFrame } from "remotion";
import { assetUrl } from "../assetUrls";
import { FPS, AUDIO_SECONDS, SECTIONS, bt, snare } from "./lib/timing";
import { TurnTimer } from "./components/TurnTimer";
import { SCENES } from "./scenes";
import { Subtitles } from "./components/Subtitles";
import { PostFX } from "./fx/PostFX";
import { BleedContext, Fill, STAGE_H, STAGE_W } from "./lib/stage";

/** Big hits that get an RGB-split jolt. The split is faked with a sideways jump and red/cyan edge
 * fringes: a real channel-split SVG filter over the whole stage made Chrome's GPU compositor tear
 * rectangles out of the blurred and will-change layers underneath, so those hits flickered. */
const CHROMA_HITS = [bt(32), bt(64), bt(80), bt(96), bt(128), bt(152), bt(156), bt(160), bt(164), bt(168)];
const FRINGE = "linear-gradient(90deg, rgba(255,40,90,.6), rgba(255,40,90,0) 16%, rgba(0,220,255,0) 84%, rgba(0,220,255,.6))";

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
  const side = frame % 2 ? 1 : -1;
  const shiftX = (sn > 0.15 ? side * sn * 5 : 0) + (chroma > 1 ? side * chroma * 0.6 : 0);
  const shiftY = sn > 0.15 ? (frame % 3 ? -1 : 1) * sn * 3 : 0;
  // a hair of zoom during a hit keeps the jump from baring the window edge
  const twitch = shiftX || shiftY ? `translate(${shiftX}px, ${shiftY}px)${chroma > 1 ? ` scale(${1 + chroma * 0.0008})` : ""}` : undefined;
  return (
    <BleedContext.Provider value={bleed}>
      <AbsoluteFill style={{ background: "#03050b", overflow: "hidden" }}>
        <Audio src={assetUrl("audio/song.m4a")} endAt={Math.ceil(AUDIO_SECONDS * FPS)} />
        {/* The 1920x1080 stage every scene is laid out on, centred; scene layers bleed out to the window edges. */}
        <div style={{ position: "absolute", left: bleedX, top: bleedY, width: STAGE_W, height: STAGE_H }}>
          <Fill style={{ transform: twitch }}>
            {SCENES.filter((s) => t >= s.from && t < s.to).map((s) => (
              <Fill key={s.id} style={{ zIndex: s.z ?? 0 }}>
                <s.C t={t} from={s.from} to={s.to} />
              </Fill>
            ))}
          </Fill>
        </div>
        {chroma > 1 && <AbsoluteFill style={{ background: FRINGE, mixBlendMode: "screen", opacity: chroma / 18, pointerEvents: "none" }} />}
        {/* HUD, subtitles and grain hug the real window edges. */}
        <TurnTimer t={t} visible={!SCENES.some((s) => (s.id === "c1-bot" || s.id === "c2-bot" || s.id === "v3-phone") && t >= s.from - 0.1 && t < s.to)} />
        <Subtitles t={t} />
        <PostFX t={t} />
      </AbsoluteFill>
    </BleedContext.Provider>
  );
};
