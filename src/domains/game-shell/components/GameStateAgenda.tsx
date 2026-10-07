import { Stack, Text } from "@mantine/core";
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

function outcomeStatus(agenda: GameStateAgenda | null): string {
  const resolvedOutcome = agenda?.resolvedOutcome?.trim();
  if (resolvedOutcome) {
    return `Vote resolved: ${titleCaseWords(resolvedOutcome)}`;
  }
  return Object.entries(agenda?.outcomeVoteCounts ?? {})
    .map(([outcome, votes]) => `${titleCaseWords(outcome)} ${votes}`)
    .join(" · ");
}

function AgendaCardText({
  agenda,
  agendaData,
}: {
  agenda: GameStateAgenda | null;
  agendaData: AgendaData | undefined;
}) {
  const displayName = agenda ? (agendaData?.name ?? agenda.id) : null;
  return (
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
      {agendaData?.text2?.trim() && (
        <Text size="xs" c="gray.2" lh={1.35}>
          {agendaData.text2}
        </Text>
      )}
    </Stack>
  );
}

function VoteTable({
  agenda,
  activePlayer,
  voters,
}: {
  agenda: GameStateAgenda | null;
  activePlayer: string | null;
  voters: GameStatePlayer[];
}) {
  return (
    <Stack gap={4}>
      <Text size="xs" c="gray.3" fw={700}>
        Vote counts
      </Text>
      <div className={styles.voteTableWrapper}>
        <table className={styles.voteTable}>
          <thead>
            <tr>
              <th>Player</th>
              <th>Votes</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {voters.map((player) => (
              <tr
                key={player.color}
                className={
                  player.color === activePlayer
                    ? styles.currentVoterRow
                    : undefined
                }
              >
                <td>
                  <span className={styles.voterName}>
                    {player.faction && (
                      <CircularFactionIcon
                        faction={player.faction}
                        size={18}
                        factionImageOverride={player.factionImage}
                        factionImageTypeOverride={player.factionImageType}
                      />
                    )}
                    <span className={styles.voterNameText}>
                      {getPlayerDisplayName(player, player.color)}
                    </span>
                  </span>
                </td>
                <td>{agenda?.castVoteCounts?.[player.color] ?? 0}</td>
                <td>{agenda?.startVoteCounts?.[player.color] ?? "?"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Stack>
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
  const status = outcomeStatus(agenda);
  const activeStartVotes =
    activePlayer !== null ? agenda?.startVoteCounts[activePlayer] : undefined;

  return (
    <Stack gap="xs">
      <AgendaCardText agenda={agenda} agendaData={agendaData} />

      {isVoting && voters.length > 0 && (
        <VoteTable
          agenda={agenda}
          activePlayer={activePlayer}
          voters={voters}
        />
      )}

      {status && (
        <Text size="xs" c="gray.3">
          {status}
        </Text>
      )}

      {isVoting && activePlayer !== null && activeStartVotes !== undefined && (
        <Text size="xs" c="blue.3">
          {playerNameForColor(playerData, activePlayer)} has {activeStartVotes}{" "}
          vote
          {activeStartVotes !== 1 ? "s" : ""} to cast
        </Text>
      )}
    </Stack>
  );
}
