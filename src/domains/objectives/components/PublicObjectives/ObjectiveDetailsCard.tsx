import { Stack, Box, Text, Group, Divider, Image } from "@mantine/core";
import { IconCheck, IconQuestionMark } from "@tabler/icons-react";
import { publicObjectives } from "@/entities/data/publicObjectives";
import { PlayerData } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import classes from "./ObjectiveDetailsCard.module.css";
import { getPlayerFactionDisplayName } from "@/utils/playerUtils";
import { useViewerDiscordId, useHideScoreOrder } from "@/hooks/useGameContext";
import { computeScoreTier, getOwnFaction } from "@/utils/objectiveScoreTiers";
import { AnonymousPlayerToken } from "@/shared/ui/AnonymousPlayerToken";

type Props = {
  objectiveKey: string;
  playerData: PlayerData[];
  hasRedTape?: boolean;
  scoredFactions?: string[];
  unidentifiedScorerCount?: number;
  color?: "orange" | "blue" | "gray";
  factionProgress?: Record<string, number>;
  progressThreshold?: number;
  showFactionProgress?: boolean;
};

export function ObjectiveDetailsCard({
  objectiveKey,
  playerData,
  hasRedTape,
  scoredFactions = [],
  unidentifiedScorerCount = 0,
  color = "blue",
  factionProgress = {},
  progressThreshold = 0,
  showFactionProgress = true,
}: Props) {
  const objectiveData = publicObjectives.find(
    (obj) => obj.alias === objectiveKey
  );
  const viewerDiscordId = useViewerDiscordId();
  const hideScoreOrder = useHideScoreOrder();

  if (!objectiveData) return null;

  const ownFaction = getOwnFaction(playerData, viewerDiscordId);
  const tier = computeScoreTier(
    scoredFactions,
    unidentifiedScorerCount,
    playerData,
    ownFaction,
    hideScoreOrder
  );
  const ownProgress = ownFaction ? (factionProgress[ownFaction] ?? 0) : 0;

  // Already in render order - seat order normally, grouped by state in FoW (see computeScoreTier).
  const identifiedRows = tier.identified;

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

        {showFactionProgress && (
          <>
            <Divider c="gray.7" opacity={0.8} />

            <DetailsCard.Section
              title="Faction Progress"
              content={
                <Stack gap={6}>
                  {tier.ownFaction && (
                    <Group
                      key={tier.ownFaction}
                      gap="sm"
                      align="center"
                      wrap="nowrap"
                    >
                      <Box w={24} className={classes.factionIconBox}>
                        <CircularFactionIcon faction={tier.ownFaction} size={24} />
                      </Box>
                      <Text
                        size="xs"
                        c="gray.4"
                        fw={600}
                        tt="uppercase"
                        className={classes.factionName}
                      >
                        You
                      </Text>
                      <Box w={40} className={classes.progressValueBox} ml="auto">
                        {tier.ownScored ? (
                          <IconCheck
                            size={18}
                            color="var(--mantine-color-green-5)"
                          />
                        ) : (
                          <Text size="sm" c="gray.4" fw={500}>
                            {ownProgress}/{progressThreshold}
                          </Text>
                        )}
                      </Box>
                    </Group>
                  )}

                  {identifiedRows.map(({ player, scored: isScored }) => (
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
                        ) : factionProgress[player.faction] !== undefined ? (
                          <Text size="sm" c="gray.4" fw={500}>
                            {factionProgress[player.faction]}/{progressThreshold}
                          </Text>
                        ) : (
                          <IconQuestionMark
                            size={16}
                            color="var(--mantine-color-gray-5)"
                          />
                        )}
                      </Box>
                    </Group>
                  ))}

                  {Array.from({ length: tier.anonymousScorerCount }, (_, i) => (
                    <Group
                      key={i}
                      gap="sm"
                      align="center"
                      wrap="nowrap"
                    >
                      <Box w={24} className={classes.factionIconBox}>
                        <AnonymousPlayerToken size={24} />
                      </Box>
                      <Text
                        size="sm"
                        c="gray.5"
                        fw={500}
                        fs="italic"
                        className={classes.playerName}
                      >
                        Unidentified player
                      </Text>
                      <Box w={40} className={classes.progressValueBox} ml="auto">
                        <IconCheck size={18} color="var(--mantine-color-gray-5)" />
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
