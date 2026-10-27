import type { PlayerData } from "@/entities/data/types";
import { cdnImage } from "@/entities/data/cdnImage";
import { ACTION_CARD_BACK } from "@/entities/data/uiImages";
import { FragmentsPool } from "@/domains/player/components/FragmentsPool";
import { DebtTokens } from "@/domains/player/components/DebtTokens";
import styles from "./StoresStrip.module.css";

type Props = {
  tg?: number | null;
  commodities?: number | null;
  commoditiesTotal?: number | null;
  acCount: number;
  pnCount: number;
  fragments: string[];
  debtTokens?: PlayerData["debtTokens"];
  tacticalCC: number;
  fleetCC: number;
  strategicCC: number;
  showCommandTokens?: boolean;
};

/** Stores as one row of keyed readouts, for the narrow Panels dossier. */
export function StoresStrip({
  tg,
  commodities,
  commoditiesTotal,
  acCount,
  pnCount,
  fragments,
  debtTokens,
  tacticalCC,
  fleetCC,
  strategicCC,
  showCommandTokens = true,
}: Props) {
  const tradeGoods = tg ?? 0;
  const comms = commodities ?? 0;

  return (
    <div className={styles.strip}>
      <span className={`${styles.sx} ${styles.tg}`} title={`${tradeGoods} trade goods`}>
        <img src="/tg.png" alt="" />
        <b className={tradeGoods === 0 ? styles.zero : undefined}>{tradeGoods}</b>
      </span>
      <span className={styles.sx} title={`${comms} of ${commoditiesTotal ?? 0} commodities`}>
        <img src="/comms.png" alt="" />
        <b className={comms === 0 ? styles.zero : undefined}>
          {comms}
          <i>/{commoditiesTotal ?? 0}</i>
        </b>
      </span>
      <span className={`${styles.sx} ${styles.card}`} title={`${acCount} action cards`}>
        <img src={ACTION_CARD_BACK} alt="" />
        <b>{acCount}</b>
      </span>
      <span className={`${styles.sx} ${styles.card}`} title={`${pnCount} promissory notes`}>
        <img src={cdnImage("/player_area/pa_cardbacks_pn.png")} alt="" />
        <b>{pnCount}</b>
      </span>
      {showCommandTokens && (
        <span
          className={`${styles.sx} ${styles.cc}`}
          title={`${tacticalCC} tactic · ${fleetCC} fleet · ${strategicCC} strategy`}
        >
          {tacticalCC}
          <em>T</em>
          {fleetCC}
          <em>F</em>
          {strategicCC}
          <em>S</em>
        </span>
      )}
      <FragmentsPool fragments={fragments} />
      {debtTokens && <DebtTokens debts={debtTokens} compact />}
    </div>
  );
}
