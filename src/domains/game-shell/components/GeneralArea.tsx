import { Box, Flex, Stack } from "@mantine/core";
import { Surface } from "@/domains/player/components/Surface";
import { useGameData } from "@/hooks/useGameContext";
import cx from "clsx";
import styles from "@/domains/player/components/composition/ScoreBoard.module.css";
import { FactionsInGame } from "./FactionsInGame";
import { UnpickedSCs } from "./UnpickedSCs";
import { CardPool } from "./CardPool";
import { LawsInPlay } from "./LawsInPlay";
import Expeditions from "./Expeditions/Expeditions";
import { GeneralTechCatalog } from "./GeneralTechCatalog";

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
    <Stack gap={0}>
      <Surface
        p="lg"
        className={cx(styles.scoreBoardSurface, styles.generalPanelSurface)}
      >
        <Flex wrap={"wrap"} justify={"center"} gap={64}>
          <UnpickedSCs strategyCards={strategyCards} />
          <Stack gap={32}>
            <FactionsInGame playerData={playerData} />
            <CardPool cardPool={cardPool} playerData={playerData} />
          </Stack>

          {/* <Expeditions expeditions={gameData.expeditions} /> */}

          <Box>
            <LawsInPlay laws={lawsInPlay} />
          </Box>
        </Flex>
      </Surface>
      <GeneralTechCatalog />
    </Stack>
  );
}

export default GeneralArea;
