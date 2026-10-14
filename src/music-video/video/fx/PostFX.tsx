import React from "react";
import { AbsoluteFill } from "remotion";
import { assetUrl } from "../../assetUrls";
import { clamp, hash } from "../lib/math";
import { CUES } from "../lib/cues";
import { AUDIO_SECONDS } from "../lib/timing";
import { STAGE_H, STAGE_W, useBleed } from "../lib/stage";

/** Film grain, scanlines, vignette and cue-driven flashes over everything. */
export const PostFX: React.FC<{ t: number }> = ({ t }) => {
  const frame = Math.round(t * 60);
  let flash = 0;
  let flashColor = "255,255,255";
  for (const c of CUES.flashes) {
    const dt = t - c.t;
    if (dt < -0.02 || dt > c.tau * 6) continue;
    const a = dt < 0 ? (1 + dt / 0.02) * c.a : c.a * Math.exp(-dt / c.tau);
    if (a > flash) {
      flash = a;
      flashColor = c.color ?? "255,255,255";
    }
  }
  const fadeOut = clamp((t - (AUDIO_SECONDS + 3.2)) / 0.5);
  const bleed = useBleed();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
      {/* Static layers sit on their own compositor layers: drawn once, never repainted. */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.62) 100%)", willChange: "transform" }} />
      {/* Film grain: one oversized pre-drawn layer jumped to a random offset every other frame by the
          compositor (the same pattern a moving background-position gives, without a repaint). */}
      <div
        style={{
          position: "absolute", left: -1024, top: -1024, width: STAGE_W + 2 * bleed.x + 1024, height: STAGE_H + 2 * bleed.y + 1024,
          backgroundImage: `url(${assetUrl("misc/noise.png")})`, backgroundSize: "1024px 1024px", imageRendering: "auto",
          transform: `translate(${Math.floor(hash(Math.floor(frame / 2)) * 1024)}px, ${Math.floor(hash(Math.floor(frame / 2) + 99) * 1024)}px)`,
          mixBlendMode: "overlay", opacity: 0.075, willChange: "transform",
        }}
      />
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1px, transparent 1px, transparent 3px)", opacity: 0.55, willChange: "transform" }} />
      {flash > 0.003 && <AbsoluteFill style={{ background: `rgb(${flashColor})`, opacity: Math.min(1, flash), mixBlendMode: "screen" }} />}
      {fadeOut > 0 && <AbsoluteFill style={{ background: "#000", opacity: fadeOut }} />}
    </AbsoluteFill>
  );
};
