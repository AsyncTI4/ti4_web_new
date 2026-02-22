import { Stack, Text, Box } from "@mantine/core";
import { useState } from "react";
import { CompactObjective } from "../CompactObjective";
import { Objectives, PlayerData } from "../../../data/types";
import { StageObjectivesSection } from "./StageObjectivesSection";

type Props = {
  objectives: Objectives;
  playerData: PlayerData[];
};

export function CompactObjectives({ objectives, playerData }: Props) {
  const [selectedObjective, setSelectedObjective] = useState<string | null>(
    null
  );

  return (
    <Stack gap="xs">
      <StageObjectivesSection
        objectives={objectives.stage1Objectives}
        playerData={playerData}
        title="Stage I"
        color="orange"
        selectedObjective={selectedObjective}
        onSelect={setSelectedObjective}
      />

      <StageObjectivesSection
        objectives={objectives.stage2Objectives}
        playerData={playerData}
        title="Stage II"
        color="blue"
        selectedObjective={selectedObjective}
        onSelect={setSelectedObjective}
      />

      {/* Other Objectives */}
      {objectives.customObjectives.length > 0 && (
        <Box>
          <Text size="sm" fw={600} c="gray.4" mb={4}>
            Other
          </Text>
          <Stack gap={2}>
            {objectives.customObjectives.map((objective) => (
              <CompactObjective
                key={objective.key}
                objectiveKey={objective.key}
                name={objective.name}
                color="gray"
                revealed={objective.revealed}
                scoredFactions={objective.scoredFactions}
                playerData={playerData}
                multiScoring
              />
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
