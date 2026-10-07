import { Box, BoxProps } from "@mantine/core";
import { getGradientClasses, ColorKey } from "@/shared/ui/gradientClasses";
import cx from "clsx";
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

  return (
    <Box
      className={cx(
        gradientClasses.shimmerContainer,
        styles.shimmerWrapper,
        className
      )}
      {...boxProps}
    >
      {color === "blue" && (
        <Box className={cx(gradientClasses.pattern, styles.diagonalPattern)} />
      )}

      {children}
    </Box>
  );
}
