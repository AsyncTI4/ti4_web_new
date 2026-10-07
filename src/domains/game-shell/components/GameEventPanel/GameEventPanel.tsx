import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader, Text, Tooltip } from "@mantine/core";
import {
  IconArrowsLeftRight,
  IconMap2,
  IconPlayerPlayFilled,
  IconTrophy,
} from "@tabler/icons-react";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { useGameEvents } from "@/api/useGameEvents";
import { useMapStatePreview } from "@/state/useGameContext";
import { usePlayerData } from "@/api/usePlayerData";
import type { GameEvent, PlayerDataResponse } from "@/entities/data/types";
import {
  formatAbsoluteTime,
  formatRelativeTime,
  prettifyId,
  resolveSystemName,
} from "./eventFormatting";
import { num, str, stringArray, type SystemNameResolver } from "./eventPayload";
import { EventBody } from "./EventBody";
import {
  buildMapTimeline,
  groupByRound,
  type MapPreviewFrame,
} from "./mapTimeline";
import cx from "clsx";
import classes from "./GameEventPanel.module.css";

const MAX_VISIBLE = 150;
const selectTilePositions = (data: PlayerDataResponse) => data.tilePositions;

function ActorIcon({ faction }: { faction: string | null }) {
  if (!faction) return <span className={classes.glyph}>·</span>;
  return (
    <Tooltip label={prettifyId(faction)} withArrow openDelay={300}>
      <span className={classes.actorIcon}>
        <CircularFactionIcon faction={faction} size={20} />
      </span>
    </Tooltip>
  );
}

function EventRow({
  event,
  now,
  systemName,
}: {
  event: GameEvent;
  now: number;
  systemName: SystemNameResolver;
}) {
  const isTransaction = event.archetype === "TRANSACTION";
  return (
    <div
      className={cx(
        classes.row,
        event.archetype === "TURN" && classes.passed,
        isTransaction && classes.transactionRow,
      )}
    >
      <div className={classes.iconCell}>
        {isTransaction ? (
          <span className={classes.transactionEventIcon}>
            <IconArrowsLeftRight size={16} stroke={2} />
          </span>
        ) : (
          <ActorIcon faction={event.faction} />
        )}
      </div>
      <div className={classes.content}>
        <EventBody event={event} systemName={systemName} />
      </div>
      <Tooltip
        label={formatAbsoluteTime(event.timestamp)}
        withArrow
        openDelay={300}
      >
        <span className={classes.time}>
          {formatRelativeTime(event.timestamp, now)}
        </span>
      </Tooltip>
    </div>
  );
}

function isSectionDivider(event: GameEvent): boolean {
  return (
    event.archetype === "PHASE_STARTED" || event.archetype === "ROUND_STARTED"
  );
}

/**
 * PHASE_STARTED / ROUND_STARTED render as minimal in-scroll dividers; the
 * sticky round headers already announce each round group.
 */
function sectionDividerLabel(event: GameEvent): string | null {
  if (event.archetype === "PHASE_STARTED") {
    const phase = str(event.payload ?? {}, "phase");
    return phase ? `${prettifyId(phase)} Phase` : null;
  }
  const round = num(event.payload ?? {}, "round");
  return round !== undefined ? `Round ${round}` : null;
}

function SectionDividerRow({ label }: { label: string }) {
  return (
    <div className={classes.sectionDivider}>
      <span className={classes.sectionDividerLabel}>{label}</span>
      <span className={classes.sectionDividerRule} />
    </div>
  );
}

function GameEndedRow({ event }: { event: GameEvent }) {
  const winners = stringArray(event.payload ?? {}, "winner");
  const verb = winners.length > 1 ? "win" : "wins";
  return (
    <div className={classes.gameEnded}>
      <span className={classes.trophy}>
        <IconTrophy size={20} stroke={2} />
      </span>
      <div className={classes.gameEndedWinners}>
        {winners.map((w) => (
          <CircularFactionIcon key={w} faction={w} size={22} />
        ))}
        <span className={classes.gameEndedText}>
          {winners.length > 0
            ? `${winners.map(prettifyId).join(" & ")} ${verb}!`
            : "Game ended"}
        </span>
      </div>
    </div>
  );
}

function TimelineRow({
  event,
  now,
  systemName,
}: {
  event: GameEvent;
  now: number;
  systemName: SystemNameResolver;
}) {
  if (event.archetype === "GAME_ENDED") return <GameEndedRow event={event} />;
  if (!isSectionDivider(event)) {
    return <EventRow event={event} now={now} systemName={systemName} />;
  }
  const label = sectionDividerLabel(event);
  return label ? <SectionDividerRow label={label} /> : null;
}

