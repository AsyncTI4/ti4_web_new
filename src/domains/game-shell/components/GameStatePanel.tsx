import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Group, Stack, Text, Divider } from "@mantine/core";
import { useGameState } from "@/hooks/useGameState";
import { useGameData } from "@/hooks/useGameContext";
import { Panel } from "@/shared/ui/primitives/Panel";
import { Chip } from "@/shared/ui/primitives/Chip";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { DetailsCard } from "@/shared/ui/DetailsCard";
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
  unknown: { label: "Unknown", accent: "gray" },
  "setup.draft": { label: "Setup · Draft", accent: "gray" },
  "setup.players": { label: "Setup · Players", accent: "gray" },
  strategy: { label: "Strategy", accent: "blue" },
  action: { label: "Action", accent: "green" },
  "status.scoring": { label: "Status · Scoring", accent: "yellow" },
  "status.homework": { label: "Status · Homework", accent: "yellow" },
  "agenda.readyToFlip": { label: "Agenda · Ready", accent: "orange" },
  "agenda.whens": { label: "Agenda · Whens", accent: "orange" },
  "agenda.afters": { label: "Agenda · Afters", accent: "orange" },
  "agenda.voting": { label: "Agenda · Voting", accent: "orange" },
  "agenda.resolving": { label: "Agenda · Resolving", accent: "orange" },
  finished: { label: "Game Over", accent: "red" },
} as const;

type PanelAccentValue = "red" | "green" | "blue" | "yellow" | "orange" | "none";

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

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  if (hours > 0) return `${hours}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

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

function ElapsedTimer({ turnStartedAt }: { turnStartedAt: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <Text size="xs" c="gray.4" ff="monospace">
      {formatElapsed(now - turnStartedAt)}
    </Text>
  );
}

function ActivePlayerRow({
  activePlayer,
  turnStartedAt,
  phase,
  playerData,
}: {
  activePlayer: string;
  turnStartedAt: number | null;
  phase: GamePhase;
  playerData: Array<{ color: string; displayName: string }>;
}) {
  const player = playerData.find((p) => p.color === activePlayer);
  const displayName = player?.displayName ?? activePlayer;
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
      {turnStartedAt !== null && (
        <ElapsedTimer turnStartedAt={turnStartedAt} />
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
  agenda: GameStateAgenda;
  phase: GamePhase;
  activePlayer: string | null;
  playerData: Array<{ color: string; displayName: string }>;
}) {
  const [open, setOpen] = useState(false);
  const agendaData = agendas.find((a) => a.alias === agenda.id);
  const displayName = agendaData?.name ?? agenda.id;

  const outcomeEntries = Object.entries(agenda.outcomeVoteCounts);
  const outcomeSummary = outcomeEntries
    .map(([k, v]) => `${titleCaseWords(k)} ${v}`)
    .join(" · ");

  const showVoterHint =
    phase === "agenda.voting" &&
    activePlayer !== null &&
    agenda.startVoteCounts[activePlayer] !== undefined;

  const activePlayerName = playerData.find((p) => p.color === activePlayer)?.displayName ?? activePlayer;
  const votes = activePlayer !== null ? agenda.startVoteCounts[activePlayer] : undefined;

  return (
    <Stack gap={4}>
      <SmoothPopover
        position="right"
        opened={open}
        onChange={setOpen}
      >
        <SmoothPopover.Target>
          <div>
            <Chip accent="orange" size="sm" onClick={() => setOpen((o) => !o)}>
              <Text size="xs" fw={700} c="white">
                {displayName}
              </Text>
            </Chip>
          </div>
        </SmoothPopover.Target>
        <SmoothPopover.Dropdown p={0}>
          <DetailsCard width={300} color="orange">
            <Stack gap="sm">
              <DetailsCard.Title
                title={displayName}
                subtitle={agendaData?.type ?? "Agenda"}
              />
              {agendaData?.target && (
                <>
                  <Divider c="gray.7" opacity={0.6} />
                  <DetailsCard.Section
                    title="Elect"
                    content={agendaData.target}
                  />
                </>
              )}
              {(agendaData?.text1 || agendaData?.text2) && (
                <>
                  <Divider c="gray.7" opacity={0.6} />
                  <DetailsCard.Section
                    title="Effect"
                    content={
                      <Stack gap={6}>
                        {agendaData?.text1 && (
                          <Text size="sm" c="gray.2" lh={1.4}>
                            {agendaData.text1}
                          </Text>
                        )}
                        {agendaData?.text2 && agendaData.text2.trim() && (
                          <Text size="sm" c="gray.2" lh={1.4}>
                            {agendaData.text2}
                          </Text>
                        )}
                      </Stack>
                    }
                  />
                </>
              )}
            </Stack>
          </DetailsCard>
        </SmoothPopover.Dropdown>
      </SmoothPopover>

      {outcomeSummary && (
        <Text size="xs" c="gray.3">
          {outcomeSummary}
        </Text>
      )}

      {showVoterHint && votes !== undefined && (
        <Text size="xs" c="orange.3">
          {activePlayerName} has {votes} vote{votes !== 1 ? "s" : ""} to cast
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
  playerData: Array<{ color: string; displayName: string }>;
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
            const name = player?.displayName ?? color;
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
  playerData: Array<{ color: string; displayName: string }>;
}) {
  const player = playerData.find((p) => p.color === winner);
  const displayName = player?.displayName ?? winner;
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
  playerData: Array<{ color: string; displayName: string }>;
}) {
  const { phase } = gameState;
  const cfg = PHASE_CONFIGS[phase];
  const panelAccent = PANEL_ACCENT[cfg.accent] ?? "none";

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
        <PhaseBadge phase={phase} />

        {gameState.activePlayer && (
          <ActivePlayerRow
            activePlayer={gameState.activePlayer}
            turnStartedAt={gameState.turnStartedAt}
            phase={phase}
            playerData={playerData}
          />
        )}

        {gameState.agenda && (
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
    </Panel>
  );
}

export function GameStatePanel() {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid ?? "";
  const { data: gameState } = useGameState(gameId);
  const gameData = useGameData();
  const playerData = gameData?.playerData ?? [];

  if (!gameState || !gameState.phase || gameState.phase === "unknown")
    return null;

  return (
    <GameStatePanelContent gameState={gameState} playerData={playerData} />
  );
}
