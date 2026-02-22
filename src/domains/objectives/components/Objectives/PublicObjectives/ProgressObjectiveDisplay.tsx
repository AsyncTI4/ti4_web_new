import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { PlayerData } from "@/entities/data/types";
import { Text, Group } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import styles from "./ExpandedObjectiveCard.module.css";

type FactionProgressData = {
  player: PlayerData;
  progress: number;
  isScored: boolean;
  isAtThreshold: boolean;
};


type ProgressObjectiveDisplayProps = {
  factionProgressData: FactionProgressData[];
  progressThreshold: number;
};


function ProgressObjectiveDisplay({
  factionProgressData,
  progressThreshold,
}: ProgressObjectiveDisplayProps) {
  return (
    <>
      {factionProgressData.map(
        ({ player, progress, isScored, isAtThreshold }) => {
          const badgeClass = isScored
            ? `${styles.factionProgressBadge} ${styles.completed}`
            : isAtThreshold
              ? `${styles.factionProgressBadge} ${styles.atThreshold}`
              : styles.factionProgressBadge;

          return (
            <Group key={player.faction} className={badgeClass} gap={4}>
              <CircularFactionIcon faction={player.faction} size={28} />
              {isScored ? (
                <IconCheck size={16} color="var(--mantine-color-green-5)" />
              ) : (
                <Text className={styles.progressBadgeText}>
                  {progress}/{progressThreshold}
                </Text>
              )}
            </Group>
          );
        }
      )}
    </>
  );
}

export default ProgressObjectiveDisplay;