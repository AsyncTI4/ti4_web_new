// CSS-first gradient system utilities
// This provides type-safe helpers for applying gradient CSS classes

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

// Helper function to generate gradient class names
export function getGradientClasses(color: ColorKey) {
  const baseClass = `gradient-${color}`;

  return {
    // Base color class
    color: baseClass,

    // Combined classes for common patterns
    background: `${baseClass} gradient-bg`,
    backgroundStrong: `${baseClass} gradient-bg-strong`,
    border: `${baseClass} gradient-border`,
    shadow: `${baseClass} gradient-shadow`,

    // Component-specific classes
    statusBadge: `status-badge ${baseClass} gradient-bg gradient-border gradient-shadow`,
    techCard: `tech-card ${baseClass} gradient-bg gradient-border`,
    playerAreaCard: `player-area-card ${baseClass} gradient-bg gradient-border`,
    strategyCardBanner: `strategy-card-banner ${baseClass} gradient-bg gradient-border`,
    shimmerContainer: `shimmer-container ${baseClass}`,

    // Individual utility classes
    accent: `${baseClass} gradient-accent`,
    iconFilter: `${baseClass} gradient-icon-filter`,
    innerGlow: `${baseClass} gradient-inner-glow`,
    pattern: `${baseClass} gradient-pattern`,
    leftBorder: `${baseClass} gradient-left-border`,
    shimmer: `${baseClass} gradient-shimmer`,

    // Tier dot class
    tierDot: `tier-dot ${baseClass}`,
  };
}

// Special classes for relic
export const relicClasses = {
  card: "relic-card",
  icon: "relic-icon",
};

// Special classes for unit cards
export const unitCardClasses = {
  upgraded: "unit-card upgraded",
  standard: "unit-card standard",
  highlight: "unit-card-highlight",
  highlightStandard: "unit-card-highlight standard",
};

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
