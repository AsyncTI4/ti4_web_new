import { Box, Flex, Stack } from "@mantine/core";
import { Surface } from "../PlayerArea/Surface";
import { useGameData } from "@/hooks/useGameContext";
import styles from "../ScoreBoard.module.css";
import { FactionsInGame } from "./FactionsInGame";
import { UnpickedSCs } from "./UnpickedSCs";
import { CardPool } from "./CardPool";
import { LawsInPlay } from "./LawsInPlay";
import Expeditions from "./Expeditions/Expeditions";

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
      <Flex wrap={"wrap"} justify={"center"} mb="md" gap={64}>
            <UnpickedSCs strategyCards={strategyCards} />
          <Stack gap={32}>
            <FactionsInGame playerData={playerData} />
            <CardPool cardPool={cardPool} playerData={playerData} />
          </Stack>
          <Expeditions playerData={playerData}/>
          <Box mb="lg">
            <LawsInPlay laws={lawsInPlay} />
          </Box>
      </Flex>
    </Surface>
  );
}

export default GeneralArea;