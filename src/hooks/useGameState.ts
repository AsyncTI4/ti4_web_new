import { useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { GameState, GameStateMessage } from "@/entities/data/types";
import { config } from "@/config";

// RFC 7386-style merge: null deletes/nulls, arrays/scalars replace, objects recurse.
export function deepMergePatch<T>(base: T, patch: unknown): T {
  if (patch === null || typeof patch !== "object" || Array.isArray(patch))
    return patch as T;
  const baseObj =
    base !== null && typeof base === "object" && !Array.isArray(base)
      ? (base as Record<string, unknown>)
      : {};
  const result: Record<string, unknown> = { ...baseObj };
  for (const [key, value] of Object.entries(
    patch as Record<string, unknown>
  )) {
    result[key] = value === null ? null : deepMergePatch(result[key], value);
  }
  return result as T;
}

async function fetchGameState(gameId: string): Promise<GameState> {
  const response = await fetch(
    `${config.api.gameDataUrl}/${gameId}/game-state`
  );
  if (!response.ok)
    throw new Error(`Failed to fetch game state: ${response.status}`);
  return response.json() as Promise<GameState>;
}

export function useGameState(gameId: string) {
  return useQuery<GameState>({
    queryKey: ["gameState", gameId],
    queryFn: () => fetchGameState(gameId),
    retry: false,
  });
}

/** Returns a stable handler for GameStateMessages; give it to useGameSocket. */
export function useGameStatePatcher(gameId: string) {
  const queryClient = useQueryClient();
  const lastSeqRef = useRef<number | null>(null);

  return useCallback(
    (msg: GameStateMessage) => {
      const key = ["gameState", gameId];
      const cached = queryClient.getQueryData<GameState>(key);

      if (msg.full || cached === undefined) {
        queryClient.setQueryData(key, msg.patch as GameState);
        lastSeqRef.current = msg.seq;
        return;
      }
      if (
        lastSeqRef.current !== null &&
        msg.seq === lastSeqRef.current + 1
      ) {
        queryClient.setQueryData(key, deepMergePatch(cached, msg.patch));
        lastSeqRef.current = msg.seq;
        return;
      }
      // Gap or seq reset (bot restart): resync from the cheap endpoint.
      lastSeqRef.current = null;
      void queryClient.invalidateQueries({ queryKey: key });
    },
    [gameId, queryClient]
  );
}
