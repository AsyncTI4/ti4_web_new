import { Box } from "@/ds";
import type { LawInPlay, Objectives, PlayerData } from "@/entities/data/types";
import { PlayerScoreSummary } from "@/domains/objectives/components/PlayerScoreSummary/PlayerScoreSummary";
import { LawsPanel } from "@/domains/objectives/components/PublicObjectives/LawsPanel";
import styles from "./ScoreLawsRow.module.css";

type Props = {
  playerData: PlayerData[];
  objectives: Objectives;
  lawsInPlay?: LawInPlay[];
};

/** Score breakdown with the laws in play beside it, on the map and score tabs. */
export function ScoreLawsRow({ playerData, objectives, lawsInPlay = [] }: Props) {
  return (
    <Box className={styles.frame}>
      <Box className={styles.row}>
        <PlayerScoreSummary playerData={playerData} objectives={objectives} />
        <LawsPanel laws={lawsInPlay} playerData={playerData} standalone />
      </Box>
    </Box>
  );
}
