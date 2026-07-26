import { Box, Text } from "@mantine/core";
import { PlayerData } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { useOrderedFactions } from "@/hooks/useOrderedFactions";
import styles from "./ScoreTracker.module.css";

type Props = {
  playerData: PlayerData[];
  vpsToWin: number;
};

function ScoreTracker({ playerData, vpsToWin }: Props) {
  // Create array of score positions 0 to vpsToWin
  const scorePositions = Array.from({ length: vpsToWin + 1 }, (_, i) => i);

  // Get consistently ordered factions
  const orderedFactions = useOrderedFactions(playerData);

  // Group factions by their score, maintaining consistent ordering
  const factionsByScore = playerData.reduce(
    (acc, player) => {
      const score = player.totalVps;
      if (!acc[score]) {
        acc[score] = [];
      }
      acc[score].push(player);
      return acc;
    },
    {} as Record<number, PlayerData[]>
  );

  // Sort players within each score group by faction order
  Object.keys(factionsByScore).forEach((scoreKey) => {
    const score = parseInt(scoreKey);
    factionsByScore[score].sort((a, b) => {
      const aIndex = orderedFactions.indexOf(a.faction);
      const bIndex = orderedFactions.indexOf(b.faction);
      return aIndex - bIndex;
    });
  });

  return (
    <Box mb={8} className={styles.scoreTracker}>
      {scorePositions.map((score, index) => {
        const playersAtScore = factionsByScore[score] || [];
        const isWinningScore = score === vpsToWin;
        /* Only meaningful while someone is actually standing there. */
        const isOnTheBrink =
          score === vpsToWin - 1 && playersAtScore.length > 0;
        const isFirstSquare = index === 0;
        const isLastSquare = index === scorePositions.length - 1;

        return (
          <Box
            key={score}
            className={`${styles.scoreSquare} ${isWinningScore ? styles.winningScore : ""} ${isOnTheBrink ? styles.brinkScore : ""} ${isFirstSquare ? styles.firstSquare : ""} ${isLastSquare ? styles.lastSquare : ""}`}
            title={
              isOnTheBrink
                ? `One point from victory: ${playersAtScore
                    .map((p) => p.faction)
                    .join(", ")}`
                : undefined
            }
          >
            {/* Score number */}
            <Text
              className={`${styles.scoreNumber} ${isWinningScore ? styles.winningNumber : ""}`}
            >
              {score}
            </Text>

            {/* Faction control tokens */}
            {playersAtScore.length > 0 && (
              <Box className={styles.factionTokens}>
                {playersAtScore.map((player) => (
                  <Box key={player.faction} className={styles.tokenContainer}>
                    <CircularFactionIcon faction={player.faction} factionImageOverride={player.factionImage} factionImageTypeOverride={player.factionImageType} size={32} />
                  </Box>
                ))}
              </Box>
            )}

            {/* Special effects for winning score */}
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
