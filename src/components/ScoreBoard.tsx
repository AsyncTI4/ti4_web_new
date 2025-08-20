import { Box } from "@mantine/core";
import { Surface } from "./PlayerArea/Surface";
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
    vpsToWin = 10,
  } = gameData;

  return (
    <Surface
      p="lg"
      pattern="grid"
      cornerAccents={true}
      className={styles.scoreBoardSurface}
    >
      <ScoreTracker playerData={playerData} vpsToWin={vpsToWin} />

      <Box mb="md">
        <ExpandedPublicObjectives
          objectives={objectives}
          playerData={playerData}
        />
      </Box>

    </Surface>
  );
}

export default ScoreBoard;
