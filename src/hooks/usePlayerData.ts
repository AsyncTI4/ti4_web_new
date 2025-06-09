import { useQuery } from "@tanstack/react-query";
import { PlayerDataResponse } from "../data/types";
import { enhancePlayerData } from "@/data/enhancePlayerData";
import { useMemo } from "react";

export function usePlayerData(gameId: string) {
  const apiUrl = import.meta.env.DEV
    ? `/proxy/webdata/${gameId}/${gameId}.json`
    : `https://ti4.westaddisonheavyindustries.com/webdata/${gameId}/${gameId}.json`;

  return useQuery<PlayerDataResponse>({
    queryKey: ["playerData", gameId],
    queryFn: () => fetch(apiUrl).then((res) => res.json()),
    retry: false,
  });
}

export function usePlayerDataEnhanced(gameId: string) {
  const { data, isLoading, isError } = usePlayerData(gameId);
  const enhancedPlayerData = useMemo(
    () => (data ? enhancePlayerData(data) : undefined),
    [data]
  );

  return { ...enhancedPlayerData, isLoading, isError };
}
