import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch, getBotApiUrl } from "@/domains/auth/api";
import { usePersistentGameTabs } from "./usePersistentGameTabs";

type PlayerGame = {
  gameId: string;
  faction: string | null;
  color: string | null;
};

type PlayerGamesResponse = PlayerGame[];

type EnrichedTab = {
  id: string;
  faction: string | null;
  factionColor: string | null;
  isManaged: boolean;
};

function usePlayerGames() {
  const apiUrl = getBotApiUrl("/my-games");

  return useQuery<PlayerGamesResponse>({
    queryKey: ["playerGames"],
    queryFn: () => authenticatedFetch(apiUrl).then((res) => res.json()),
    retry: false,
  });
}

export function useTabManagementV2() {
  const { activeTabs, changeTab, removeTab } = usePersistentGameTabs();
  const { data: playerGamesData } = usePlayerGames();

  const enrichedTabs: EnrichedTab[] = useMemo(() => {
    const allGameIds = new Set([
      ...activeTabs,
      ...(playerGamesData?.map((game) => game.gameId) || []),
    ]);

    return Array.from(allGameIds)
      .map((tabId) => {
        const gameData = playerGamesData?.find((game) => game.gameId === tabId);
        const isManaged = !!gameData;
        return {
          id: tabId,
          faction:
            gameData?.faction === "null" ? null : gameData?.faction || null,
          factionColor:
            gameData?.color === "null" ? null : gameData?.color || null,
          isManaged,
        };
      })
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [activeTabs, playerGamesData]);

  return { activeTabs: enrichedTabs, changeTab, removeTab };
}
