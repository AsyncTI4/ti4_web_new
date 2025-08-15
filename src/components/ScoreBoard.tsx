import { Box, SimpleGrid, Stack } from "@mantine/core";
import { Surface } from "./PlayerArea/Surface";
import { UnpickedSCs } from "./Objectives/UnpickedSCs";
import { CardPool } from "./Objectives/CardPool";
import { FactionsInGame } from "./Objectives/FactionsInGame";
import { LawsInPlay } from "./Objectives/LawsInPlay";
import ExpandedPublicObjectives from "./Objectives/PublicObjectives/ExpandedPublicObjectives";
import { ScoreTracker } from "./Objectives/ScoreTracker";
import { useGameData } from "@/hooks/useGameContext";
import styles from "./ScoreBoard.module.css";

function ScoreBoard() {
  const gameData = useGameData();
  if (!gameData) return null;
  const {
    objectives,
    playerData,
    lawsInPlay = [],
    strategyCards = [],
    vpsToWin = 10,
    cardPool,
  } = gameData;

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
            <LawsInPlay laws={lawsInPlay} />
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
