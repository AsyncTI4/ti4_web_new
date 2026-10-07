import { useQuery } from "@tanstack/react-query";
import { getBotApiUrl } from "@/domains/auth/api";
import { fetchJson } from "@/utils/fetchJson";

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
