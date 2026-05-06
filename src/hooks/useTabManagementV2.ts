import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch, getBotApiUrl } from "@/domains/auth/api";
import { usePersistentGameTabs } from "./usePersistentGameTabs";
import { EnrichedTab } from "@/app/providers/context/types";

type PlayerGame = {
  gameId: string;
  faction: string | null;
  color: string | null;
};

type PlayerGamesResponse = PlayerGame[];

async function fetchPlayerGames(apiUrl: string): Promise<PlayerGamesResponse> {
  const response = await authenticatedFetch(apiUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch player games: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as unknown;

  if (!Array.isArray(data)) {
    throw new Error("Failed to fetch player games: unexpected response shape");
  }

  return data as PlayerGamesResponse;
}

function usePlayerGames() {
  const apiUrl = getBotApiUrl("/my-games");

  return useQuery<PlayerGamesResponse>({
    queryKey: ["playerGames"],
    queryFn: () => fetchPlayerGames(apiUrl),
    retry: false,
  });
}

export function useTabManagementV2() {
  const { activeTabs, changeTab, removeTab } = usePersistentGameTabs();
  const { data: playerGamesData } = usePlayerGames();

  const enrichedTabs: EnrichedTab[] = useMemo(() => {
    const playerGames = playerGamesData ?? [];
    const allGameIds = new Set([
      ...activeTabs,
      ...playerGames.map((game) => game.gameId),
    ]);

    return Array.from(allGameIds)
      .map((tabId) => {
        const gameData = playerGames.find((game) => game.gameId === tabId);
        const isManaged = !!gameData;
        return {
          id: tabId,
          faction:
            gameData?.faction === "null" ? null : gameData?.faction || null,
          factionColor:
            gameData?.color === "null" ? null : gameData?.color || null,
          factionImage: null,
          factionImageType: null,
          isManaged,
        };
      })
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [activeTabs, playerGamesData]);

  return { activeTabs: enrichedTabs, changeTab, removeTab };
}
