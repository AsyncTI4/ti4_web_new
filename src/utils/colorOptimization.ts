// Color optimization utilities for maximizing color distance while minimizing changes

export type RGBColor = {
  red: number;
  green: number;
  blue: number;
};

export type ColorWithId = {
  id: string;
  color: RGBColor;
  isAnchor?: boolean;
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

// Optimize colors to maximize minimum pairwise distance while minimizing changes
export const optimizeColorDistances = (
  colors: ColorWithId[]
): Record<string, RGBColor> => {
  // If we have 2 or fewer colors, no optimization needed
  if (colors.length <= 2) {
    return colors.reduce(
      (acc, color) => {
        acc[color.id] = color.color;
        return acc;
      },
      {} as Record<string, RGBColor>
    );
  }

  const result: Record<string, RGBColor> = {};
  const workingColors = colors.map((c) => ({ ...c, color: { ...c.color } }));

  // Simple optimization: for each non-anchor color, try small adjustments to maximize minimum distance
  const maxIterations = 10;
  const stepSize = 10; // How much to potentially adjust each color channel

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let improved = false;

    for (let i = 0; i < workingColors.length; i++) {
      if (workingColors[i].isAnchor) continue; // Skip anchor colors

      const originalColor = { ...workingColors[i].color };
      let bestColor = originalColor;
      let bestMinDistance = calculateMinDistanceForColor(workingColors, i);

      // Try adjustments in each color channel
      for (const channel of ["red", "green", "blue"] as const) {
        for (const delta of [-stepSize, stepSize]) {
          const testColor = { ...originalColor };
          testColor[channel] = Math.max(
            0,
            Math.min(255, testColor[channel] + delta)
          );

          // Temporarily apply this color
          workingColors[i].color = testColor;
          const minDistance = calculateMinDistanceForColor(workingColors, i);

          if (minDistance > bestMinDistance) {
            bestMinDistance = minDistance;
            bestColor = { ...testColor };
            improved = true;
          }
        }
      }

      workingColors[i].color = bestColor;
    }

    // If no improvements were made, stop early
    if (!improved) break;
  }

  // Build result object
  workingColors.forEach((color) => {
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

// Main function to optimize colors for faction overlays
export const optimizeFactionColors = (
  colors: Array<{ alias: string; primaryColor: RGBColor }>
): Record<string, RGBColor> => {
  const colorsToOptimize: ColorWithId[] = [];

  // Add the anchor color
  colorsToOptimize.push({
    id: "anchor",
    color: hexToRgb("#1f1e4b"),
    isAnchor: true,
  });

  // Add all the provided colors (already filtered to only those in use)
  colors.forEach((colorData) => {
    colorsToOptimize.push({
      id: colorData.alias,
      color: colorData.primaryColor,
    });
  });

  const optimizedColors = optimizeColorDistances(colorsToOptimize);

  // Filter out the anchor color from the result - it should only be used for optimization
  const { anchor, ...factionColors } = optimizedColors;
  return factionColors;
};
