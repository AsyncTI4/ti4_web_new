import type { GameEvent } from "@/entities/data/types";
import type { CombatReplayEvent, MapStatePreview, RetreatSubEvent } from "@/entities/game/types";
import { findMovementBaseline } from "@/entities/replay/compactMovementState";
import { parseSubEvents, str } from "./eventPayload";

export type MapPreviewFrame = {
  preview: MapStatePreview;
  snapshotSeq: number;
  replaysChange: boolean;
};

function previousMapStateFor(
  event: GameEvent,
  history: string[],
  latestMapState: string | undefined,
): string | undefined {
  if (
    event.archetype !== "TACTICAL_ACTION" ||
    !event.movementState ||
    !event.faction
  ) {
    return latestMapState;
  }
  return (
    findMovementBaseline(history, event.movementState, event.faction) ??
    latestMapState
  );
}

function replayPreview(
  event: GameEvent,
  mapState: string,
  previousMapState: string | undefined,
): MapStatePreview {
  const subEvents = parseSubEvents(event.payload?.subEvents);
  return {
    mapState,
    previousMapState,
    movementState: event.movementState,
    retreats: subEvents.filter(
      (sub): sub is RetreatSubEvent => sub.type === "RETREAT",
    ),
    combats: subEvents.filter(
      (sub): sub is CombatReplayEvent => sub.type === "COMBAT",
    ),
    activeFaction: event.faction,
    tacticalPosition:
      event.archetype === "TACTICAL_ACTION"
        ? str(event.payload, "activeSystem")
        : undefined,
  };
}

/**
 * Snapshots are sparse: an event without one has the same map as the most
 * recent earlier event that does. Built from the complete event list so a
 * snapshot still carries into the visible window when earlier rows are hidden
 * behind "Show earlier events".
 */
export function buildMapTimeline(events: GameEvent[]) {
  const previews = new Map<number, MapPreviewFrame>();
  const changedEvents = new Set<number>();
  const mapStateHistory: string[] = [];
  let latestMapState: string | undefined;
  let latestSnapshotSeq: number | undefined;

  for (const event of [...events].sort((a, b) => a.seq - b.seq)) {
    if (!event.mapState) {
      if (latestMapState && latestSnapshotSeq !== undefined) {
        previews.set(event.seq, {
          preview: { mapState: latestMapState },
          snapshotSeq: latestSnapshotSeq,
          replaysChange: false,
        });
      }
      continue;
    }

    const previousMapState = previousMapStateFor(
      event,
      mapStateHistory,
      latestMapState,
    );
    const replaysChange =
      previousMapState !== undefined &&
      event.mapState !== previousMapState &&
      event.archetype !== "TRANSACTION";
    latestMapState = event.mapState;
    mapStateHistory.push(event.mapState);
    latestSnapshotSeq = event.seq;
    if (replaysChange) changedEvents.add(event.seq);
    previews.set(event.seq, {
      preview: replaysChange
        ? replayPreview(event, event.mapState, previousMapState)
        : { mapState: event.mapState },
      snapshotSeq: event.seq,
      replaysChange,
    });
  }
  return { previews, changedEvents };
}

/** Newest round first, newest event first within a round. */
export function groupByRound(events: GameEvent[]) {
  const byRound = new Map<number, GameEvent[]>();
  for (const e of events) {
    const roundEvents = byRound.get(e.round) ?? [];
    roundEvents.push(e);
    byRound.set(e.round, roundEvents);
  }
  return [...byRound.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([round, roundEvents]) => ({
      round,
      events: roundEvents.sort((a, b) => b.seq - a.seq),
    }));
}
