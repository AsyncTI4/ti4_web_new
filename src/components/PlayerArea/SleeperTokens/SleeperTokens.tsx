import { Box } from "@mantine/core";
import { cdnImage } from "@/data/cdnImage";
import { getTokenImagePath } from "@/lookup/tokens";
import styles from "./SleeperTokens.module.css";

type SleeperTokensProps = {
  count: number;
};

export function SleeperTokens({ count }: SleeperTokensProps) {
  if (count <= 0) return null;

  const tokenPath = getTokenImagePath("sleeper");
  if (!tokenPath) return null;

  return (
    <Box
      className={styles.container}
      style={{ width: `${Math.min(count * 35, 280)}px` }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <img
          key={index}
          src={cdnImage(tokenPath)}
          alt="Sleeper Token"
          className={styles.token}
          style={{
            left: `${index * 35}px`,
            top: `${25 * ((index + 1) % 2)}px`,
          }}
        />
      ))}
    </Box>
  );
}
