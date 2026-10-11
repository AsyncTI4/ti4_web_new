import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useParams } from "react-router-dom";
import { Loader, Text, Tooltip } from "@/ds";
import {
  IconMap2,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconTrophy,
} from "@tabler/icons-react";
import cx from "clsx";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { useGameEvents } from "@/api/useGameEvents";
import { useGameData, useMapStatePreview } from "@/state/useGameContext";
import { usePlayerData } from "@/api/usePlayerData";
import type { GameEvent, PlayerDataResponse } from "@/entities/data/types";
import { getPlayerDisplayName } from "../gameStatePlayers";
import {
  formatAbsoluteTime,
  formatRelativeTime,
  prettifyId,
  resolveSystemName,
} from "./eventFormatting";
import { str, stringArray, type SystemNameResolver } from "./eventPayload";
import { EventBody, type PlayerNameResolver } from "./EventBody";
import {
  EVENT_FILTERS,
  eventKind,
  matchesFilter,
  type EventFilter,
} from "./eventKinds";
import { countSince, lastOwnEventSeq, useMyFaction } from "./sinceLastTurn";
import {
  buildMapTimeline,
  groupByRound,
  type MapPreviewFrame,
} from "./mapTimeline";
import classes from "./GameEventPanel.module.css";

const MAX_VISIBLE = 150;
const MAX_TICKS = 160;
const PLAY_BEAT_MS = 900;
const selectTilePositions = (data: PlayerDataResponse) => data.tilePositions;

type Timeline = ReturnType<typeof buildMapTimeline>;

function isSectionDivider(event: GameEvent): boolean {
  return (
    event.archetype === "PHASE_STARTED" || event.archetype === "ROUND_STARTED"
  );
}

function phaseDividerLabel(event: GameEvent): string | null {
  if (event.archetype !== "PHASE_STARTED") return null;
  const phase = str(event.payload ?? {}, "phase");
  return phase ? `${prettifyId(phase)} phase` : null;
}

/** "statusScoring", "status.scoring" and "STATUS_SCORING" all read "Status scoring". */
function phaseName(phase: string): string {
  const words = phase
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[._-]+/g, " ")
    .trim()
    .toLowerCase();
  return words ? words[0].toUpperCase() + words.slice(1) : "";
}

function toneStyle(tone: string): CSSProperties {
  return { "--ek": tone } as CSSProperties;
}

function ActorMark({ event }: { event: GameEvent }) {
  const kind = eventKind(event);
  const Glyph = kind.Glyph;
  const faction =
    event.archetype === "TRANSACTION"
      ? (str(event.payload ?? {}, "from") ?? event.faction)
      : event.faction;
  return (
    <span className={classes.mark}>
      {faction ? (
        <Tooltip label={prettifyId(faction)} withArrow openDelay={300}>
          <span className={classes.faction}>
            <CircularFactionIcon faction={faction} size={24} />
          </span>
        </Tooltip>
      ) : (
        <span className={classes.factionEmpty} />
      )}
      <span className={classes.glyph} style={toneStyle(kind.tone)}>
        <Glyph size={9} stroke={2.4} />
      </span>
    </span>
  );
}

function EventRow({
  event,
  now,
  isNew,
  isFuture,
  changesMap,
  animated,
  systemName,
  playerName,
  onPreview,
}: {
  event: GameEvent;
  now: number;
  isNew: boolean;
  isFuture: boolean;
  changesMap: boolean;
  animated: boolean;
  systemName: SystemNameResolver;
  playerName: PlayerNameResolver;
  onPreview: () => void;
}) {
  return (
    <div
      className={cx(classes.row, event.archetype === "TURN" && classes.quiet)}
      data-new={isNew || undefined}
      data-future={isFuture || undefined}
      onMouseEnter={onPreview}
    >
      <ActorMark event={event} />
      <EventBody
        event={event}
        systemName={systemName}
        playerName={playerName}
      />
      <span className={classes.meta}>
        <Tooltip
          label={formatAbsoluteTime(event.timestamp)}
          withArrow
          openDelay={300}
        >
          <time className={classes.time}>
            {formatRelativeTime(event.timestamp, now)}
          </time>
        </Tooltip>
        {changesMap && <MapChangeIndicator animated={animated} />}
      </span>
    </div>
  );
}

