import type { CSSProperties } from "react";
import { SC_COLORS, SC_NAMES } from "@/entities/data/strategyCardColors";
import styles from "./RailParts.module.css";

type Props = {
  values: number[];
};

/** Strategy cards this player still owes a follow on, in each card's colour. */
export function NeedsToFollow({ values }: Props) {
  if (values.length === 0) return null;

  return (
    <span className={styles.follow}>
      <span className={styles.lbl}>Needs to follow</span>
      {values.map((scNumber) => (
        <span
          key={scNumber}
          className={styles.scn}
          title={SC_NAMES[scNumber] ?? String(scNumber)}
          style={
            { "--scc": `var(--gd-${SC_COLORS[scNumber] ?? "gray"})` } as CSSProperties
          }
        >
          {scNumber}
        </span>
      ))}
    </span>
  );
}
