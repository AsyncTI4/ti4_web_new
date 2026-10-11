import { skipToken, useQuery } from "@tanstack/react-query";
import { useUser } from "@/api/auth/useUser";
import { useGameData } from "@/state/useGameContext";
import type { GameEvent } from "@/entities/data/types";

const IGNORED_ARCHETYPES = new Set(["PHASE_STARTED", "ROUND_STARTED"]);

/** The faction the signed-in user is seated as in this game, if any. */
export function useMyFaction(): string | null {
  const { user } = useUser();
  const gameData = useGameData();
  const discordId = user?.discord_id;
  if (!discordId) return null;
  const me = gameData?.playerData?.find((p) => p.discordId === discordId);
  return me?.faction ?? null;
}

/**
 * The seq of the user's most recent own event. Everything after it happened
 * since their last turn. Null when they have no event in the log yet.
 */
export function lastOwnEventSeq(
  events: GameEvent[],
  faction: string | null,
): number | null {
  if (!faction) return null;
  let last: number | null = null;
  for (const e of events) {
    if (e.faction !== faction || IGNORED_ARCHETYPES.has(e.archetype)) continue;
    if (last === null || e.seq > last) last = e.seq;
  }
  return last;
}

export function countSince(events: GameEvent[], seq: number | null): number {
  if (seq === null) return 0;
  return events.filter(
    (e) => e.seq > seq && !IGNORED_ARCHETYPES.has(e.archetype),
  ).length;
}

/**
 * Events since the user's last turn, read from the event log only once it is
 * already cached, so the badge never triggers the log's (large) fetch itself.
 */
export function useUnreadEventCount(gameId: string): number {
  const faction = useMyFaction();
  const { data } = useQuery<GameEvent[]>({
    queryKey: ["gameEvents", gameId],
    queryFn: skipToken,
  });
  if (!data || !faction) return 0;
  return countSince(data, lastOwnEventSeq(data, faction));
}
