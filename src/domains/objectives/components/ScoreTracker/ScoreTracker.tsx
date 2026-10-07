import { Box, Text } from "@mantine/core";
import cx from "clsx";
import { PlayerData } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { useOrderedFactions } from "@/domains/objectives/hooks/useOrderedFactions";
import styles from "./ScoreTracker.module.css";

type Props = {
  playerData: PlayerData[];
  vpsToWin: number;
};

function ScoreTracker({ playerData, vpsToWin }: Props) {
  const scorePositions = Array.from({ length: vpsToWin + 1 }, (_, i) => i);

  const orderedFactions = useOrderedFactions(playerData);

  const seatOrder = (player: PlayerData) => orderedFactions.indexOf(player.faction);
  const factionsByScore = new Map<number, PlayerData[]>();
  for (const player of [...playerData].sort((a, b) => seatOrder(a) - seatOrder(b))) {
    factionsByScore.set(player.totalVps, [...(factionsByScore.get(player.totalVps) ?? []), player]);
  }

  return (
    <Box mb={8} className={styles.scoreTracker}>
      {scorePositions.map((score, index) => {
        const playersAtScore = factionsByScore.get(score) ?? [];
        const isWinningScore = score === vpsToWin;
        /* Only meaningful while someone is actually standing there. */
        const isOnTheBrink =
          score === vpsToWin - 1 && playersAtScore.length > 0;

        return (
          <Box
            key={score}
            className={cx(
              styles.scoreSquare,
              isWinningScore && styles.winningScore,
              isOnTheBrink && styles.brinkScore,
              index === 0 && styles.firstSquare,
              index === scorePositions.length - 1 && styles.lastSquare
            )}
            title={
              isOnTheBrink
                ? `One point from victory: ${playersAtScore
                    .map((p) => p.faction)
                    .join(", ")}`
                : undefined
            }
          >
            <Text
              className={cx(styles.scoreNumber, isWinningScore && styles.winningNumber)}
            >
              {score}
            </Text>

            {playersAtScore.length > 0 && (
              <Box className={styles.factionTokens}>
                {playersAtScore.map((player) => (
                  <Box key={player.faction} className={styles.tokenContainer}>
                    <CircularFactionIcon faction={player.faction} factionImageOverride={player.factionImage} factionImageTypeOverride={player.factionImageType} size={32} />
                  </Box>
                ))}
              </Box>
            )}

            {isWinningScore && (
              <Box className={styles.victoryCrown}>
                <Text className={styles.victoryIcon}>★</Text>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default ScoreTracker;
