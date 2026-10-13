import cx from "clsx";
import { Box } from "@/ds";
import type { PlayerData, LawInPlay } from "@/entities/data/types";
import { LawCard } from "@/domains/objectives/components/LawsInPlay";
import styles from "./PublicObjectives.module.css";

type Props = {
  laws: LawInPlay[];
  playerData: PlayerData[];
  /** Set when rendered outside the objectives board, which owns the plate tokens. */
  standalone?: boolean;
  className?: string;
};

/**
 * Laws in play as one plate, each law sunk into its own well. With no laws the
 * plate still renders, holding a single empty well, so the layout stays put.
 */
export function LawsPanel({ laws, playerData, standalone = false, className }: Props) {
  return (
    <Box className={cx(standalone && styles.board, styles.laws, className)}>
      <span className={styles.lawsTitle}>
        Laws in play
        <small className={styles.lawsCount}>{laws.length}</small>
      </span>
      {laws.length > 0 ? (
        <Box className={styles.lawGrid}>
          {laws.map((law, index) => (
            <LawCard key={`${law.id}-${index}`} law={law} playerData={playerData} />
          ))}
        </Box>
      ) : (
        <span className={styles.noLaws}>No laws in play</span>
      )}
    </Box>
  );
}
