import { Box, Text, Image, BoxProps } from "@/ds";
import type { ReactNode } from "react";
import cx from "clsx";
import styles from "./Cardback.module.css";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

type Props = BoxProps & {
  src: string;
  alt: string;
  count: ReactNode;
};

export function Cardback({
  src,
  alt,
  count,
  className,
  ...boxProps
}: Props) {
  return (
    <Box
      className={cx(styles.container, className)}
      {...boxProps}
    >
      <Box className={styles.imageWrapper}>
        <Image
          {...lowPriorityImageProps}
          src={src}
          alt={alt}
          className={styles.image}
        />
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
