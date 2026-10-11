import { IconGavel } from "@tabler/icons-react";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { agendas } from "@/entities/data/agendas";
import type { GamePhase, GameStateAgenda } from "@/entities/data/types";
import {
  getPlayerDisplayName,
  isVoteTablePlayer,
  playerNameForColor,
  titleCaseWords,
  type GameStatePlayer,
} from "./gameStatePlayers";
import styles from "./GameStatePanel.module.css";

type AgendaData = (typeof agendas)[number];

function AgendaHeading({
  agenda,
  agendaData,
}: {
  agenda: GameStateAgenda | null;
  agendaData: AgendaData | undefined;
}) {
  const displayName = agenda ? (agendaData?.name ?? agenda.id) : null;
  const target = agendaData?.target ?? null;
  return (
    <div className={styles.section}>
      <span className={styles.agendaTitle}>
        <span className={styles.seal} aria-hidden="true">
          <IconGavel size={12} />
        </span>
        <b>{displayName ?? "Agenda not revealed"}</b>
      </span>
      {(target || agendaData?.text1) && (
        <span className={styles.agendaText}>{target ?? agendaData?.text1}</span>
      )}
    </div>
  );
}

/** Outcome tallies as bars scaled to the leading outcome. */
function OutcomeBars({ agenda }: { agenda: GameStateAgenda | null }) {
  const outcomes = Object.entries(agenda?.outcomeVoteCounts ?? {}).sort(
    (a, b) => b[1] - a[1],
  );
  if (outcomes.length === 0) return null;
  const max = Math.max(1, ...outcomes.map(([, votes]) => votes));
  const resolved = agenda?.resolvedOutcome?.trim().toLowerCase();

  return (
    <div className={styles.section}>
      {outcomes.map(([outcome, votes], index) => (
        <div
          key={outcome}
          className={styles.vote}
          data-lead={
            index === 0 || outcome.toLowerCase() === resolved || undefined
          }
        >
          <span className={styles.voteName}>{titleCaseWords(outcome)}</span>
          <span className={styles.voteBar}>
            <i style={{ width: `${(votes / max) * 100}%` }} />
          </span>
          <b className={styles.voteCount}>{votes}</b>
        </div>
      ))}
    </div>
  );
}

function VoterIcon({ player }: { player: GameStatePlayer }) {
  if (!player.faction) return null;
  return (
    <span title={getPlayerDisplayName(player, player.color)}>
      <CircularFactionIcon
        faction={player.faction}
        size={16}
        factionImageOverride={player.factionImage}
        factionImageTypeOverride={player.factionImageType}
      />
    </span>
  );
}

/** Each seat's cast votes against what it started with. */
function VoteLedger({
  agenda,
  activePlayer,
  voters,
}: {
  agenda: GameStateAgenda | null;
  activePlayer: string | null;
  voters: GameStatePlayer[];
}) {
  return (
    <div className={styles.ledger} role="table" aria-label="Votes by seat">
      <div className={styles.ledgerHead} role="row">
        <span role="columnheader" />
        <span role="columnheader" />
        <span role="columnheader">Cast</span>
        <span role="columnheader">Of</span>
      </div>
      {voters.map((player) => (
        <div
          key={player.color}
          role="row"
          className={styles.ledgerRow}
          data-active={player.color === activePlayer || undefined}
        >
          <VoterIcon player={player} />
          <span className={styles.ledgerName}>
            {getPlayerDisplayName(player, player.color)}
          </span>
          <b>{agenda?.castVoteCounts?.[player.color] ?? "–"}</b>
          <b>{agenda?.startVoteCounts?.[player.color] ?? "?"}</b>
        </div>
      ))}
    </div>
  );
}

export function AgendaRow({
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
  const isVoting = phase === "agenda.voting";
  const voters = playerData.filter(isVoteTablePlayer);
  const stillToVote = voters.filter(
    (p) => agenda?.castVoteCounts?.[p.color] === undefined,
  );
  const resolved = agenda?.resolvedOutcome?.trim();
  const activeStartVotes =
    activePlayer !== null ? agenda?.startVoteCounts[activePlayer] : undefined;

  return (
    <>
      <AgendaHeading agenda={agenda} agendaData={agendaData} />
      <OutcomeBars agenda={agenda} />
      {resolved && (
        <div className={styles.section}>
          <span className={styles.agendaText}>
            Resolved: {titleCaseWords(resolved)}
          </span>
        </div>
      )}
      {isVoting && voters.length > 0 && (
        <div className={styles.section}>
          <VoteLedger
            agenda={agenda}
            activePlayer={activePlayer}
            voters={voters}
          />
          {stillToVote.length > 0 && (
            <div className={styles.toVote}>
              <span className={styles.label}>To vote</span>
              {stillToVote.map((player) => (
                <VoterIcon key={player.color} player={player} />
              ))}
            </div>
          )}
          {activePlayer !== null && activeStartVotes !== undefined && (
            <span className={styles.agendaText}>
              {playerNameForColor(playerData, activePlayer)} has{" "}
              {activeStartVotes} vote{activeStartVotes !== 1 ? "s" : ""} to cast
            </span>
          )}
        </div>
      )}
    </>
  );
}
