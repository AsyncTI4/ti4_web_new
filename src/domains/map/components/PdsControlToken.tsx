import type { CSSProperties } from "react";
import { cdnImage } from "@/entities/data/cdnImage";
import { useFactionTokenImage } from "@/hooks/useFactionTokenImage";
import styles from "./PdsControlToken.module.css";

type PdsControlTokenProps = {
  colorAlias: string;
  faction: string;
  count: number;
  expected: number;
  style?: CSSProperties;
};

export const PdsControlToken = ({
  colorAlias,
  faction,
  count,
  expected,
  style,
}: PdsControlTokenProps) => {
  const factionUrl = useFactionTokenImage(faction);

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
            src={factionUrl}
            alt={`${faction} faction`}
            className={styles.factionIcon}
          />
        )}
        <div className={styles.pdsOverlay}>
          <div className={styles.pdsCount}>{count} PDS</div>
          <div className={styles.pdsHits}>{expected} hits</div>
        </div>
      </div>
    </div>
  );
};
