import { useState, type CSSProperties, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Collapse, UnstyledButton } from "@/ds";
import { IconChevronDown, IconSwords, IconTrophy } from "@tabler/icons-react";
import cx from "clsx";
import { useGameState } from "@/api/useGameState";
import { useGameData } from "@/state/useGameContext";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { resolvePrimaryRgb } from "@/entities/lookup/colors";
import type {
  GamePhase,
  GameState,
  GameStateCombat,
  PlayerData,
} from "@/entities/data/types";
import {
  loadStoredChoice,
  saveStoredChoice,
} from "@/utils/localStorageSettings";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { SC_NAMES } from "@/entities/data/strategyCardColors";
import {
  prettifyId,
  resolveSystemName,
} from "./GameEventPanel/eventFormatting";
import { AgendaRow } from "./GameStateAgenda";
import { getPlayerDisplayName, playerNameForColor } from "./gameStatePlayers";
import styles from "./GameStatePanel.module.css";

type PhaseStep = "strategy" | "action" | "status" | "agenda";

type PhaseConfig = {
  label: string;
  /** Signal triplet (space-separated) the plate's top line and dot key to. */
  tone: string;
  step: PhaseStep | null;
};

const TONE = {
  neutral: "var(--ds-hair-rgb)",
  strategy: "var(--ds-sig-break)",
  action: "var(--ds-sig-bio)",
  status: "var(--ds-sig-warn)",
  agenda: "var(--ds-sig-law)",
  combat: "var(--ds-sig-danger)",
  finished: "var(--ds-sig-relic)",
};

const PHASE_CONFIGS: Record<GamePhase, PhaseConfig> = {
  unknown: { label: "Unknown phase", tone: TONE.neutral, step: null },
  "setup.draft": { label: "Setup · Draft", tone: TONE.neutral, step: null },
  "setup.players": { label: "Setup · Players", tone: TONE.neutral, step: null },
  strategy: { label: "Strategy phase", tone: TONE.strategy, step: "strategy" },
  action: { label: "Action phase", tone: TONE.action, step: "action" },
  "status.scoring": {
    label: "Status · Scoring",
    tone: TONE.status,
    step: "status",
  },
  "status.homework": {
    label: "Status · Homework",
    tone: TONE.status,
    step: "status",
  },
  "agenda.readyToFlip": {
    label: "Agenda · Ready",
    tone: TONE.agenda,
    step: "agenda",
  },
  "agenda.whens": {
    label: "Agenda · Whens",
    tone: TONE.agenda,
    step: "agenda",
  },
  "agenda.afters": {
    label: "Agenda · Afters",
    tone: TONE.agenda,
    step: "agenda",
  },
  "agenda.voting": {
    label: "Agenda · Voting",
    tone: TONE.agenda,
    step: "agenda",
  },
  "agenda.resolving": {
    label: "Agenda · Resolving",
    tone: TONE.agenda,
    step: "agenda",
  },
  finished: { label: "Game over", tone: TONE.finished, step: null },
};

const PHASE_STEPS: { step: PhaseStep; label: string }[] = [
  { step: "strategy", label: "Strategy" },
  { step: "action", label: "Action" },
  { step: "status", label: "Status" },
  { step: "agenda", label: "Agenda" },
];

/* Strategy card initiative → its signal triplet (comma-separated). */
const SC_TONE: Record<number, string> = {
  1: "var(--gd-red)",
  2: "var(--gd-orange)",
  3: "var(--gd-yellow)",
  4: "var(--gd-green)",
  5: "var(--gd-teal)",
  6: "var(--gd-cyan)",
  7: "var(--gd-blue)",
  8: "var(--gd-purple)",
};

type SeatStatus = "acting" | "passed" | "waiting" | "picked" | "picking";

type Seat = {
  player: PlayerData;
  name: string;
  initiative: number | null;
  status: SeatStatus;
};

