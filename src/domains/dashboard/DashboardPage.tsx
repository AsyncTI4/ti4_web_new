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
import type { DashboardGame, GamePacks } from "@/domains/dashboard/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon/CircularFactionIcon";
import { Surface } from "@/domains/player/components/Surface";
import { Panel } from "@/shared/ui/primitives/Panel";
import { Chip } from "@/shared/ui/primitives/Chip";
import { StatDisplay } from "@/shared/ui/primitives/StatDisplay";
import Caption from "@/shared/ui/Caption/Caption";
import FadedDivider from "@/shared/ui/primitives/FadedDivider/FadedDivider";
import { BadgeStrip } from "./BadgeStrip";

import classes from "./DashboardPage.module.css";

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

function diceBarPercent(ratio: number | null) {
  if (ratio == null) return 0;
  return Math.max(2, Math.min(100, ratio * 50));
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
  const diceRatio = data.profile.diceLuck.ratio;
  const diceGood = diceRatio != null && diceRatio >= 1;

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
              <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
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
                    <Chip accent={diceGood ? "teal" : "red"} size="sm" leftSection={<IconDice5 size={13} />}>
                      <Text size="xs" fw={700} c="white">
                        Dice {formatRatio(diceRatio)}
                      </Text>
                    </Chip>
                    <Chip accent="yellow" size="sm" leftSection={<IconTrophy size={13} />}>
                      <Text size="xs" fw={700} c="white">
                        {data.summary.wins}W / {data.summary.gamesPlayed}G
                      </Text>
                    </Chip>
                  </div>
                </Stack>

                <Stack gap={4} maw={320} miw={200} style={{ flex: "0 1 320px" }}>
                  <Group justify="space-between">
                    <Text size="xs" c="gray.5">
                      Actual {data.profile.diceLuck.actualHits.toFixed(0)}
                    </Text>
                    <Text size="xs" c="gray.5">
                      Expected {data.profile.diceLuck.expectedHits.toFixed(0)}
                    </Text>
                  </Group>
                  <div className={classes.diceBar}>
                    <div
                      className={cx(classes.diceFill, diceGood ? classes.diceFillGood : classes.diceFillBad)}
                      style={{ width: `${diceBarPercent(diceRatio)}%` }}
                    />
                  </div>
                  <Text size="10px" c="gray.6" ta="center">
                    1.00x = expected &middot; above = lucky
                  </Text>
                </Stack>
              </Group>
            </div>
          </Surface>

          {/* ── KPI Strip ── */}
          <div className={classes.kpiGrid}>
            <Panel variant="standard" className={classes.kpiCard}>
              <Caption size="xs">Played</Caption>
              <span className={classes.kpiValue}>{data.summary.gamesPlayed}</span>
            </Panel>
            <Panel variant="standard" className={classes.kpiCard}>
              <Caption size="xs">Active</Caption>
              <span className={classes.kpiValue}>{data.summary.activeGames}</span>
            </Panel>
            <Panel variant="standard" className={classes.kpiCard}>
              <Caption size="xs">Finished</Caption>
              <span className={classes.kpiValue}>{data.summary.finishedGames}</span>
            </Panel>
            <Panel variant="standard" className={classes.kpiCard}>
              <Caption size="xs">Abandoned</Caption>
              <span className={classes.kpiValue}>{data.summary.abandonedGames}</span>
            </Panel>
            <Panel variant="standard" className={classes.kpiCard}>
              <Caption size="xs">Wins</Caption>
              <span className={classes.kpiValue}>{data.summary.wins}</span>
            </Panel>
            <Panel variant="standard" className={classes.kpiCard}>
              <Caption size="xs">Win %</Caption>
              <span className={classes.kpiValue}>{formatPercent(data.summary.winPercent)}</span>
            </Panel>
          </div>

          {/* ── Badges ── */}
          <BadgeStrip badges={data.profile.insights.badges} />

          {/* ── Middle: Titles / Game Index / Combat Form ── */}
          <div className={classes.middleGrid}>
            {/* Titles */}
            <Panel variant="elevated" className={classes.sectionCard}>
              <div className={classes.sectionHeader}>
                <Group gap={6}>
                  <IconTrophy size={16} color="var(--mantine-color-yellow-5)" />
                  <Caption size="sm">Titles</Caption>
                </Group>
                <Chip accent="yellow" size="xs">
                  <Text size="10px" fw={700} c="white">
                    {data.profile.titles.totalCount}
                  </Text>
                </Chip>
              </div>
              <FadedDivider orientation="horizontal" />
              <ScrollArea h={200} scrollbarSize={4}>
                <Stack gap={8}>
                  {data.profile.titles.items.length === 0 ? (
                    <Text c="gray.6" size="xs">
                      No titles earned yet.
                    </Text>
                  ) : (
                    data.profile.titles.items.map((titleItem) => (
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

            {/* Game Index */}
            <Panel variant="elevated" className={classes.sectionCard}>
              <div className={classes.sectionHeader}>
                <Group gap={6}>
                  <IconCrosshair size={16} color="var(--mantine-color-gray-4)" />
                  <Caption size="sm">Game Index</Caption>
                </Group>
              </div>
              <SegmentedControl
                fullWidth
                size="xs"
                value={filter}
                onChange={(v) => setFilter(v as StatusFilter)}
                className={classes.filterControl}
                data={[
                  { label: "All", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Done", value: "finished" },
                  { label: "Abn", value: "abandoned" },
                ]}
              />
              <Text c="gray.5" size="xs">
                {filteredGames.length} of {data.games.length} games
              </Text>
              <ScrollArea h={160} scrollbarSize={4}>
                <div>
                  {filteredGames.slice(0, 10).map((game) => (
                    <div key={game.gameId} className={classes.indexItem}>
                      <Text
                        size="xs"
                        c="gray.3"
                        truncate
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/game/${game.gameId}`)}
                      >
                        {game.gameId}
                      </Text>
                      <Chip accent={statusAccent(game.status)} size="xs">
                        <Text size="10px" fw={700} c="white">
                          {game.status}
                        </Text>
                      </Chip>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Panel>

            {/* Combat Form */}
            <Panel variant="elevated" className={classes.sectionCard}>
              <div className={classes.sectionHeader}>
                <Group gap={6}>
                  <IconDice5 size={16} color="var(--mantine-color-teal-5)" />
                  <Caption size="sm">Combat Form</Caption>
                </Group>
              </div>
              <FadedDivider orientation="horizontal" />
              <Stack gap={8}>
                <Group justify="space-between">
                  <Text size="xs" c="gray.5">
                    Dice Ratio
                  </Text>
                  <StatDisplay value={formatRatio(diceRatio)} size="sm" color={diceGood ? "teal.4" : "red.4"} />
                </Group>
                <Group justify="space-between">
                  <Text size="xs" c="gray.5">
                    Actual Hits
                  </Text>
                  <StatDisplay value={data.profile.diceLuck.actualHits.toFixed(0)} size="sm" />
                </Group>
                <Group justify="space-between">
                  <Text size="xs" c="gray.5">
                    Expected Hits
                  </Text>
                  <StatDisplay value={data.profile.diceLuck.expectedHits.toFixed(0)} size="sm" />
                </Group>
                <FadedDivider orientation="horizontal" />
                <Text size="10px" c="gray.6" lh={1.3}>
                  Aggregate dice performance across all tracked games. 1.00x = exactly expected. Above 1.00x is above
                  expectation.
                </Text>
              </Stack>
            </Panel>
          </div>

          {/* ── Game Deck ── */}
          <div className={classes.deckHeader}>
            <Title order={4} c="gray.2" style={{ fontFamily: "Slider, serif", letterSpacing: "0.02em" }}>
              GAME DECK
            </Title>
            <Text c="gray.6" size="xs">
              Ordered by latest activity
            </Text>
          </div>

          <Stack gap="sm">
            {filteredGames.map((game) => (
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

        </Box>
      </AppShell.Main>
    </AppShell>
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
