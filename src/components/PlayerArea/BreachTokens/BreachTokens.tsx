import { Box } from "@mantine/core";
import { cdnImage } from "@/data/cdnImage";
import styles from "./BreachTokens.module.css";

type BreachTokensProps = {
  count: number;
};

export function BreachTokens({ count }: BreachTokensProps) {
  if (count <= 0) return null;

  return (
    <Box
      className={styles.container}
      style={{ width: `${Math.min(count * 35, 280)}px` }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <img
          key={index}
          src={cdnImage("/tokens/token_breachActive.webp")}
          alt="Breach Token"
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
