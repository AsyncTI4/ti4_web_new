import { Box, BoxProps } from "@mantine/core";
import { getGradientClasses, ColorKey } from "../gradientClasses";
import styles from "./Shimmer.module.css";

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
    `${gradientClasses.shimmerContainer} ${styles.shimmerWrapper} ${className || ""}`.trim();

  return (
    <Box className={combinedClassName} {...boxProps}>
      {/* Top shimmer */}
      <Box className={`${gradientClasses.shimmer} ${styles.topShimmer}`} />
      {/* Bottom shimmer */}
      <Box className={`${gradientClasses.shimmer} ${styles.bottomShimmer}`} />

      {/* Subtle diagonal pattern for blue shimmers */}
      {color === "blue" && (
        <Box
          className={`${gradientClasses.pattern} ${styles.diagonalPattern}`}
        />
      )}

      {children}
    </Box>
  );
}
