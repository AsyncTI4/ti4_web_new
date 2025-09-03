import { Box, Text, Group, Stack } from "@mantine/core";
import { Shimmer } from "../../PlayerArea/Shimmer";
import { getGradientClasses } from "../../PlayerArea/gradientClasses";
import { Objective, PlayerData } from "../../../data/types";
import { CircularFactionIcon } from "../../shared/CircularFactionIcon";
import { publicObjectives } from "../../../data/publicObjectives";
import styles from "./ExpandedObjectiveCard.module.css";
import ProgressObjectiveDisplay from "./ProgressObjectiveDisplay";

type Props = {
  playerData: PlayerData[];
  objective: Objective;
  color: "orange" | "blue" | "gray";
  custom?: boolean;
};

function ExpandedObjectiveCard({
  objective,
  playerData,
  color,
  custom = true,
}: Props) {
  const objectiveData = publicObjectives.find(
    (obj) => obj.alias === objective.key
  );

  // Create faction progress data with alphabetical sorting for consistency
  const factionProgressData = playerData
    .map((player) => ({
      player,
      progress: objective.factionProgress[player.faction] || 0,
      isScored: objective.scoredFactions.includes(player.faction),
      isAtThreshold:
        (objective.factionProgress[player.faction] || 0) >=
        objective.progressThreshold,
    }))
    .sort((a, b) => a.player.faction.localeCompare(b.player.faction));

  const renderProgressDisplay = () => {
    if (!objective.revealed) return null;

    if (objective.progressThreshold > 0) {
      return (
        <ProgressObjectiveDisplay
          factionProgressData={factionProgressData}
          progressThreshold={objective.progressThreshold}
        />
      );
    }

    if (custom) {
      return objective.scoredFactions.map((faction) => (
        <CircularFactionIcon key={faction} faction={faction} size={28} />
      ));
    }

    return null;
  };

  return (
    <Shimmer
      color={color}
      p="sm"
      className={`${getGradientClasses(color).border} ${getGradientClasses(color).backgroundStrong} ${getGradientClasses(color).leftBorder} ${styles[color]} ${!objective.revealed ? styles.unrevealed : ""}`}
    >
      <Group className={styles.mainRow}>
        <Box className={styles.contentArea}>
          <Text
            className={`${styles.objectiveTitle} ${objective.revealed ? styles.revealed : styles.hidden}`}
          >
            {objective.revealed ? objective.name : "UNREVEALED"}
          </Text>
          {objective.revealed && objectiveData && (
            <Text className={styles.requirementText} size="sm">
              {objectiveData.text}
            </Text>
          )}
        </Box>
        <Stack>
          <Group className={styles.progressBadges}>
            {renderProgressDisplay()}
          </Group>
        </Stack>
      </Group>
    </Shimmer>
  );
}

export default ExpandedObjectiveCard;
