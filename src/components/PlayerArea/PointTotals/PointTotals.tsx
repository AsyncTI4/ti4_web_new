import { SimpleGrid, Group, Text } from "@mantine/core";
import { CircularFactionIcon } from "../../shared/CircularFactionIcon";
import { PlayerData } from "../../../data/types";
import styles from "./PointTotals.module.css";

type Props = {
  playerData: PlayerData[];
  vpsToWin: number;
};

export function PointTotals({ playerData, vpsToWin }: Props) {
  // Sort players by total VPs in descending order
  const sortedPlayers = [...playerData].sort(
    (a, b) => (b.totalVps || 0) - (a.totalVps || 0)
  );

  // Calculate max points for scaling
  const maxPoints = Math.max(...sortedPlayers.map((p) => p.totalVps || 0));

  // Calculate scale factor for each player (0.7 to 1.1 range for more subtle effect)
  const getScaleFactor = (points: number) => {
    if (maxPoints === 0) return 1;
    const baseScale = 0.7;
    const scaleRange = 0.4;
    return baseScale + (points / maxPoints) * scaleRange;
  };

  return (
    <SimpleGrid cols={6} spacing="xs" className={styles.container}>
      {sortedPlayers.map((player) => {
        const points = player.totalVps || 0;
        const scaleFactor = getScaleFactor(points);
        const isWinning = points === vpsToWin;

        return (
          <Group
            key={player.faction}
            gap={4}
            align="center"
            justify="center"
            className={`${styles.playerRow} ${isWinning ? styles.winningPlayer : ""}`}
            style={{
              transform: `scale(${scaleFactor})`,
              transformOrigin: "center",
            }}
          >
            <CircularFactionIcon
              faction={player.faction}
              size={20}
              className={styles.factionIcon}
            />
            <Text size="sm" fw={600} c="white" className={styles.pointsText}>
              {points}
            </Text>
            {isWinning && (
              <Text size="xs" c="yellow.4" className={styles.winnerIcon}>
                ★
              </Text>
            )}
          </Group>
        );
      })}
    </SimpleGrid>
  );
}
