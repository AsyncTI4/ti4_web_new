import { useQuery } from "@tanstack/react-query";
import type { PlayerDataResponse } from "@/entities/data/types";
import { fetchPlayerData } from "./usePlayerData";

/**
 * The game-state slice of the full web-data document. Streamed merge patches
 * land on the shared ["playerData"] query (see useWebDataPatcher), so this
 * selector re-renders on every gameState change without its own endpoint or
 * subscription.
 */
export function useGameState(gameId: string) {
  return useQuery({
    queryKey: ["playerData", gameId],
    queryFn: () => fetchPlayerData(gameId),
    retry: false,
    select: (data: PlayerDataResponse) => data.gameState,
  });
}
