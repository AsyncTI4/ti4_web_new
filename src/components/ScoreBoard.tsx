import { Box } from "@mantine/core";
import ExpandedPublicObjectives from "./Objectives/PublicObjectives/ExpandedPublicObjectives";
import { ScoreTracker } from "./Objectives/ScoreTracker";
import { useGameData } from "@/hooks/useGameContext";

function ScoreBoard() {
  const gameData = useGameData();
  if (!gameData) return null;
  const { objectives, playerData, vpsToWin = 10 } = gameData;

  return (
    <Box p="lg">
      <ScoreTracker playerData={playerData} vpsToWin={vpsToWin} />

      <Box mb="md" mt="xl">
        <ExpandedPublicObjectives
          objectives={objectives}
          playerData={playerData}
        />
      </Box>
    </Box>
  );
}

export default ScoreBoard;
