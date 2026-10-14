import React from "react";
import { Fill } from "../lib/stage";
import { clamp, ease } from "../lib/math";
import { G } from "../lib/game";
import { STAGE_W, useBleed } from "../lib/stage";

/** The two leads' systems with their units hidden, for shots that draw the leads by hand. */
export const hideLeads = () => new Set([G.heroPos, G.crushPos]);

/** Whip-pan transition wrapper: slides content in from `dir` at `inAt`, out at `outAt`. */
export const Whip: React.FC<{ t: number; inAt?: number; outAt?: number; dir?: 1 | -1; dur?: number; children: React.ReactNode }> = ({ t, inAt, outAt, dir = 1, dur = 0.2, children }) => {
  const span = STAGE_W + 2 * useBleed().x;
  let x = 0;
  let blur = 0;
  if (inAt !== undefined && t < inAt + dur) {
    const p = clamp((t - inAt) / dur);
    x = (1 - ease.outExpo(p)) * span * dir;
    blur = (1 - p) * 30;
  }
  if (outAt !== undefined && t > outAt) {
    const p = clamp((t - outAt) / dur);
    x = -ease.inExpo(p) * span * dir;
    blur = p * 30;
  }
  return (
    <Fill style={{ transform: `translateX(${x}px)`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined }}>
      {children}
    </Fill>
  );
};

/** Hold an element in for [a, b] with scale-pop entry and fade exit. */
export const pop = (t: number, a: number, b = Infinity, dur = 0.22) => {
  const pin = clamp((t - a) / dur);
  const pout = b === Infinity ? 0 : clamp((t - b) / 0.15);
  return { s: ease.outBack(pin, 2.2) * (1 - pout * 0.3), o: clamp(pin * 3) * (1 - pout), visible: t >= a && pout < 1 };
};
