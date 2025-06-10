import { Stack, Box, Text, Group, Divider, Badge } from "@mantine/core";
import { publicObjectives } from "../../../data/publicObjectives";
import { PlayerData } from "../../../data/types";
import { CircularFactionIcon } from "../../shared/CircularFactionIcon";
import classes from "./ObjectiveDetailsCard.module.css";

type Props = {
  objectiveKey: string;
  playerData: PlayerData[];
  scoredFactions?: string[];
  color?: "orange" | "blue" | "gray";
};

export function ObjectiveDetailsCard({
  objectiveKey,
  playerData,
  scoredFactions = [],
  color = "blue",
}: Props) {
  const objectiveData = publicObjectives.find(
    (obj) => obj.alias === objectiveKey
  );

  if (!objectiveData) return null;

  // Get players who have scored this objective
  const scoredPlayers = playerData.filter((player) =>
    scoredFactions.includes(player.faction)
  );

  return (
    <Box w={320} p="md" className={classes.card}>
      <Stack gap="md">
        {/* Header with point value and phase */}
        <Group gap="md" align="flex-start">
          <Box className={`${classes.pointsContainer} ${classes[color]}`}>
            <Text size="xl" fw={700} c="white" className={classes.pointsText}>
              {objectiveData.points}
            </Text>
          </Box>
          <Stack gap={4} flex={1}>
            <Text size="lg" fw={700} c="white" className={classes.title}>
              {objectiveData.name}
            </Text>
            <Badge color="gray" size="sm" variant="light">
              {objectiveData.phase} Phase
            </Badge>
          </Stack>
        </Group>

        <Divider c="gray.7" opacity={0.8} />

        {/* Objective Text */}
        <Box>
          <Text size="sm" c="gray.4" mb={4} fw={600}>
            Requirement
          </Text>
          <Text size="sm" c="gray.2" className={classes.requirementText}>
            {objectiveData.text}
          </Text>
        </Box>

        {/* Scored Players */}
        {scoredPlayers.length > 0 && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <Box>
              <Text size="sm" c="gray.4" mb={8} fw={600}>
                Scored By
              </Text>
              <Stack gap={6}>
                {scoredPlayers.map((player) => (
                  <Group key={player.faction} gap="sm" align="center">
                    <CircularFactionIcon faction={player.faction} size={24} />
                    <Text
                      size="xs"
                      c="gray.4"
                      fw={600}
                      tt="uppercase"
                      style={{ minWidth: 60, letterSpacing: "0.5px" }}
                    >
                      {player.faction}
                    </Text>
                    <Text size="sm" c="gray.3">
                      {player.userName.length > 20
                        ? `${player.userName.slice(0, 20)}...`
                        : player.userName}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
}
