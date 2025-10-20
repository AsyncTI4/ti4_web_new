import { Group, Text, Grid, Stack, Flex } from "@mantine/core";
import { PlayerData, Objectives } from "@/data/types";
import { PlayerColor } from "@/components/PlayerArea/PlayerColor";
import styles from "./PlayerScoreSummary.module.css";
import { ObjectiveChip } from "./ObjectiveChip";
import { cdnImage } from "@/data/cdnImage";
import { getPromissoryNoteData } from "@/lookup/promissoryNotes";
import { useFactionColors } from "@/hooks/useFactionColors";
import { FactionIcon } from "@/components/shared/FactionIcon";

type Props = {
  playerData: PlayerData[];
  objectives: Objectives;
};

export function PlayerScoreSummary({ playerData, objectives }: Props) {
  if (!playerData || !objectives) return null;

  const factionColorMap = useFactionColors();

  const sortedPlayers = [...playerData].sort(
    (a, b) => {
      const aInit = a.scs[0];
      const bInit = b.scs[0];

      if (aInit == 8 && !a.exhaustedSCs.includes(8)) return -1;
      if (bInit == 8 && !b.exhaustedSCs.includes(8)) return 1;

      return (aInit || 0) - (bInit || 0);
    }
  );

  return (<Stack gap={10}>
    {
      sortedPlayers.map((player) => {
        const { stage1, stage2, other } = getScoredPublicsByTier(
          player,
          objectives
        );

        const secretsArray = Object.keys(player.secretsScored || {}).concat(new Array(3).fill("")).slice(0, 3);
        const sfttIds = getPlayerSftt(player.promissoryNotesInPlayArea || []);

        function getPlayerSftt(promissoryNotesInPlayArea: string[]): string[] {
          const pnData = promissoryNotesInPlayArea.map((pnId) => {
            const promissoryNoteData = getPromissoryNoteData(
              pnId,
              factionColorMap
            );

            // fake pnData to comply with type stuff (i was too dumb to figure it out)
            if (!promissoryNoteData) return {
              noteData: {
                alias: ""
              },
              faction: "",
              displayName: "",
            };
            return promissoryNoteData;
          }).filter((pnId) => pnId!.noteData.alias.endsWith("_sftt"))
            .map((pnId) => pnId?.faction);

          return pnData;
        }

        return <Group mah={100}>
          <Flex w={"20%"} justify={"space-between"} className={styles.nameBody} gap={8} px={4} align="center">
            <FactionIcon
              faction={player.faction!}
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
            <Grid columns={2}>
              <Grid.Col span={1}>
                <Text ff={"text"} className={styles.initiativeBody} fs={"md"} ta="center">
                  {player.scs[0]}
                </Text>
              </Grid.Col>
              <Grid.Col span={1}>
                <Text ff={"heading"} className={styles.vp} fs={"md"} ta="center">
                  {player.totalVps} VP
                </Text>
              </Grid.Col>
            </Grid>
          </Flex>

          <Grid gutter={10} columns={5} style={{ width: '18%' }}>
            {stage1.map((_, idx) => (
              <Grid.Col key={idx} span={{ base: 1 }}>
                <ObjectiveChip
                  image={cdnImage("/general/Public1.png")}
                  color="orange"
                />
              </Grid.Col>
            ))}
          </Grid>

          <Grid gutter={10} columns={3} style={{ width: '11%' }}>
            {secretsArray.map((_, idx) => (
              <Grid.Col key={idx} span={{ base: 1 }}>
                <ObjectiveChip
                  image={cdnImage("/general/Secret_regular.png")}
                  color="red"
                />
              </Grid.Col>
            ))}
          </Grid>

          <Grid gutter={10} columns={7} style={{ width: '20%' }}>
            {stage2.map((_, idx) => (
              <Grid.Col key={idx} span={{ base: 2 }}>
                <ObjectiveChip
                  image={cdnImage("/general/Public2.png")}
                  span={2}
                  color="blue"
                />
              </Grid.Col>
            ))}

            {other.filter((objective) => objective.name === "Custodian/Imperial")
              .map((_, idx) => (
                <Grid.Col key={idx} span={{ base: 1 }} >
                  <ObjectiveChip
                    image={cdnImage("/general/Agenda.png")}
                    color="teal"
                  />
                </Grid.Col>
              ))}

            {sfttIds.map((pnId, idx) => (
              <Grid.Col key={idx} span={{ base: 1 }} >
                <ObjectiveChip
                  image={cdnImage(`/factions/${pnId.toLowerCase()}.png`)}
                  color="yellow"
                />
              </Grid.Col>
            ))}

            {other.filter((objective) => objective.name !== "Custodian/Imperial")
              .map((_, idx) => (
                <Grid.Col key={idx} span={{ base: 1 }}>
                  <ObjectiveChip
                    image={cdnImage("/general/Promissory.png")}
                    color="teal"
                  />
                </Grid.Col>
              ))}
          </Grid>
        </Group>
      })
    }
  </Stack>);
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
