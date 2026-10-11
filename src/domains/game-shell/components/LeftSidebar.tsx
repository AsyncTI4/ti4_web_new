import { Box } from "@/ds";
import cx from "clsx";
import type { GamePhase } from "@/entities/data/types";
import { useSettingsStore } from "@/state/appStore";
import { useGameData } from "@/state/useGameContext";
import { useParams } from "react-router-dom";
import { useGameState } from "@/api/useGameState";
import { ScoreTracker } from "@/domains/objectives/components/ScoreTracker";
import { ObjectiveSeatMatrix } from "@/domains/objectives/components/ObjectiveSeatMatrix";
import { LawsInPlay } from "@/domains/objectives/components/LawsInPlay";
import { RailLabel } from "@/domains/objectives/components/RailLabel";
import styles from "./LeftSidebar.module.css";

function phaseLabel(phase?: GamePhase): string | null {
  if (!phase || phase === "unknown") return null;
  if (phase === "finished") return "Game over";
  if (phase.startsWith("setup")) return "Setup";
  if (phase.startsWith("status")) return "Status phase";
  if (phase.startsWith("agenda")) return "Agenda phase";
  return `${phase.charAt(0).toUpperCase()}${phase.slice(1)} phase`;
}

/**
 * The Panels view's table rail: game title, points mini-track, objectives as a
 * seat matrix and laws as sealed rows.
 */
export function LeftSidebar() {
  const gameData = useGameData();
  const { mapid = "" } = useParams<{ mapid: string }>();
  const { data: gameState } = useGameState(mapid);
  const collapsed = useSettingsStore((state) => state.settings.leftPanelCollapsed);

  if (!gameData?.objectives || !gameData?.playerData) {
    return <Box className={cx(styles.rail, collapsed && styles.collapsed)} />;
  }

  const laws = gameData.lawsInPlay ?? [];
  const phase = phaseLabel(gameState?.phase);
  const vpsToWin = gameData.vpsToWin || 10;

  return (
    <Box
      component="aside"
      aria-label="Table"
      className={cx(styles.rail, collapsed && styles.collapsed)}
      aria-hidden={collapsed || undefined}
    >
      <Box className={styles.title}>
        <b className={styles.gameName}>{gameData.gameName}</b>
        {gameData.gameCustomName && (
          <span className={styles.customName}>{gameData.gameCustomName}</span>
        )}
        <span className={styles.meta}>
          <span>
            Round <b>{gameData.gameRound}</b>
          </span>
          {phase && <span>{phase}</span>}
          <span>
            to <b>{vpsToWin}</b> VP
          </span>
        </span>
      </Box>

      <Box className={styles.section}>
        <RailLabel meta={`${vpsToWin} to win`}>Points</RailLabel>
        <ScoreTracker playerData={gameData.playerData} vpsToWin={vpsToWin} variant="mini" />
      </Box>

      <Box className={styles.section}>
        <RailLabel meta="by seat">Objectives</RailLabel>
        <ObjectiveSeatMatrix
          objectives={gameData.objectives}
          playerData={gameData.playerData}
        />
      </Box>

      {laws.length > 0 && (
        <Box className={styles.section}>
          <RailLabel meta={laws.length}>Laws</RailLabel>
          <LawsInPlay laws={laws} />
        </Box>
      )}
    </Box>
  );
}
