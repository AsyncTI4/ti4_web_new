import { Box } from "@mantine/core";
import { PlayerEconomyStack } from "./PlayerEconomyStack";
import { PlayerCardCounts } from "@/domains/player/components/PlayerCardCounts";
import { CCPool } from "@/domains/player/components/CCPool";
import { FragmentsPool } from "@/domains/player/components/FragmentsPool";
import { DebtTokens } from "@/domains/player/components/DebtTokens";
import type { PlayerData } from "@/entities/data/types";
import styles from "./LogisticsPlate.module.css";

type Props = {
  tg?: number | null;
  commodities?: number | null;
  commoditiesTotal?: number | null;
  pnCount: number;
  acCount: number;
  fragments: string[];
  debtTokens?: PlayerData["debtTokens"];
  tacticalCC: number;
  fleetCC: number;
  strategicCC: number;
  mahactEdict?: string[];
  showCommandTokens?: boolean;
};

/**
 * The status compartment: stores and hand up top, salvage shelf and command
 * trough docked to the plate's floor. The most engineered plate in the band —
 * both player card compositions seat it so the same numbers land in the same
 * place everywhere a player reads them.
 */
export function LogisticsPlate({
  tg,
  commodities,
  commoditiesTotal,
  pnCount,
  acCount,
  fragments,
  debtTokens,
  tacticalCC,
  fleetCC,
  strategicCC,
  mahactEdict,
  showCommandTokens = true,
}: Props) {
  return (
    <Box className={styles.logistics}>
      <Box className={styles.logisticsTop}>
        {/* Debt is not part of the stores stack here — it moved down to
            the salvage shelf, which has width to spare and vertical room
            the stores column does not. */}
        <PlayerEconomyStack
          tg={tg}
          commodities={commodities}
          commoditiesTotal={commoditiesTotal}
        />
        <Box className={styles.logisticsHand}>
          <PlayerCardCounts pnCount={pnCount} acCount={acCount} />
        </Box>
      </Box>
      {/* Salvage above, command readout docked to the plate's floor. */}
      <Box className={styles.logisticsFloor}>
        <Box className={styles.fragmentRow}>
          <FragmentsPool fragments={fragments} reserveSpace />
          {debtTokens && <DebtTokens debts={debtTokens} compact />}
        </Box>
        {showCommandTokens && (
          <Box className={styles.ccRow}>
            <CCPool
              tacticalCC={tacticalCC}
              fleetCC={fleetCC}
              strategicCC={strategicCC}
              mahactEdict={mahactEdict}
              layout="horizontal"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
