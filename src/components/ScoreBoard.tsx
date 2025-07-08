import { Box, SimpleGrid, Stack } from "@mantine/core";
import { Surface } from "./PlayerArea/Surface";
import { UnpickedSCs } from "./Objectives/UnpickedSCs";
import { CardPool } from "./Objectives/CardPool";
import { FactionsInGame } from "./Objectives/FactionsInGame";
import { LawsInPlay } from "./Objectives/LawsInPlay";
import ExpandedPublicObjectives from "./Objectives/PublicObjectives/ExpandedPublicObjectives";
import { ScoreTracker } from "./Objectives/ScoreTracker";
import {
  Objectives,
  PlayerData,
  LawInPlay,
  StrategyCard,
  CardPoolData,
} from "../data/types";
import styles from "./ScoreBoard.module.css";

type Props = {
  objectives: Objectives;
  playerData: PlayerData[];
  lawsInPlay: LawInPlay[];
  strategyCards: StrategyCard[];
  vpsToWin: number;
  cardPool?: CardPoolData;
};

function ScoreBoard({
  objectives,
  playerData,
  lawsInPlay,
  strategyCards,
  vpsToWin,
  cardPool,
}: Props) {
  // Create faction to color mapping
  const factionToColor = playerData.reduce(
    (acc, player) => {
      acc[player.faction] = player.color;
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <Surface
      p="lg"
      pattern="grid"
      cornerAccents={true}
      className={styles.scoreBoardSurface}
    >
      {/* Game Status Section */}
      <Box mb="md">
        <SimpleGrid cols={2} spacing="md">
          <Stack>
            <FactionsInGame playerData={playerData} />
            <UnpickedSCs strategyCards={strategyCards} />
          </Stack>
          <CardPool cardPool={cardPool} playerData={playerData} />
        </SimpleGrid>
      </Box>

      {/* Divider */}
      <Box className={styles.divider} />

      {/* Laws in Play Section - Only show if there are laws */}
      {lawsInPlay.length > 0 && (
        <>
          <Box mb="md">
            <LawsInPlay laws={lawsInPlay} factionToColor={factionToColor} />
          </Box>

          {/* Divider */}
          <Box className={styles.divider} />
        </>
      )}

      {/* Scorable Objectives Section */}
      <Box mb="md">
        <ExpandedPublicObjectives
          objectives={objectives}
          playerData={playerData}
        />
      </Box>

      {/* Score Tracker */}
      <ScoreTracker playerData={playerData} vpsToWin={vpsToWin} />
    </Surface>
  );
}

export default ScoreBoard;
