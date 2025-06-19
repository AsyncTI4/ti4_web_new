import { Box, Text, Stack, SimpleGrid } from "@mantine/core";
import ExpandedObjectiveCard from "./ExpandedObjectiveCard";
import { Objectives, PlayerData } from "../../../data/types";
import styles from "./PublicObjectives.module.css";

type Props = {
  objectives: Objectives;
  playerData: PlayerData[];
};

function ExpandedPublicObjectives({ objectives, playerData }: Props) {
  console.log("objectives.customObjectives", objectives.customObjectives);
  return (
    <Box>
      <Text className={styles.sectionTitle}>Public Objectives</Text>
      <Stack gap="md">
        {/* Stage I Objectives (Orange) */}
        {objectives.stage1Objectives.length > 0 && (
          <Box>
            <Text className={`${styles.stageTitle} ${styles.stage1Title}`}>
              Stage I
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
              {objectives.stage1Objectives.map((objective) => (
                <ExpandedObjectiveCard
                  key={objective.key}
                  text={objective.name}
                  vp={objective.pointValue}
                  color="orange"
                  revealed={objective.revealed}
                  scoredFactions={objective.scoredFactions}
                  playerData={playerData}
                  objectiveKey={objective.key}
                  factionProgress={objective.factionProgress}
                  progressThreshold={objective.progressThreshold}
                />
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Stage II Objectives (Blue) */}
        {objectives.stage2Objectives.length > 0 && (
          <Box>
            <Text className={`${styles.stageTitle} ${styles.stage2Title}`}>
              Stage II
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
              {objectives.stage2Objectives.map((objective) => (
                <ExpandedObjectiveCard
                  key={objective.key}
                  text={objective.name}
                  vp={objective.pointValue}
                  color="blue"
                  revealed={objective.revealed}
                  scoredFactions={objective.scoredFactions}
                  playerData={playerData}
                  objectiveKey={objective.key}
                  factionProgress={objective.factionProgress}
                  progressThreshold={objective.progressThreshold}
                />
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Other Objectives (Gray) */}
        {objectives.customObjectives.length > 0 && (
          <Box>
            <Text className={`${styles.stageTitle} ${styles.otherTitle}`}>
              Other
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
              {objectives.customObjectives.map((objective) => (
                <ExpandedObjectiveCard
                  key={objective.key}
                  text={objective.name}
                  vp={objective.pointValue}
                  color="gray"
                  revealed={objective.revealed}
                  scoredFactions={objective.scoredFactions}
                  multiScoring={objective.multiScoring}
                  playerData={playerData}
                  objectiveKey={objective.key}
                  factionProgress={objective.factionProgress}
                  progressThreshold={objective.progressThreshold}
                  custom
                />
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default ExpandedPublicObjectives;
