import type { CSSProperties } from "react";
import { cdnImage } from "@/entities/data/cdnImage";
import styles from "./PlayerCardCounts.module.css";

type Props = {
  pnCount: number;
  acCount: number;
};

function HandBack({
  src,
  count,
  label,
  className,
}: {
  src: string;
  count: number;
  label: string;
  className: string;
}) {
  return (
    <span
      className={`${styles.back} ${className}`}
      style={{ backgroundImage: `url("${src}")` } as CSSProperties}
      title={`${count} ${label}`}
      aria-label={`${count} ${label}`}
    >
      <b>{count}</b>
    </span>
  );
}

/**
 * Cards in hand as the real card-backs with a stamped count: the back is what
 * a player recognises across the table.
 */
export function PlayerCardCounts({ pnCount, acCount }: Props) {
  return (
    <span className={styles.hand}>
      <HandBack
        src="/cardback/cardback_action.png"
        count={acCount}
        label="action cards"
        className={styles.ac}
      />
      <HandBack
        src={cdnImage("/player_area/pa_cardbacks_pn.png")}
        count={pnCount}
        label="promissory notes"
        className={styles.pn}
      />
    </span>
  );
}
