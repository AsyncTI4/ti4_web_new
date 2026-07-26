import cx from "clsx";
import styles from "./PhantomLeader.module.css";

export type PhantomLeaderProps = {
  type: "agent" | "commander" | "hero";
  /** Whether the dossiers beside this slot carry portraits, which sets the row height. */
  withPortrait?: boolean;
};

/** A leader slot with nobody in it — most often a hero already spent. */
export function PhantomLeader({ type, withPortrait = true }: PhantomLeaderProps) {
  return (
    <div
      className={cx(styles.plate, withPortrait && styles.plateWithPortrait)}
      title={`No ${type} in play`}
    >
      {withPortrait && <span className={styles.well} />}
      <span className={styles.text}>
        <span className={styles.nameRule} />
        <span className={styles.role}>{type}</span>
      </span>
    </div>
  );
}
