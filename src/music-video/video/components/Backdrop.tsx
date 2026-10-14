import React, { useLayoutEffect, useRef } from "react";
import { Fill } from "../lib/stage";
import { Img } from "../lib/Img";
import { STAGE_H, STAGE_W, useBleed } from "../lib/stage";
import { botSrc } from "../lib/assets";
import { rng } from "../lib/math";

/** The async TI4 starfield art, slowly drifting. */
export const Starfield: React.FC<{ t: number; zoom?: number; x?: number; y?: number; opacity?: number; hue?: number; brightness?: number }> = ({ t, zoom = 1.1, x = 0, y = 0, opacity = 1, hue = 0, brightness = 1 }) => (
  <Fill style={{ overflow: "hidden", opacity }}>
    <Img
      src={botSrc("extra_starfield.jpg")}
      style={{
        position: "absolute", left: "50%", top: "50%", width: 1920 * 1.15, height: "auto",
        transform: `translate(-50%, -50%) translate(${x + Math.sin(t * 0.05) * 30}px, ${y - 700 + t * 4}px) scale(${zoom}) rotate(90deg)`,
        filter: `hue-rotate(${hue}deg) brightness(${brightness}) saturate(1.2)`,
        willChange: "transform, filter",
      }}
    />
  </Fill>
);

const STAR_COUNT = 420;
const LEVELS = 32;
const buckets: number[][] = Array.from({ length: LEVELS }, () => []);
const STARS = (() => {
  const r = rng(7);
  return Array.from({ length: STAR_COUNT }, () => ({ x: r() * 2 - 1, y: r() * 2 - 1, z: r(), tw: r() * 6.28, hue: r() }));
})();

/** Procedural parallax stars with optional hyperspace warp streaks. */
export const Stars: React.FC<{ t: number; drift?: number; warp?: number; opacity?: number; tint?: string; cx?: number; cy?: number }> = ({ t, drift = 20, warp = 0, opacity = 1, tint = "#cfe6ff", cx: stageCx = 960, cy: stageCy = 540 }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const bleed = useBleed();
  const W = STAGE_W + 2 * bleed.x;
  const H = STAGE_H + 2 * bleed.y;
  useLayoutEffect(() => {
    const ctx = ref.current!.getContext("2d")!;
    const cx = stageCx + bleed.x;
    const cy = stageCy + bleed.y;
    const wrap = W + 280;
    const spreadY = H / 2 + 100;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (const s of STARS) {
      const depth = 0.25 + s.z * 0.75;
      // forward travel for warp: stars move outward from centre
      const travel = (t * (0.04 + warp * 0.9) + s.z) % 1;
      const persp = warp > 0 ? 0.3 + travel * 2.2 : 1;
      const px = cx + (s.x * (W / 2 + 140) + ((t * drift * depth) % wrap)) * persp;
      const wrappedX = warp > 0 ? cx + s.x * (W / 2 + 140) * persp : ((px % wrap) + wrap) % wrap - 140;
      const wrappedY = cy + s.y * spreadY * persp;
      const tw = 0.55 + 0.45 * Math.sin(t * 3 + s.tw);
      const a = (0.25 + 0.75 * s.z) * tw * opacity;
      if (warp > 0.02) {
        const len = warp * 140 * travel * depth;
        const dx = wrappedX - cx;
        const dy = wrappedY - cy;
        const d = Math.hypot(dx, dy) || 1;
        ctx.strokeStyle = s.hue > 0.7 ? `rgba(255,120,230,${a})` : s.hue > 0.4 ? `rgba(120,230,255,${a})` : `rgba(230,240,255,${a})`;
        ctx.lineWidth = 1 + depth * 2 * travel;
        ctx.beginPath();
        ctx.moveTo(wrappedX, wrappedY);
        ctx.lineTo(wrappedX - (dx / d) * len, wrappedY - (dy / d) * len);
        ctx.stroke();
      } else {
        // dots are batched by brightness: one fill per level instead of one per star
        const level = Math.min(LEVELS - 1, Math.round(a * (LEVELS - 1)));
        if (level > 0) buckets[level].push(wrappedX, wrappedY, 0.6 + depth * 1.6);
      }
    }
    ctx.fillStyle = tint;
    buckets.forEach((dots, level) => {
      if (!dots.length) return;
      ctx.globalAlpha = level / (LEVELS - 1);
      ctx.beginPath();
      for (let i = 0; i < dots.length; i += 3) {
        ctx.moveTo(dots[i] + dots[i + 2], dots[i + 1]);
        ctx.arc(dots[i], dots[i + 1], dots[i + 2], 0, Math.PI * 2);
      }
      ctx.fill();
      dots.length = 0;
    });
    ctx.globalAlpha = 1;
  }, [t, drift, warp, opacity, tint, stageCx, stageCy, bleed.x, bleed.y, W, H]);
  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", left: -bleed.x, top: -bleed.y, width: W, height: H }} />;
};
