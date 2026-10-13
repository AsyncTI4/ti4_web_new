import { useState } from "react";
import { Box } from "@/ds";
import type { Objectives, PlayerData } from "@/entities/data/types";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { getSeatOrder } from "@/domains/objectives/hooks/useOrderedFactions";
import { ObjectiveTable } from "./ObjectiveTable";
import styles from "./PublicObjectives.module.css";

type Props = {
  objectives: Objectives;
  playerData: PlayerData[];
  alwaysShowRequirements?: boolean;
};

/**
 * The objectives on the table: Stage I beside Stage II, one-off points under
 * Stage II. Laws sit beside the score breakdown instead (see ScoreLawsRow).
 */
function ExpandedPublicObjectives({
  objectives,
  playerData,
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

    </Box>
  );
}

export default ExpandedPublicObjectives;
