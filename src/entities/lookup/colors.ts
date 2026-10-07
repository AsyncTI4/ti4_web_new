import { colors } from "@/entities/data/colors";
import type { Color, RGBColor } from "@/entities/data/types";

const FALLBACK_COLOR_ALIAS = "lgy";
const FALLBACK_RGB: RGBColor = { red: 148, green: 163, blue: 184 };

/** Resolves a color ref when present, otherwise returns the direct color. */
export const getColorValues = (
  colorRef: string | undefined,
  directColor: RGBColor | undefined,
) => {
  if (colorRef) return findColorData(colorRef)?.primaryColor;
  return directColor;
};

const colorsByKey = new Map<string, Color>();
colors.forEach((c) => {
  [c.alias, c.name, ...c.aliases].forEach((key) => {
    if (!colorsByKey.has(key)) colorsByKey.set(key, c);
  });
});

export const findColorData = (color: string) => colorsByKey.get(color);

export const getColorAlias = (color?: string) => {
  if (!color) return FALLBACK_COLOR_ALIAS;
  return findColorData(color)?.alias || FALLBACK_COLOR_ALIAS;
};

export const getTextColor = (color: string) => {
  return findColorData(color)?.textColor || "white";
};

export const toRgb = ({ red, green, blue }: RGBColor) =>
  `rgb(${red}, ${green}, ${blue})`;

export const toRgba = ({ red, green, blue }: RGBColor, alpha: number) =>
  `rgba(${red}, ${green}, ${blue}, ${alpha})`;

export const resolvePrimaryRgb = (color: string): RGBColor | undefined => {
  const colorData = findColorData(color);
  if (!colorData) return undefined;
  return getColorValues(colorData.primaryColorRef, colorData.primaryColor);
};

export const getPrimaryColorCSS = (color: string) =>
  toRgb(resolvePrimaryRgb(color) ?? FALLBACK_RGB);

export const getPrimaryColorWithOpacity = (
  color: string,
  opacity: number = 0.7,
) => toRgba(resolvePrimaryRgb(color) ?? FALLBACK_RGB, opacity);

export const generateColorGradient = (color: string, opacity: number = 0.6) => {
  const colorData = findColorData(color);
  const primary = resolvePrimaryRgb(color);
  const primaryColor = toRgba(primary ?? FALLBACK_RGB, opacity);

  const secondary =
    colorData &&
    primary &&
    getColorValues(colorData.secondaryColorRef, colorData.secondaryColor);
  if (!secondary) {
    return `linear-gradient(90deg, transparent 0%, ${primaryColor} 50%, transparent 100%)`;
  }

  const secondaryColor = toRgba(secondary, opacity);
  return `linear-gradient(90deg, transparent 0%, ${primaryColor} 25%, ${primaryColor} 45%, ${secondaryColor} 55%, ${secondaryColor} 75%, transparent 100%)`;
};
