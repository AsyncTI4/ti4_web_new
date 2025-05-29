// Unified gradient and color system for all PlayerArea components
// This centralizes all color-based styling to ensure consistency

export type ColorKey =
  | "red"
  | "green"
  | "blue"
  | "cyan"
  | "orange"
  | "yellow"
  | "teal"
  | "purple"
  | "gray"
  | "grey";

// Core color values (RGB values for consistency)
const COLOR_VALUES = {
  red: "239, 68, 68",
  green: "34, 197, 94",
  blue: "59, 130, 246",
  cyan: "6, 182, 212",
  orange: "249, 115, 22",
  yellow: "234, 179, 8",
  teal: "20, 184, 166",
  purple: "147, 51, 234",
  gray: "148, 163, 184",
  grey: "107, 114, 128", // Darker gray variant
} as const;

// Unified gradient system with consistent opacity patterns
export const UNIFIED_GRADIENTS = {
  red: {
    // Standard background gradient
    background: `linear-gradient(135deg, rgba(${COLOR_VALUES.red}, 0.12) 0%, rgba(${COLOR_VALUES.red}, 0.06) 100%)`,
    // Highlighted background for hover states
    backgroundHighlight: `linear-gradient(135deg, rgba(${COLOR_VALUES.red}, 0.18) 0%, rgba(${COLOR_VALUES.red}, 0.12) 100%)`,
    // Stronger background for special components
    backgroundStrong: `linear-gradient(135deg, rgba(${COLOR_VALUES.red}, 0.15) 0%, rgba(${COLOR_VALUES.red}, 0.08) 100%)`,
    // Border color
    border: `rgba(${COLOR_VALUES.red}, 0.25)`,
    // Highlighted border for hover states
    borderHighlight: `rgba(${COLOR_VALUES.red}, 0.4)`,
    // Shimmer/accent line
    shimmer: `linear-gradient(90deg, transparent 0%, rgba(${COLOR_VALUES.red}, 0.6) 50%, transparent 100%)`,
    // Left border accent
    leftBorder: `linear-gradient(180deg, rgba(${COLOR_VALUES.red}, 0.6) 0%, rgba(${COLOR_VALUES.red}, 0.2) 100%)`,
    // Box shadow
    shadow: `0 2px 8px rgba(${COLOR_VALUES.red}, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
    // Highlighted shadow for hover states
    shadowHighlight: `0 4px 16px rgba(${COLOR_VALUES.red}, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)`,
    // Icon filter
    iconFilter: `drop-shadow(0 1px 2px rgba(${COLOR_VALUES.red}, 0.3))`,
    // Tier dot/accent color
    accent: `rgba(${COLOR_VALUES.red}, 0.9)`,
    // Inner glow
    innerGlow: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.red}, 0.15) 0%, transparent 70%)`,
    // Highlighted inner glow for hover states
    innerGlowHighlight: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.red}, 0.22) 0%, transparent 70%)`,
    // Pattern overlay
    pattern: `repeating-linear-gradient(45deg, rgba(${COLOR_VALUES.red}, 0.08) 0px, rgba(${COLOR_VALUES.red}, 0.08) 1px, transparent 1px, transparent 16px)`,
  },
  green: {
    background: `linear-gradient(135deg, rgba(${COLOR_VALUES.green}, 0.12) 0%, rgba(${COLOR_VALUES.green}, 0.06) 100%)`,
    backgroundHighlight: `linear-gradient(135deg, rgba(${COLOR_VALUES.green}, 0.18) 0%, rgba(${COLOR_VALUES.green}, 0.12) 100%)`,
    backgroundStrong: `linear-gradient(135deg, rgba(${COLOR_VALUES.green}, 0.15) 0%, rgba(${COLOR_VALUES.green}, 0.08) 100%)`,
    border: `rgba(${COLOR_VALUES.green}, 0.25)`,
    borderHighlight: `rgba(${COLOR_VALUES.green}, 0.4)`,
    shimmer: `linear-gradient(90deg, transparent 0%, rgba(${COLOR_VALUES.green}, 0.6) 50%, transparent 100%)`,
    leftBorder: `linear-gradient(180deg, rgba(${COLOR_VALUES.green}, 0.6) 0%, rgba(${COLOR_VALUES.green}, 0.2) 100%)`,
    shadow: `0 2px 8px rgba(${COLOR_VALUES.green}, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
    shadowHighlight: `0 4px 16px rgba(${COLOR_VALUES.green}, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)`,
    iconFilter: `drop-shadow(0 1px 2px rgba(${COLOR_VALUES.green}, 0.3))`,
    accent: `rgba(${COLOR_VALUES.green}, 0.9)`,
    innerGlow: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.green}, 0.15) 0%, transparent 70%)`,
    innerGlowHighlight: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.green}, 0.22) 0%, transparent 70%)`,
    pattern: `repeating-linear-gradient(45deg, rgba(${COLOR_VALUES.green}, 0.08) 0px, rgba(${COLOR_VALUES.green}, 0.08) 1px, transparent 1px, transparent 16px)`,
  },
  blue: {
    background: `linear-gradient(135deg, rgba(${COLOR_VALUES.blue}, 0.12) 0%, rgba(${COLOR_VALUES.blue}, 0.06) 100%)`,
    backgroundHighlight: `linear-gradient(135deg, rgba(${COLOR_VALUES.blue}, 0.18) 0%, rgba(${COLOR_VALUES.blue}, 0.12) 100%)`,
    backgroundStrong: `linear-gradient(135deg, rgba(${COLOR_VALUES.blue}, 0.15) 0%, rgba(${COLOR_VALUES.blue}, 0.08) 100%)`,
    border: `rgba(${COLOR_VALUES.blue}, 0.25)`,
    borderHighlight: `rgba(${COLOR_VALUES.blue}, 0.4)`,
    shimmer: `linear-gradient(90deg, transparent 0%, rgba(${COLOR_VALUES.blue}, 0.6) 50%, transparent 100%)`,
    leftBorder: `linear-gradient(180deg, rgba(${COLOR_VALUES.blue}, 0.6) 0%, rgba(${COLOR_VALUES.blue}, 0.2) 100%)`,
    shadow: `0 2px 8px rgba(${COLOR_VALUES.blue}, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
    shadowHighlight: `0 4px 16px rgba(${COLOR_VALUES.blue}, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)`,
    iconFilter: `drop-shadow(0 1px 2px rgba(${COLOR_VALUES.blue}, 0.3))`,
    accent: `rgba(${COLOR_VALUES.blue}, 0.9)`,
    innerGlow: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.blue}, 0.15) 0%, transparent 70%)`,
    innerGlowHighlight: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.blue}, 0.22) 0%, transparent 70%)`,
    pattern: `repeating-linear-gradient(45deg, rgba(${COLOR_VALUES.blue}, 0.03) 0px, rgba(${COLOR_VALUES.blue}, 0.03) 1px, transparent 1px, transparent 16px)`,
  },
  cyan: {
    background: `linear-gradient(135deg, rgba(${COLOR_VALUES.cyan}, 0.12) 0%, rgba(${COLOR_VALUES.cyan}, 0.06) 100%)`,
    backgroundHighlight: `linear-gradient(135deg, rgba(${COLOR_VALUES.cyan}, 0.18) 0%, rgba(${COLOR_VALUES.cyan}, 0.12) 100%)`,
    backgroundStrong: `linear-gradient(135deg, rgba(${COLOR_VALUES.cyan}, 0.15) 0%, rgba(${COLOR_VALUES.cyan}, 0.08) 100%)`,
    border: `rgba(${COLOR_VALUES.cyan}, 0.25)`,
    borderHighlight: `rgba(${COLOR_VALUES.cyan}, 0.4)`,
    shimmer: `linear-gradient(90deg, transparent 0%, rgba(${COLOR_VALUES.cyan}, 0.6) 50%, transparent 100%)`,
    leftBorder: `linear-gradient(180deg, rgba(${COLOR_VALUES.cyan}, 0.6) 0%, rgba(${COLOR_VALUES.cyan}, 0.2) 100%)`,
    shadow: `0 2px 8px rgba(${COLOR_VALUES.cyan}, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
    shadowHighlight: `0 4px 16px rgba(${COLOR_VALUES.cyan}, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)`,
    iconFilter: `drop-shadow(0 1px 2px rgba(${COLOR_VALUES.cyan}, 0.3))`,
    accent: `rgba(${COLOR_VALUES.cyan}, 0.9)`,
    innerGlow: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.cyan}, 0.15) 0%, transparent 70%)`,
    innerGlowHighlight: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.cyan}, 0.22) 0%, transparent 70%)`,
    pattern: `repeating-linear-gradient(45deg, rgba(${COLOR_VALUES.cyan}, 0.08) 0px, rgba(${COLOR_VALUES.cyan}, 0.08) 1px, transparent 1px, transparent 16px)`,
  },
  orange: {
    background: `linear-gradient(135deg, rgba(${COLOR_VALUES.orange}, 0.12) 0%, rgba(${COLOR_VALUES.orange}, 0.06) 100%)`,
    backgroundHighlight: `linear-gradient(135deg, rgba(${COLOR_VALUES.orange}, 0.18) 0%, rgba(${COLOR_VALUES.orange}, 0.12) 100%)`,
    backgroundStrong: `linear-gradient(135deg, rgba(${COLOR_VALUES.orange}, 0.15) 0%, rgba(${COLOR_VALUES.orange}, 0.08) 100%)`,
    border: `rgba(${COLOR_VALUES.orange}, 0.25)`,
    borderHighlight: `rgba(${COLOR_VALUES.orange}, 0.4)`,
    shimmer: `linear-gradient(90deg, transparent 0%, rgba(${COLOR_VALUES.orange}, 0.6) 50%, transparent 100%)`,
    leftBorder: `linear-gradient(180deg, rgba(${COLOR_VALUES.orange}, 0.6) 0%, rgba(${COLOR_VALUES.orange}, 0.2) 100%)`,
    shadow: `0 2px 8px rgba(${COLOR_VALUES.orange}, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
    shadowHighlight: `0 4px 16px rgba(${COLOR_VALUES.orange}, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)`,
    iconFilter: `drop-shadow(0 1px 2px rgba(${COLOR_VALUES.orange}, 0.3))`,
    accent: `rgba(${COLOR_VALUES.orange}, 0.9)`,
    innerGlow: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.orange}, 0.15) 0%, transparent 70%)`,
    innerGlowHighlight: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.orange}, 0.22) 0%, transparent 70%)`,
    pattern: `repeating-linear-gradient(45deg, rgba(${COLOR_VALUES.orange}, 0.08) 0px, rgba(${COLOR_VALUES.orange}, 0.08) 1px, transparent 1px, transparent 16px)`,
  },
  yellow: {
    background: `linear-gradient(135deg, rgba(${COLOR_VALUES.yellow}, 0.12) 0%, rgba(${COLOR_VALUES.yellow}, 0.06) 100%)`,
    backgroundHighlight: `linear-gradient(135deg, rgba(${COLOR_VALUES.yellow}, 0.18) 0%, rgba(${COLOR_VALUES.yellow}, 0.12) 100%)`,
    backgroundStrong: `linear-gradient(135deg, rgba(${COLOR_VALUES.yellow}, 0.15) 0%, rgba(${COLOR_VALUES.yellow}, 0.08) 100%)`,
    border: `rgba(${COLOR_VALUES.yellow}, 0.25)`,
    borderHighlight: `rgba(${COLOR_VALUES.yellow}, 0.4)`,
    shimmer: `linear-gradient(90deg, transparent 0%, rgba(${COLOR_VALUES.yellow}, 0.6) 50%, transparent 100%)`,
    leftBorder: `linear-gradient(180deg, rgba(${COLOR_VALUES.yellow}, 0.6) 0%, rgba(${COLOR_VALUES.yellow}, 0.2) 100%)`,
    shadow: `0 2px 8px rgba(${COLOR_VALUES.yellow}, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
    shadowHighlight: `0 4px 16px rgba(${COLOR_VALUES.yellow}, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)`,
    iconFilter: `drop-shadow(0 1px 2px rgba(${COLOR_VALUES.yellow}, 0.3))`,
    accent: `rgba(${COLOR_VALUES.yellow}, 0.9)`,
    innerGlow: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.yellow}, 0.15) 0%, transparent 70%)`,
    innerGlowHighlight: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.yellow}, 0.22) 0%, transparent 70%)`,
    pattern: `repeating-linear-gradient(45deg, rgba(${COLOR_VALUES.yellow}, 0.08) 0px, rgba(${COLOR_VALUES.yellow}, 0.08) 1px, transparent 1px, transparent 16px)`,
  },
  teal: {
    background: `linear-gradient(135deg, rgba(${COLOR_VALUES.teal}, 0.12) 0%, rgba(${COLOR_VALUES.teal}, 0.06) 100%)`,
    backgroundHighlight: `linear-gradient(135deg, rgba(${COLOR_VALUES.teal}, 0.18) 0%, rgba(${COLOR_VALUES.teal}, 0.12) 100%)`,
    backgroundStrong: `linear-gradient(135deg, rgba(${COLOR_VALUES.teal}, 0.15) 0%, rgba(${COLOR_VALUES.teal}, 0.08) 100%)`,
    border: `rgba(${COLOR_VALUES.teal}, 0.25)`,
    borderHighlight: `rgba(${COLOR_VALUES.teal}, 0.4)`,
    shimmer: `linear-gradient(90deg, transparent 0%, rgba(${COLOR_VALUES.teal}, 0.6) 50%, transparent 100%)`,
    leftBorder: `linear-gradient(180deg, rgba(${COLOR_VALUES.teal}, 0.6) 0%, rgba(${COLOR_VALUES.teal}, 0.2) 100%)`,
    shadow: `0 2px 8px rgba(${COLOR_VALUES.teal}, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
    shadowHighlight: `0 4px 16px rgba(${COLOR_VALUES.teal}, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)`,
    iconFilter: `drop-shadow(0 1px 2px rgba(${COLOR_VALUES.teal}, 0.3))`,
    accent: `rgba(${COLOR_VALUES.teal}, 0.9)`,
    innerGlow: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.teal}, 0.15) 0%, transparent 70%)`,
    innerGlowHighlight: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.teal}, 0.22) 0%, transparent 70%)`,
    pattern: `repeating-linear-gradient(45deg, rgba(${COLOR_VALUES.teal}, 0.08) 0px, rgba(${COLOR_VALUES.teal}, 0.08) 1px, transparent 1px, transparent 16px)`,
  },
  purple: {
    background: `linear-gradient(135deg, rgba(${COLOR_VALUES.purple}, 0.12) 0%, rgba(${COLOR_VALUES.purple}, 0.06) 100%)`,
    backgroundHighlight: `linear-gradient(135deg, rgba(${COLOR_VALUES.purple}, 0.18) 0%, rgba(${COLOR_VALUES.purple}, 0.12) 100%)`,
    backgroundStrong: `linear-gradient(135deg, rgba(${COLOR_VALUES.purple}, 0.15) 0%, rgba(${COLOR_VALUES.purple}, 0.08) 100%)`,
    border: `rgba(${COLOR_VALUES.purple}, 0.25)`,
    borderHighlight: `rgba(${COLOR_VALUES.purple}, 0.4)`,
    shimmer: `linear-gradient(90deg, transparent 0%, rgba(${COLOR_VALUES.purple}, 0.6) 50%, transparent 100%)`,
    leftBorder: `linear-gradient(180deg, rgba(${COLOR_VALUES.purple}, 0.6) 0%, rgba(${COLOR_VALUES.purple}, 0.2) 100%)`,
    shadow: `0 2px 8px rgba(${COLOR_VALUES.purple}, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
    shadowHighlight: `0 4px 16px rgba(${COLOR_VALUES.purple}, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)`,
    iconFilter: `drop-shadow(0 1px 2px rgba(${COLOR_VALUES.purple}, 0.3))`,
    accent: `rgba(${COLOR_VALUES.purple}, 0.9)`,
    innerGlow: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.purple}, 0.15) 0%, transparent 70%)`,
    innerGlowHighlight: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.purple}, 0.22) 0%, transparent 70%)`,
    pattern: `repeating-linear-gradient(45deg, rgba(${COLOR_VALUES.purple}, 0.08) 0px, rgba(${COLOR_VALUES.purple}, 0.08) 1px, transparent 1px, transparent 16px)`,
  },
  gray: {
    background: `linear-gradient(135deg, rgba(${COLOR_VALUES.gray}, 0.12) 0%, rgba(${COLOR_VALUES.gray}, 0.06) 100%)`,
    backgroundHighlight: `linear-gradient(135deg, rgba(${COLOR_VALUES.gray}, 0.18) 0%, rgba(${COLOR_VALUES.gray}, 0.12) 100%)`,
    backgroundStrong: `linear-gradient(135deg, rgba(${COLOR_VALUES.gray}, 0.15) 0%, rgba(${COLOR_VALUES.gray}, 0.08) 100%)`,
    border: `rgba(${COLOR_VALUES.gray}, 0.25)`,
    borderHighlight: `rgba(${COLOR_VALUES.gray}, 0.4)`,
    shimmer: `linear-gradient(90deg, transparent 0%, rgba(${COLOR_VALUES.gray}, 0.6) 50%, transparent 100%)`,
    leftBorder: `linear-gradient(180deg, rgba(${COLOR_VALUES.gray}, 0.6) 0%, rgba(${COLOR_VALUES.gray}, 0.2) 100%)`,
    shadow: `0 2px 8px rgba(${COLOR_VALUES.gray}, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
    shadowHighlight: `0 4px 16px rgba(${COLOR_VALUES.gray}, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)`,
    iconFilter: `drop-shadow(0 1px 2px rgba(${COLOR_VALUES.gray}, 0.3))`,
    accent: `rgba(${COLOR_VALUES.gray}, 0.9)`,
    innerGlow: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.gray}, 0.15) 0%, transparent 70%)`,
    innerGlowHighlight: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.gray}, 0.22) 0%, transparent 70%)`,
    pattern: `repeating-linear-gradient(45deg, rgba(${COLOR_VALUES.gray}, 0.08) 0px, rgba(${COLOR_VALUES.gray}, 0.08) 1px, transparent 1px, transparent 16px)`,
  },
  grey: {
    background: `linear-gradient(135deg, rgba(${COLOR_VALUES.grey}, 0.12) 0%, rgba(${COLOR_VALUES.grey}, 0.06) 100%)`,
    backgroundHighlight: `linear-gradient(135deg, rgba(${COLOR_VALUES.grey}, 0.18) 0%, rgba(${COLOR_VALUES.grey}, 0.12) 100%)`,
    backgroundStrong: `linear-gradient(135deg, rgba(${COLOR_VALUES.grey}, 0.15) 0%, rgba(${COLOR_VALUES.grey}, 0.08) 100%)`,
    border: `rgba(${COLOR_VALUES.grey}, 0.25)`,
    borderHighlight: `rgba(${COLOR_VALUES.grey}, 0.4)`,
    shimmer: `linear-gradient(90deg, transparent 0%, rgba(${COLOR_VALUES.grey}, 0.6) 50%, transparent 100%)`,
    leftBorder: `linear-gradient(180deg, rgba(${COLOR_VALUES.grey}, 0.6) 0%, rgba(${COLOR_VALUES.grey}, 0.2) 100%)`,
    shadow: `0 2px 8px rgba(${COLOR_VALUES.grey}, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
    shadowHighlight: `0 4px 16px rgba(${COLOR_VALUES.grey}, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)`,
    iconFilter: `drop-shadow(0 1px 2px rgba(${COLOR_VALUES.grey}, 0.3))`,
    accent: `rgba(${COLOR_VALUES.grey}, 0.9)`,
    innerGlow: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.grey}, 0.15) 0%, transparent 70%)`,
    innerGlowHighlight: `radial-gradient(ellipse at center, rgba(${COLOR_VALUES.grey}, 0.22) 0%, transparent 70%)`,
    pattern: `repeating-linear-gradient(45deg, rgba(${COLOR_VALUES.grey}, 0.08) 0px, rgba(${COLOR_VALUES.grey}, 0.08) 1px, transparent 1px, transparent 16px)`,
  },
} as const;

// Helper function to get gradient config by color
export function getGradientConfig(color: ColorKey) {
  return UNIFIED_GRADIENTS[color] || UNIFIED_GRADIENTS.blue;
}

// Special gradient configurations for unique components
export const SPECIAL_GRADIENTS = {
  // Relic uses a special orange/amber gradient with diagonal stripes
  relic: {
    background: `linear-gradient(135deg, rgba(194, 65, 12, 0.15) 0%, rgba(234, 88, 12, 0.12) 50%, rgba(194, 65, 12, 0.15) 100%)`,
    border: `rgba(251, 191, 36, 0.4)`,
    innerGlow: `radial-gradient(ellipse at center, rgba(251, 191, 36, 0.15) 0%, transparent 70%)`,
    pattern: `repeating-linear-gradient(45deg, rgba(251, 191, 36, 0.08) 0px, rgba(251, 191, 36, 0.08) 1px, transparent 1px, transparent 16px)`,
    iconFilter: `drop-shadow(0 1px 2px rgba(251, 191, 36, 0.3))`,
  },
} as const;
