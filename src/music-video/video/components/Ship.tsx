import React from "react";
import { Img } from "../lib/Img";
import { NATIVE_ANGLE, UNIT_SIZE, UnitType, spriteOf } from "../lib/assets";

type Props = {
  color: string;
  unit: UnitType;
  /** Multiplier on the native sprite size. */
  scale?: number;
  x?: number;
  y?: number;
  /** Extra rotation in degrees (applied on top of the sprite's native heading). */
  rotate?: number;
  /** If set, rotates so the nose points along this heading (degrees, screen space). */
  heading?: number;
  /** Additional transform appended after positioning (dance moves etc). */
  transform?: string;
  glow?: string;
  glowSize?: number;
  opacity?: number;
  filter?: string;
  style?: React.CSSProperties;
  zIndex?: number;
};

export const Ship: React.FC<Props> = ({
  color, unit, scale = 1, x = 0, y = 0, rotate = 0, heading, transform = "", glow, glowSize = 10,
  opacity = 1, filter, style, zIndex,
}) => {
  const [w, h] = UNIT_SIZE[unit];
  const sprite = spriteOf(color, unit);
  const rot = heading !== undefined ? heading - NATIVE_ANGLE(unit) : rotate;
  const filters = [filter, glow ? `drop-shadow(0 0 ${glowSize}px ${glow})` : undefined].filter(Boolean).join(" ");
  return (
    <Img
      src={sprite.src}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: w * scale,
        height: h * scale,
        transform: `translate(${x - (w * scale) / 2}px, ${y - (h * scale) / 2}px) ${transform} rotate(${rot}deg)`,
        transformOrigin: "50% 50%",
        opacity,
        filter: filters || undefined,
        // 4x files downsample smoothly until they'd be enlarged; native fallbacks go pixel-crisp sooner
        imageRendering: scale > (sprite.native ? 1.6 : 3.6) ? "pixelated" : "auto",
        zIndex,
        ...style,
      }}
    />
  );
};
