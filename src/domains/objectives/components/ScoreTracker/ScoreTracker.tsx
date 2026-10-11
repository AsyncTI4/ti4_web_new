import { Box } from "@/ds";
import cx from "clsx";
import { PlayerData } from "@/entities/data/types";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { getSeatOrder } from "@/domains/objectives/hooks/useOrderedFactions";
import styles from "./ScoreTracker.module.css";

type Props = {
  playerData: PlayerData[];
  vpsToWin: number;
  /** "mini" is the condensed track for the Panels view's table rail. */
  variant?: "full" | "mini";
};

/**
 * Victory track. The square one short of victory lights only while someone is
 * standing on it: a marker that appears exactly when the table should be nervous.
 */
function ScoreTracker({ playerData, vpsToWin, variant = "full" }: Props) {
  const scorePositions = Array.from({ length: vpsToWin + 1 }, (_, i) => i);
  const factionsByScore = new Map<number, PlayerData[]>();
  for (const player of getSeatOrder(playerData)) {
    const score = Math.min(player.totalVps, vpsToWin);
    factionsByScore.set(score, [...(factionsByScore.get(score) ?? []), player]);
  }
  const iconSize = variant === "mini" ? 14 : 24;

  return (
    <Box
      className={cx(styles.track, variant === "mini" && styles.mini)}
      style={{ "--squares": vpsToWin + 1 } as React.CSSProperties}
    >
      {scorePositions.map((score) => {
        const playersAtScore = factionsByScore.get(score) ?? [];
        const isWinningScore = score === vpsToWin;
        const isOnTheBrink = score === vpsToWin - 1 && playersAtScore.length > 0;

        return (
          <Box
            key={score}
            className={styles.square}
            data-win={isWinningScore || undefined}
            data-threat={isOnTheBrink || undefined}
            title={
              isOnTheBrink
                ? `One point from victory: ${playersAtScore.map((p) => p.faction).join(", ")}`
                : undefined
            }
          >
            <span className={styles.num}>{score}</span>
            {playersAtScore.length > 0 && (
              <span className={styles.tokens}>
                {playersAtScore.map((player) => (
                  <FactionIcon
                    key={player.faction}
                    faction={player.faction}
                    factionImageOverride={player.factionImage}
                    factionImageTypeOverride={player.factionImageType}
                    alt={player.faction}
                    title={`${player.faction} · ${player.totalVps} VP`}
                    w={iconSize}
                    h={iconSize}
                    className={styles.token}
                  />
                ))}
              </span>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default ScoreTracker;
