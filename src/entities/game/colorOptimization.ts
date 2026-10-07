/** Spreads faction colors apart perceptually while changing each as little as possible. */

import { colors } from "@/entities/data/colors";
import { getColorValues } from "@/entities/lookup/colors";
import type { PlayerDataResponse, RGBColor } from "@/entities/data/types";
import type { FactionColorMap } from "@/entities/game/types";

/** Color assignment order when the accessible-colors setting is on. */
export const ACCESSIBLE_COLOR_ORDER = [
  "blue",
  "green",
  "purple",
  "yellow",
  "red",
  "pink",
  "black",
  "lightgray",
];

type ColorWithId = {
  id: string;
  color: RGBColor;
};

type LabColor = { l: number; a: number; b: number };

/** sRGB → CIELAB (D65), for perceptual distance. */
const rgbToLab = (rgb: RGBColor): LabColor => {
  let r = rgb.red / 255;
  let g = rgb.green / 255;
  let b = rgb.blue / 255;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

  const xn = x / 0.95047;
  const yn = y / 1.0;
  const zn = z / 1.08883;

  const fx = xn > 0.008856 ? Math.pow(xn, 1 / 3) : 7.787 * xn + 16 / 116;
  const fy = yn > 0.008856 ? Math.pow(yn, 1 / 3) : 7.787 * yn + 16 / 116;
  const fz = zn > 0.008856 ? Math.pow(zn, 1 / 3) : 7.787 * zn + 16 / 116;

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bLab = 200 * (fy - fz);

  return { l, a, b: bLab };
};

const labToRgb = (lab: LabColor): RGBColor => {
  const fy = (lab.l + 16) / 116;
  const fx = lab.a / 500 + fy;
  const fz = fy - lab.b / 200;

  const xn = fx > 0.206893 ? Math.pow(fx, 3) : (fx - 16 / 116) / 7.787;
  const yn = fy > 0.206893 ? Math.pow(fy, 3) : (fy - 16 / 116) / 7.787;
  const zn = fz > 0.206893 ? Math.pow(fz, 3) : (fz - 16 / 116) / 7.787;

  const x = xn * 0.95047;
  const y = yn * 1.0;
  const z = zn * 1.08883;

  let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  let g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
  let b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  return {
    red: Math.max(0, Math.min(255, Math.round(r * 255))),
    green: Math.max(0, Math.min(255, Math.round(g * 255))),
    blue: Math.max(0, Math.min(255, Math.round(b * 255))),
  };
};

/** Sets LAB luminance and chroma while preserving hue; grays only change luminance. */
const adjustColorLuminanceAndChroma = (
  rgb: RGBColor,
  targetLuminance: number,
  targetChroma: number,
): RGBColor => {
  const lab = rgbToLab(rgb);
  const currentChroma = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  const chromaRatio = currentChroma === 0 ? 1 : targetChroma / currentChroma;

  return labToRgb({
    l: targetLuminance,
    a: lab.a * chromaRatio,
    b: lab.b * chromaRatio,
  });
};

export const normalizeBorderColor = (color: RGBColor): RGBColor => {
  const isNeutral = color.red === color.green && color.green === color.blue;
  return isNeutral
    ? adjustColorLuminanceAndChroma(color, 70, 0)
    : adjustColorLuminanceAndChroma(color, 65, 53);
};

/** Delta E (CIE76). */
const calculateColorDistance = (color1: RGBColor, color2: RGBColor): number => {
  const lab1 = rgbToLab(color1);
  const lab2 = rgbToLab(color2);

  const deltaL = lab1.l - lab2.l;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;

  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
};

/** Only colors closer than this to another color are nudged apart. */
const MIN_DESIRED_DISTANCE = 50;

/** LAB a/b nudges tried on a crowded color: red, green, yellow, blue, warm, cool, and mixes. */
const LAB_ADJUSTMENTS = [
  { a: 20, b: 0 },
  { a: -20, b: 0 },
  { a: 0, b: 20 },
  { a: 0, b: -20 },
  { a: 15, b: 15 },
  { a: -15, b: -15 },
  { a: 25, b: 8 },
  { a: -12, b: 18 },
  { a: 12, b: -25 },
];

