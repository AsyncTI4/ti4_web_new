import { Box, BoxProps } from "@mantine/core";
import { getGradientClasses, ColorKey } from "../gradientClasses";

type Props = BoxProps & {
  color?: ColorKey;
  children: React.ReactNode;
};

export function Shimmer({
  color = "blue",
  children,
  className,
  ...boxProps
}: Props) {
  const gradientClasses = getGradientClasses(color);
  const combinedClassName =
    `${gradientClasses.shimmerContainer} ${className || ""}`.trim();

  return (
    <Box
      className={combinedClassName}
      style={{
        borderRadius: "var(--mantine-radius-sm)",
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
        }}
        className={gradientClasses.shimmer}
      />
      {/* Bottom shimmer */}
      <Box
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
        }}
        className={gradientClasses.shimmer}
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
            pointerEvents: "none",
            opacity: 0.5,
          }}
          className={gradientClasses.pattern}
        />
      )}

      {children}
    </Box>
  );
}
