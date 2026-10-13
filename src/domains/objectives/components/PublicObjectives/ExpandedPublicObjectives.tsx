import { useState } from "react";
import { Box } from "@/ds";
import type { Objectives, PlayerData, LawInPlay } from "@/entities/data/types";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { getSeatOrder } from "@/domains/objectives/hooks/useOrderedFactions";
import { RailLabel } from "@/domains/objectives/components/RailLabel";
import { LawCard } from "@/domains/objectives/components/LawsInPlay";
import { ObjectiveTable } from "./ObjectiveTable";
import styles from "./PublicObjectives.module.css";

type Props = {
  objectives: Objectives;
  playerData: PlayerData[];
  lawsInPlay?: LawInPlay[];
  alwaysShowRequirements?: boolean;
};

/**
 * The objectives on the table: Stage I beside Stage II, one-off points under
 * Stage II, and laws in play beneath them all.
 */
function ExpandedPublicObjectives({
  objectives,
  playerData,
  lawsInPlay = [],
  alwaysShowRequirements = false,
}: Props) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const seats = getSeatOrder(playerData);
  const shared = {
    seats,
    playerData,
    showRequirement: !isMobileDevice() || alwaysShowRequirements,
    openKey,
    onOpenKeyChange: setOpenKey,
  };

  return (
    <Box className={styles.board}>
      <Box className={styles.stageGrid}>
        {objectives.stage1Objectives.length > 0 && (
          <ObjectiveTable title="Stage I" meta="1 point each" stage="orange" objectives={objectives.stage1Objectives} {...shared} />
        )}
        <Box className={styles.column}>
          {objectives.stage2Objectives.length > 0 && (
            <ObjectiveTable title="Stage II" meta="2 points each" stage="blue" objectives={objectives.stage2Objectives} {...shared} />
          )}
          {objectives.customObjectives.length > 0 && (
            <ObjectiveTable title="Other points" stage="gray" objectives={objectives.customObjectives} {...shared} />
          )}
        </Box>
      </Box>

      {lawsInPlay.length > 0 && (
        <Box className={styles.stage}>
          <RailLabel meta={lawsInPlay.length}>Laws in play</RailLabel>
          <Box className={styles.lawGrid}>
            {lawsInPlay.map((law, index) => (
              <LawCard key={`${law.id}-${index}`} law={law} playerData={playerData} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ExpandedPublicObjectives;
