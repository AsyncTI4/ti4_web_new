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
    border: `${baseClass} gradient-border`,
    iconFilter: `${baseClass} gradient-icon-filter`,
    pattern: `${baseClass} gradient-pattern`,
    shimmerContainer: `shimmer-container ${baseClass}`,
  };
}
