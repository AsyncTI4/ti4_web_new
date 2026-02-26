import { useQuery } from "@tanstack/react-query";
import { getBotApiUrl } from "@/domains/auth/api";

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
    queryFn: async () => {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch community stats: ${response.status}`);
      }
      return (await response.json()) as CommunityStatsResponse;
    },
    staleTime: 1000 * 60 * 5,
  });
}
