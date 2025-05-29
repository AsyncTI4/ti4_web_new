import { useQuery } from "@tanstack/react-query";
import { PlayerData } from "../data/pbd10242";

export function usePlayerData(gameId: string) {
  const apiUrl = import.meta.env.DEV
    ? `/proxy/webdata/${gameId}/${gameId}.json`
    : `https://ti4.westaddisonheavyindustries.com/webdata/${gameId}/${gameId}.json`;

  return useQuery<PlayerData[]>({
    queryKey: ["playerData", gameId],
    queryFn: () => fetch(apiUrl).then((res) => res.json()),
    retry: false,
  });
}
