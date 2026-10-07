import { useQuery } from "@tanstack/react-query";
import { getBotApiUrl } from "@/api/auth";
import { fetchJson } from "@/api/fetchJson";

type CommunityStatsResponse = {
  activeGames: number;
  players: number;
  gamesCompleted: number;
  gamesInProgress: {
    id: string;
    name: string;
    round: number;
    vpTarget: number;
    factions: string[];
  }[];
  generatedAtEpochMs: number;
  ttlSeconds: number;
  unavailableMetrics: string[];
};

export function useCommunityStats() {
  const apiUrl = getBotApiUrl("/public/community/stats");

  return useQuery({
    queryKey: ["communityStats"],
    queryFn: () => fetchJson<CommunityStatsResponse>(apiUrl, "community stats"),
    staleTime: 1000 * 60 * 5,
  });
}
