import { Box, Group, Stack, SimpleGrid, Text, Image } from "@mantine/core";
import { PlayerData, Objectives } from "@/data/types";
import { PlayerCardBox } from "@/components/PlayerCardBox";
import { Chip } from "@/components/shared/primitives/Chip";
import { ScoredSecret } from "@/components/PlayerArea/ScoredSecret";
import { PromissoryNote } from "@/components/PlayerArea";
import { PlayerColor } from "@/components/PlayerArea/PlayerColor";
import { cdnImage } from "@/data/cdnImage";
import styles from "./PlayerScoreSummary.module.css";

type Props = {
  playerData: PlayerData[];
  objectives: Objectives;
};

export function PlayerScoreSummary({ playerData, objectives }: Props) {
  if (!playerData || !objectives) return null;

  const sortedPlayers = [...playerData].sort(
    (a, b) => (b.totalVps || 0) - (a.totalVps || 0)
  );

  return (
    <Box>
      <Text className={styles.sectionTitle} ff="heading">
        Player scoring summary
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {sortedPlayers.map((player) => {
          const { stage1, stage2, other } = getScoredPublicsByTier(
            player,
            objectives
          );
          const secretIds = Object.keys(player.secretsScored || {});
          const sfttIds = getPlayerSftt(player.promissoryNotesInPlayArea || []);

          const hasAny =
            stage1.length ||
            stage2.length ||
            other.length ||
            secretIds.length ||
            sfttIds.length;
          if (!hasAny) return null;

          return (
            <PlayerCardBox
              key={player.faction}
              color={player.color}
              faction={player.faction}
              paperProps={{ style: { height: "100%" } }}
            >
              <Group justify="space-between" align="center" mb="xs">
                <Group gap={8} px={4} align="center">
                  <Image
                    src={cdnImage(`/factions/${player.faction}.png`)}
                    alt={player.faction}
                    w={26}
                    h={26}
                  />
                  <Text
                    size="sm"
                    fw={700}
                    c="white"
                    ff="heading"
                    className={styles.playerName}
                  >
                    {player.userName}
                  </Text>
                  <PlayerColor color={player.color} size="xs" />
                </Group>
                <Text size="sm" fw={700} c="white" ff="heading">
                  {player.totalVps ?? 0} VP
                </Text>
              </Group>

              <Stack gap="xs">
                {/* Public objectives (Stage I + Stage II combined) */}
                {(() => {
                  const publics = [...stage1, ...stage2];
                  if (publics.length === 0) return null;
                  const stage1Keys = new Set(stage1.map((o) => o.key));
                  return (
                    <Box>
                      <Text className={styles.sectionSubTitle}>
                        Public objectives
                      </Text>
                      <Group gap="xs" wrap="wrap">
                        {publics.map((obj) => (
                          <Chip
                            key={obj.key}
                            accent={stage1Keys.has(obj.key) ? "orange" : "blue"}
                            title={obj.name}
                            strong
                            px={8}
                            py={4}
                          />
                        ))}
                      </Group>
                    </Box>
                  );
                })()}

                {/* Other */}
                {other.length > 0 && (
                  <Box>
                    <Text className={styles.sectionSubTitle}>Other</Text>
                    <Group gap="xs" wrap="wrap">
                      {other.map((obj) => (
                        <Chip
                          key={obj.key}
                          accent="gray"
                          title={obj.name}
                          px={8}
                          py={4}
                          strong
                        />
                      ))}
                    </Group>
                  </Box>
                )}

                {/* Secrets */}
                {secretIds.length > 0 && (
                  <Box>
                    <Text className={styles.sectionSubTitle}>Secrets</Text>
                    <Group gap="xs" wrap="wrap">
                      {secretIds.map((id) => (
                        <ScoredSecret key={id} secretId={id} />
                      ))}
                    </Group>
                  </Box>
                )}

                {/* SFTT */}
                {sfttIds.length > 0 && (
                  <Box>
                    <Text className={styles.sectionSubTitle}>
                      Support for the Throne
                    </Text>
                    <Group gap="xs" wrap="wrap">
                      {sfttIds.map((pn) => (
                        <PromissoryNote key={pn} promissoryNoteId={pn} />
                      ))}
                    </Group>
                  </Box>
                )}
              </Stack>
            </PlayerCardBox>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

function getScoredPublicsByTier(player: PlayerData, objectives: Objectives) {
  const faction = player.faction;
  const stage1 = objectives.stage1Objectives.filter((o) =>
    o.scoredFactions?.includes(faction)
  );
  const stage2 = objectives.stage2Objectives.filter((o) =>
    o.scoredFactions?.includes(faction)
  );
  const other = objectives.customObjectives.filter((o) =>
    o.scoredFactions?.includes(faction)
  );
  return { stage1, stage2, other };
}

function getPlayerSftt(promissoryNotesInPlayArea: string[]): string[] {
  return (promissoryNotesInPlayArea || []).filter((id) => id.endsWith("_sftt"));
}
