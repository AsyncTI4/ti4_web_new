import { Stack, Box, Text, Group, Divider, Badge } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { publicObjectives } from "../../../data/publicObjectives";
import { PlayerData } from "../../../data/types";
import { CircularFactionIcon } from "../../shared/CircularFactionIcon";
import classes from "./ObjectiveDetailsCard.module.css";

type Props = {
  objectiveKey: string;
  playerData: PlayerData[];
  scoredFactions?: string[];
  color?: "orange" | "blue" | "gray";
  factionProgress?: Record<string, number>;
  progressThreshold?: number;
};

export function ObjectiveDetailsCard({
  objectiveKey,
  playerData,
  scoredFactions = [],
  color = "blue",
  factionProgress = {},
  progressThreshold = 0,
}: Props) {
  const objectiveData = publicObjectives.find(
    (obj) => obj.alias === objectiveKey
  );

  if (!objectiveData) return null;

  // Create a set for fast lookup of scored factions
  const scoredFactionsSet = new Set(scoredFactions);

  // Create faction progress data with sorting
  const factionProgressData = playerData.map((player) => ({
    player,
    progress: factionProgress[player.faction] || 0,
    isScored: scoredFactionsSet.has(player.faction),
  }));

  // Sort by: scored first, then by highest progress
  factionProgressData.sort((a, b) => {
    if (a.isScored && !b.isScored) return -1;
    if (!a.isScored && b.isScored) return 1;
    if (a.isScored && b.isScored) return 0; // Keep same order for scored
    return b.progress - a.progress; // Higher progress first for unscored
  });

  return (
    <Box p="md" className={classes.card}>
      <Stack className={classes.cardStack}>
        {/* Header with point value and phase */}
        <Group className={classes.headerGroup}>
          <Box className={`${classes.pointsContainer} ${classes[color]}`}>
            <Text className={classes.pointsText}>{objectiveData.points}</Text>
          </Box>
          <Stack className={classes.titleStack}>
            <Text className={classes.title}>{objectiveData.name}</Text>
            <Badge
              color="gray"
              size="sm"
              variant="light"
              className={classes.phaseBadge}
            >
              {objectiveData.phase} Phase
            </Badge>
          </Stack>
        </Group>

        <Divider className={classes.divider} />

        {/* Objective Text */}
        <Box>
          <Text className={classes.sectionLabel}>Requirement</Text>
          <Text className={classes.requirementText}>{objectiveData.text}</Text>
        </Box>

        {/* Faction Progress */}
        <Divider className={classes.divider} />
        <Box>
          <Text className={classes.progressSectionLabel}>Faction Progress</Text>
          <Stack className={classes.progressStack}>
            {factionProgressData.map(({ player, progress, isScored }) => (
              <Group key={player.faction} className={classes.progressRow}>
                {/* Column 1: Faction Icon */}
                <Box className={classes.factionIconContainer}>
                  <CircularFactionIcon faction={player.faction} size={24} />
                </Box>

                {/* Column 2: Faction Name */}
                <Text className={classes.factionNameText}>
                  {player.faction}
                </Text>

                {/* Column 3: Player Name */}
                <Text className={classes.playerNameText}>
                  {player.userName.length > 12
                    ? `${player.userName.slice(0, 12)}...`
                    : player.userName}
                </Text>

                {/* Column 4: Progress or Checkmark */}
                <Box className={classes.progressContainer}>
                  {isScored ? (
                    <IconCheck size={18} color="var(--mantine-color-green-5)" />
                  ) : (
                    <Text className={classes.progressText}>
                      {progress}/{progressThreshold}
                    </Text>
                  )}
                </Box>
              </Group>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
