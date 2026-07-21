import { Box, Text } from "@mantine/core";
import { PlayerData, WebScoreBreakdown } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { useOrderedFactions } from "@/hooks/useOrderedFactions";
import { isAssignedFactionKey } from "@/utils/playerUtils";
import { AnonymousPlayerToken } from "@/shared/ui/AnonymousPlayerToken";
import styles from "./ScoreTracker.module.css";

type Props = {
  playerData: PlayerData[];
  vpsToWin: number;
  /** Includes entries for players hidden from playerData (FoW) - used to still place a
   * greyed-out token for them at their (public) score-track position. */
  scoreBreakdowns?: Record<string, WebScoreBreakdown>;
};

type TrackEntry = { faction: string; player?: PlayerData };

function ScoreTracker({ playerData, vpsToWin, scoreBreakdowns }: Props) {
  // Create array of score positions 0 to vpsToWin
  const scorePositions = Array.from({ length: vpsToWin + 1 }, (_, i) => i);

  // Get consistently ordered factions
  const orderedFactions = useOrderedFactions(playerData);

  // Roster of every faction with a score, including ones hidden from playerData by FoW (visible
  // here only via scoreBreakdowns, with no identifying data beyond their public total VP).
  // scoreBreakdowns also carries the neutral (Dicecord) player, which playerData deliberately
  // omits - it isn't a hidden opponent, so it must not become an "unidentified" token here.
  const playerByFaction = new Map(playerData.map((p) => [p.faction, p]));
  const rosterFactions = new Set([
    ...playerData.map((p) => p.faction),
    ...Object.keys(scoreBreakdowns ?? {}).filter(isAssignedFactionKey),
  ]);

  // Group factions by their score, maintaining consistent ordering
  const factionsByScore = Array.from(rosterFactions).reduce(
    (acc, faction) => {
      const player = playerByFaction.get(faction);
      const score = player?.totalVps ?? scoreBreakdowns?.[faction]?.totalVps;
      if (score === undefined) return acc;
      if (!acc[score]) {
        acc[score] = [];
      }
      acc[score].push({ faction, player });
      return acc;
    },
    {} as Record<number, TrackEntry[]>
  );

  // Sort factions within each score group by faction order (unidentified ones last)
  Object.keys(factionsByScore).forEach((scoreKey) => {
    const score = parseInt(scoreKey);
    factionsByScore[score].sort((a, b) => {
      const rawA = orderedFactions.indexOf(a.faction);
      const rawB = orderedFactions.indexOf(b.faction);
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
                {playersAtScore.map(({ faction, player }) =>
                  player ? (
                    <Box key={faction} className={styles.tokenContainer}>
                      <CircularFactionIcon faction={player.faction} factionImageOverride={player.factionImage} factionImageTypeOverride={player.factionImageType} size={32} />
                    </Box>
                  ) : (
                    <Box key={faction} className={styles.tokenContainer}>
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
