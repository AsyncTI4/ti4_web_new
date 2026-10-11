import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import cx from "clsx";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon/CircularFactionIcon";
import classes from "./GameLanes.module.css";

export type LaneSeat = {
  key: string;
  faction: string | null;
  name?: string;
  score?: number;
  isYou?: boolean;
  isActive?: boolean;
  isWinner?: boolean;
};

export type LaneClock =
  | { kind: "you"; faction?: string | null }
  | { kind: "player"; label: string; faction?: string | null }
  | { kind: "winner"; label: string; faction?: string | null }
  | { kind: "quiet"; label: string };

export type LaneGame = {
  id: string;
  title?: string;
  href: string;
  seats: LaneSeat[];
  round?: ReactNode;
  roundNote?: string;
  clock: LaneClock;
  last?: string;
  needsYou?: boolean;
};

type Columns = {
  seats: string;
  round: string;
  clock: string;
  last: string;
};

const DEFAULT_COLUMNS: Columns = {
  seats: "Seats · VP",
  round: "Round",
  clock: "On the clock",
  last: "Last",
};

function SeatCell({ seat }: { seat: LaneSeat }) {
  const title = [seat.name, seat.faction, seat.score != null && `${seat.score} VP`]
    .filter(Boolean)
    .join(" · ");
  return (
    <span
      className={classes.seat}
      title={title}
      data-me={seat.isYou || undefined}
      data-act={seat.isActive || undefined}
      data-win={seat.isWinner || undefined}
    >
      {seat.faction ? (
        <CircularFactionIcon faction={seat.faction} size={20} />
      ) : (
        <span className={classes.seatBlank} />
      )}
      {seat.score != null && <b>{seat.score}</b>}
    </span>
  );
}

function ClockCell({ clock }: { clock: LaneClock }) {
  if (clock.kind === "you") {
    return (
      <span className={cx(classes.clock, classes.clockYou)}>
        <span>Your turn</span>
      </span>
    );
  }
  if (clock.kind === "quiet") {
    return (
      <span className={cx(classes.clock, classes.clockQuiet)}>
        <span>{clock.label}</span>
      </span>
    );
  }
  return (
    <span
      className={cx(classes.clock, clock.kind === "winner" && classes.clockWin)}
    >
      {clock.faction && <CircularFactionIcon faction={clock.faction} size={16} />}
      <span>{clock.label}</span>
    </span>
  );
}

const squash = (value: string) => value.replace(/\s+/g, "").toLowerCase();

function showTitle(game: LaneGame) {
  return !!game.title && squash(game.title) !== squash(game.id);
}

function LaneRow({ game }: { game: LaneGame }) {
  return (
    <Link
      to={game.href}
      className={cx(classes.row, game.needsYou && classes.you)}
      aria-label={`Open ${game.id}`}
    >
      <span className={classes.name}>
        <b>{game.id}</b>
        {showTitle(game) && <small>{game.title}</small>}
      </span>
      <span className={classes.seats}>
        {game.seats.map((seat) => (
          <SeatCell key={seat.key} seat={seat} />
        ))}
      </span>
      <span className={classes.round}>
        {game.round ?? "—"}
        {game.roundNote && <small>{game.roundNote}</small>}
      </span>
      <ClockCell clock={game.clock} />
      <span className={classes.ago}>{game.last ?? ""}</span>
    </Link>
  );
}

function LaneHead({ columns }: { columns: Columns }) {
  return (
    <div className={cx(classes.row, classes.head)} aria-hidden="true">
      <span className={classes.label}>Game</span>
      <span className={classes.label}>{columns.seats}</span>
      <span className={classes.label}>{columns.round}</span>
      <span className={classes.label}>{columns.clock}</span>
      <span className={cx(classes.label, classes.right)}>{columns.last}</span>
    </div>
  );
}

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={cx(classes.row, classes.skeletonRow)}>
          {Array.from({ length: 5 }, (__, cell) => (
            <span key={cell} className={classes.skeleton} />
          ))}
        </div>
      ))}
    </>
  );
}

type Props = {
  games: LaneGame[];
  columns?: Partial<Columns>;
  loading?: boolean;
  empty?: { title: string; body?: string };
  label?: string;
};

/** The games lane table: game, seats with VP, round, who is on the clock, last activity. */
export function GameLaneTable({ games, columns, loading, empty, label }: Props) {
  const cols = { ...DEFAULT_COLUMNS, ...columns };
  const showEmpty = !loading && games.length === 0 && empty;

  return (
    <div className={classes.table} role="group" aria-label={label} aria-busy={loading || undefined}>
      <LaneHead columns={cols} />
      {loading && <SkeletonRows count={4} />}
      {!loading && games.map((game) => <LaneRow key={game.id} game={game} />)}
      {showEmpty && (
        <div className={classes.empty}>
          <b>{empty.title}</b>
          {empty.body && <span>{empty.body}</span>}
        </div>
      )}
    </div>
  );
}
