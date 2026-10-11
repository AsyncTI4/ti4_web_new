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

/** Table-wide information: seats, unpicked strategy cards, card pool, laws, then the tech matrix. */
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
      <Box className={styles.top}>
        <GenBox label="Seats · turn order" meta={`Round ${gameRound}`}>
          <FactionsInGame playerData={playerData} />
        </GenBox>
        <GenBox label="Unpicked strategy cards">
          <UnpickedSCs strategyCards={strategyCards} />
          <RailLabel>Card pool</RailLabel>
          <CardPool cardPool={cardPool} />
        </GenBox>
        <GenBox label="Laws in play" meta={lawsInPlay.length} className={styles.laws}>
          <LawsInPlay laws={lawsInPlay} />
        </GenBox>
      </Box>
      <GeneralTechCatalog
        technologyDeck={cardPool?.technologyDeck}
        playerData={playerData}
      />
    </Box>
  );
}

export default GeneralArea;
