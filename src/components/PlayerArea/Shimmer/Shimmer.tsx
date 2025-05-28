import { Box, BoxProps } from "@mantine/core";

// Shimmer color configurations
const SHIMMER_COLORS = {
  red: {
    gradient:
      "linear-gradient(90deg, transparent 0%, #ef4444 50%, transparent 100%)",
    background:
      "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
    border: "rgba(239, 68, 68, 0.25)",
    shadow:
      "0 4px 12px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  },
  green: {
    gradient:
      "linear-gradient(90deg, transparent 0%, #22c55e 50%, transparent 100%)",
    background:
      "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
    border: "rgba(34, 197, 94, 0.25)",
    shadow:
      "0 4px 12px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  },
  blue: {
    gradient:
      "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.6) 50%, transparent 100%)",
    background:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)",
    border: "rgba(59, 130, 246, 0.25)",
    shadow:
      "0 2px 8px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  },
  cyan: {
    gradient:
      "linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.6) 50%, transparent 100%)",
    background:
      "linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(6, 182, 212, 0.06) 100%)",
    border: "rgba(6, 182, 212, 0.25)",
    shadow:
      "0 2px 8px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  },
  orange: {
    gradient:
      "linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.6) 50%, transparent 100%)",
    background:
      "linear-gradient(135deg, rgba(249, 115, 22, 0.12) 0%, rgba(249, 115, 22, 0.06) 100%)",
    border: "rgba(249, 115, 22, 0.25)",
    shadow:
      "0 2px 8px rgba(249, 115, 22, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  },
  gray: {
    gradient:
      "linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.6) 50%, transparent 100%)",
    background:
      "linear-gradient(135deg, rgba(148, 163, 184, 0.12) 0%, rgba(148, 163, 184, 0.06) 100%)",
    border: "rgba(148, 163, 184, 0.25)",
    shadow:
      "0 2px 8px rgba(148, 163, 184, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  },
};

type ShimmerColor = keyof typeof SHIMMER_COLORS;

type Props = BoxProps & {
  color?: ShimmerColor;
  children: React.ReactNode;
};

export function Shimmer({ color = "blue", children, ...boxProps }: Props) {
  const shimmerConfig = SHIMMER_COLORS[color] || SHIMMER_COLORS.blue;

  return (
    <Box
      style={{
        borderRadius: "var(--mantine-radius-sm)",
        background: shimmerConfig.background,
        border: `1px solid ${shimmerConfig.border}`,
        position: "relative",
        overflow: "hidden",
        boxShadow: shimmerConfig.shadow,
        ...boxProps.style,
      }}
      {...boxProps}
    >
      {/* Top shimmer */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: shimmerConfig.gradient,
        }}
      />
      {/* Bottom shimmer */}
      <Box
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: shimmerConfig.gradient,
        }}
      />

      {/* Subtle diagonal pattern for blue shimmers */}
      {color === "blue" && (
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                rgba(59, 130, 246, 0.03) 0px,
                rgba(59, 130, 246, 0.03) 1px,
                transparent 1px,
                transparent 16px
              )
            `,
            pointerEvents: "none",
            opacity: 0.5,
          }}
        />
      )}

      {children}
    </Box>
  );
}
