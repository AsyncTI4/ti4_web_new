import { Box, Flex, Stack } from "@mantine/core";
import { Surface } from "@/domains/player/components/Surface";
import { useGameData, useHideScoreOrder } from "@/hooks/useGameContext";
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
  // Factions in Game (turn order/"next" indicator) and Card Pool (deck sizes, including whatever
  // HIDE_EXPLORES leaves as null) both encode more about game state than a fogged viewer should
  // have - dropped outright rather than picked apart field by field. Not hidden from the GM's own
  // unfiltered view, since nothing there is redacted in the first place.
  const hideScoreOrder = useHideScoreOrder();
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
          {!hideScoreOrder && (
            <Stack gap={32}>
              <FactionsInGame playerData={playerData} />
              <CardPool cardPool={cardPool} playerData={playerData} />
            </Stack>
          )}

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