/** The player's colour as a comma triplet, for rgba(var(--pc), a). */
function playerTone(color: string | null | undefined): string | undefined {
  if (!color) return undefined;
  const rgb = resolvePrimaryRgb(color);
  return rgb ? `${rgb.red}, ${rgb.green}, ${rgb.blue}` : undefined;
}

function toneStyle(vars: Record<string, string | undefined>): CSSProperties {
  const entries = Object.entries(vars).filter(([, v]) => v !== undefined);
  return Object.fromEntries(entries) as CSSProperties;
}

function lowestInitiative(player: PlayerData): number | null {
  if (!player.scs?.length) return null;
  return Math.min(...player.scs);
}

function seatStatus(player: PlayerData, phase: GamePhase): SeatStatus {
  if (player.active) return phase === "strategy" ? "picking" : "acting";
  if (phase === "strategy") return player.scs?.length ? "picked" : "waiting";
  return player.passed ? "passed" : "waiting";
}

function isSeated(player: PlayerData): boolean {
  if (!player.faction || player.faction === "neutral") return false;
  const name = getPlayerDisplayName(player, player.color).toLowerCase();
  return !name.endsWith(".deck") && !name.endsWith('.deck"');
}

/** Seats in initiative order; players without a card fall to the end. */
function buildSeats(playerData: PlayerData[], phase: GamePhase): Seat[] {
  return playerData
    .filter(isSeated)
    .map((player) => ({
      player,
      name: getPlayerDisplayName(player, player.color),
      initiative: lowestInitiative(player),
      status: seatStatus(player, phase),
    }))
    .sort((a, b) => (a.initiative ?? 99) - (b.initiative ?? 99));
}

function systemLabel(
  position: string | null,
  tiles: Record<string, { systemId: string }> | undefined,
): string | null {
  if (!position) return null;
  const systemId = tiles?.[position]?.systemId;
  const name = systemId
    ? resolveSystemName(position, { [position]: systemId })
    : position;
  return name === position ? position : `${position} ${name}`;
}

function nowPhrase(phase: GamePhase, system: string | null): string {
  if (phase === "action") {
    return system ? `Tactical action · ${system}` : "Taking a turn";
  }
  if (phase === "strategy") return "Picking a strategy card";
  if (phase === "agenda.voting") return "Casting votes";
  if (phase.startsWith("agenda")) return "Agenda phase";
  if (phase.startsWith("status")) return "Status phase";
  return "On the clock";
}

const PANEL_OPEN_KEY = "ti4_game_state_panel_open";

/**
 * Whether the plate is expanded, remembered across games and reloads. The
 * plate floats over the board's top-left corner, so leaving it open is the
 * player's choice; a phone starts collapsed.
 */
function useGameStatePanelOpen(): [boolean, (next: boolean) => void] {
  const [isOpen, setIsOpen] = useState(() => {
    const stored = loadStoredChoice(PANEL_OPEN_KEY, ["true", "false"]);
    if (stored === null) return !isMobileDevice();
    return stored === "true";
  });

  const set = (next: boolean) => {
    setIsOpen(next);
    saveStoredChoice(PANEL_OPEN_KEY, String(next), "game state panel state");
  };

  return [isOpen, set];
}

const DETAILS_ID = "game-state-panel-details";

