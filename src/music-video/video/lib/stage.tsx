import React, { createContext, useContext } from "react";
import { AbsoluteFill } from "remotion";

/*
 * Every scene is laid out on a 1920x1080 stage. The composition itself takes the window's
 * aspect ratio, so the video fills the window exactly: the stage sits centred and "bleed"
 * extends it by `x` px left and right (wide windows) or `y` px top and bottom (tall ones).
 * Backgrounds, the board and the starfield spill into the bleed; scene content stays on stage.
 */
export const STAGE_W = 1920;
export const STAGE_H = 1080;

export type Bleed = { x: number; y: number };
export const BleedContext = createContext<Bleed>({ x: 0, y: 0 });
export const useBleed = () => useContext(BleedContext);

/** Composition size for a window: the stage plus bleed, with the aspect clamped to 4:3 .. 21:9. */
export function compositionFor(width: number, height: number) {
  const aspect = Math.min(21 / 9, Math.max(4 / 3, width / height));
  if (aspect >= STAGE_W / STAGE_H) {
    const w = Math.round((STAGE_H * aspect) / 2) * 2;
    return { width: w, height: STAGE_H, bleed: { x: (w - STAGE_W) / 2, y: 0 } };
  }
  const h = Math.round(STAGE_W / aspect / 2) * 2;
  return { width: STAGE_W, height: h, bleed: { x: 0, y: (h - STAGE_H) / 2 } };
}

const LAYOUT_KEYS = ["display", "flexDirection", "alignItems", "justifyContent", "gap", "perspective"] as const;

/** Percent transform origins were written against the stage; re-express them in the bleed box. */
function stageOrigin(origin: React.CSSProperties["transformOrigin"], { x, y }: Bleed) {
  if (typeof origin !== "string") return origin;
  const m = /^\s*([\d.]+)%\s+([\d.]+)%\s*$/.exec(origin);
  return m ? `${x + (Number(m[1]) / 100) * STAGE_W}px ${y + (Number(m[2]) / 100) * STAGE_H}px` : origin;
}

/**
 * A full-frame layer (drop-in for AbsoluteFill inside scenes). Its visuals (background, filter,
 * transform, opacity, overflow) cover the whole window including the bleed; its children keep
 * stage coordinates, with flex layout (centring) relative to the stage.
 */
export const Fill: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => {
  const bleed = useBleed();
  if (!bleed.x && !bleed.y) return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
  const outer: React.CSSProperties = { ...style };
  const inner: React.CSSProperties = { position: "absolute", left: bleed.x, top: bleed.y, width: STAGE_W, height: STAGE_H, display: "flex", flexDirection: "column" };
  for (const key of LAYOUT_KEYS) {
    if (outer[key] !== undefined) {
      (inner as Record<string, unknown>)[key] = outer[key];
      delete outer[key];
    }
  }
  return (
    <div style={{ position: "absolute", left: -bleed.x, top: -bleed.y, width: STAGE_W + 2 * bleed.x, height: STAGE_H + 2 * bleed.y, ...outer, transformOrigin: stageOrigin(outer.transformOrigin, bleed) }}>
      <div style={inner}>{children}</div>
    </div>
  );
};
