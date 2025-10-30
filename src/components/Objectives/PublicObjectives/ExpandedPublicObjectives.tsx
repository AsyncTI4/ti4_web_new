import { Box, Stack, SimpleGrid, Flex } from "@mantine/core";
import ExpandedObjectiveCard from "./ExpandedObjectiveCard";
import { Objectives, PlayerData } from "../../../data/types";
import styles from "./PublicObjectives.module.css";
import Caption from "@/components/shared/Caption/Caption";

type Props = {
  objectives: Objectives;
  playerData: PlayerData[];
};

function ExpandedPublicObjectives({ objectives, playerData }: Props) {
  return (
    <Box className={styles.themedContainer}>
      <Stack gap="md">
        <Box>
          {/* Stage I Objectives (Orange) */}
          <SimpleGrid cols={{ base: 2, sm: 2 }} spacing="xs">
            {objectives.stage1Objectives.length > 0 && (
              <Box>
                <Caption
                  size="sm"
                  className={`${styles.stageTitle} ${styles.stage1Title}`}
                >
                  Stage I
                </Caption>
                <SimpleGrid cols={{ base: 1, sm: 1 }} spacing="xs">
                  {objectives.stage1Objectives.map((objective) => (
                    <ExpandedObjectiveCard
                      key={objective.key}
                      playerData={playerData}
                      objective={objective}
                      color="orange"
                    />
                  ))}
                </SimpleGrid>
              </Box>
            )}

            {/* Stage II Objectives (Blue) */}
            {objectives.stage2Objectives.length > 0 && (
              <Box>
                <Caption
                  size="sm"
                  className={`${styles.stageTitle} ${styles.stage2Title}`}
                >
                  Stage II
                </Caption>
                <SimpleGrid cols={{ base: 1, sm: 1 }} spacing="xs">
                  {objectives.stage2Objectives.map((objective) => (
                    <ExpandedObjectiveCard
                      key={objective.key}
                      playerData={playerData}
                      objective={objective}
                      color="blue"
                    />
                  ))}
                </SimpleGrid>
              </Box>
            )}
          </SimpleGrid>
        </Box>

        {/* Other Objectives (Gray) */}
        {objectives.customObjectives.length > 0 && (
          <Box>
            <Flex gap="xs">
              {objectives.customObjectives.map((objective) => (
                <ExpandedObjectiveCard
                  key={objective.key}
                  playerData={playerData}
                  objective={objective}
                  color="gray"
                  custom
                />
              ))}
            </Flex>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default ExpandedPublicObjectives;