function PlateHeader({
  label,
  meta,
  isOpen,
  onToggle,
}: {
  label: string;
  meta: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const action = isOpen ? "Collapse game state" : "Expand game state";
  return (
    <UnstyledButton
      className={styles.header}
      aria-controls={DETAILS_ID}
      aria-expanded={isOpen}
      aria-label={action}
      title={action}
      onClick={onToggle}
    >
      <span className={styles.phaseDot} aria-hidden="true" />
      <span className={styles.phaseLabel}>{label}</span>
      <span className={styles.headerMeta}>{meta}</span>
      <IconChevronDown
        aria-hidden="true"
        size={13}
        className={cx(styles.chevron, isOpen && styles.chevronOpen)}
      />
    </UnstyledButton>
  );
}

function PhaseTrack({ step }: { step: PhaseStep | null }) {
  if (!step) return null;
  const current = PHASE_STEPS.findIndex((s) => s.step === step);
  return (
    <div className={styles.track} aria-label="Phase">
      {PHASE_STEPS.map((s, index) => {
        const state =
          index < current ? "done" : index === current ? "now" : undefined;
        return (
          <span
            key={s.step}
            className={styles.trackStep}
            data-s={state}
            aria-current={state === "now" ? "step" : undefined}
          >
            {s.label}
          </span>
        );
      })}
    </div>
  );
}

function FactionMark({
  player,
  size,
}: {
  player: PlayerData | undefined;
  size: number;
}) {
  if (!player?.faction) return <span style={{ width: size, height: size }} />;
  return (
    <CircularFactionIcon
      faction={player.faction}
      size={size}
      factionImageOverride={player.factionImage}
      factionImageTypeOverride={player.factionImageType}
    />
  );
}

function NowCallout({
  player,
  name,
  detail,
  icon,
}: {
  player: PlayerData | undefined;
  name: string;
  detail: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div
      className={styles.now}
      style={toneStyle({ "--pc": playerTone(player?.color) })}
    >
      {icon ?? <FactionMark player={player} size={26} />}
      <span className={styles.nowText}>
        <b className={styles.nowName}>{name}</b>
        <small className={styles.nowDetail}>{detail}</small>
      </span>
    </div>
  );
}

function ScDisc({ initiative }: { initiative: number | null }) {
  if (initiative === null) {
    return <span className={cx(styles.disc, styles.discEmpty)}>–</span>;
  }
  return (
    <span
      className={styles.disc}
      style={toneStyle({ "--scc": SC_TONE[initiative] })}
    >
      {initiative}
    </span>
  );
}

function TurnOrder({ seats }: { seats: Seat[] }) {
  if (seats.length === 0) return null;
  return (
    <div className={styles.order} role="list" aria-label="Turn order">
      {seats.map((seat) => (
        <div
          key={seat.player.color}
          role="listitem"
          className={styles.seat}
          data-s={seat.status}
        >
          <ScDisc initiative={seat.initiative} />
          <FactionMark player={seat.player} size={18} />
          <span className={styles.seatName}>{seat.name}</span>
          <span className={styles.seatStatus}>{seat.status}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Strategy cards still being followed: who has yet to resolve the secondary
 * of each played card.
 */
function FollowQueue({ seats }: { seats: Seat[] }) {
  const pending = new Map<number, Seat[]>();
  for (const seat of seats) {
    for (const sc of seat.player.unfollowedSCs ?? []) {
      pending.set(sc, [...(pending.get(sc) ?? []), seat]);
    }
  }
  if (pending.size === 0) return null;

  return (
    <>
      {[...pending.entries()].map(([sc, waiting]) => (
        <div key={sc} className={styles.follow}>
          <span className={styles.label}>
            Following {sc}
            {SC_NAMES[sc] ? ` · ${prettifyId(SC_NAMES[sc].toLowerCase())}` : ""}
          </span>
          <span className={styles.followChips}>
            {waiting.map((seat) => (
              <span key={seat.player.color} title={seat.name}>
                <FactionMark player={seat.player} size={16} />
              </span>
            ))}
          </span>
          <span className={styles.followCount}>{waiting.length} left</span>
        </div>
      ))}
    </>
  );
}

function CombatSection({
  combat,
  playerData,
  location,
}: {
  combat: GameStateCombat;
  playerData: PlayerData[];
  location: string | null;
}) {
  const sides = combat.participantColors;
  return (
    <div className={styles.section}>
      <span className={styles.label}>
        <IconSwords size={11} aria-hidden="true" />
        Combat{location ? ` · ${location}` : ""}
        {combat.unitHolder ? ` · ${combat.unitHolder}` : ""}
        {combat.round !== null ? ` · round ${combat.round}` : ""}
      </span>
      {sides.length > 0 && (
        <div className={styles.sides}>
          {sides.map((color, index) => {
            const player = playerData.find((p) => p.color === color);
            return (
              <span
                key={color}
                className={styles.side}
                data-align={index === 0 ? "start" : "end"}
                style={toneStyle({ "--pc": playerTone(color) })}
              >
                <FactionMark player={player} size={18} />
                <span>{playerNameForColor(playerData, color)}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WinnerCallout({
  winner,
  playerData,
}: {
  winner: string;
  playerData: PlayerData[];
}) {
  const player = playerData.find((p) => p.color === winner);
  return (
    <NowCallout
      player={player}
      name={`${playerNameForColor(playerData, winner)} wins`}
      detail="Victory points reached"
      icon={
        <span className={styles.trophy}>
          <IconTrophy size={16} aria-hidden="true" />
        </span>
      }
    />
  );
}

type Locations = { system: string | null; combat: string | null };

function PlateBody({
  gameState,
  playerData,
  locations,
}: {
  gameState: GameState;
  playerData: PlayerData[];
  locations: Locations;
}) {
  const { phase, activePlayer, winner, activeCombat } = gameState;
  if (phase === "finished" && winner) {
    return <WinnerCallout winner={winner} playerData={playerData} />;
  }

  const seats = buildSeats(playerData, phase);
  const active = playerData.find((p) => p.color === activePlayer);
  const isAgenda = phase.startsWith("agenda");
  const showOrder = phase === "action" || phase === "strategy";

  return (
    <>
      {activePlayer && (
        <NowCallout
          player={active}
          name={playerNameForColor(playerData, activePlayer)}
          detail={nowPhrase(phase, locations.system)}
        />
      )}
      {activeCombat && (
        <CombatSection
          combat={activeCombat}
          playerData={playerData}
          location={locations.combat}
        />
      )}
      {showOrder && <TurnOrder seats={seats} />}
      {phase === "action" && <FollowQueue seats={seats} />}
      {isAgenda && (
        <AgendaRow
          agenda={gameState.agenda}
          phase={phase}
          activePlayer={activePlayer}
          playerData={playerData}
        />
      )}
    </>
  );
}

function headerMeta(
  round: number | undefined,
  gameState: GameState,
  playerData: PlayerData[],
  isOpen: boolean,
): string {
  const parts: string[] = [];
  if (round) parts.push(`R${round}`);
  if (!isOpen && gameState.activePlayer) {
    parts.push(playerNameForColor(playerData, gameState.activePlayer));
  }
  return parts.join(" · ");
}

/**
 * The game-state plate: whose move it is and what they are doing. A phase
 * track sits on top, the current actor is called out in a faint wash of their
 * colour, and the body follows the phase. Collapsed, it is one line.
 */
function GameStatePanelContent({
  gameState,
  playerData,
  round,
  locations,
}: {
  gameState: GameState;
  playerData: PlayerData[];
  round: number | undefined;
  locations: Locations;
}) {
  const [isOpen, setIsOpen] = useGameStatePanelOpen();
  const { phase, activeCombat } = gameState;
  const config = PHASE_CONFIGS[phase];
  const tone = activeCombat ? TONE.combat : config.tone;
  const label = activeCombat ? "Combat" : config.label;

  return (
    <section
      className={styles.panel}
      style={toneStyle({ "--ph": tone })}
      aria-label="Game state"
      data-open={isOpen || undefined}
    >
      <PlateHeader
        label={label}
        meta={headerMeta(round, gameState, playerData, isOpen)}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      <Collapse in={isOpen} id={DETAILS_ID} transitionDuration={160}>
        <PhaseTrack step={config.step} />
        <PlateBody
          gameState={gameState}
          playerData={playerData}
          locations={locations}
        />
      </Collapse>
    </section>
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
    <GameStatePanelContent
      gameState={gameState}
      playerData={playerData}
      round={gameData?.gameRound}
      locations={{
        system: systemLabel(gameState.activeSystem, gameData?.tiles),
        combat: systemLabel(
          gameState.activeCombat?.system ?? null,
          gameData?.tiles,
        ),
      }}
    />
  );
}
