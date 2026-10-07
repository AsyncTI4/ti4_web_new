import { Stack, Box, Text, Group, Divider, Image } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { publicObjectives } from "@/entities/data/publicObjectives";
import { PlayerData } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import classes from "./ObjectiveDetailsCard.module.css";
import { getPlayerFactionDisplayName } from "@/utils/playerUtils";

type ObjectiveColor = "orange" | "blue" | "gray";

const CARD_COLORS = { orange: "orange", blue: "blue", gray: "none" } as const;
const CAPTION_COLORS = { orange: "orange", blue: "blue", gray: "yellow" } as const;

type Props = {
  objectiveKey: string;
  playerData: PlayerData[];
  hasRedTape?: boolean;
  scoredFactions?: string[];
  color?: ObjectiveColor;
  factionProgress?: Record<string, number>;
  progressThreshold?: number;
  showFactionProgress?: boolean;
};

export function ObjectiveDetailsCard({
  objectiveKey,
  playerData,
  hasRedTape,
  scoredFactions = [],
  color = "blue",
  factionProgress = {},
  progressThreshold = 0,
  showFactionProgress = true,
}: Props) {
  const objectiveData = publicObjectives.find(
    (obj) => obj.alias === objectiveKey
  );

  if (!objectiveData) return null;

  const scoredFactionsSet = new Set(scoredFactions);

  const factionProgressData = playerData.map((player) => ({
    player,
    progress: factionProgress[player.faction] || 0,
    isScored: scoredFactionsSet.has(player.faction),
  }));

  // Scored first, then unscored by highest progress
  factionProgressData.sort((a, b) => {
    if (a.isScored !== b.isScored) return a.isScored ? -1 : 1;
    if (a.isScored) return 0;
    return b.progress - a.progress;
  });

  return (
    <DetailsCard width={320} color={CARD_COLORS[color]}>
      <Stack gap="md">
        <DetailsCard.Title
          title={objectiveData.name}
          icon={hasRedTape && <Image src="/redTape.png" w={48} h={48} />}
          subtitle={`${objectiveData.phase} Phase`}
          caption={`${objectiveData.points} VP`}
          captionColor={CAPTION_COLORS[color]}
        />

        <Divider c="gray.7" opacity={0.8} />

        <DetailsCard.Section title="Requirement" content={objectiveData.text} />

        {showFactionProgress && (
          <>
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
                        <CircularFactionIcon faction={player.faction} factionImageOverride={player.factionImage} factionImageTypeOverride={player.factionImageType} size={24} />
                      </Box>
                      <Text
                        size="xs"
                        c="gray.4"
                        fw={600}
                        tt="uppercase"
                        className={classes.factionName}
                      >
                        {getPlayerFactionDisplayName(player)}
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
          </>
        )}
      </Stack>
    </DetailsCard>
  );
}