function MapChangeIndicator({ animated }: { animated: boolean }) {
  return (
    <span
      className={classes.mapChange}
      title={
        animated
          ? "Hover to replay this map change"
          : "Hover to show the map after this event"
      }
      aria-label={animated ? "Animated map replay" : "Map state change"}
    >
      {animated ? <IconPlayerPlayFilled size={8} /> : <IconMap2 size={9} />}
    </span>
  );
}

function GameEndedRow({
  event,
  playerName,
}: {
  event: GameEvent;
  playerName: PlayerNameResolver;
}) {
  const winners = stringArray(event.payload ?? {}, "winner");
  const verb = winners.length > 1 ? "win" : "wins";
  return (
    <div className={classes.gameEnded}>
      <span className={classes.trophy}>
        <IconTrophy size={16} stroke={2} />
      </span>
      {winners.map((w) => (
        <CircularFactionIcon key={w} faction={w} size={22} />
      ))}
      <span className={classes.gameEndedText}>
        {winners.length > 0
          ? `${winners.map(playerName).join(" & ")} ${verb}`
          : "Game ended"}
      </span>
    </div>
  );
}

function FilterChips({
  filter,
  counts,
  onChange,
}: {
  filter: EventFilter;
  counts: Record<EventFilter, number>;
  onChange: (filter: EventFilter) => void;
}) {
  return (
    <div className={classes.filters} role="toolbar" aria-label="Filter events">
      {EVENT_FILTERS.map((f) => (
        <button
          key={f.key}
          type="button"
          className={classes.chip}
          aria-pressed={filter === f.key}
          style={f.tone ? toneStyle(f.tone) : undefined}
          onClick={() => onChange(f.key)}
        >
          {f.tone && <i aria-hidden="true" />}
          {f.label}
          <b>{counts[f.key]}</b>
        </button>
      ))}
    </div>
  );
}

type Frame = { event: GameEvent; frame: MapPreviewFrame };

function sampledTicks(frames: Frame[]): { frame: Frame; index: number }[] {
  const step = Math.max(1, Math.ceil(frames.length / MAX_TICKS));
  const ticks: { frame: Frame; index: number }[] = [];
  for (let i = 0; i < frames.length; i += step) {
    ticks.push({ frame: frames[i], index: i });
  }
  return ticks;
}

/** Round labels above the track, skipping any that would crowd the last. */
function roundMarks(frames: Frame[]): { round: number; index: number }[] {
  const marks: { round: number; index: number }[] = [];
  const minGap = frames.length * 0.08;
  frames.forEach((f, index) => {
    const last = marks.at(-1);
    if (last?.round === f.event.round) return;
    if (last && index - last.index < minGap) {
      marks[marks.length - 1] = { round: f.event.round, index };
      return;
    }
    marks.push({ round: f.event.round, index });
  });
  return marks.slice(-6);
}

/**
 * Replays the board through the log. Each tick is an event in its filter
 * colour; dragging the knob previews the map at that moment, and play steps
 * through one event per beat. The far right is "now".
 */
