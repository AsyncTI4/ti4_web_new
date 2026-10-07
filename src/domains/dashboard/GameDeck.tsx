import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, SegmentedControl, Stack, Text, Title } from "@mantine/core";
import { Panel } from "@/shared/ui/primitives/Panel";
import type { DashboardGame } from "./types";
import { GameCard } from "./GameCard";
import { gameCountLabel } from "./dashboardFormat";
import classes from "./DashboardPage.module.css";

const GAMES_PER_PAGE = 5;

type StatusFilter = "all" | "active" | "finished" | "abandoned";

const STATUS_FILTERS: {
  label: string;
  value: StatusFilter;
  match: (game: DashboardGame) => boolean;
}[] = [
  { label: "All", value: "all", match: () => true },
  { label: "Active", value: "active", match: (game) => game.isActive },
  {
    label: "Done",
    value: "finished",
    match: (game) => game.isFinished && !game.isAbandoned,
  },
  { label: "Abn", value: "abandoned", match: (game) => game.isAbandoned },
];

const FILTER_OPTIONS = STATUS_FILTERS.map(({ label, value }) => ({
  label,
  value,
}));

function isFogOfWarGame(game: DashboardGame) {
  return (
    game.gameModes.some((mode) => mode.toLowerCase() === "fog_of_war") ||
    game.gameId.toLowerCase().startsWith("fow")
  );
}

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
        color="gray"
        disabled={page === 0}
        onClick={() => onChange(Math.max(0, page - 1))}
      >
        Prev
      </Button>
      <Text size="xs" c="gray.4" ff="mono">
        {page + 1} / {totalPages}
      </Text>
      <Button
        size="compact-xs"
        variant="subtle"
        color="gray"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(Math.min(totalPages - 1, page + 1))}
      >
        Next
      </Button>
    </div>
  );
}

export function GameDeck({ games }: { games: DashboardGame[] }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(0);

  const handleFilterChange = (value: string) => {
    setFilter(value as StatusFilter);
    setPage(0);
  };

  const matchesFilter =
    STATUS_FILTERS.find((f) => f.value === filter)?.match ?? (() => true);
  const filteredGames = games.filter(
    (game) => !isFogOfWarGame(game) && matchesFilter(game),
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredGames.length / GAMES_PER_PAGE),
  );
  const paginatedGames = filteredGames.slice(
    page * GAMES_PER_PAGE,
    (page + 1) * GAMES_PER_PAGE,
  );

  return (
    <>
      <div className={classes.deckHeader}>
        <Title order={4} c="gray.2" className={classes.deckTitle}>
          GAME DECK
        </Title>
        <Text c="gray.6" size="xs">
          Ordered by latest activity
        </Text>
      </div>

      <div className={classes.gameDeckControls}>
        <SegmentedControl
          size="xs"
          value={filter}
          onChange={handleFilterChange}
          className={classes.filterControl}
          data={FILTER_OPTIONS}
        />
        <Text c="gray.5" size="xs">
          {gameCountLabel(filteredGames.length)}
        </Text>
      </div>

      <Stack gap="sm">
        {paginatedGames.map((game) => (
          <GameCard
            key={game.gameId}
            game={game}
            onOpen={() => navigate(`/game/${game.gameId}`)}
          />
        ))}
      </Stack>

      {filteredGames.length === 0 && (
        <Panel variant="subtle" className={classes.emptyState}>
          <Text c="gray.5" size="sm">
            No games in this filter.
          </Text>
        </Panel>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
}
