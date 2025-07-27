import React from "react";
import { cdnImage } from "../../data/cdnImage";
import styles from "./PdsControlToken.module.css";

type PdsControlTokenProps = {
  colorAlias: string;
  faction: string;
  count: number;
  expected: number;
  style?: React.CSSProperties;
};

export const PdsControlToken = ({
  colorAlias,
  faction,
  count,
  expected,
  style,
}: PdsControlTokenProps) => {
  return (
    <div style={style}>
      <div className={styles.container}>
        <img
          src={cdnImage(`/command_token/control_${colorAlias}.png`)}
          alt={`${faction} control token`}
          className={styles.controlTokenImage}
        />
        {faction && (
          <img
            src={cdnImage(`/factions/${faction}.png`)}
            alt={`${faction} faction`}
            className={styles.factionIcon}
          />
        )}
        {/* PDS Information Overlay */}
        <div className={styles.pdsOverlay}>
          <div className={styles.pdsCount}>{count} PDS</div>
          <div className={styles.pdsHits}>{expected} hits</div>
        </div>
      </div>
    </div>
  );
};