function Scrubber({
  frames,
  position,
  playing,
  onScrub,
  onTogglePlay,
}: {
  frames: Frame[];
  position: number;
  playing: boolean;
  onScrub: (position: number) => void;
  onTogglePlay: () => void;
}) {
  const total = frames.length;
  const pct = (index: number) => (total === 0 ? 100 : (index / total) * 100);
  const current = position < total ? frames[position].event : null;
  const PlayGlyph = playing ? IconPlayerPauseFilled : IconPlayerPlayFilled;

  return (
    <div className={classes.scrub}>
      <button
        type="button"
        className={classes.play}
        aria-label={playing ? "Pause replay" : "Replay"}
        onClick={onTogglePlay}
        disabled={total === 0}
      >
        <PlayGlyph size={11} />
      </button>
      <div className={classes.track}>
        {sampledTicks(frames).map(({ frame, index }) => (
          <i
            key={frame.event.seq}
            style={{
              left: `${pct(index)}%`,
              ...toneStyle(eventKind(frame.event).tone),
            }}
          />
        ))}
        {roundMarks(frames).map((mark) => (
          <span
            key={mark.round}
            className={classes.roundMark}
            style={{ left: `${pct(mark.index)}%` }}
          >
            R{mark.round}
          </span>
        ))}
        <span className={classes.fill} style={{ width: `${pct(position)}%` }} />
        <span className={classes.knob} style={{ left: `${pct(position)}%` }} />
        <input
          type="range"
          className={classes.range}
          min={0}
          max={total}
          step={1}
          value={position}
          aria-label="Replay position"
          aria-valuetext={current ? `Round ${current.round}` : "Now"}
          onChange={(e) => onScrub(Number(e.currentTarget.value))}
        />
      </div>
      <span className={classes.when}>
        {current
          ? `R${current.round} · ${formatRelativeTime(current.timestamp, Date.now())}`
          : "now"}
      </span>
    </div>
  );
}

function filterCounts(events: GameEvent[]): Record<EventFilter, number> {
  const counts = Object.fromEntries(
    EVENT_FILTERS.map((f) => [f.key, 0]),
  ) as Record<EventFilter, number>;
  for (const e of events) {
    for (const f of EVENT_FILTERS) {
      if (matchesFilter(e, f.key)) counts[f.key] += 1;
    }
  }
  return counts;
}

function scrubFrames(events: GameEvent[], timeline: Timeline): Frame[] {
  return [...events]
    .sort((a, b) => a.seq - b.seq)
    .flatMap((event) => {
      const frame = timeline.previews.get(event.seq);
      return frame ? [{ event, frame }] : [];
    });
}

