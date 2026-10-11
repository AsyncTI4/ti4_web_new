import type { CSSProperties } from "react";
import { resolvePrimaryRgb } from "@/entities/lookup/colors";

/** Player colour as an rgb triplet on `--pc`, for a seat's colour band. */
export function seatColorStyle(color: string): CSSProperties | undefined {
  const rgb = resolvePrimaryRgb(color);
  if (!rgb) return undefined;
  return { "--pc": `${rgb.red} ${rgb.green} ${rgb.blue}` } as CSSProperties;
}
