import { Box, Text, Image, BoxProps } from "@mantine/core";
import { ReactNode } from "react";
import cx from "clsx";
import styles from "./Cardback.module.css";

type CardbackSize = "xs" | "sm" | "md" | "lg";

type Props = BoxProps & {
  src: string;
  alt: string;
  count: string | number | ReactNode;
  size?: CardbackSize;
  addBorder?: boolean;
};

export function Cardback({
  src,
  alt,
  count,
  size = "sm",
  addBorder = true,
  className,
  ...boxProps
}: Props) {
  return (
    <Box className={cx(styles.container, styles[`size_${size}`], className)} {...boxProps}>
      <Box className={styles.imageWrapper}>
        <Image src={src} alt={alt} className={styles.image} />
      </Box>
      <Box className={styles.countBadge}>
        {typeof count === "string" || typeof count === "number" ? (
          <Text size="lg" fw={700} c="white" className={styles.count}>
            {(count || 0).toString()}
          </Text>
        ) : (
          count
        )}
      </Box>
    </Box>
  );
}
