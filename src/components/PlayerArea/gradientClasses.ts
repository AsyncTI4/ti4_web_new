// CSS-first gradient system utilities
// This provides type-safe helpers for applying global gradient CSS classes

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

// Helper function to generate gradient class names for global utilities
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

// Helper function for backward compatibility - returns CSS class names instead of inline styles
export function getGradientConfig(color: ColorKey) {
  const classes = getGradientClasses(color);

  // Return an object that mimics the old structure but with CSS classes
  return {
    // These return class names instead of CSS values
    backgroundClass: classes.background,
    backgroundStrongClass: classes.backgroundStrong,
    borderClass: classes.border,
    shadowClass: classes.shadow,
    accentClass: classes.accent,
    iconFilterClass: classes.iconFilter,
    innerGlowClass: classes.innerGlow,
    patternClass: classes.pattern,
    leftBorderClass: classes.leftBorder,
    shimmerClass: classes.shimmer,

    // For components that need the base color class
    colorClass: classes.color,
  };
}
