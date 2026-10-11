import styles from "./PhantomLeader.module.css";

type Props = {
  type: "agent" | "commander" | "hero";
  /** Accepted for API parity; every dossier row is 44px. */
  withPortrait?: boolean;
};

/** A leader slot with nobody in it — most often a hero already spent. */
export function PhantomLeader({ type }: Props) {
  return (
    <div className={styles.plate} title={`No ${type} in play`}>
      <span className={styles.well} />
      <span className={styles.role}>{type}</span>
    </div>
  );
}
