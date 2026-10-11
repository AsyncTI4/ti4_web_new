import { TradeGoods } from "@/domains/player/components/TradeGoods/TradeGoods";
import { Commodities } from "@/domains/player/components/Commodities/Commodities";
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
 * The stores lane: trade goods and commodities as keyed readouts beside the
 * hand's card-backs, a salvage shelf for fragments and debt, and the command
 * pool docked to the floor.
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
    <div className={styles.stores}>
      <TradeGoods tg={tg ?? 0} />
      <div className={styles.hand}>
        <PlayerCardCounts pnCount={pnCount} acCount={acCount} />
      </div>
      <Commodities
        commodities={commodities ?? 0}
        commoditiesTotal={commoditiesTotal ?? 0}
      />
      <div className={styles.shelf}>
        <FragmentsPool fragments={fragments} reserveSpace />
        {debtTokens && <DebtTokens debts={debtTokens} compact />}
      </div>
      {showCommandTokens && (
        <div className={styles.ccRow}>
          <CCPool
            tacticalCC={tacticalCC}
            fleetCC={fleetCC}
            strategicCC={strategicCC}
            mahactEdict={mahactEdict}
            layout="horizontal"
          />
        </div>
      )}
    </div>
  );
}
