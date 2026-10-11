import { useState } from "react";
import { Button } from "@/ds";
import type { DashboardGame } from "./types";
import { GameLaneTable } from "./GameLanes";
import { isFogOfWarGame, sortForLanes, toLaneGame } from "./dashboardLanes";
import { DashBox } from "./DashboardParts";
import classes from "./DashboardPage.module.css";

const GAMES_PER_PAGE = 8;

type StatusFilter = "active" | "finished" | "abandoned" | "all";

const STATUS_FILTERS: {
  label: string;
  value: StatusFilter;
  match: (game: DashboardGame) => boolean;
}[] = [
  { label: "Active", value: "active", match: (game) => game.isActive },
  {
    label: "Finished",
    value: "finished",
    match: (game) => game.isFinished && !game.isAbandoned,
  },
  { label: "Abandoned", value: "abandoned", match: (game) => game.isAbandoned },
  { label: "All", value: "all", match: () => true },
];

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className={classes.pagination}>
      <Button
        size="compact-xs"
        variant="subtle"
        disabled={page === 0}
        onClick={() => onChange(Math.max(0, page - 1))}
      >
        Prev
      </Button>
      <span>
        {page + 1} / {totalPages}
      </span>
      <Button
        size="compact-xs"
        variant="subtle"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(Math.min(totalPages - 1, page + 1))}
      >
        Next
      </Button>
    </div>
  );
}

/** Your games as a lane table, games needing you pinned first. */
export function GameDeck({ games }: { games: DashboardGame[] }) {
  const [filter, setFilter] = useState<StatusFilter>("active");
  const [page, setPage] = useState(0);

  const visible = games.filter((game) => !isFogOfWarGame(game));
  const counts = Object.fromEntries(
    STATUS_FILTERS.map((f) => [f.value, visible.filter(f.match).length]),
  ) as Record<StatusFilter, number>;
  const match = STATUS_FILTERS.find((f) => f.value === filter)?.match;
  const filtered = sortForLanes(visible.filter((game) => match?.(game) ?? true));
  const totalPages = Math.max(1, Math.ceil(filtered.length / GAMES_PER_PAGE));
  const pageGames = filtered.slice(
    page * GAMES_PER_PAGE,
    (page + 1) * GAMES_PER_PAGE,
  );

  const choose = (value: StatusFilter) => {
    setFilter(value);
    setPage(0);
  };

  return (
    <DashBox label="Your games" meta={`${filtered.length} shown`}>
      <div className={classes.chips} role="group" aria-label="Filter games">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={classes.fchip}
            aria-pressed={filter === f.value}
            onClick={() => choose(f.value)}
          >
            {f.label} <b>{counts[f.value]}</b>
          </button>
        ))}
      </div>
      <GameLaneTable
        label="Your games"
        games={pageGames.map(toLaneGame)}
        empty={{
          title: "No games in this filter",
          body: "Pick another filter, or join a game from the Discord server.",
        }}
      />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </DashBox>
  );
}
