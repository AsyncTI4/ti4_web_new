import { Box, Stack } from "@mantine/core";
import ExpandedPublicObjectives from "@/domains/objectives/components/PublicObjectives/ExpandedPublicObjectives";
import { ScoreTracker } from "@/domains/objectives/components/ScoreTracker";
import { useGameData } from "@/state/useGameContext";
import { PlayerScoreSummary } from "@/domains/objectives/components/PlayerScoreSummary/PlayerScoreSummary";
import styles from "./ScoreBoard.module.css";

function ScoreBoard() {
  const gameData = useGameData();
  if (!gameData) return null;
  const { objectives, playerData, lawsInPlay, vpsToWin = 10 } = gameData;

  return (
    <Box p={{ base: 0, sm: "lg" }} className={styles.scoreBoard}>
      <ScoreTracker playerData={playerData} vpsToWin={vpsToWin} />

      <Stack gap="xl">
        <ExpandedPublicObjectives
          objectives={objectives}
          playerData={playerData}
          lawsInPlay={lawsInPlay}
          alwaysShowRequirements
        />

        <PlayerScoreSummary playerData={playerData} objectives={objectives} />
      </Stack>
    </Box>
  );
}

export default ScoreBoard;
