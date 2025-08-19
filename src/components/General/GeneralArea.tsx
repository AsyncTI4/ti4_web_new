import { Box, SimpleGrid, Stack } from "@mantine/core";
import { Surface } from "../PlayerArea/Surface";
import { useGameData } from "@/hooks/useGameContext";
import styles from "../ScoreBoard.module.css";
import { FactionsInGame } from "./FactionsInGame";
import { UnpickedSCs } from "./UnpickedSCs";
import { CardPool } from "./CardPool";
import { LawsInPlay } from "./LawsInPlay";

function GeneralArea() {
  const gameData = useGameData();
  if (!gameData) return null;
  const {
    playerData,
    lawsInPlay = [],
    strategyCards = [],
    cardPool,
  } = gameData;

  return (
    <Surface
      p="lg"
      pattern="grid"
      cornerAccents={true}
      className={styles.scoreBoardSurface}
    >
      <Box mb="md">
        <SimpleGrid cols={3} spacing="md">
            <UnpickedSCs strategyCards={strategyCards} />
          <Stack>
            <FactionsInGame playerData={playerData} />
          <CardPool cardPool={cardPool} playerData={playerData} />
          </Stack>
          <Box mb="lg">
            <LawsInPlay laws={lawsInPlay} />
          </Box>
        </SimpleGrid>
      </Box>
    </Surface>
  );
}

export default GeneralArea;
