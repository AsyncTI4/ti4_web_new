import { Box, BoxProps } from "@mantine/core";
import { getGradientConfig, ColorKey } from "../gradients";

type Props = BoxProps & {
  color?: ColorKey;
  children: React.ReactNode;
};

export function Shimmer({ color = "blue", children, ...boxProps }: Props) {
  const gradientConfig = getGradientConfig(color);

  return (
    <Box
      style={{
        borderRadius: "var(--mantine-radius-sm)",
        background: gradientConfig.background,
        border: `1px solid ${gradientConfig.border}`,
        position: "relative",
        overflow: "hidden",
        boxShadow: gradientConfig.shadow,
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
          background: gradientConfig.shimmer,
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
          background: gradientConfig.shimmer,
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
            backgroundImage: gradientConfig.pattern,
            pointerEvents: "none",
            opacity: 0.5,
          }}
        />
      )}

      {children}
    </Box>
  );
}
