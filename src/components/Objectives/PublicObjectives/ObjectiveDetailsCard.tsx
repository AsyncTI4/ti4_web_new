import { Stack, Box, Text, Group, Divider, Image } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { publicObjectives } from "../../../data/publicObjectives";
import { PlayerData } from "../../../data/types";
import { CircularFactionIcon } from "../../shared/CircularFactionIcon";
import { DetailsCard } from "@/components/shared/DetailsCard";
import classes from "./ObjectiveDetailsCard.module.css";

type Props = {
  objectiveKey: string;
  playerData: PlayerData[];
  hasRedTape?: boolean;
  scoredFactions?: string[];
  color?: "orange" | "blue" | "gray";
  factionProgress?: Record<string, number>;
  progressThreshold?: number;
};

export function ObjectiveDetailsCard({
  objectiveKey,
  playerData,
  hasRedTape,
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

  const mapCardColor = (
    c: Props["color"]
  ): "none" | "yellow" | "purple" | "red" | "orange" | "blue" | "green" => {
    if (c === "orange") return "orange";
    if (c === "blue") return "blue";
    return "none";
  };

  const mapCaptionColor = (
    c: Props["color"]
  ): "blue" | "yellow" | "red" | "orange" => {
    if (c === "orange") return "orange";
    if (c === "blue") return "blue";
    return "yellow";
  };

  const renderRedTape = () => {
      return (
          <Image src={"/redTape.png"} className={"redTape"} w={48} h={48} />
      ) 
    }

  return (
    <DetailsCard width={320} color={mapCardColor(color)}>
      <Stack gap="md">
        <DetailsCard.Title
          title={objectiveData.name}
          icon={hasRedTape && renderRedTape()}
          subtitle={`${objectiveData.phase} Phase`}
          caption={`${objectiveData.points} VP`}
          captionColor={mapCaptionColor(color)}
        />

        <Divider c="gray.7" opacity={0.8} />

        <DetailsCard.Section title="Requirement" content={objectiveData.text} />

        <Divider c="gray.7" opacity={0.8} />

        <DetailsCard.Section
          title="Faction Progress"
          content={
            <Stack gap={6}>
              {factionProgressData.map(({ player, progress, isScored }) => (
                <Group
                  key={player.faction}
                  gap="sm"
                  align="center"
                  wrap="nowrap"
                >
                  <Box w={24} className={classes.factionIconBox}>
                    <CircularFactionIcon faction={player.faction} size={24} />
                  </Box>
                  <Text
                    size="xs"
                    c="gray.4"
                    fw={600}
                    tt="uppercase"
                    className={classes.factionName}
                  >
                    {player.faction}
                  </Text>
                  <Text size="sm" c="gray.3" className={classes.playerName}>
                    {player.userName.length > 12
                      ? `${player.userName.slice(0, 12)}...`
                      : player.userName}
                  </Text>
                  <Box w={40} className={classes.progressValueBox}>
                    {isScored ? (
                      <IconCheck
                        size={18}
                        color="var(--mantine-color-green-5)"
                      />
                    ) : (
                      <Text size="sm" c="gray.4" fw={500}>
                        {progress}/{progressThreshold}
                      </Text>
                    )}
                  </Box>
                </Group>
              ))}
            </Stack>
          }
        />
      </Stack>
    </DetailsCard>
  );
}
