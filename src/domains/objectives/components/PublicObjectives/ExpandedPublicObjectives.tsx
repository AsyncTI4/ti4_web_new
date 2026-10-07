import { useState } from "react";
import { Box, Stack, SimpleGrid, Flex } from "@mantine/core";
import ExpandedObjectiveCard from "./ExpandedObjectiveCard";
import { Objective, Objectives, PlayerData, type LawInPlay } from "@/entities/data/types";
import styles from "./PublicObjectives.module.css";
import Caption from "@/shared/ui/Caption/Caption";
import { LawCard } from "@/domains/objectives/components/LawsInPlay";

type ObjectiveColor = "orange" | "blue" | "gray";

type Props = {
  objectives: Objectives;
  playerData: PlayerData[];
  lawsInPlay?: LawInPlay[];
  alwaysShowRequirements?: boolean;
};

function ExpandedPublicObjectives({
  objectives,
  playerData,
  lawsInPlay = [],
  alwaysShowRequirements = false,
}: Props) {
  const [openObjectiveKey, setOpenObjectiveKey] = useState<string | null>(null);

  const renderCard = (objective: Objective, color: ObjectiveColor) => (
    <ExpandedObjectiveCard
      key={objective.key}
      playerData={playerData}
      objective={objective}
      color={color}
      alwaysShowRequirement={alwaysShowRequirements}
      opened={openObjectiveKey === objective.key}
      onToggle={() =>
        setOpenObjectiveKey((current) =>
          current === objective.key ? null : objective.key
        )
      }
      onOpenChange={(nextOpened) =>
        setOpenObjectiveKey(nextOpened ? objective.key : null)
      }
    />
  );

  const renderStage = (title: string, stageObjectives: Objective[], color: ObjectiveColor) => {
    if (stageObjectives.length === 0) return null;
    return (
      <Box>
        <Caption size="sm" className={styles.stageTitle}>
          {title}
        </Caption>
        <SimpleGrid cols={{ base: 1, sm: 1 }} spacing="xs">
          {stageObjectives.map((objective) => renderCard(objective, color))}
        </SimpleGrid>
      </Box>
    );
  };

  return (
    <Box className={styles.themedContainer}>
      <Stack gap="md">
        <Box>
          <SimpleGrid
            cols={{ base: 2, sm: 2 }}
            spacing="xs"
            className={styles.stageGrid}
          >
            {renderStage("Stage I", objectives.stage1Objectives, "orange")}
            {renderStage("Stage II", objectives.stage2Objectives, "blue")}
          </SimpleGrid>
        </Box>

        {objectives.customObjectives.length > 0 && (
          <Box>
            <Flex gap="xs" className={styles.customRow}>
              {objectives.customObjectives.map((objective) => renderCard(objective, "gray"))}
            </Flex>
          </Box>
        )}

        {lawsInPlay.length > 0 && (
          <Box>
            <Caption
              size="sm"
              rule
              className={`${styles.stageTitle} ${styles.lawsTitle}`}
            >
              Laws in Play
            </Caption>
            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="xs">
              {lawsInPlay.map((law, index) => (
                <LawCard key={`${law.id}-${index}`} law={law} />
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default ExpandedPublicObjectives;