export function GameEventPanel({ animated = true }: { animated?: boolean }) {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid ?? "";
  const { data: tilePositions } = usePlayerData(gameId, {
    select: selectTilePositions,
  });
  const gameData = useGameData();
  const myFaction = useMyFaction();
  const setMapStatePreview = useMapStatePreview();
  const { data, isLoading, isError } = useGameEvents(gameId);
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<EventFilter>("all");
  const [scrubPosition, setScrubPosition] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const sinceRef = useRef<HTMLDivElement>(null);
  const scrolledToSince = useRef(false);
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

  const allEvents = data ?? [];
  const keptEvents = allEvents.filter(
    (e) => e.archetype !== "TURN" || e.payload?.passed === true,
  );
  const countable = keptEvents.filter((e) => !isSectionDivider(e));
  const counts = filterCounts(countable);
  const filtered = keptEvents.filter((e) =>
    isSectionDivider(e) ? filter === "all" : matchesFilter(e, filter),
  );
  const visibleEvents = showAll ? filtered : filtered.slice(-MAX_VISIBLE);
  const hasHidden = !showAll && filtered.length > MAX_VISIBLE;
  const timeline = buildMapTimeline(allEvents);
  const grouped = groupByRound(visibleEvents);
  const frames = scrubFrames(
    visibleEvents.filter((e) => !isSectionDivider(e)),
    timeline,
  );
  const lastSeq = lastOwnEventSeq(allEvents, myFaction);
  const newCount = countSince(countable, lastSeq);
  const position = Math.min(scrubPosition ?? frames.length, frames.length);
  const scrubSeq = position < frames.length ? frames[position].event.seq : null;

  const scrubTo = (next: number) => {
    const clamped = Math.max(0, Math.min(frames.length, next));
    if (clamped >= frames.length) {
      setScrubPosition(null);
      setPlaying(false);
      clearMapPreview();
      return;
    }
    setScrubPosition(clamped);
    const { event, frame } = frames[clamped];
    showMapPreview(event.seq, frame);
  };

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => scrubTo(position + 1), PLAY_BEAT_MS);
    return () => clearTimeout(id);
  });

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (position >= frames.length) scrubTo(0);
    setPlaying(true);
  };

  useEffect(() => {
    if (scrolledToSince.current || !sinceRef.current) return;
    scrolledToSince.current = true;
    sinceRef.current.scrollIntoView({ block: "center" });
  });

  const positionToSystemId: Record<string, string> = {};
  for (const entry of tilePositions ?? []) {
    const [pos, systemId] = entry.split(":");
    if (pos && systemId) positionToSystemId[pos] = systemId;
  }
  const systemName: SystemNameResolver = (pos) =>
    resolveSystemName(pos, positionToSystemId);
  const playerName: PlayerNameResolver = (faction) => {
    const player = gameData?.playerData?.find((p) => p.faction === faction);
    return getPlayerDisplayName(player, prettifyId(faction));
  };

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

  if (countable.length === 0) {
    return (
      <Text className={classes.stateBox} size="sm" c="dimmed">
        No events recorded yet — events start appearing as the game is played.
      </Text>
    );
  }

  let ruleShown = false;
  const sinceRuleBefore = (event: GameEvent, previous: GameEvent | null) => {
    if (ruleShown || lastSeq === null || newCount === 0) return false;
    if (event.seq > lastSeq) return false;
    if (previous !== null && previous.seq <= lastSeq) return false;
    if (previous === null && grouped[0]?.events[0] === event) return false;
    ruleShown = true;
    return true;
  };

  let previous: GameEvent | null = null;

  return (
    <div
      className={classes.root}
      onMouseLeave={scrubPosition === null ? clearMapPreview : undefined}
    >
      <FilterChips
        filter={filter}
        counts={counts}
        onChange={(next) => {
          setFilter(next);
          setPlaying(false);
          setScrubPosition(null);
          clearMapPreview();
        }}
      />
      <div className={classes.list}>
        {grouped.length === 0 && (
          <p className={classes.empty}>No events match this filter.</p>
        )}
        {grouped.map(({ round, events }) => (
          <section key={round} aria-label={`Round ${round}`}>
            <div className={classes.band}>
              <b>Round {round}</b>
              <span className={classes.bandLabel}>
                {phaseName(events[0]?.phase ?? "")}
              </span>
              <span className={cx(classes.bandLabel, classes.bandEnd)}>
                {events.filter((e) => !isSectionDivider(e)).length} events
              </span>
            </div>
            {events.map((event) => {
              const showRule = sinceRuleBefore(event, previous);
              if (!isSectionDivider(event)) previous = event;
              return (
                <div key={event.seq}>
                  {showRule && (
                    <div ref={sinceRef} className={classes.since}>
                      Since your last turn · {newCount} new
                    </div>
                  )}
                  <TimelineItem
                    event={event}
                    now={now}
                    isNew={lastSeq !== null && event.seq > lastSeq}
                    isFuture={scrubSeq !== null && event.seq > scrubSeq}
                    changesMap={timeline.changedEvents.has(event.seq)}
                    animated={animated}
                    systemName={systemName}
                    playerName={playerName}
                    onPreview={() => {
                      const frame = timeline.previews.get(event.seq);
                      if (frame) showMapPreview(event.seq, frame);
                    }}
                  />
                </div>
              );
            })}
          </section>
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
      <Scrubber
        frames={frames}
        position={position}
        playing={playing}
        onScrub={(next) => {
          setPlaying(false);
          scrubTo(next);
        }}
        onTogglePlay={togglePlay}
      />
    </div>
  );
}

function TimelineItem(props: Parameters<typeof EventRow>[0]) {
  const { event, playerName } = props;
  if (event.archetype === "GAME_ENDED") {
    return <GameEndedRow event={event} playerName={playerName} />;
  }
  if (event.archetype === "ROUND_STARTED") return null;
  if (event.archetype === "PHASE_STARTED") {
    const label = phaseDividerLabel(event);
    return label ? <div className={classes.phaseRule}>{label}</div> : null;
  }
  return <EventRow {...props} />;
}
