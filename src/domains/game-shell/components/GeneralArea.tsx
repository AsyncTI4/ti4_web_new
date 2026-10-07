import { Box, Flex, Stack } from "@mantine/core";
import { Surface } from "@/shared/ui/Surface";
import { useGameData } from "@/state/useGameContext";
import cx from "clsx";
import styles from "@/domains/objectives/components/ScoreBoard/ScoreBoard.module.css";
import { FactionsInGame } from "./FactionsInGame";
import { UnpickedSCs } from "./UnpickedSCs";
import { CardPool } from "./CardPool";
import { LawsInPlay } from "@/domains/objectives/components/LawsInPlay";
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
            <CardPool cardPool={cardPool} />
          </Stack>

          <Box>
            <LawsInPlay laws={lawsInPlay} />
          </Box>
        </Flex>
      </Surface>
      <GeneralTechCatalog technologyDeck={cardPool.technologyDeck}/>
    </Stack>
  );
}

export default GeneralArea;
