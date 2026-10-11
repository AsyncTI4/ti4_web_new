import type { ReactNode } from "react";
import { Loader } from "@/ds";
import {
  IconCards,
  IconCircleCheck,
  IconDice5,
  IconMedal,
  IconShield,
  IconTarget,
} from "@tabler/icons-react";
import { useDashboard } from "@/domains/dashboard/hooks/useDashboard";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { DashboardGame, DashboardResponse } from "@/domains/dashboard/types";
import { PageShell } from "@/layout/PageShell";
import { AuthPrompt } from "@/domains/auth/AuthPrompt";
import { BadgeStrip } from "@/domains/dashboard/BadgeStrip";
import {
  SpeakerEconomySection,
  FactionTechSynergySection,
  FavoredFactionsSection,
} from "@/domains/dashboard/charts";
import { DashBox, SectionHead } from "@/domains/dashboard/DashboardParts";
import { formatPercent, formatRatio } from "@/domains/dashboard/dashboardFormat";
import { isFogOfWarGame, needsYou } from "@/domains/dashboard/dashboardLanes";
import { GameCard } from "@/domains/dashboard/GameCard";
import { GameDeck } from "@/domains/dashboard/GameDeck";
import { TitlesCard } from "@/domains/dashboard/TitlesCard";
import { TopTechsPanel } from "@/domains/dashboard/TopTechsPanel";
import classes from "@/domains/dashboard/DashboardPage.module.css";

const SPARK_GAMES = 20;

function Stat({ label, value, of }: { label: string; value: ReactNode; of?: ReactNode }) {
  return (
    <div className={classes.stat}>
      <span className={classes.label}>{label}</span>
      <span className={classes.statValue}>
        {value}
        {of != null && <small>{of}</small>}
      </span>
    </div>
  );
}

function DashboardHeader({ data }: { data: DashboardResponse }) {
  const { profile, summary } = data;
  return (
    <header className={classes.header}>
      <div className={classes.identity}>
        <span className={classes.label}>Player dashboard</span>
        <h1 className={classes.playerName}>{profile.userName ?? "Unknown player"}</h1>
        <div className={classes.tags}>
          {profile.tiglLatestRankAtGameStart && (
            <span className={`${classes.tag} ${classes.tagLaw}`}>
              <IconShield size={12} /> TIGL {profile.tiglLatestRankAtGameStart}
            </span>
          )}
          <span className={classes.tag} title="Actual hits / expected hits">
            <IconDice5 size={12} /> Dice {formatRatio(profile.diceLuck.ratio)}
          </span>
        </div>
      </div>
      <div className={classes.stats}>
        <Stat label="Played" value={summary.gamesPlayed} />
        <Stat label="Active" value={summary.activeGames} />
        <Stat label="Wins" value={summary.wins} />
        <Stat label="Win rate" value={formatPercent(summary.winPercent)} />
      </div>
    </header>
  );
}

function NeedsYou({ games }: { games: DashboardGame[] }) {
  const active = games.filter((game) => game.isActive && !isFogOfWarGame(game));
  const waiting = active.filter(needsYou);
  return (
    <section className={classes.section} aria-label="Needs you">
      <SectionHead
        title="Needs you"
        meta={`${waiting.length} of ${active.length} active game${active.length === 1 ? "" : "s"}`}
      />
      {waiting.length === 0 ? (
        <div className={classes.calm}>
          <IconCircleCheck size={16} />
          Nothing is waiting on you. The bot will ping you in Discord when it is your turn.
        </div>
      ) : (
        <div className={classes.needs}>
          {waiting.map((game) => (
            <GameCard key={game.gameId} game={game} />
          ))}
        </div>
      )}
    </section>
  );
}

