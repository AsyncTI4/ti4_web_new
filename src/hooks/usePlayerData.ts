import { useQuery } from "@tanstack/react-query";
import { PlayerDataResponse } from "../data/types";
import {
  EnhancedPlayerData,
  enhancePlayerData,
} from "@/data/enhancePlayerData";
import { useMemo } from "react";
import { config } from "@/config";

export function usePlayerData(gameId: string) {
  const apiUrl = `${config.api.websiteBase}webdata/${gameId}/${gameId}.json`;

  return useQuery<PlayerDataResponse>({
    queryKey: ["playerData", gameId],
    queryFn: () => fetch(apiUrl).then((res) => res.json()),
    retry: false,
  });
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
