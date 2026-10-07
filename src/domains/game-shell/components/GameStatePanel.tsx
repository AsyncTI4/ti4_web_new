import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Collapse,
  Divider,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import cx from "clsx";
import { useGameState } from "@/hooks/useGameState";
import { useGameData } from "@/hooks/useGameContext";
import { Module } from "@/shared/ui/primitives/Module/Module";
import { Chip } from "@/shared/ui/primitives/Chip";
import { PlayerColorSwatch } from "@/domains/player/components/PlayerColor";
import type {
  GamePhase,
  GameState,
  GameStateCombat,
} from "@/entities/data/types";
import type { ColorKey } from "@/shared/ui/gradientClasses";
import {
  loadStoredChoice,
  saveStoredChoice,
} from "@/utils/localStorageSettings";
import { AgendaRow } from "./GameStateAgenda";
import { playerNameForColor, type GameStatePlayer } from "./gameStatePlayers";
import styles from "./GameStatePanel.module.css";

type PhaseConfig = { label: string; accent: ColorKey };

const PHASE_CONFIGS: Record<GamePhase, PhaseConfig> = {
  unknown: { label: "Unknown Phase", accent: "gray" },
  "setup.draft": { label: "Setup Phase · Draft", accent: "gray" },
  "setup.players": { label: "Setup Phase · Players", accent: "gray" },
  strategy: { label: "Strategy Phase", accent: "blue" },
  action: { label: "Action Phase", accent: "green" },
  "status.scoring": { label: "Status Phase · Scoring", accent: "yellow" },
  "status.homework": { label: "Status Phase · Homework", accent: "yellow" },
  "agenda.readyToFlip": { label: "Agenda Phase · Ready", accent: "blue" },
  "agenda.whens": { label: "Agenda Phase · Whens", accent: "blue" },
  "agenda.afters": { label: "Agenda Phase · Afters", accent: "blue" },
  "agenda.voting": { label: "Agenda Phase · Voting", accent: "blue" },
  "agenda.resolving": { label: "Agenda Phase · Resolving", accent: "blue" },
  finished: { label: "Game Over", accent: "red" },
};

/* The phase colour as an RGB triplet, so the plate keys its frame, rail edge
   and status dot to it without washing the whole field in the colour. */
const PHASE_ACCENT_RGB: Partial<Record<ColorKey, string>> = {
  gray: "var(--gd-gray)",
  grey: "var(--gd-gray)",
  blue: "var(--gd-blue)",
  green: "var(--gd-green)",
  yellow: "var(--gd-yellow)",
  orange: "var(--gd-orange)",
  red: "var(--gd-red)",
};

const CHIP_ACCENT_BY_COLOR: Record<string, ColorKey> = {
  red: "red",
  green: "green",
  blue: "blue",
  yellow: "yellow",
  orange: "orange",
  purple: "purple",
  teal: "teal",
  cyan: "cyan",
};

function colorToChipAccent(color: string): ColorKey | "gray" {
  return CHIP_ACCENT_BY_COLOR[color.toLowerCase()] ?? "gray";
}

function phaseGroup(phase: GamePhase): string {
  if (phase === "strategy") return "strategy";
  if (phase === "action") return "action";
  if (phase.startsWith("agenda")) return "agenda";
  if (phase.startsWith("status")) return "status";
  return "other";
}

/* Rendered flush against the player name, so leading spaces matter */
function activePlayerPhrase(phase: GamePhase): string {
  switch (phaseGroup(phase)) {
    case "strategy":
      return " is picking";
    case "action":
      return "’s turn";
    case "agenda":
      return " is voting";
    default:
      return "";
  }
}

function PhaseBadge({ phase }: { phase: GamePhase }) {
  return (
    <span className={styles.phaseLabel}>
      <span className={styles.phaseDot} />
      {PHASE_CONFIGS[phase].label}
    </span>
  );
}

const PANEL_OPEN_KEY = "ti4_game_state_panel_open";

/**
 * Whether the plate is expanded, remembered across games and reloads.
 *
 * The panel floats over the board's top-left corner at every scroll position —
 * in a large agenda vote it covered 18% of the map — so leaving it open has to
 * be the player's choice rather than the only option.
 */
function useGameStatePanelOpen(): [boolean, (next: boolean) => void] {
  const [isOpen, setIsOpen] = useState(
    () => loadStoredChoice(PANEL_OPEN_KEY, ["false"]) === null,
  );

  const set = (next: boolean) => {
    setIsOpen(next);
    saveStoredChoice(PANEL_OPEN_KEY, String(next), "game state panel state");
  };

  return [isOpen, set];
}

