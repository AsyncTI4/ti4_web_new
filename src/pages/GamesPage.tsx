import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IconSearch } from "@tabler/icons-react";
import { Button, TextInput } from "@/ds";
import { useMaps } from "@/api/useMaps";
import { useCommunityStats } from "@/api/useCommunityStats";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { PageShell } from "@/layout/PageShell";
import { AuthPrompt } from "@/domains/auth/AuthPrompt";
import { useDashboard } from "@/domains/dashboard/hooks/useDashboard";
import { GameLaneTable, type LaneGame } from "@/domains/dashboard/GameLanes";
import { SectionHead } from "@/domains/dashboard/DashboardParts";
import {
  isFogOfWarGame,
  needsYou,
  sortForLanes,
  toLaneGame,
} from "@/domains/dashboard/dashboardLanes";
import type { DashboardGame } from "@/domains/dashboard/types";
import dash from "@/domains/dashboard/DashboardPage.module.css";
import classes from "./GamesPage.module.css";

const ID_PAGE = 120;

type Filter = "active" | "finished";

const FILTERS: { value: Filter; label: string; match: (g: DashboardGame) => boolean }[] = [
  { value: "active", label: "Active", match: (g) => g.isActive },
  { value: "finished", label: "Finished", match: (g) => !g.isActive },
];

function YourGames() {
  const dashboardQuery = useDashboard();
  const [filter, setFilter] = useState<Filter>("active");

  if (dashboardQuery.isError && dashboardQuery.error?.status === 401) {
    return (
      <section className={classes.section} aria-label="Your games">
        <SectionHead title="Your games" />
        <AuthPrompt
          compact
          title="Log in to see your seats"
          body="Your games, whose turn it is and your VP in each one come from your Discord account."
          buttonLabel="Log in with Discord"
        />
      </section>
    );
  }

  const games = (dashboardQuery.data?.games ?? []).filter((g) => !isFogOfWarGame(g));
  const waiting = games.filter(needsYou).length;
  const match = FILTERS.find((f) => f.value === filter)?.match ?? (() => true);

  return (
    <section className={classes.section} aria-label="Your games">
      <SectionHead
        title="Your games"
        meta={dashboardQuery.data ? `${waiting} waiting on you` : undefined}
      >
        <span className={dash.chips} role="group" aria-label="Filter games">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={dash.fchip}
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
            >
              {f.label} <b>{games.filter(f.match).length}</b>
            </button>
          ))}
        </span>
      </SectionHead>
      <GameLaneTable
        label="Your games"
        loading={dashboardQuery.isLoading}
        games={sortForLanes(games.filter(match)).map(toLaneGame)}
        empty={
          dashboardQuery.isError
            ? { title: "Your games didn't load", body: "The game server didn't answer. Try again in a moment." }
            : filter === "active"
              ? { title: "No active games", body: "Sign up for a new game in the Discord server's game channels." }
              : { title: "No finished games yet" }
        }
      />
    </section>
  );
}

function LiveGames() {
  const statsQuery = useCommunityStats();
  const live: LaneGame[] = (statsQuery.data?.gamesInProgress ?? []).map((game) => ({
    id: game.id,
    title: game.name,
    href: `/game/${game.id}`,
    seats: game.factions.map((faction) => ({ key: faction, faction })),
    round: `R${game.round}`,
    clock: { kind: "quiet", label: `First to ${game.vpTarget} VP` },
    last: "Watch",
  }));
  const failed = statsQuery.isError || (!statsQuery.isLoading && !statsQuery.data);

  return (
    <section className={classes.section} aria-label="Live now">
      <SectionHead
        title="Live now"
        meta={statsQuery.data ? `${statsQuery.data.activeGames.toLocaleString()} games running` : undefined}
      />
      <p className={classes.intro}>A few games in progress right now. Anyone can open the board and watch.</p>
      <GameLaneTable
        label="Live games"
        loading={statsQuery.isLoading}
        games={live}
        columns={{ seats: "Factions", clock: "Target", last: "" }}
        empty={
          failed
            ? { title: "Live games didn't load", body: "Try again in a moment." }
            : { title: "No public games to show right now" }
        }
      />
    </section>
  );
}

function AllGames() {
  const mapsQuery = useMaps();
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(ID_PAGE);

  const ids = useMemo(
    () =>
      (mapsQuery.data ?? [])
        .map((m) => m.MapName)
        .filter((name) => !name.includes("fow"))
        .sort((a, b) => a.localeCompare(b)),
    [mapsQuery.data],
  );

  if (mapsQuery.isLoading) return null;
  if (mapsQuery.isError) {
    return (
      <section className={classes.section} aria-label="All games">
        <SectionHead title="All games" />
        <div className={classes.quiet}>The game list didn't load. Try again later.</div>
      </section>
    );
  }
  if (ids.length === 0) return null;

  const needle = query.trim().toLowerCase();
  const matches = needle ? ids.filter((id) => id.toLowerCase().includes(needle)) : ids;

  return (
    <section className={classes.section} aria-label="All games">
      <SectionHead title="All games" meta={`${ids.length.toLocaleString()} games`}>
        <TextInput
          className={classes.search}
          size="xs"
          placeholder="Find a game id"
          aria-label="Find a game id"
          leftSection={<IconSearch size={13} />}
          value={query}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(event.currentTarget.value);
            setLimit(ID_PAGE);
          }}
        />
      </SectionHead>
      {matches.length === 0 ? (
        <div className={classes.quiet}>No game id contains "{query}".</div>
      ) : (
        <div className={classes.ids}>
          {matches.slice(0, limit).map((id) => (
            <Link key={id} to={`/game/${id}`} className={classes.id}>
              {id}
            </Link>
          ))}
        </div>
      )}
      {matches.length > limit && (
        <Button
          className={classes.more}
          variant="default"
          size="xs"
          onClick={() => setLimit(limit + ID_PAGE * 4)}
        >
          Show more ({(matches.length - limit).toLocaleString()} left)
        </Button>
      )}
    </section>
  );
}

function GamesPage() {
  useDocumentTitle("Games · AsyncTI4");

  return (
    <PageShell footer>
      <div className={classes.wrap}>
        <YourGames />
        <LiveGames />
        <AllGames />
      </div>
    </PageShell>
  );
}

export default GamesPage;
