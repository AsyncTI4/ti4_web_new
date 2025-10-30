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

export function getGradientClasses(color: ColorKey) {
  const baseClass = `gradient-${color}`;

  return {
    // Base color class
    color: baseClass,

    // Global utility classes
    background: `${baseClass} gradient-bg`,
    backgroundStrong: `${baseClass} gradient-bg-strong`,
    border: `${baseClass} gradient-border`,
    shadow: `${baseClass} gradient-shadow`,
    accent: `${baseClass} gradient-accent`,
    iconFilter: `${baseClass} gradient-icon-filter`,
    innerGlow: `${baseClass} gradient-inner-glow`,
    pattern: `${baseClass} gradient-pattern`,
    leftBorder: `${baseClass} gradient-left-border`,
    shimmer: `${baseClass} gradient-shimmer`,

    // Generic player area card utility
    playerAreaCard: `player-area-card ${baseClass} gradient-bg gradient-border`,

    // Shimmer container utility
    shimmerContainer: `shimmer-container ${baseClass}`,
  };
}

export type HybridKey =
  | "blueRed"
  | "blueGreen"
  | "blueYellow"
  | "greenRed"
  | "greenYellow"
  | "yellowRed";

export function getHybridGradientClasses(combo: HybridKey) {
  const baseClass = `hybrid-${combo}`;

  return {
    // Hybrid two-sided utilities
    background: `${baseClass}-bg`,
    backgroundStrong: `${baseClass}-bg-strong`,
    border: `${baseClass}-border`,
    shimmer: `${baseClass}-shimmer`,

    // Shimmer container utility (affects ::before)
    shimmerContainer: `shimmer-container ${baseClass}`,
  };
}
