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
import { useGameState } from "@/hooks/useGameState";
import { useGameData, useIsTrueGmView } from "@/hooks/useGameContext";
import { Panel } from "@/shared/ui/primitives/Panel";
import { Chip } from "@/shared/ui/primitives/Chip";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { agendas } from "@/entities/data/agendas";
import type {
  GamePhase,
  GameState,
  GameStateAgenda,
  GameStateCombat,
} from "@/entities/data/types";
import type { ColorKey } from "@/domains/player/components/gradientClasses";

// ---------------------------------------------------------------------------
// Phase display config
// ---------------------------------------------------------------------------

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
} as const;

type PanelAccentValue = "red" | "green" | "blue" | "yellow" | "orange" | "none";
type GameStatePlayer = {
  color: string;
  displayName?: string | null;
  userName?: string | null;
  flexibleDisplayName?: string | null;
  faction?: string | null;
  factionImage?: string | null;
  factionImageType?: string | null;
  influence?: number | null;
  totInfluence?: number | null;
};

const PANEL_ACCENT: Record<ColorKey, PanelAccentValue> = {
  gray: "none",
  grey: "none",
  blue: "blue",
  green: "green",
  yellow: "yellow",
  orange: "orange",
  red: "red",
  cyan: "none",
  teal: "none",
  purple: "none",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function titleCaseWords(value: string): string {
  return value
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Map player color string to a Chip-compatible accent. Best-effort.
function colorToChipAccent(color: string): ColorKey | "gray" {
  const lower = color.toLowerCase();
  const MAP: Record<string, ColorKey | "gray"> = {
    red: "red",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    orange: "orange",
    purple: "purple",
    teal: "teal",
    cyan: "cyan",
  };
  return MAP[lower] ?? "gray";
}

function phaseGroup(phase: GamePhase): string {
  if (phase === "strategy") return "strategy";
  if (phase === "action") return "action";
  if (phase.startsWith("agenda")) return "agenda";
  if (phase.startsWith("status")) return "status";
  return "other";
}

function activePlayerPhrase(phase: GamePhase): string {
  switch (phaseGroup(phase)) {
    case "strategy":
      return "is picking";
    case "action":
      return "'s turn";
    case "agenda":
      return "is voting";
    default:
      return "";
  }
}

function cleanDisplayName(value?: string | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return null;
  return trimmed;
}

function getPlayerDisplayName(
  player: GameStatePlayer | undefined,
  fallback: string,
): string {
  return (
    cleanDisplayName(player?.displayName) ??
    cleanDisplayName(player?.userName) ??
    cleanDisplayName(player?.flexibleDisplayName) ??
    cleanDisplayName(player?.faction) ??
    fallback
  );
}

function isVoteTablePlayer(player: GameStatePlayer): boolean {
  if (player.faction === "neutral") return false;
  const name = getPlayerDisplayName(player, player.color).toLowerCase();
  return !name.endsWith(".deck") && !name.endsWith('.deck"');
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PhaseBadge({ phase }: { phase: GamePhase }) {
  const cfg = PHASE_CONFIGS[phase];
  return (
    <Chip accent={cfg.accent} size="sm">
      <Text size="xs" fw={700} c="white">
        {cfg.label}
      </Text>
    </Chip>
  );
}

function PanelHeader({
  phase,
  isCollapsible,
  isOpen,
  controlsId,
  onToggle,
}: {
  phase: GamePhase;
  isCollapsible: boolean;
  isOpen: boolean;
  controlsId: string;
  onToggle: () => void;
}) {
  if (!isCollapsible) {
    return <PhaseBadge phase={phase} />;
  }

  return (
    <UnstyledButton
      aria-controls={controlsId}
      aria-expanded={isOpen}
      onClick={onToggle}
      style={{
        borderRadius: 6,
        display: "block",
        width: "100%",
      }}
    >
      <Group align="center" justify="space-between" wrap="nowrap" gap="xs">
        <PhaseBadge phase={phase} />
        <IconChevronDown
          aria-hidden="true"
          size={16}
          style={{
            color: "var(--mantine-color-gray-4)",
            flex: "0 0 auto",
            transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 140ms ease",
          }}
        />
      </Group>
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
  const player = playerData.find((p) => p.color === activePlayer);
  const displayName = getPlayerDisplayName(player, activePlayer);
  const phrase = activePlayerPhrase(phase);
  const accent = colorToChipAccent(activePlayer);

  return (
    <Group gap="xs" align="center" wrap="nowrap">
      <Chip accent={accent} size="xs">
        <Text size="xs" fw={700} c="white">
          {displayName}
        </Text>
      </Chip>
      {phrase && (
        <Text size="xs" c="gray.3">
          {phrase}
        </Text>
      )}
    </Group>
  );
}

function AgendaRow({
  agenda,
  phase,
  activePlayer,
  playerData,
}: {
  agenda: GameStateAgenda | null;
  phase: GamePhase;
  activePlayer: string | null;
  playerData: GameStatePlayer[];
}) {
  const agendaData = agenda
    ? agendas.find((a) => a.alias === agenda.id)
    : undefined;
  const displayName = agenda ? (agendaData?.name ?? agenda.id) : null;

  const outcomeEntries = Object.entries(agenda?.outcomeVoteCounts ?? {});
  const outcomeSummary = outcomeEntries
    .map(([k, v]) => `${titleCaseWords(k)} ${v}`)
    .join(" · ");
  const resolvedOutcome = agenda?.resolvedOutcome?.trim();
  const outcomeStatus = resolvedOutcome
    ? `Vote resolved: ${titleCaseWords(resolvedOutcome)}`
    : outcomeSummary;

  const showVoterHint =
    phase === "agenda.voting" &&
    activePlayer !== null &&
    agenda !== null &&
    agenda.startVoteCounts[activePlayer] !== undefined;

  const activePlayerName =
    activePlayer === null
      ? null
      : getPlayerDisplayName(
          playerData.find((p) => p.color === activePlayer),
          activePlayer,
        );
  const activePlayerStartVotes =
    activePlayer !== null && agenda !== null
      ? agenda.startVoteCounts[activePlayer]
      : undefined;
  const votingPlayers = playerData.filter(isVoteTablePlayer);

  return (
    <Stack gap="xs">
      <Stack gap={4}>
        <Text size="xs" c="gray.3" fw={700}>
          Agenda
        </Text>
        {displayName ? (
          <Text size="sm" c="gray.1" fw={700} lh={1.25}>
            {displayName}
          </Text>
        ) : (
          <Text size="sm" c="blue.2" fw={700} lh={1.25}>
            Current agenda unavailable
          </Text>
        )}
        {agendaData?.target && (
          <Text size="xs" c="gray.3">
            Elect: {agendaData.target}
          </Text>
        )}
        {agendaData?.text1 && (
          <Text size="xs" c="gray.2" lh={1.35}>
            {agendaData.text1}
          </Text>
        )}
        {agendaData?.text2 && agendaData.text2.trim() && (
          <Text size="xs" c="gray.2" lh={1.35}>
            {agendaData.text2}
          </Text>
        )}
      </Stack>

      {phase === "agenda.voting" && votingPlayers.length > 0 && (
        <Stack gap={4}>
          <Text size="xs" c="gray.3" fw={700}>
            Vote counts
          </Text>
          <div
            style={{
              width: "100%",
              boxSizing: "border-box",
              overflow: "hidden",
              paddingRight: 8,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
                color: "var(--mantine-color-gray-2)",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "3px 6px",
                      textAlign: "left",
                      color: "var(--mantine-color-gray-4)",
                      fontWeight: 700,
                      borderBottom: "1px solid var(--mantine-color-dark-4)",
                    }}
                  >
                    Player
                  </th>
                  <th
                    style={{
                      padding: "3px 6px",
                      textAlign: "right",
                      color: "var(--mantine-color-gray-4)",
                      fontWeight: 700,
                      borderBottom: "1px solid var(--mantine-color-dark-4)",
                    }}
                  >
                    Votes
                  </th>
                  <th
                    style={{
                      padding: "3px 6px",
                      textAlign: "right",
                      color: "var(--mantine-color-gray-4)",
                      fontWeight: 700,
                      borderBottom: "1px solid var(--mantine-color-dark-4)",
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {votingPlayers.map((player) => {
                  const isCurrent = player.color === activePlayer;
                  const castVotes =
                    agenda?.castVoteCounts?.[player.color] ?? 0;
                  const startVotes =
                    agenda?.startVoteCounts?.[player.color] ?? "?";
                  return (
                    <tr
                      key={player.color}
                      style={{
                        background: isCurrent
                          ? "rgba(255, 255, 255, 0.06)"
                          : "transparent",
                      }}
                    >
                      <td
                        style={{
                          padding: "3px 6px",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCurrent
                            ? "var(--mantine-color-gray-1)"
                            : "var(--mantine-color-gray-3)",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            minWidth: 0,
                          }}
                        >
                          {player.faction && (
                            <CircularFactionIcon
                              faction={player.faction}
                              size={18}
                              factionImageOverride={player.factionImage}
                              factionImageTypeOverride={player.factionImageType}
                            />
                          )}
                          <span
                            style={{
                              minWidth: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {getPlayerDisplayName(player, player.color)}
                          </span>
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "3px 6px",
                          textAlign: "right",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                          fontVariantNumeric: "tabular-nums",
                          color: "var(--mantine-color-gray-2)",
                        }}
                      >
                        {castVotes}
                      </td>
                      <td
                        style={{
                          padding: "3px 6px",
                          textAlign: "right",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                          fontVariantNumeric: "tabular-nums",
                          color: "var(--mantine-color-gray-4)",
                        }}
                      >
                        {startVotes}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Stack>
      )}

      {outcomeStatus && (
        <Text size="xs" c="gray.3">
          {outcomeStatus}
        </Text>
      )}

      {showVoterHint && activePlayerStartVotes !== undefined && (
        <Text size="xs" c="blue.3">
          {activePlayerName} has {activePlayerStartVotes} vote
          {activePlayerStartVotes !== 1 ? "s" : ""} to cast
        </Text>
      )}
    </Stack>
  );
}

function CombatRow({
  combat,
  playerData,
}: {
  combat: GameStateCombat;
  playerData: GameStatePlayer[];
}) {
  const parts: string[] = [`Combat — ${combat.system ?? "?"}`];
  if (combat.unitHolder) parts[0] += ` (${combat.unitHolder})`;
  if (combat.round !== null) parts[0] += ` · R${combat.round}`;

  return (
    <Stack gap={4}>
      <Text size="xs" c="gray.2" fw={600}>
        {parts[0]}
      </Text>
      {combat.participantColors.length > 0 && (
        <Group gap={4} wrap="wrap">
          {combat.participantColors.map((color) => {
            const player = playerData.find((p) => p.color === color);
            const name = getPlayerDisplayName(player, color);
            return (
              <Chip key={color} accent={colorToChipAccent(color)} size="xs">
                <Text size="xs" fw={700} c="white">
                  {name}
                </Text>
              </Chip>
            );
          })}
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
  const player = playerData.find((p) => p.color === winner);
  const displayName = getPlayerDisplayName(player, winner);
  const accent = colorToChipAccent(winner);

  return (
    <Chip accent={accent} size="md" strong>
      <Group gap="xs" align="center">
        <Text size="sm" c="white">
          🏆
        </Text>
        <Text size="sm" fw={700} c="white">
          {displayName} wins!
        </Text>
      </Group>
    </Chip>
  );
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------

function GameStatePanelContent({
  gameState,
  playerData,
}: {
  gameState: GameState;
  playerData: GameStatePlayer[];
}) {
  const { phase } = gameState;
  const cfg = PHASE_CONFIGS[phase];
  const panelAccent = PANEL_ACCENT[cfg.accent] ?? "none";
  const isCollapsible = phaseGroup(phase) === "agenda";
  const [isOpen, setIsOpen] = useState(true);
  const detailsId = "game-state-panel-details";

  if (phase === "finished" && gameState.winner) {
    return (
      <Panel variant="subtle" accent="red">
        <Stack gap="xs">
          <PhaseBadge phase={phase} />
          <WinnerBanner winner={gameState.winner} playerData={playerData} />
        </Stack>
      </Panel>
    );
  }

  return (
    <Panel variant="subtle" accent={panelAccent}>
      <Stack gap="xs">
        <PanelHeader
          phase={phase}
          isCollapsible={isCollapsible}
          isOpen={isOpen}
          controlsId={detailsId}
          onToggle={() => setIsOpen((opened) => !opened)}
        />

        <Collapse
          in={!isCollapsible || isOpen}
          id={detailsId}
          transitionDuration={160}
        >
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
                <CombatRow
                  combat={gameState.activeCombat}
                  playerData={playerData}
                />
              </>
            )}
          </Stack>
        </Collapse>
      </Stack>
    </Panel>
  );
}

export function GameStatePanel() {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid ?? "";
  const { data: gameState } = useGameState(gameId);
  const gameData = useGameData();
  const playerData = gameData?.playerData ?? [];
  const isTrueGmView = useIsTrueGmView();

  if (gameData?.hidePlayerInfos && !isTrueGmView) return null;
  if (!gameState || !gameState.phase || gameState.phase === "unknown")
    return null;

  return (
    <GameStatePanelContent gameState={gameState} playerData={playerData} />
  );
}