function FinishSpark({ games }: { games: DashboardGame[] }) {
  const finished = games
    .filter((game) => game.isFinished && !game.isAbandoned)
    .sort((a, b) => (b.endedAtEpochMs ?? 0) - (a.endedAtEpochMs ?? 0))
    .slice(0, SPARK_GAMES)
    .reverse();
  if (finished.length === 0) return null;

  const wins = finished.filter((game) => game.yourSeat.isWinner).length;
  return (
    <DashBox
      label={`Last ${finished.length} games · VP at finish`}
      meta={`${wins} win${wins === 1 ? "" : "s"}`}
    >
      <div className={classes.spark} role="img" aria-label={`VP at finish for your last ${finished.length} games, ${wins} wins`}>
        {finished.map((game) => {
          const ratio = game.vpTarget > 0 ? game.yourSeat.score / game.vpTarget : 0;
          return (
            <i
              key={game.gameId}
              data-w={game.yourSeat.isWinner || undefined}
              style={{ height: `${Math.max(4, Math.min(100, ratio * 100))}%` }}
              title={`${game.gameId}: ${game.yourSeat.score}/${game.vpTarget} VP`}
            />
          );
        })}
      </div>
      <div className={classes.sparkKey}>
        <span><i data-w /> Win</span>
        <span><i /> VP reached, as a share of the target</span>
      </div>
    </DashBox>
  );
}

function Analytics({ profile }: { profile: DashboardResponse["profile"] }) {
  const agg = profile.aggregates;
  if (!agg.ready) return null;

  return (
    <section className={classes.section} aria-label="Analytics">
      <SectionHead
        title="Analytics"
        meta={`From ${agg.completedGameCount} completed games`}
      />
      <div className={classes.analyticsGrid}>
        <FavoredFactionsSection factions={profile.insights.favoredFactions} />
        <SpeakerEconomySection impact={agg.speakerImpact} economy={agg.economyProfile} />
        {agg.factionTechSynergy && (
          <FactionTechSynergySection synergy={agg.factionTechSynergy} />
        )}
      </div>
    </section>
  );
}

const LOGGED_OUT_ITEMS = [
  { icon: <IconTarget size={14} />, label: "Games waiting on your turn" },
  { icon: <IconCards size={14} />, label: "Every game you sit in, active and finished" },
  { icon: <IconMedal size={14} />, label: "Titles, badges and your most researched tech" },
];

function DashboardError({ unauthorized }: { unauthorized: boolean }) {
  if (unauthorized) {
    return (
      <AuthPrompt
        kicker="Player dashboard"
        title="Log in to see your dashboard"
        body="The dashboard is built from the games you play in. Log in with Discord so we know which seats are yours."
        items={LOGGED_OUT_ITEMS}
      />
    );
  }
  return (
    <AuthPrompt
      kicker="Player dashboard"
      title="The dashboard didn't load"
      body="The game server didn't answer. Try again in a moment, or log in again if it keeps failing."
      buttonLabel="Log in again"
    />
  );
}

export default function DashboardPage() {
  useDocumentTitle("Player Dashboard");
  const dashboardQuery = useDashboard();

  if (dashboardQuery.isLoading) {
    return (
      <PageShell footer mainClassName={classes.main}>
        <div className={classes.loadingWrap}>
          <Loader size="md" />
          Reading your games…
        </div>
      </PageShell>
    );
  }

  if (dashboardQuery.isError) {
    return (
      <PageShell footer mainClassName={classes.main}>
        <DashboardError unauthorized={dashboardQuery.error?.status === 401} />
      </PageShell>
    );
  }

  const data = dashboardQuery.data;
  if (!data) return null;

  return (
    <PageShell footer mainClassName={classes.main}>
      <div className={classes.wrap}>
        <DashboardHeader data={data} />
        <NeedsYou games={data.games} />
        <div className={classes.dash}>
          <div className={classes.col}>
            <FinishSpark games={data.games} />
            <GameDeck games={data.games} />
          </div>
          <div className={classes.col}>
            <TitlesCard titles={data.profile.titles} />
            <TopTechsPanel aggregates={data.profile.aggregates} />
          </div>
        </div>
        <BadgeStrip badges={data.profile.insights.badges} />
        <Analytics profile={data.profile} />
      </div>
    </PageShell>
  );
}
