import type { DashboardGame } from "./types";
import type { LaneClock, LaneGame } from "./GameLanes";
import { formatAgo } from "./dashboardFormat";

export function isFogOfWarGame(game: DashboardGame) {
  return (
    game.gameModes.some((mode) => mode.toLowerCase() === "fog_of_war") ||
    game.gameId.toLowerCase().startsWith("fow")
  );
}

export function needsYou(game: DashboardGame) {
  return game.isActive && game.yourSeat.isActivePlayer;
}

function statusNote(game: DashboardGame) {
  if (game.isAbandoned) return "abandoned";
  if (game.isFinished) return "finished";
  return `${game.vpTarget} VP game`;
}

function clockFor(game: DashboardGame): LaneClock {
  if (needsYou(game)) return { kind: "you", faction: game.yourSeat.faction };
  if (game.isAbandoned) return { kind: "quiet", label: "Abandoned" };
  if (game.isFinished) {
    const winner = game.participants.find((p) => p.isWinner);
    if (!winner) return { kind: "quiet", label: "No winner recorded" };
    return { kind: "winner", label: winner.userName, faction: winner.faction };
  }
  if (game.yourSeat.passed) return { kind: "quiet", label: "You passed" };
  return { kind: "quiet", label: "Waiting on the table" };
}

/** Maps a dashboard game onto the lane table row. */
export function toLaneGame(game: DashboardGame): LaneGame {
  return {
    id: game.gameId,
    title: game.title,
    href: `/game/${game.gameId}`,
    seats: game.participants.map((p) => ({
      key: p.userId,
      faction: p.faction,
      name: p.userName,
      score: p.score,
      isYou: p.userId === game.yourSeat.userId,
      isActive: p.userId === game.yourSeat.userId && needsYou(game),
      isWinner: p.isWinner,
    })),
    round: `R${game.round}`,
    roundNote: statusNote(game),
    clock: clockFor(game),
    last: formatAgo(game.lastUpdatedEpochMs),
    needsYou: needsYou(game),
  };
}

/** Games needing you first, then most recently updated. */
export function sortForLanes(games: DashboardGame[]) {
  return [...games].sort(
    (a, b) =>
      Number(needsYou(b)) - Number(needsYou(a)) ||
      b.lastUpdatedEpochMs - a.lastUpdatedEpochMs,
  );
}
