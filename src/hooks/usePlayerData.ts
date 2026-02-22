import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlayerDataResponse } from "@/entities/data/types";
import { useGameSocket } from "./useGameSocket";
import { useRef } from "react";
import { config } from "@/config";

export function usePlayerData(gameId: string) {
  const apiUrl = `${config.api.gameDataUrl}/${gameId}/${gameId}.json`;

  return useQuery<PlayerDataResponse>({
    queryKey: ["playerData", gameId],
    queryFn: () => fetch(apiUrl).then((res) => res.json()),
    retry: false,
  });
}

export function usePlayerDataSocket(gameId: string) {
  const { data, isLoading, isError, refetch } = usePlayerData(gameId);
  const queryClient = useQueryClient();
  const hasConnectedBefore = useRef(false);

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
    }
  );

  return {
    data,
    isLoading,
    isError,
    readyState,
    reconnect,
    isReconnecting,
  };
}