/**
 * Normalizes every color to the target luminance and chroma, then (for three or
 * more colors) nudges any color crowding another toward the best LAB adjustment.
 */
const optimizeColorsWithLuminanceNormalization = (
  colors: ColorWithId[],
  targetLuminance: number,
  targetChroma: number,
): Record<string, RGBColor> => {
  const normalizedColors = colors.map((c) => ({
    ...c,
    color: adjustColorLuminanceAndChroma(
      c.color,
      targetLuminance,
      targetChroma,
    ),
  }));
  if (colors.length > 2) spreadCrowdedColors(normalizedColors, targetLuminance);

  return Object.fromEntries(
    normalizedColors.map((color) => [color.id, color.color]),
  );
};

const spreadCrowdedColors = (
  normalizedColors: ColorWithId[],
  targetLuminance: number,
) => {
  for (let i = 0; i < normalizedColors.length; i++) {
    const originalColor = normalizedColors[i].color;
    const currentMinDistance = calculateMinDistanceForColor(
      normalizedColors,
      i,
    );

    if (currentMinDistance >= MIN_DESIRED_DISTANCE) continue;

    const originalLab = rgbToLab(originalColor);
    let bestColor = originalColor;
    let bestMinDistance = currentMinDistance;

    for (const adjustment of LAB_ADJUSTMENTS) {
      const testLab = {
        l: targetLuminance,
        a: originalLab.a + adjustment.a,
        b: originalLab.b + adjustment.b,
      };

      const testColor = labToRgb(testLab);

      normalizedColors[i].color = testColor;
      const minDistance = calculateMinDistanceForColor(normalizedColors, i);

      if (minDistance > bestMinDistance) {
        bestMinDistance = minDistance;
        bestColor = testColor;
      }
    }

    normalizedColors[i].color = bestColor;
  }
};

const calculateMinDistanceForColor = (
  colors: ColorWithId[],
  colorIndex: number,
): number => {
  const targetColor = colors[colorIndex].color;
  let minDistance = Infinity;

  for (let i = 0; i < colors.length; i++) {
    if (i === colorIndex) continue;
    const distance = calculateColorDistance(targetColor, colors[i].color);
    minDistance = Math.min(minDistance, distance);
  }

  return minDistance;
};

export function buildFactionToColor(
  playerData: Array<{ faction: string; color: string }>,
): Record<string, string> {
  return Object.fromEntries(
    playerData.map((player) => [player.faction, player.color]),
  );
}

export function computeOptimizedColors(
  factionToColor: Record<string, string>,
): Record<string, RGBColor> {
  const colorsInUse = new Set(Object.values(factionToColor));

  const transformedColors = colors
    .filter((color) => colorsInUse.has(color.name))
    .map((color) => {
      const primaryColorValues = getColorValues(
        color.primaryColorRef,
        color.primaryColor,
      );

      if (!primaryColorValues) return null;
      return { id: color.name, color: primaryColorValues };
    })
    .filter((color): color is ColorWithId => color !== null);

  return optimizeColorsWithLuminanceNormalization(transformedColors, 75, 75);
}

export function buildFactionColorMap(
  data: PlayerDataResponse,
  optimizedColors: Record<string, RGBColor>,
  accessibleColors: boolean,
): FactionColorMap {
  const factionColorMap: FactionColorMap = {};
  if (!data.playerData) return factionColorMap;

  const assignedByFaction: Record<string, string> = {};
  const usedAccessible = new Set<string>();

  const pickAccessibleColor = (faction: string): string | undefined => {
    if (assignedByFaction[faction]) return assignedByFaction[faction];
    const next = ACCESSIBLE_COLOR_ORDER.find((c) => !usedAccessible.has(c));
    if (!next) return undefined;
    usedAccessible.add(next);
    assignedByFaction[faction] = next;
    return next;
  };

  data.playerData.forEach((player) => {
    const chosenColor =
      (accessibleColors && pickAccessibleColor(player.faction)) || player.color;

    const entry = {
      faction: player.faction,
      color: chosenColor,
      optimizedColor:
        optimizedColors[chosenColor] ?? optimizedColors[player.color],
    };

    factionColorMap[player.faction] = entry;
    factionColorMap[chosenColor] = entry;
  });

  return factionColorMap;
}
