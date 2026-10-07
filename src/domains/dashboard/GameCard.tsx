import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconExternalLink, IconTrophy } from "@tabler/icons-react";
import cx from "clsx";
import type { DashboardGame, GamePacks } from "./types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon/CircularFactionIcon";
import { Panel } from "@/shared/ui/primitives/Panel";
import { StatDisplay } from "@/shared/ui/primitives/StatDisplay";
import Caption from "@/shared/ui/Caption/Caption";
import FadedDivider from "@/shared/ui/primitives/FadedDivider/FadedDivider";
import { LabelChip } from "./DashboardParts";
import { formatDate, formatRatio } from "./dashboardFormat";
import classes from "./DashboardPage.module.css";

const STATUS_STYLES = {
  ACTIVE: { accent: "green", className: classes.accentActive },
  ABANDONED: { accent: "red", className: classes.accentAbandoned },
  FINISHED: { accent: "gray", className: classes.accentFinished },
} as const;

const PACK_ENTRIES: { key: keyof GamePacks; label: string }[] = [
  { key: "prophecyOfKings", label: "PoK" },
  { key: "discordantStars", label: "DS" },
  { key: "thundersEdge", label: "TE" },
  { key: "twilightsFall", label: "TF" },
  { key: "absol", label: "Absol" },
  { key: "miltyMod", label: "Milty" },
  { key: "franken", label: "Franken" },
  { key: "votc", label: "VotC" },
];

function statusStyle(status: DashboardGame["status"]) {
  if (status === "ACTIVE" || status === "ABANDONED")
    return STATUS_STYLES[status];
  return STATUS_STYLES.FINISHED;
}

function GameCardHeader({
  game,
  onOpen,
}: {
  game: DashboardGame;
  onOpen: () => void;
}) {
  return (
    <div className={classes.gameCardInner}>
      <Stack gap={4}>
        <Group gap={6} wrap="wrap">
          <LabelChip accent={statusStyle(game.status).accent}>
            {game.status}
          </LabelChip>
          {game.isTiglGame && <LabelChip accent="purple">TIGL</LabelChip>}
          {game.yourSeat.isWinner && (
            <LabelChip accent="yellow" leftSection={<IconTrophy size={11} />}>
              WIN
            </LabelChip>
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
  );
}

function SeatSection({ seat }: { seat: DashboardGame["yourSeat"] }) {
  return (
    <div className={classes.detailSection}>
      <Caption size="xs">Your Seat</Caption>
      <Group gap={6} wrap="nowrap">
        {seat.faction && (
          <CircularFactionIcon faction={seat.faction} size={18} />
        )}
        <Text size="sm" c="gray.2" fw={600}>
          {seat.faction ?? "Unknown"} &middot; {seat.color ?? "—"}
        </Text>
      </Group>
      <Group gap={8}>
        <StatDisplay value={seat.score} label="VP" size="xs" />
        <FadedDivider />
        <StatDisplay
          value={formatRatio(seat.diceLuck.ratio)}
          label="DICE"
          size="xs"
        />
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
  );
}

function TableSection({
  participants,
}: {
  participants: DashboardGame["participants"];
}) {
  return (
    <div className={classes.detailSection}>
      <Caption size="xs">Table</Caption>
      <Stack gap={4}>
        {participants.map((p) => (
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
  );
}

function PacksSection({ game }: { game: DashboardGame }) {
  const events = game.galacticEvents.inEffect;
  return (
    <div className={classes.detailSection}>
      <Caption size="xs">Packs &amp; Events</Caption>
      <div className={classes.packRow}>
        {PACK_ENTRIES.filter((p) => game.packs[p.key]).map((p) => (
          <LabelChip key={p.key} accent="cyan">
            {p.label}
          </LabelChip>
        ))}
      </div>
      {events.length > 0 && (
        <Text size="10px" c="gray.5">
          Events: {events.map((e) => e.name).join(", ")}
        </Text>
      )}
      <Text size="10px" c="gray.6">
        Created {formatDate(game.createdAtEpochMs)} &middot; Updated{" "}
        {formatDate(game.lastUpdatedEpochMs)}
      </Text>
    </div>
  );
}

export function GameCard({
  game,
  onOpen,
}: {
  game: DashboardGame;
  onOpen: () => void;
}) {
  return (
    <Panel
      variant="elevated"
      className={cx(
        classes.gameCard,
        game.yourSeat.isWinner && classes.winnerCard,
      )}
    >
      <div
        className={cx(
          classes.gameCardAccent,
          statusStyle(game.status).className,
        )}
      />
      <GameCardHeader game={game} onOpen={onOpen} />
      <FadedDivider orientation="horizontal" />
      <div className={classes.gameDetails}>
        <SeatSection seat={game.yourSeat} />
        <TableSection participants={game.participants} />
        <PacksSection game={game} />
      </div>
    </Panel>
  );
}
