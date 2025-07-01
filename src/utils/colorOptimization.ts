// Color optimization utilities for maximizing color distance while minimizing changes

export type RGBColor = {
  red: number;
  green: number;
  blue: number;
};

export type ColorWithId = {
  id: string;
  color: RGBColor;
};

// Convert RGB to LAB color space for perceptual color distance
const rgbToLab = (rgb: RGBColor): { l: number; a: number; b: number } => {
  // First convert RGB to XYZ
  let r = rgb.red / 255;
  let g = rgb.green / 255;
  let b = rgb.blue / 255;

  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ using sRGB matrix
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

  // Normalize by D65 illuminant
  const xn = x / 0.95047;
  const yn = y / 1.0;
  const zn = z / 1.08883;

  // Convert XYZ to LAB
  const fx = xn > 0.008856 ? Math.pow(xn, 1 / 3) : 7.787 * xn + 16 / 116;
  const fy = yn > 0.008856 ? Math.pow(yn, 1 / 3) : 7.787 * yn + 16 / 116;
  const fz = zn > 0.008856 ? Math.pow(zn, 1 / 3) : 7.787 * zn + 16 / 116;

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bLab = 200 * (fy - fz);

  return { l, a, b: bLab };
};

// Convert LAB color space back to RGB
const labToRgb = (lab: { l: number; a: number; b: number }): RGBColor => {
  // Convert LAB to XYZ
  const fy = (lab.l + 16) / 116;
  const fx = lab.a / 500 + fy;
  const fz = fy - lab.b / 200;

  const xn = fx > 0.206893 ? Math.pow(fx, 3) : (fx - 16 / 116) / 7.787;
  const yn = fy > 0.206893 ? Math.pow(fy, 3) : (fy - 16 / 116) / 7.787;
  const zn = fz > 0.206893 ? Math.pow(fz, 3) : (fz - 16 / 116) / 7.787;

  // Convert to XYZ with D65 illuminant
  const x = xn * 0.95047;
  const y = yn * 1.0;
  const z = zn * 1.08883;

  // Convert XYZ to RGB using sRGB matrix
  let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  let g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
  let b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  // Apply inverse gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  // Clamp values to 0-255 range
  return {
    red: Math.max(0, Math.min(255, Math.round(r * 255))),
    green: Math.max(0, Math.min(255, Math.round(g * 255))),
    blue: Math.max(0, Math.min(255, Math.round(b * 255))),
  };
};

// Adjust a color to target luminance while preserving hue and chroma
const adjustColorLuminance = (
  rgb: RGBColor,
  targetLuminance: number
): RGBColor => {
  const lab = rgbToLab(rgb);

  // Preserve hue and chroma (a, b) but adjust luminance (l)
  const adjustedLab = {
    l: targetLuminance,
    a: lab.a,
    b: lab.b,
  };

  return labToRgb(adjustedLab);
};

// Adjust both luminance and chroma together
const adjustColorLuminanceAndChroma = (
  rgb: RGBColor,
  targetLuminance: number,
  targetChroma: number
): RGBColor => {
  const lab = rgbToLab(rgb);
  const currentChroma = Math.sqrt(lab.a * lab.a + lab.b * lab.b);

  if (currentChroma === 0) {
    // For gray colors, just adjust luminance
    return adjustColorLuminance(rgb, targetLuminance);
  }

  const chromaRatio = targetChroma / currentChroma;
  const adjustedLab = {
    l: targetLuminance,
    a: lab.a * chromaRatio,
    b: lab.b * chromaRatio,
  };

  return labToRgb(adjustedLab);
};

// Calculate perceptual color distance using Delta E (CIE76)
const calculateColorDistance = (color1: RGBColor, color2: RGBColor): number => {
  const lab1 = rgbToLab(color1);
  const lab2 = rgbToLab(color2);

  const deltaL = lab1.l - lab2.l;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;

  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
};

// Convert hex string to RGB
export const hexToRgb = (hex: string): RGBColor => {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return { red: r, green: g, blue: b };
};

// Convert RGB to hex string
export const rgbToHex = (rgb: RGBColor): string => {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${toHex(rgb.red)}${toHex(rgb.green)}${toHex(rgb.blue)}`;
};

// Optimize colors with luminance and chroma normalization for better overlays
export const optimizeColorsWithLuminanceNormalization = (
  colors: ColorWithId[],
  targetLuminance: number = 0,
  targetChroma: number = 35
): Record<string, RGBColor> => {
  if (colors.length <= 2) {
    // For small color sets, just normalize luminance and chroma
    return colors.reduce(
      (acc, color) => {
        acc[color.id] = adjustColorLuminanceAndChroma(
          color.color,
          targetLuminance,
          targetChroma
        );
        return acc;
      },
      {} as Record<string, RGBColor>
    );
  }

  // First pass: normalize all colors to target luminance and chroma
  const normalizedColors = colors.map((c) => ({
    ...c,
    color: adjustColorLuminanceAndChroma(
      c.color,
      targetLuminance,
      targetChroma
    ),
  }));

  // Second pass: fix colors that are really close
  const minDesiredDistance = 50; // Only adjust colors closer than this
  const adjustments = [
    { a: 20, b: 0 }, // strong red
    { a: -20, b: 0 }, // strong green
    { a: 0, b: 20 }, // strong yellow
    { a: 0, b: -20 }, // strong blue
    { a: 15, b: 15 }, // strong warm
    { a: -15, b: -15 }, // strong cool
    { a: 25, b: 8 }, // red-yellow
    { a: -12, b: 18 }, // green-yellow
    { a: 12, b: -25 }, // red-blue
  ];

  for (let i = 0; i < normalizedColors.length; i++) {
    const originalColor = normalizedColors[i].color;
    const currentMinDistance = calculateMinDistanceForColor(
      normalizedColors,
      i
    );

    // Only optimize colors that are really close to others
    if (currentMinDistance >= minDesiredDistance) continue;

    const originalLab = rgbToLab(originalColor);
    let bestColor = originalColor;
    let bestMinDistance = currentMinDistance;

    // Try each adjustment
    for (const adjustment of adjustments) {
      const testLab = {
        l: targetLuminance,
        a: originalLab.a + adjustment.a,
        b: originalLab.b + adjustment.b,
      };

      const testColor = labToRgb(testLab);

      // Test this adjustment
      normalizedColors[i].color = testColor;
      const minDistance = calculateMinDistanceForColor(normalizedColors, i);

      if (minDistance > bestMinDistance) {
        bestMinDistance = minDistance;
        bestColor = testColor;
      }
    }

    normalizedColors[i].color = bestColor;
  }

  // Build result object
  const result: Record<string, RGBColor> = {};
  normalizedColors.forEach((color) => {
    result[color.id] = color.color;
  });

  return result;
};

// Calculate the minimum distance from a color to all other colors
const calculateMinDistanceForColor = (
  colors: ColorWithId[],
  colorIndex: number
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

// Main function to optimize colors for faction overlays with luminance normalization
export const optimizeFactionColors = (
  colors: Array<{ alias: string; primaryColor: RGBColor }>
): Record<string, RGBColor> => {
  const colorsToOptimize: ColorWithId[] = [];

  colors.forEach((colorData) => {
    colorsToOptimize.push({
      id: colorData.alias,
      color: colorData.primaryColor,
    });
  });

  const optimizedColors = optimizeColorsWithLuminanceNormalization(
    colorsToOptimize,
    75,
    75
  );

  return optimizedColors;
};
