import { Box, Text, Group } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { Shimmer } from "../../PlayerArea/Shimmer";
import { PlayerData } from "../../../data/types";
import { CircularFactionIcon } from "../../shared/CircularFactionIcon";
import { publicObjectives } from "../../../data/publicObjectives";
import styles from "./ExpandedObjectiveCard.module.css";

type Props = {
  text: string;
  vp: number;
  color: "orange" | "blue" | "gray";
  revealed?: boolean;
  scoredFactions: string[];
  multiScoring?: boolean;
  custom?: boolean;
  playerData: PlayerData[];
  objectiveKey: string;
  factionProgress?: Record<string, number>;
  progressThreshold?: number;
};

type FactionProgressData = {
  player: PlayerData;
  progress: number;
  isScored: boolean;
  isAtThreshold: boolean;
};

type CustomObjectiveDisplayProps = {
  scoredFactions: string[];
  multiScoring: boolean;
};

type ProgressObjectiveDisplayProps = {
  factionProgressData: FactionProgressData[];
  progressThreshold: number;
};

function CustomObjectiveDisplay({
  scoredFactions,
  multiScoring,
}: CustomObjectiveDisplayProps) {
  if(multiScoring) {
    let factionScoreCount = new Map<string, number>();
    return (
      <>
        {scoredFactions.map((faction) => {
          factionScoreCount.set(faction, (factionScoreCount.get(faction) ?? 0) + 1);
        (
          <CircularFactionIcon key={`${faction}_${factionScoreCount.get(faction)}`} faction={faction} size={28} />
        )})}
      </>
    );
  } else {
    return (
      <>
        {scoredFactions.map((faction) => (
          <CircularFactionIcon key={faction} faction={faction} size={28} />
        ))}
      </>
    );
  }
}

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

function ExpandedObjectiveCard({
  text,
  vp,
  color,
  revealed = true,
  scoredFactions,
  multiScoring,
  custom,
  playerData,
  objectiveKey,
  factionProgress = {},
  progressThreshold = 0,
}: Props) {
  const objectiveData = publicObjectives.find(
    (obj) => obj.alias === objectiveKey
  );

  // Create faction progress data with alphabetical sorting for consistency
  const factionProgressData = playerData.map((player) => ({
    player,
    progress: factionProgress[player.faction] || 0,
    isScored: scoredFactions.includes(player.faction),
    isAtThreshold: (factionProgress[player.faction] || 0) >= progressThreshold,
  }));

  // Sort alphabetically by faction name for consistent ordering across objectives
  factionProgressData.sort((a, b) =>
    a.player.faction.localeCompare(b.player.faction)
  );

  const renderProgressDisplay = () => {
    if (!revealed) return null;

    if (custom) {
      return <CustomObjectiveDisplay scoredFactions={scoredFactions} multiScoring={multiScoring} />;
    }

    if (progressThreshold > 0) {
      return (
        <ProgressObjectiveDisplay
          factionProgressData={factionProgressData}
          progressThreshold={progressThreshold}
        />
      );
    }

    return null;
  };

  return (
    <Shimmer
      color={color}
      p="sm"
      className={`${styles.expandedCard} ${styles[color]} ${!revealed ? styles.unrevealed : ""}`}
    >
      {/* Main Row */}
      <Group className={styles.mainRow}>
        {/* VP indicator */}
        <Box
          className={`${styles.vpIndicator} ${revealed ? styles.revealed : styles.hidden} ${revealed ? styles[color] : ""}`}
        >
          <Text
            className={`${styles.vpText} ${revealed ? styles.revealed : styles.hidden}`}
          >
            {vp}
          </Text>
        </Box>

        {/* Title and Requirement */}
        <Box className={styles.contentArea}>
          <Text
            className={`${styles.objectiveTitle} ${revealed ? styles.revealed : styles.hidden}`}
          >
            {revealed ? text : "UNREVEALED"}
          </Text>
          {revealed && objectiveData && (
            <Text className={styles.requirementText}>{objectiveData.text}</Text>
          )}
        </Box>

        {/* Progress/Scoring Display */}
        <Group className={styles.progressBadges} gap="xs">
          {renderProgressDisplay()}
        </Group>
      </Group>
    </Shimmer>
  );
}

export default ExpandedObjectiveCard;
