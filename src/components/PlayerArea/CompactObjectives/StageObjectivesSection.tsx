import { Box, Stack, Text } from "@mantine/core";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { CompactObjective } from "../CompactObjective";
import { ObjectiveDetailsCard } from "../../Objectives/PublicObjectives/ObjectiveDetailsCard";
import type { Objectives, PlayerData } from "../../../data/types";

type StageObjective = Objectives["stage1Objectives"][number];

type Props = {
  objectives: StageObjective[];
  playerData: PlayerData[];
  title: string;
  color: "orange" | "blue";
  selectedObjective: string | null;
  onSelect: (objectiveKey: string | null) => void;
};

export function StageObjectivesSection({
  objectives,
  playerData,
  title,
  color,
  selectedObjective,
  onSelect,
}: Props) {
  if (objectives.length === 0) return null;

  const textColor = color === "orange" ? "orange.4" : "blue.4";

  return (
    <Box>
      <Text size="sm" fw={600} c={textColor} mb={4}>
        {title}
      </Text>
      <Stack gap={2}>
        {objectives.map((objective) => {
          const isSelected = selectedObjective === objective.key;
          return (
            <SmoothPopover
              position="right"
              key={objective.key}
              opened={isSelected}
              onChange={(opened) =>
                onSelect(opened ? objective.key : null)
              }
            >
              <SmoothPopover.Target>
                <div>
                  <CompactObjective
                    objectiveKey={objective.key}
                    name={objective.name}
                    color={color}
                    revealed={objective.revealed}
                    onClick={() => onSelect(objective.key)}
                    scoredFactions={objective.scoredFactions}
                    playerData={playerData}
                    multiScoring={objective.multiScoring}
                    hasRedTape={objective.hasRedTape}
                  />
                </div>
              </SmoothPopover.Target>
              <SmoothPopover.Dropdown p={0}>
                <ObjectiveDetailsCard
                  objectiveKey={objective.key}
                  playerData={playerData}
                  hasRedTape={objective.hasRedTape}
                  scoredFactions={objective.scoredFactions}
                  color={color}
                  factionProgress={objective.factionProgress}
                  progressThreshold={objective.progressThreshold}
                />
              </SmoothPopover.Dropdown>
            </SmoothPopover>
          );
        })}
      </Stack>
    </Box>
  );
}