function MapChangeIndicator({ animated }: { animated: boolean }) {
  return (
    <span
      className={classes.mapChangeIndicator}
      title={
        animated
          ? "Hover to replay this map change"
          : "Hover to show the map after this event"
      }
      aria-label={animated ? "Animated map replay" : "Map state change"}
    >
      {animated ? (
        <IconPlayerPlayFilled size={9} />
      ) : (
        <IconMap2 size={10} stroke={2} />
      )}
    </span>
  );
}

function isRenderedRow(event: GameEvent): boolean {
  return !isSectionDivider(event) || sectionDividerLabel(event) !== null;
}

export function GameEventPanel({ animated = true }: { animated?: boolean }) {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid ?? "";
  const { data: tilePositions } = usePlayerData(gameId, {
    select: selectTilePositions,
  });
  const setMapStatePreview = useMapStatePreview();
  const { data, isLoading, isError } = useGameEvents(gameId);
  const [showAll, setShowAll] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const activePreviewRef = useRef<
    { snapshotSeq: number; replayEventSeq: number | null } | undefined
  >(undefined);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    activePreviewRef.current = undefined;
    setMapStatePreview(null);
    return () => {
      activePreviewRef.current = undefined;
      setMapStatePreview(null);
    };
  }, [gameId, animated, setMapStatePreview]);

  const showMapPreview = (eventSeq: number, frame: MapPreviewFrame) => {
    const replayEventSeq = animated && frame.replaysChange ? eventSeq : null;
    const active = activePreviewRef.current;
    activePreviewRef.current = {
      snapshotSeq: frame.snapshotSeq,
      replayEventSeq,
    };
    if (
      active?.snapshotSeq === frame.snapshotSeq &&
      (replayEventSeq === null || active.replayEventSeq === replayEventSeq)
    ) {
      return;
    }
    setMapStatePreview(
      replayEventSeq === null
        ? { mapState: frame.preview.mapState }
        : frame.preview,
    );
  };

  const clearMapPreview = () => {
    activePreviewRef.current = undefined;
    setMapStatePreview(null);
  };

  const keptEvents = (data ?? []).filter(
    (e) => e.archetype !== "TURN" || e.payload?.passed === true,
  );
  const visibleEvents = showAll ? keptEvents : keptEvents.slice(-MAX_VISIBLE);
  const hasHidden = !showAll && keptEvents.length > MAX_VISIBLE;
  const timeline = buildMapTimeline(data ?? []);
  const grouped = groupByRound(visibleEvents);

  const positionToSystemId: Record<string, string> = {};
  for (const entry of tilePositions ?? []) {
    const [position, systemId] = entry.split(":");
    if (position && systemId) positionToSystemId[position] = systemId;
  }
  const systemName: SystemNameResolver = (position) =>
    resolveSystemName(position, positionToSystemId);

  if (isLoading) {
    return (
      <div className={cx(classes.stateBox, classes.stateBoxLoading)}>
        <Loader size="xs" color="gray" />
        <Text size="sm" c="dimmed">
          Loading events…
        </Text>
      </div>
    );
  }

  if (isError) {
    return (
      <Text className={classes.stateBox} size="sm" c="dimmed">
        Couldn't load the event log. It may not be available for this game yet.
      </Text>
    );
  }

  if (grouped.length === 0) {
    return (
      <Text className={classes.stateBox} size="sm" c="dimmed">
        No events recorded yet — events start appearing as the game is played.
      </Text>
    );
  }

  return (
    <div className={classes.root} onMouseLeave={clearMapPreview}>
      {grouped.map(({ round, events }) => (
        <div key={round}>
          <div className={classes.roundHeader}>
            <span className={classes.roundLabel}>Round {round}</span>
            <span className={classes.roundRule} />
          </div>
          {events.filter(isRenderedRow).map((event) => {
            const frame = timeline.previews.get(event.seq);
            const changesMap = timeline.changedEvents.has(event.seq);
            return (
              <div
                key={event.seq}
                className={changesMap ? classes.mapChangeEvent : undefined}
                onMouseEnter={() => {
                  if (frame) showMapPreview(event.seq, frame);
                }}
              >
                {changesMap && <MapChangeIndicator animated={animated} />}
                <TimelineRow event={event} now={now} systemName={systemName} />
              </div>
            );
          })}
        </div>
      ))}
      {hasHidden && (
        <button
          type="button"
          className={classes.showEarlier}
          onClick={() => setShowAll(true)}
        >
          Show earlier events
        </button>
      )}
    </div>
  );
}
