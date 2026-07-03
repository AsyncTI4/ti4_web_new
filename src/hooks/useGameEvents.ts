import { useQuery } from "@tanstack/react-query";
import { config } from "@/config";
import type { GameEvent, PlayerDataResponse } from "@/entities/data/types";
import { usePlayerData } from "./usePlayerData";

async function fetchGameEvents(gameId: string): Promise<GameEvent[]> {
  const response = await fetch(`${config.api.gameDataUrl}/${gameId}/events`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch game events: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<GameEvent[]>;
}

/**
 * Fetches the game event log and keeps it fresh without polling: the full
 * web-data document carries a scalar `eventSequence` that bumps whenever new
 * events land (delivered live via the websocket merge stream). We read only
 * that scalar via a react-query selector — so unrelated playerData changes
 * don't re-render — and invalidate the events query when it increments.
 */
export function useGameEvents(gameId: string) {
  const { data: eventSequence } = usePlayerData(gameId, {
    select: (data: PlayerDataResponse) => data.eventSequence ?? 0,
  });

  const query = useQuery<GameEvent[]>({
    queryKey: ["gameEvents", gameId, eventSequence],
    queryFn: () => fetchGameEvents(gameId),
    enabled: gameId.length > 0 && eventSequence !== undefined,
    retry: false,
    staleTime: Infinity,
  });

  return query;
}
