import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlayerDataResponse, GameStateMessage } from "@/entities/data/types";
import { useGameSocket } from "./useGameSocket";
import { useCallback, useRef } from "react";
import { config } from "@/config";
import { authenticatedFetch } from "@/domains/auth/api/authenticatedFetch";
import { getLocalUser } from "@/hooks/useUser";
import { useFowViewStore } from "@/utils/fowViewStore";

// RFC 7386-style merge: null removes the key, arrays/scalars replace, objects recurse.
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
    if (value === null) {
      delete result[key];
    } else {
      result[key] = deepMergePatch(result[key], value);
    }
  }
  return result as T;
}

/** Mirrors useMapImage's MapImageError shape/intent for the same 401/403 cases on a FoW game. */
export type PlayerDataError = {
  status: number;
  message: string;
  requiresAuth?: boolean;
  notParticipant?: boolean;
};

export async function fetchPlayerData(
  gameId: string,
  viewAsPlayerId?: string | null
): Promise<PlayerDataResponse> {
  const user = getLocalUser();
  const params = viewAsPlayerId
    ? `?asPlayer=${encodeURIComponent(viewAsPlayerId)}`
    : "";
  const fowUrl = `${config.api.gameDataUrl}/${gameId}/web-data-fow${params}`;

  // Try the FoW-aware endpoint even when logged out: the backend 404s immediately for
  // non-FoW games regardless of auth, so an anonymous request still reliably tells us
  // whether this is a FoW game before falling back - and if it is, we get a real 401
  // instead of a misleading 404 from the plain endpoint below.
  const fowResponse = user?.token
    ? await authenticatedFetch(fowUrl)
    : await fetch(fowUrl);

  if (fowResponse.ok) {
    const body = (await fowResponse.json()) as PlayerDataResponse;
    body.viewerIsGm = fowResponse.headers.get("X-Viewer-Is-Gm") === "true";
    return body;
  }
  if (fowResponse.status === 401) {
    const error: PlayerDataError = {
      status: 401,
      message: await fowResponse.text(),
      requiresAuth: true,
    };
    throw error;
  }
  if (fowResponse.status === 403) {
    const error: PlayerDataError = {
      status: 403,
      message: await fowResponse.text(),
      notParticipant: true,
    };
    throw error;
  }
  if (fowResponse.status !== 404) {
    throw new Error(
      `Failed to fetch player data: ${fowResponse.status} ${fowResponse.statusText}`
    );
  }
  // 404 from web-data-fow means this isn't a FoW game; fall through to the plain endpoint.

  const response = await fetch(`${config.api.gameDataUrl}/${gameId}/web-data`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch player data: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<PlayerDataResponse>;
}

export function usePlayerData<TData = PlayerDataResponse>(
  gameId: string,
  options?: { select?: (data: PlayerDataResponse) => TData }
) {
  const viewAsPlayerId = useFowViewStore((state) => state.viewAsPlayerId);
  return useQuery<PlayerDataResponse, Error | PlayerDataError, TData>({
    queryKey: ["playerData", gameId, viewAsPlayerId],
    queryFn: () => fetchPlayerData(gameId, viewAsPlayerId),
    retry: false,
    select: options?.select,
  });
}

/**
 * Applies streamed merge patches to the full web-data document (the
 * ["playerData"] query). The server diffs the entire web payload, so every
 * consumer of that document — player areas, objectives, tiles, the game-state
 * panel — updates from this one stream. Give the handler to useGameSocket.
 */
export function useWebDataPatcher(gameId: string) {
  const queryClient = useQueryClient();
  const viewAsPlayerId = useFowViewStore((state) => state.viewAsPlayerId);
  const lastSeqRef = useRef<number | null>(null);

  return useCallback(
    (msg: GameStateMessage) => {
      // The patch stream only carries diffs for non-FoW games (see WebSocketNotifier),
      // where viewAsPlayerId is always null, so this key always matches usePlayerData's.
      const key = ["playerData", gameId, viewAsPlayerId];
      const cached = queryClient.getQueryData<PlayerDataResponse>(key);

      if (msg.full) {
        queryClient.setQueryData(key, msg.patch as PlayerDataResponse);
        lastSeqRef.current = msg.seq;
        return;
      }
      if (
        cached !== undefined &&
        lastSeqRef.current !== null &&
        msg.seq === lastSeqRef.current + 1
      ) {
        queryClient.setQueryData(key, deepMergePatch(cached, msg.patch));
        lastSeqRef.current = msg.seq;
        return;
      }
      // Gap, seq reset, or delta before initial fetch: adopt seq as baseline and resync once.
      lastSeqRef.current = msg.seq;
      void queryClient.invalidateQueries({ queryKey: key });
    },
    [gameId, viewAsPlayerId, queryClient]
  );
}

export function usePlayerDataSocket(gameId: string) {
  const { data, isLoading, isError, error, refetch } = usePlayerData(gameId);
  const queryClient = useQueryClient();
  const viewAsPlayerId = useFowViewStore((state) => state.viewAsPlayerId);
  const hasConnectedBefore = useRef(false);
  const hasSocketConnectedBefore = useRef(false);
  const onStateMessage = useWebDataPatcher(gameId);

  const { readyState, reconnect, isReconnecting } = useGameSocket(
    gameId,
    () => {
      if (!hasConnectedBefore.current) {
        hasConnectedBefore.current = true;
        return;
      }
      console.log(
        "Game refresh received, refetching player data and player hands..."
      );
      void refetch();
      void queryClient.invalidateQueries({
        queryKey: ["playerHand", gameId],
      });
    },
    onStateMessage,
    () => {
      if (!hasSocketConnectedBefore.current) {
        hasSocketConnectedBefore.current = true;
        return;
      }
      void queryClient.invalidateQueries({
        queryKey: ["playerData", gameId, viewAsPlayerId],
      });
    }
  );

  return {
    data,
    isLoading,
    isError,
    error,
    readyState,
    reconnect,
    isReconnecting,
  };
}
