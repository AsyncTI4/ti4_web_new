import {
  Alert,
  AppShell,
  Box,
  Button,
  Group,
  Loader,
  ScrollArea,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconAlertCircle,
  IconCrosshair,
  IconDice5,
  IconExternalLink,
  IconShield,
  IconTrophy,
} from "@tabler/icons-react";
import cx from "clsx";
import { AppHeader } from "@/shared/ui/AppHeader";
import { GamesBar } from "@/shared/ui/GamesBar";
import { useDashboard, type DashboardError } from "@/hooks/useDashboard";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { AggressionProfile, DashboardGame, GamePacks, TitleSummary } from "@/domains/dashboard/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon/CircularFactionIcon";
import { Surface } from "@/domains/player/components/Surface";
import { Panel } from "@/shared/ui/primitives/Panel";
import { Chip } from "@/shared/ui/primitives/Chip";
import { StatDisplay } from "@/shared/ui/primitives/StatDisplay";
import Caption from "@/shared/ui/Caption/Caption";
import FadedDivider from "@/shared/ui/primitives/FadedDivider/FadedDivider";
import { BadgeStrip } from "./BadgeStrip";
import { getTechData } from "@/entities/lookup/tech";
import { getGenericUnitDataByRequiredTechId } from "@/entities/lookup/units";
import { cdnImage } from "@/entities/data/cdnImage";
import {
  StrategyCardChart,
  CombatProfileSection,
  SpeakerEconomySection,
  AggressionChart,
  FactionTechSynergySection,
  FavoredFactionsSection,
} from "./charts";

import classes from "./DashboardPage.module.css";

const TECH_TYPE_COLORS: Record<string, string> = {
  BIOTIC: classes.techBiotic,
  PROPULSION: classes.techPropulsion,
  CYBERNETIC: classes.techCybernetic,
  WARFARE: classes.techWarfare,
  UNITUPGRADE: classes.techUnitUpgrade,
};

function techTypeColorClass(type?: string) {
  if (!type) return "";
  return TECH_TYPE_COLORS[type] ?? "";
}

function getUnitImageUrl(techId: string, baseUpgrade?: string): string | undefined {
  const requiredTechId = baseUpgrade || techId;
  const unitData = getGenericUnitDataByRequiredTechId(requiredTechId);
  if (!unitData?.asyncId) return undefined;
  return cdnImage(`/units/lgy_${unitData.asyncId}.png`);
}

type StatusFilter = "all" | "active" | "finished" | "abandoned";

function formatPercent(value: number | null) {
  return value == null ? "N/A" : `${value.toFixed(1)}%`;
}

function formatRatio(value: number | null) {
  return value == null ? "N/A" : `${value.toFixed(2)}x`;
}

function formatDate(value: number | null) {
  if (value == null) return "N/A";
  return new Date(value).toLocaleDateString();
}

function statusFilterMatch(game: DashboardGame, filter: StatusFilter) {
  if (filter === "all") return true;
  if (filter === "active") return game.isActive;
  if (filter === "finished") return game.isFinished && !game.isAbandoned;
  if (filter === "abandoned") return game.isAbandoned;
  return true;
}

type StatusAccent = "green" | "gray" | "red";

function statusAccent(status: DashboardGame["status"]): StatusAccent {
  if (status === "ACTIVE") return "green";
  if (status === "ABANDONED") return "red";
  return "gray";
}

function accentClass(status: DashboardGame["status"]) {
  if (status === "ACTIVE") return classes.accentActive;
  if (status === "ABANDONED") return classes.accentAbandoned;
  return classes.accentFinished;
}

const AGGRESSION_GAME_LIMIT = 6;

function latestAggression(profile: AggressionProfile, games: DashboardGame[]): AggressionProfile {
  const gameIds = Object.keys(profile.byGame);
  if (gameIds.length <= AGGRESSION_GAME_LIMIT) return profile;

  const dateByGame = new Map(games.map((g) => [g.gameId, g.createdAtEpochMs]));
  const sorted = gameIds.sort((a, b) => (dateByGame.get(b) ?? 0) - (dateByGame.get(a) ?? 0));
  const keep = new Set(sorted.slice(0, AGGRESSION_GAME_LIMIT));

  const trimmed: Record<string, number> = {};
  for (const id of keep) {
    trimmed[id] = profile.byGame[id];
  }
  return { ...profile, byGame: trimmed };
}

