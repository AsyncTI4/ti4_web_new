import { Box, Text, SimpleGrid } from "@mantine/core";
import { ObjectiveCard } from "./ObjectiveCard";
import { Objectives, PlayerData } from "../../../data/types";
import styles from "./PublicObjectives.module.css";

type Props = {
  objectives: Objectives;
  playerData: PlayerData[];
};

function PublicObjectives({ objectives, playerData }: Props) {

  objectives.customObjectives.map((objective) => (
    console.log(objective.key),
    console.log(objective.multiScoring)
  ));
  
  return (
    <Box>
      <Text className={styles.sectionTitle}>Public Objectives</Text>
      <SimpleGrid cols={3} spacing="xs">
        {/* Stage I Objectives (Orange) */}
        <Box className={styles.stage1Container}>
          <Text className={`${styles.stageTitle} ${styles.stage1Title}`}>
            Stage I
          </Text>
          <Box className={styles.objectiveList}>
            {objectives.stage1Objectives.map((objective) => (
              <ObjectiveCard
                key={objective.key}
                text={objective.name}
                vp={objective.pointValue}
                color="orange"
                revealed={objective.revealed}
                scoredFactions={objective.scoredFactions}
                playerData={playerData}
                objectiveKey={objective.key}
              />
            ))}
          </Box>
        </Box>

        {/* Stage II Objectives (Blue) */}
        <Box className={styles.stage2Container}>
          <Text className={`${styles.stageTitle} ${styles.stage2Title}`}>
            Stage II
          </Text>
          <Box className={styles.objectiveList}>
            {objectives.stage2Objectives.map((objective) => (
              <ObjectiveCard
                key={objective.key}
                text={objective.name}
                vp={objective.pointValue}
                color="blue"
                revealed={objective.revealed}
                scoredFactions={objective.scoredFactions}
                playerData={playerData}
                objectiveKey={objective.key}
              />
            ))}
          </Box>
        </Box>

        {/* Other Objectives (Gray) */}
        <Box className={styles.stage1Container}>
          <Text className={`${styles.stageTitle} ${styles.otherTitle}`}>
            Other
          </Text>
          <Box className={styles.objectiveList}>
            {objectives.customObjectives.map((objective) => (
              <ObjectiveCard
                key={objective.key}
                text={objective.name}
                vp={objective.pointValue}
                color="gray"
                revealed={objective.revealed}
                scoredFactions={objective.scoredFactions}
                multiScoring={objective.multiScoring}
                playerData={playerData}
                objectiveKey={objective.key}
              />
            ))}
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

export default PublicObjectives;
