import { Box, Text } from "@mantine/core";
import { PlayerData } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { useOrderedFactions } from "@/hooks/useOrderedFactions";
import { useHideScoreOrder } from "@/hooks/useGameContext";
import { byColor } from "@/utils/objectiveScoreTiers";
import { AnonymousPlayerToken } from "@/shared/ui/AnonymousPlayerToken";
import styles from "./ScoreTracker.module.css";

type Props = {
  playerData: PlayerData[];
  vpsToWin: number;
  /** Score-track totals for players hidden from playerData (FoW), with no faction attached - used
   * to still place an anonymous token at their (public) position on the track. */
  hiddenPlayerVps?: number[];
};

type TrackEntry = { key: string; player?: PlayerData };

function ScoreTracker({ playerData, vpsToWin, hiddenPlayerVps }: Props) {
  // Create array of score positions 0 to vpsToWin
  const scorePositions = Array.from({ length: vpsToWin + 1 }, (_, i) => i);

  // Seat order is hidden under fog, so a fogged viewer gets color order instead - visible to them
  // already, and it keeps the track from encoding seating. Normal games keep the usual order.
  const hideScoreOrder = useHideScoreOrder();
  const seatOrderedFactions = useOrderedFactions(playerData);
  const orderedFactions = hideScoreOrder
    ? byColor(playerData).map((p) => p.faction)
    : seatOrderedFactions;

  // Group factions by their score, maintaining consistent ordering
  const factionsByScore = playerData.reduce(
    (acc, player) => {
      const score = player.totalVps;
      if (score === undefined) return acc;
      if (!acc[score]) {
        acc[score] = [];
      }
      acc[score].push({ key: player.faction, player });
      return acc;
    },
    {} as Record<number, TrackEntry[]>
  );

  // Hidden players carry no faction at all, so they can only be placed by score. They sort last
  // within their group (no entry in orderedFactions), keeping identified players in seat order.
  (hiddenPlayerVps ?? []).forEach((score, i) => {
    if (!factionsByScore[score]) {
      factionsByScore[score] = [];
    }
    factionsByScore[score].push({ key: `hidden-${i}` });
  });

  // Sort factions within each score group by faction order (unidentified ones last)
  Object.keys(factionsByScore).forEach((scoreKey) => {
    const score = parseInt(scoreKey);
    factionsByScore[score].sort((a, b) => {
      const rawA = a.player ? orderedFactions.indexOf(a.player.faction) : -1;
      const rawB = b.player ? orderedFactions.indexOf(b.player.faction) : -1;
      const aIndex = rawA === -1 ? orderedFactions.length : rawA;
      const bIndex = rawB === -1 ? orderedFactions.length : rawB;
      return aIndex - bIndex;
    });
  });

  return (
    <Box mb={8} className={styles.scoreTracker}>
      {scorePositions.map((score, index) => {
        const playersAtScore = factionsByScore[score] || [];
        const isWinningScore = score === vpsToWin;
        const isFirstSquare = index === 0;
        const isLastSquare = index === scorePositions.length - 1;

        return (
          <Box
            key={score}
            className={`${styles.scoreSquare} ${isWinningScore ? styles.winningScore : ""} ${isFirstSquare ? styles.firstSquare : ""} ${isLastSquare ? styles.lastSquare : ""}`}
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
                {playersAtScore.map(({ key, player }) =>
                  player ? (
                    <Box key={key} className={styles.tokenContainer}>
                      <CircularFactionIcon faction={player.faction} factionImageOverride={player.factionImage} factionImageTypeOverride={player.factionImageType} size={32} />
                    </Box>
                  ) : (
                    <Box key={key} className={styles.tokenContainer}>
                      <AnonymousPlayerToken size={32} />
                    </Box>
                  )
                )}
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