type PackEntry = { key: keyof GamePacks; label: string };

const PACK_ENTRIES: PackEntry[] = [
  { key: "prophecyOfKings", label: "PoK" },
  { key: "discordantStars", label: "DS" },
  { key: "thundersEdge", label: "TE" },
  { key: "twilightsFall", label: "TF" },
  { key: "absol", label: "Absol" },
  { key: "miltyMod", label: "Milty" },
  { key: "franken", label: "Franken" },
  { key: "votc", label: "VotC" },
];

function activePacks(packs: GamePacks) {
  return PACK_ENTRIES.filter((p) => packs[p.key]);
}

export default function DashboardPage() {
  useDocumentTitle("Player Dashboard");
  const navigate = useNavigate();
  const dashboardQuery = useDashboard();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(0);
  const GAMES_PER_PAGE = 5;

  function handleFilterChange(v: string) {
    setFilter(v as StatusFilter);
    setPage(0);
  }

  if (dashboardQuery.isLoading) {
    return (
      <AppShell header={{ height: 60 }}>
        <AppHeader>
          <GamesBar />
        </AppHeader>
        <AppShell.Main className={classes.main}>
          <div className={classes.loadingWrap}>
            <Loader size="lg" color="teal" />
            <Caption size="sm" uppercase={false}>
              Building your dashboard...
            </Caption>
          </div>
        </AppShell.Main>
      </AppShell>
    );
  }

  if (dashboardQuery.isError) {
    const error = dashboardQuery.error as DashboardError;
    const unauthorized = typeof error === "object" && error?.status === 401;
    return (
      <AppShell header={{ height: 60 }}>
        <AppHeader>
          <GamesBar />
        </AppHeader>
        <AppShell.Main className={classes.main}>
          <Box className={classes.wrap}>
            <Alert
              variant="light"
              color={unauthorized ? "yellow" : "red"}
              icon={<IconAlertCircle />}
              title={unauthorized ? "Authentication Required" : "Failed to load dashboard"}
            >
              {unauthorized
                ? "Log in with Discord to view your player dashboard."
                : "Please try again in a moment."}
            </Alert>
          </Box>
        </AppShell.Main>
      </AppShell>
    );
  }

  const data = dashboardQuery.data;
  if (!data) return null;

  const filteredGames = data.games.filter((g) => statusFilterMatch(g, filter));
  const totalPages = Math.max(1, Math.ceil(filteredGames.length / GAMES_PER_PAGE));
  const paginatedGames = filteredGames.slice(page * GAMES_PER_PAGE, (page + 1) * GAMES_PER_PAGE);
  const diceRatio = data.profile.diceLuck.ratio;
  const diceGood = diceRatio != null && diceRatio >= 1;
  const topResearchedTechs = Object.entries(data.profile.aggregates.techStats.byTech)
    .sort((a, b) => {
      if (b[1].gamesWithTech !== a[1].gamesWithTech) {
        return b[1].gamesWithTech - a[1].gamesWithTech;
      }
      return b[1].percentInEligibleGames - a[1].percentInEligibleGames;
    })
    .slice(0, 8);
  const hasTopResearchedTechs = topResearchedTechs.length > 0;
  const agg = data.profile.aggregates;

  return (
    <AppShell header={{ height: 60 }}>
      <AppHeader>
        <GamesBar />
      </AppHeader>

      <AppShell.Main className={classes.main}>
        <Box className={classes.wrap}>
          {/* ── Hero: Player Identity + Performance ── */}
          <Surface pattern="grid" cornerAccents className={classes.hero}>
            <div className={classes.heroInner}>
              <Stack gap={4}>
                <Caption size="xs">Player Operations</Caption>
                <Title order={1} className={classes.playerName} c="gray.1">
                  {data.profile.userName ?? "Unknown Player"}
                </Title>
                <div className={classes.rankRow}>
                  {data.profile.tiglLatestRankAtGameStart && (
                    <Chip accent="purple" size="sm" leftSection={<IconShield size={13} />}>
                      <Text size="xs" fw={700} c="white">
                        TIGL {data.profile.tiglLatestRankAtGameStart}
                      </Text>
                    </Chip>
                  )}
                  <Chip accent="yellow" size="sm" leftSection={<IconTrophy size={13} />}>
                    <Text size="xs" fw={700} c="white">
                      {data.summary.wins}W / {data.summary.gamesPlayed}G
                    </Text>
                  </Chip>
                  <Chip accent={diceGood ? "teal" : "red"} size="sm" leftSection={<IconDice5 size={13} />}>
                    <Text size="xs" fw={700} c="white">
                      {formatRatio(diceRatio)}
                    </Text>
                  </Chip>
                </div>
                <div className={classes.heroStats}>
                  <span className={classes.heroStat}>
                    <span className={classes.heroStatValue}>{data.summary.gamesPlayed}</span>
                    <span className={classes.heroStatLabel}>Played</span>
                  </span>
                  <span className={classes.heroStatDot}>&middot;</span>
                  <span className={classes.heroStat}>
                    <span className={classes.heroStatValue}>{data.summary.activeGames}</span>
                    <span className={classes.heroStatLabel}>Active</span>
                  </span>
                  <span className={classes.heroStatDot}>&middot;</span>
                  <span className={classes.heroStat}>
                    <span className={classes.heroStatValue}>{data.summary.wins}</span>
                    <span className={classes.heroStatLabel}>Wins</span>
                  </span>
                  <span className={classes.heroStatDot}>&middot;</span>
                  <span className={classes.heroStat}>
                    <span className={classes.heroStatValue}>{formatPercent(data.summary.winPercent)}</span>
                    <span className={classes.heroStatLabel}>Win Rate</span>
                  </span>
                </div>
              </Stack>
            </div>
          </Surface>

          {/* ── Badges ── */}
          <BadgeStrip badges={data.profile.insights.badges} />

          {hasTopResearchedTechs && (
            <Panel variant="elevated" className={classes.sectionCard}>
              <div className={classes.sectionHeader}>
                <Group gap={6}>
                  <IconCrosshair size={16} color="var(--mantine-color-blue-4)" />
                  <Caption size="sm">Top Researched Techs</Caption>
                </Group>
                <Chip accent="blue" size="xs">
                  <Text size="10px" fw={700} c="white">
                    {data.profile.aggregates.eligibleGameCount} Eligible
                  </Text>
                </Chip>
              </div>
              <FadedDivider orientation="horizontal" />
              <div className={classes.techTopGrid}>
                {topResearchedTechs.map(([techId, stat]) => {
                  const tech = getTechData(techId);
                  const techName = tech?.name ?? techId;
                  const isUnit = tech?.types.includes("UNITUPGRADE");
                  const colorClass = techTypeColorClass(tech?.types[0]);
                  const unitImg = isUnit ? getUnitImageUrl(techId, tech?.baseUpgrade) : undefined;
                  return (
                    <div key={techId} className={cx(classes.techTopItem, colorClass)}>
                      <div className={classes.techTopHeader}>
                        {unitImg ? (
                          <img
                            src={unitImg}
                            alt={techName}
                            className={classes.techUnitIcon}
                          />
                        ) : (
                          <span className={classes.techTypePip} />
                        )}
                        <span className={classes.techName} title={techName}>
                          {techName}
                        </span>
                      </div>
                      <div className={classes.techTopMeta}>
                        <span className={classes.techGames}>
                          {stat.gamesWithTech} game{stat.gamesWithTech === 1 ? "" : "s"}
                        </span>
                        <span className={classes.techPercent}>
                          {stat.percentInEligibleGames.toFixed(1)}%
                        </span>
                      </div>
                      <div className={classes.techBar}>
                        <div
                          className={classes.techBarFill}
                          style={{ width: `${Math.min(100, stat.percentInEligibleGames)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          )}

          {/* ── Aggregates: Charts & Tables ── */}
          {agg.ready && (
            <>
              <div className={classes.deckHeader}>
                <Title order={4} c="gray.2" style={{ fontFamily: "Slider, serif", letterSpacing: "0.02em" }}>
                  ANALYTICS
                </Title>
                <div>
                  <Text c="gray.6" size="xs">
                    Across {agg.completedGameCount} completed games
                  </Text>
                  <Text c="gray.7" size="10px" mt={2}>
                    Some analytics are only available for newer games where detailed round data was collected and may be incomplete.
                  </Text>
                </div>
              </div>

              <div className={classes.aggregateGrid}>
                {/* Combat pair */}
                {agg.combatProfile && (
                  <CombatProfileSection profile={agg.combatProfile} />
                )}
                {agg.aggressionProfile && (
                  <AggressionChart profile={latestAggression(agg.aggressionProfile, data.games)} />
                )}

                {/* Strategy + meta */}
                {agg.strategyCardStats && (
                  <StrategyCardChart stats={agg.strategyCardStats} />
                )}
                {data.profile.insights.favoredFactions.length > 0 && (
                  <FavoredFactionsSection factions={data.profile.insights.favoredFactions} />
                )}

                {/* Meta-game pair */}
                {(agg.speakerImpact || agg.economyProfile) && (
                  <SpeakerEconomySection
                    impact={agg.speakerImpact}
                    economy={agg.economyProfile}
                  />
                )}
                <TitlesCard titles={data.profile.titles} />

                {/* Full-width synergy */}
                {agg.factionTechSynergy && (
                  <FactionTechSynergySection synergy={agg.factionTechSynergy} />
                )}
              </div>
            </>
          )}

          {/* ── Game Deck ── */}
          <div className={classes.deckHeader}>
            <Title order={4} c="gray.2" style={{ fontFamily: "Slider, serif", letterSpacing: "0.02em" }}>
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
              data={[
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Done", value: "finished" },
                { label: "Abn", value: "abandoned" },
              ]}
            />
            <Text c="gray.5" size="xs">
              {filteredGames.length} game{filteredGames.length === 1 ? "" : "s"}
            </Text>
          </div>

          <Stack gap="sm">
            {paginatedGames.map((game) => (
              <GameCard key={game.gameId} game={game} onOpen={() => navigate(`/game/${game.gameId}`)} />
            ))}
          </Stack>

          {filteredGames.length === 0 && (
            <Panel variant="subtle" className={classes.emptyState}>
              <Text c="gray.5" size="sm">
                No games in this filter.
              </Text>
            </Panel>
          )}

          {totalPages > 1 && (
            <div className={classes.pagination}>
              <Button
                size="compact-xs"
                variant="subtle"
                color="gray"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
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
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              >
                Next
              </Button>
            </div>
          )}

        </Box>
      </AppShell.Main>
    </AppShell>
  );
}

/* ─── Titles Card (lives in analytics grid) ─── */

function TitlesCard({ titles }: { titles: TitleSummary }) {
  return (
    <Panel variant="elevated" className={classes.sectionCard}>
      <div className={classes.sectionHeader}>
        <Group gap={6}>
          <IconTrophy size={16} color="var(--mantine-color-yellow-5)" />
          <Caption size="sm">Titles</Caption>
        </Group>
        <Chip accent="yellow" size="xs">
          <Text size="10px" fw={700} c="white">
            {titles.totalCount}
          </Text>
        </Chip>
      </div>
      <FadedDivider orientation="horizontal" />
      <ScrollArea h={200} scrollbarSize={4}>
        <Stack gap={8}>
          {titles.items.length === 0 ? (
            <Text c="gray.6" size="xs">
              No titles earned yet.
            </Text>
          ) : (
            titles.items.map((titleItem) => (
              <div key={titleItem.title} className={classes.titleItem}>
                <Group justify="space-between" gap="xs">
                  <Text fw={600} size="sm" c="gray.2">
                    {titleItem.title}
                  </Text>
                  <Text size="xs" ff="mono" c="yellow.4" fw={700}>
                    x{titleItem.count}
                  </Text>
                </Group>
                <Text c="gray.6" size="10px" truncate>
                  {titleItem.gameIds.join(" · ")}
                </Text>
              </div>
            ))
          )}
        </Stack>
      </ScrollArea>
    </Panel>
  );
}

/* ─── Game Card ─── */

type GameCardProps = {
  game: DashboardGame;
  onOpen: () => void;
};

function GameCard({ game, onOpen }: GameCardProps) {
  const packs = activePacks(game.packs);
  const isWinner = game.yourSeat.isWinner;
  const seat = game.yourSeat;

  return (
    <Panel
      variant="elevated"
      className={cx(classes.gameCard, isWinner && classes.winnerCard)}
    >
      <div className={accentClass(game.status)} style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, borderRadius: "0 2px 2px 0" }} />

      <div className={classes.gameCardInner}>
        <Stack gap={4}>
          <Group gap={6} wrap="wrap">
            <Chip accent={statusAccent(game.status)} size="xs">
              <Text size="10px" fw={700} c="white">
                {game.status}
              </Text>
            </Chip>
            {game.isTiglGame && (
              <Chip accent="purple" size="xs">
                <Text size="10px" fw={700} c="white">
                  TIGL
                </Text>
              </Chip>
            )}
            {isWinner && (
              <Chip accent="yellow" size="xs" leftSection={<IconTrophy size={11} />}>
                <Text size="10px" fw={700} c="white">
                  WIN
                </Text>
              </Chip>
            )}
          </Group>
          <Title order={5} className={classes.gameTitle} c="gray.1">
            {game.title}
          </Title>
          <Text c="gray.5" size="xs">
            {game.gameId} &middot; VP {game.vpTarget} &middot; Round {game.round}
          </Text>
        </Stack>

        <div className={classes.gameActions}>
          <Button size="compact-xs" variant="light" color="gray" onClick={onOpen}>
            Open
          </Button>
          {game.actionsJumpUrl && (
            <Button
              component="a"
              href={game.actionsJumpUrl}
              target="_blank"
              rel="noreferrer"
              size="compact-xs"
              variant="subtle"
              color="gray"
              rightSection={<IconExternalLink size={12} />}
            >
              Actions
            </Button>
          )}
        </div>
      </div>

      <FadedDivider orientation="horizontal" />

      <div className={classes.gameDetails}>
        {/* Your Seat */}
        <div className={classes.detailSection}>
          <Caption size="xs">Your Seat</Caption>
          <Group gap={6} wrap="nowrap">
            {seat.faction && <CircularFactionIcon faction={seat.faction} size={18} />}
            <Text size="sm" c="gray.2" fw={600}>
              {seat.faction ?? "Unknown"} &middot; {seat.color ?? "—"}
            </Text>
          </Group>
          <Group gap={8}>
            <StatDisplay value={seat.score} label="VP" size="xs" />
            <FadedDivider />
            <StatDisplay value={formatRatio(seat.diceLuck.ratio)} label="DICE" size="xs" />
          </Group>
          {seat.isActivePlayer && (
            <span className={classes.activeTurn}>
              <span className={classes.activeTurnDot} />
              <Text size="10px" c="green.4" fw={600}>
                YOUR TURN
              </Text>
            </span>
          )}
        </div>

        {/* Table */}
        <div className={classes.detailSection}>
          <Caption size="xs">Table</Caption>
          <Stack gap={4}>
            {game.participants.map((p) => (
              <Group key={p.userId} gap={6} wrap="nowrap">
                {p.faction && <CircularFactionIcon faction={p.faction} size={16} />}
                <Text size="xs" c="gray.3">
                  {p.userName}
                </Text>
                {p.isWinner && (
                  <IconTrophy size={11} color="var(--mantine-color-yellow-5)" />
                )}
              </Group>
            ))}
          </Stack>
        </div>

        {/* Meta */}
        <div className={classes.detailSection}>
          <Caption size="xs">Packs &amp; Events</Caption>
          <div className={classes.packRow}>
            {packs.map((p) => (
              <Chip key={p.key} accent="cyan" size="xs">
                <Text size="10px" fw={700} c="white">
                  {p.label}
                </Text>
              </Chip>
            ))}
          </div>
          {game.galacticEvents.inEffect.length > 0 && (
            <Text size="10px" c="gray.5">
              Events: {game.galacticEvents.inEffect.map((e) => e.name).join(", ")}
            </Text>
          )}
          <Text size="10px" c="gray.6">
            Created {formatDate(game.createdAtEpochMs)} &middot; Updated {formatDate(game.lastUpdatedEpochMs)}
          </Text>
        </div>
      </div>
    </Panel>
  );
}
