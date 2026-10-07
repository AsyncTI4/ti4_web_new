import { Alert, Box, Loader, Stack, Text, Title } from "@mantine/core";
import { Fragment } from "react";
import {
  IconAlertCircle,
  IconDice5,
  IconShield,
  IconTrophy,
} from "@tabler/icons-react";
import { useDashboard } from "@/domains/dashboard/hooks/useDashboard";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { DashboardResponse } from "@/domains/dashboard/types";
import { Surface } from "@/shared/ui/Surface";
import Caption from "@/shared/ui/Caption/Caption";
import { PageShell } from "@/layout/PageShell";
import { BadgeStrip } from "@/domains/dashboard/BadgeStrip";
import {
  SpeakerEconomySection,
  FactionTechSynergySection,
  FavoredFactionsSection,
} from "@/domains/dashboard/charts";
import { LabelChip } from "@/domains/dashboard/DashboardParts";
import { formatPercent, formatRatio } from "@/domains/dashboard/dashboardFormat";
import { GameDeck } from "@/domains/dashboard/GameDeck";
import { TitlesCard } from "@/domains/dashboard/TitlesCard";
import { TopTechsPanel } from "@/domains/dashboard/TopTechsPanel";
import classes from "@/domains/dashboard/DashboardPage.module.css";

function DashboardHero({ data }: { data: DashboardResponse }) {
  const { profile, summary } = data;
  const diceRatio = profile.diceLuck.ratio;
  const heroStats = [
    { label: "Played", value: summary.gamesPlayed },
    { label: "Active", value: summary.activeGames },
    { label: "Wins", value: summary.wins },
    { label: "Win Rate", value: formatPercent(summary.winPercent) },
  ];

  return (
    <Surface pattern="grid" cornerAccents className={classes.hero}>
      <div className={classes.heroInner}>
        <Stack gap={4}>
          <Caption size="xs">Player Operations</Caption>
          <Title order={1} className={classes.playerName} c="gray.1">
            {profile.userName ?? "Unknown Player"}
          </Title>
          <div className={classes.rankRow}>
            {profile.tiglLatestRankAtGameStart && (
              <LabelChip
                accent="purple"
                size="sm"
                leftSection={<IconShield size={13} />}
              >
                TIGL {profile.tiglLatestRankAtGameStart}
              </LabelChip>
            )}
            <LabelChip
              accent="yellow"
              size="sm"
              leftSection={<IconTrophy size={13} />}
            >
              {summary.wins}W / {summary.gamesPlayed}G
            </LabelChip>
            <LabelChip
              accent={diceRatio != null && diceRatio >= 1 ? "teal" : "red"}
              size="sm"
              leftSection={<IconDice5 size={13} />}
            >
              {formatRatio(diceRatio)}
            </LabelChip>
          </div>
          <div className={classes.heroStats}>
            {heroStats.map((stat, index) => (
              <Fragment key={stat.label}>
                {index > 0 && (
                  <span className={classes.heroStatDot}>&middot;</span>
                )}
                <span className={classes.heroStat}>
                  <span className={classes.heroStatValue}>{stat.value}</span>
                  <span className={classes.heroStatLabel}>{stat.label}</span>
                </span>
              </Fragment>
            ))}
          </div>
        </Stack>
      </div>
    </Surface>
  );
}

function AnalyticsDeck({ profile }: { profile: DashboardResponse["profile"] }) {
  const agg = profile.aggregates;
  if (!agg.ready) return null;

  return (
    <>
      <div className={classes.deckHeader}>
        <Title order={4} c="gray.2" className={classes.deckTitle}>
          ANALYTICS
        </Title>
        <div>
          <Text c="gray.6" size="xs">
            Across {agg.completedGameCount} completed games
          </Text>
          <Text c="gray.7" size="10px" mt={2}>
            Computed from completed games that are eligible for aggregate
            tracking.
          </Text>
        </div>
      </div>

      <div className={classes.aggregateGrid}>
        <FavoredFactionsSection factions={profile.insights.favoredFactions} />
        <SpeakerEconomySection
          impact={agg.speakerImpact}
          economy={agg.economyProfile}
        />
        <TitlesCard titles={profile.titles} />
        {agg.factionTechSynergy && (
          <FactionTechSynergySection synergy={agg.factionTechSynergy} />
        )}
      </div>
    </>
  );
}

function DashboardError({ unauthorized }: { unauthorized: boolean }) {
  return (
    <Alert
      variant="light"
      color={unauthorized ? "yellow" : "red"}
      icon={<IconAlertCircle />}
      title={
        unauthorized ? "Authentication Required" : "Failed to load dashboard"
      }
    >
      {unauthorized
        ? "Log in with Discord to view your player dashboard."
        : "Please try again in a moment."}
    </Alert>
  );
}

export default function DashboardPage() {
  useDocumentTitle("Player Dashboard");
  const dashboardQuery = useDashboard();

  if (dashboardQuery.isLoading) {
    return (
      <PageShell mainClassName={classes.main}>
        <div className={classes.loadingWrap}>
          <Loader size="lg" color="teal" />
          <Caption size="sm" uppercase={false}>
            Building your dashboard...
          </Caption>
        </div>
      </PageShell>
    );
  }

  if (dashboardQuery.isError) {
    return (
      <PageShell mainClassName={classes.main}>
        <Box className={classes.wrap}>
          <DashboardError unauthorized={dashboardQuery.error?.status === 401} />
        </Box>
      </PageShell>
    );
  }

  const data = dashboardQuery.data;
  if (!data) return null;

  return (
    <PageShell mainClassName={classes.main}>
      <Box className={classes.wrap}>
        <DashboardHero data={data} />
        <BadgeStrip badges={data.profile.insights.badges} />
        <TopTechsPanel aggregates={data.profile.aggregates} />
        <AnalyticsDeck profile={data.profile} />
        <GameDeck games={data.games} />
      </Box>
    </PageShell>
  );
}
