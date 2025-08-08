import { useQuery } from "@tanstack/react-query";
import { PlayerDataResponse } from "../data/types";
import { useMapSocket } from "./useMapSocket.js";
import {
  EnhancedPlayerData,
  enhancePlayerData,
} from "@/data/enhancePlayerData";
import { useMemo, useRef } from "react";
import { config } from "@/config";

export function usePlayerData(gameId: string) {
  const apiUrl = `${config.api.websiteBase}webdata/${gameId}/${gameId}.json`;
  
  return useQuery<PlayerDataResponse>({
    queryKey: ["playerData", gameId],
    queryFn: () => fetch(apiUrl).then((res) => res.json()),
    retry: false,
  });
}

export function usePlayerDataSocket(gameId: string) {
  const { data, isLoading, isError, refetch } = usePlayerData(gameId);
  const hasConnectedBefore = useRef(false);

  const { readyState, reconnect, isReconnecting } = useMapSocket(gameId, () => {
    if (!hasConnectedBefore.current) {
      hasConnectedBefore.current = true;
      return;
    }
    console.log("Map update received, refetching player data...");
    refetch();
  });

  return {
    data,
    isLoading,
    isError,
    readyState,
    reconnect,
    isReconnecting
  }
}

export function usePlayerDataEnhanced(gameId: string) {
  const { data, isLoading, isError, refetch } = usePlayerData(gameId);

  const enhancedPlayerData = useMemo(
    () => (data ? enhancePlayerData(data) : undefined),
    [data]
  );

  return {
    ...enhancedPlayerData,
    isLoading,
    isError,
    refetch,
  } as HookReturnType;
}

type HookReturnType = EnhancedPlayerData & {
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};