function CollapseToggle({
  isOpen,
  controlsId,
  onToggle,
}: {
  isOpen: boolean;
  controlsId: string;
  onToggle: () => void;
}) {
  return (
    <UnstyledButton
      aria-controls={controlsId}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Collapse game state" : "Expand game state"}
      title={isOpen ? "Collapse game state" : "Expand game state"}
      onClick={onToggle}
      className={styles.collapseToggle}
    >
      <IconChevronDown
        aria-hidden="true"
        size={13}
        className={cx(styles.chevron, !isOpen && styles.chevronClosed)}
      />
    </UnstyledButton>
  );
}

function ActivePlayerRow({
  activePlayer,
  phase,
  playerData,
}: {
  activePlayer: string;
  phase: GamePhase;
  playerData: GameStatePlayer[];
}) {
  return (
    <Group gap={8} align="center" wrap="nowrap">
      <PlayerColorSwatch color={activePlayer} />
      <Text span className={styles.turnText}>
        <span className={styles.turnName}>
          {playerNameForColor(playerData, activePlayer)}
        </span>
        {activePlayerPhrase(phase)}
      </Text>
    </Group>
  );
}

function CombatRow({
  combat,
  playerData,
}: {
  combat: GameStateCombat;
  playerData: GameStatePlayer[];
}) {
  let title = `Combat — ${combat.system ?? "?"}`;
  if (combat.unitHolder) title += ` (${combat.unitHolder})`;
  if (combat.round !== null) title += ` · R${combat.round}`;

  return (
    <Stack gap={4}>
      <Text size="xs" c="gray.2" fw={600}>
        {title}
      </Text>
      {combat.participantColors.length > 0 && (
        <Group gap="sm" wrap="wrap">
          {combat.participantColors.map((color) => (
            <Group key={color} gap={6} align="center" wrap="nowrap">
              <PlayerColorSwatch color={color} />
              <Text span className={styles.turnText}>
                <span className={styles.turnName}>
                  {playerNameForColor(playerData, color)}
                </span>
              </Text>
            </Group>
          ))}
        </Group>
      )}
    </Stack>
  );
}

function WinnerBanner({
  winner,
  playerData,
}: {
  winner: string;
  playerData: GameStatePlayer[];
}) {
  return (
    <Chip accent={colorToChipAccent(winner)} size="md" strong>
      <Group gap="xs" align="center">
        <Text size="sm" c="white">
          🏆
        </Text>
        <Text size="sm" fw={700} c="white">
          {playerNameForColor(playerData, winner)} wins!
        </Text>
      </Group>
    </Chip>
  );
}

const DETAILS_ID = "game-state-panel-details";

function GameStateDetails({
  gameState,
  playerData,
}: {
  gameState: GameState;
  playerData: GameStatePlayer[];
}) {
  const { phase } = gameState;
  return (
    <Stack gap="xs">
      {gameState.activePlayer && (
        <ActivePlayerRow
          activePlayer={gameState.activePlayer}
          phase={phase}
          playerData={playerData}
        />
      )}

      {phaseGroup(phase) === "agenda" && (
        <>
          <Divider c="gray.7" opacity={0.4} />
          <AgendaRow
            agenda={gameState.agenda}
            phase={phase}
            activePlayer={gameState.activePlayer}
            playerData={playerData}
          />
        </>
      )}

      {gameState.activeCombat && (
        <>
          <Divider c="gray.7" opacity={0.4} />
          <CombatRow combat={gameState.activeCombat} playerData={playerData} />
        </>
      )}
    </Stack>
  );
}

/**
 * Collapsed, the plate keeps its rail so the phase stays readable. A finished
 * game collapses like the rest: it is the most static message on the board.
 */
function GameStatePanelContent({
  gameState,
  playerData,
}: {
  gameState: GameState;
  playerData: GameStatePlayer[];
}) {
  const { phase, winner } = gameState;
  const [isOpen, setIsOpen] = useGameStatePanelOpen();
  const showWinner = phase === "finished" && !!winner;
  const accentRgb = showWinner
    ? PHASE_ACCENT_RGB.red
    : (PHASE_ACCENT_RGB[PHASE_CONFIGS[phase].accent] ?? "var(--gd-gray)");

  return (
    <Module
      accentRgb={accentRgb}
      label={<PhaseBadge phase={phase} />}
      meta={
        <CollapseToggle
          isOpen={isOpen}
          controlsId={DETAILS_ID}
          onToggle={() => setIsOpen(!isOpen)}
        />
      }
      density="compact"
      overContent
      className={styles.panel}
    >
      <Collapse in={isOpen} id={DETAILS_ID} transitionDuration={160}>
        {showWinner ? (
          <WinnerBanner winner={winner} playerData={playerData} />
        ) : (
          <GameStateDetails gameState={gameState} playerData={playerData} />
        )}
      </Collapse>
    </Module>
  );
}

export function GameStatePanel() {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid ?? "";
  const { data: gameState } = useGameState(gameId);
  const gameData = useGameData();
  const playerData = gameData?.playerData ?? [];

  if (!gameState?.phase || gameState.phase === "unknown") return null;

  return (
    <GameStatePanelContent gameState={gameState} playerData={playerData} />
  );
}
