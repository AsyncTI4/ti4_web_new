import styles from "./PhantomLeader.module.css";
import { RankChevrons } from "./RankChevrons";

type Props = {
  type: "agent" | "commander" | "hero";
  /** Accepted for API parity; every dossier row is 44px. */
  withPortrait?: boolean;
};

/** A leader slot with nobody in it — in practice a purged hero. Crossed out and
 * labelled, so it can't be mistaken for a locked leader. */
export function PhantomLeader({ type }: Props) {
  return (
    <div className={styles.plate} title={`${type[0].toUpperCase()}${type.slice(1)} purged`}>
      <span className={styles.well} />
      <span className={styles.role}>{type} · purged</span>
      <span className={styles.corner}>
        <RankChevrons type={type} />
      </span>
    </div>
  );
}
