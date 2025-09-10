import { Box, Stack } from "@mantine/core";
import ExpandedPublicObjectives from "./Objectives/PublicObjectives/ExpandedPublicObjectives";
import { ScoreTracker } from "./Objectives/ScoreTracker";
import { useGameData } from "@/hooks/useGameContext";
import { PlayerScoreSummary } from "./Objectives/PlayerScoreSummary/PlayerScoreSummary";

function ScoreBoard() {
  const gameData = useGameData();
  if (!gameData) return null;
  const { objectives, playerData, vpsToWin = 10 } = gameData;

  return (
    <Box p="lg">
      <ScoreTracker playerData={playerData} vpsToWin={vpsToWin} />

      <Stack gap="xl">
        <ExpandedPublicObjectives
          objectives={objectives}
          playerData={playerData}
        />

        <PlayerScoreSummary playerData={playerData} objectives={objectives} />
      </Stack>
    </Box>
  );
}

export default ScoreBoard;
