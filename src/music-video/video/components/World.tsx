import React from "react";
import { STAGE_H, STAGE_W, useBleed } from "../lib/stage";

export type Cam = {
  x: number;
  y: number;
  zoom: number;
  rot?: number;
  /** rotateX in degrees for a tabletop perspective. */
  tilt?: number;
  /** Screen-space shake offset in px. */
  shakeX?: number;
  shakeY?: number;
};

/** A viewport onto world coordinates (0,0 = Mecatol), centred on the stage and as big as the window. */
export const World: React.FC<{ cam: Cam; children: React.ReactNode; perspective?: number }> = ({ cam, children, perspective = 2200 }) => {
  const { x, y, zoom, rot = 0, tilt = 0, shakeX = 0, shakeY = 0 } = cam;
  const bleed = useBleed();
  return (
    <div style={{ position: "absolute", left: -bleed.x, top: -bleed.y, width: STAGE_W + 2 * bleed.x, height: STAGE_H + 2 * bleed.y, overflow: "hidden", perspective: tilt ? perspective : undefined }}>
      <div
        style={{
          position: "absolute",
          left: STAGE_W / 2 + bleed.x + shakeX,
          top: STAGE_H / 2 + bleed.y + shakeY,
          width: 0,
          height: 0,
          transformStyle: tilt ? "preserve-3d" : undefined,
          transform: `${tilt ? `rotateX(${tilt}deg) ` : ""}scale(${zoom}) rotate(${rot}deg) translate(${-x}px, ${-y}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Positions children at a world point. */
export const At: React.FC<{ x: number; y: number; z?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, z, children, style }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, zIndex: z, ...style }}>{children}</div>
);
