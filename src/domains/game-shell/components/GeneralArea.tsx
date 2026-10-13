import type { ReactNode } from "react";
import { Box } from "@/ds";
import { useGameData } from "@/state/useGameContext";
import { RailLabel } from "@/domains/objectives/components/RailLabel";
import { LawsInPlay } from "@/domains/objectives/components/LawsInPlay";
import { FactionsInGame } from "./FactionsInGame";
import { UnpickedSCs } from "./UnpickedSCs";
import { CardPool } from "./CardPool";
import { GeneralTechCatalog } from "./GeneralTechCatalog";
import styles from "./GeneralArea.module.css";

function GenBox({
  label,
  meta,
  children,
  className,
}: {
  label: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Box className={`${styles.genbox} ${className ?? ""}`}>
      <RailLabel meta={meta}>{label}</RailLabel>
      {children}
    </Box>
  );
}

/**
 * Table-wide information. A fixed rail on the left holds the at-a-glance state
 * (seats, unpicked strategy cards, card pool, laws); the tech list takes the
 * remaining width and flows its colour tables side by side.
 */
function GeneralArea() {
  const gameData = useGameData();
  if (!gameData) return null;
  const {
    playerData,
    lawsInPlay = [],
    strategyCards = [],
    cardPool,
    gameRound,
  } = gameData;

  return (
    <Box className={styles.general}>
      <Box className={styles.rail}>
        <GenBox label="Seats · turn order" meta={`Round ${gameRound}`}>
          <FactionsInGame playerData={playerData} />
        </GenBox>
        <GenBox label="Unpicked strategy cards">
          <UnpickedSCs strategyCards={strategyCards} />
        </GenBox>
        <GenBox label="Card pool">
          <CardPool cardPool={cardPool} />
        </GenBox>
        <GenBox label="Laws in play" meta={lawsInPlay.length}>
          <LawsInPlay laws={lawsInPlay} />
        </GenBox>
      </Box>
      <GeneralTechCatalog
        className={styles.tech}
        technologyDeck={cardPool?.technologyDeck}
        playerData={playerData}
      />
    </Box>
  );
}

export default GeneralArea;
