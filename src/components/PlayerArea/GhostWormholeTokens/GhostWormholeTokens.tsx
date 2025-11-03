import { Box } from "@mantine/core";
import { cdnImage } from "@/data/cdnImage";
import { getTokenImagePath } from "@/lookup/tokens";
import styles from "./GhostWormholeTokens.module.css";

type GhostWormholeTokensProps = {
  wormholeIds: string[];
};

export function GhostWormholeTokens({ wormholeIds }: GhostWormholeTokensProps) {
  if (!wormholeIds || wormholeIds.length === 0) return null;

  return (
    <Box
      className={styles.container}
      style={{ width: `${Math.min(wormholeIds.length * 35, 280)}px` }}
    >
      {wormholeIds.map((wormholeId, index) => {
        const tokenPath = getTokenImagePath(wormholeId);
        if (!tokenPath) return null;

        return (
          <img
            key={index}
            src={cdnImage(tokenPath)}
            alt={`${wormholeId} Token`}
            className={styles.token}
            style={{
              left: `${index * 35}px`,
              top: `${25 * ((index + 1) % 2)}px`,
            }}
          />
        );
      })}
    </Box>
  );
}
