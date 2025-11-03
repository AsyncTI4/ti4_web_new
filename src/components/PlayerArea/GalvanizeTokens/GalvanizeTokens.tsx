import { Box } from "@mantine/core";
import { cdnImage } from "@/data/cdnImage";
import styles from "./GalvanizeTokens.module.css";

type GalvanizeTokensProps = {
  count: number;
};

export function GalvanizeTokens({ count }: GalvanizeTokensProps) {
  if (count <= 0) return null;

  return (
    <Box
      className={styles.container}
      style={{ width: `${Math.min(count * 18, 280)}px` }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <img
          key={index}
          src={cdnImage("/extra/marker_galvanize.png")}
          alt="Galvanize Token"
          className={styles.token}
          style={{
            left: `${index * 18}px`,
            top: `${10 * ((index + 1) % 2)}px`,
          }}
        />
      ))}
    </Box>
  );
}

