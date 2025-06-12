import { Stack, Text, Box } from "@mantine/core";
import { useState } from "react";
import { CompactObjective } from "../CompactObjective";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { ObjectiveDetailsCard } from "../../Objectives/PublicObjectives/ObjectiveDetailsCard";
import { Objectives, PlayerData } from "../../../data/types";

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
      {/* Stage 1 Objectives */}
      {objectives.stage1Objectives.length > 0 && (
        <Box>
          <Text size="sm" fw={600} c="orange.4" mb={4}>
            Stage I
          </Text>
          <Stack gap={2}>
            {objectives.stage1Objectives.map((objective) => (
              <SmoothPopover
                position="right"
                key={objective.key}
                opened={selectedObjective === objective.key}
                onChange={(opened) =>
                  setSelectedObjective(opened ? objective.key : null)
                }
              >
                <SmoothPopover.Target>
                  <div>
                    <CompactObjective
                      objectiveKey={objective.key}
                      name={objective.name}
                      pointValue={objective.pointValue}
                      color="orange"
                      revealed={objective.revealed}
                      onClick={() => setSelectedObjective(objective.key)}
                      scoredFactions={objective.scoredFactions}
                      playerData={playerData}
                    />
                  </div>
                </SmoothPopover.Target>
                <SmoothPopover.Dropdown p={0}>
                  <ObjectiveDetailsCard
                    objectiveKey={objective.key}
                    playerData={playerData}
                    scoredFactions={objective.scoredFactions}
                    color="orange"
                  />
                </SmoothPopover.Dropdown>
              </SmoothPopover>
            ))}
          </Stack>
        </Box>
      )}

      {/* Stage 2 Objectives */}
      {objectives.stage2Objectives.length > 0 && (
        <Box>
          <Text size="sm" fw={600} c="blue.4" mb={4}>
            Stage II
          </Text>
          <Stack gap={2}>
            {objectives.stage2Objectives.map((objective) => (
              <SmoothPopover
                position="right"
                key={objective.key}
                opened={selectedObjective === objective.key}
                onChange={(opened) =>
                  setSelectedObjective(opened ? objective.key : null)
                }
              >
                <SmoothPopover.Target>
                  <div>
                    <CompactObjective
                      objectiveKey={objective.key}
                      name={objective.name}
                      pointValue={objective.pointValue}
                      color="blue"
                      revealed={objective.revealed}
                      onClick={() => setSelectedObjective(objective.key)}
                      scoredFactions={objective.scoredFactions}
                      playerData={playerData}
                    />
                  </div>
                </SmoothPopover.Target>
                <SmoothPopover.Dropdown p={0}>
                  <ObjectiveDetailsCard
                    objectiveKey={objective.key}
                    playerData={playerData}
                    scoredFactions={objective.scoredFactions}
                    color="blue"
                  />
                </SmoothPopover.Dropdown>
              </SmoothPopover>
            ))}
          </Stack>
        </Box>
      )}

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
                pointValue={objective.pointValue}
                color="gray"
                revealed={objective.revealed}
                scoredFactions={objective.scoredFactions}
                playerData={playerData}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
