import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { authenticatedFetch, getBotApiUrl } from "@/domains/auth/api";
import { usePersistentGameTabs } from "./usePersistentGameTabs";
import { EnrichedTab } from "@/app/providers/context/types";
import { useFactionImageCache } from "./useFactionImageCache";
import { useGameData } from "./useGameContext";

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
  const currentGameId = useParams<{ mapid?: string }>().mapid;
  const liveFactionImages = useGameData()?.factionImageMap;
  const factionImageCache = useFactionImageCache();

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
        const faction =
          gameData?.faction === "null" ? null : gameData?.faction || null;
        const imageData = faction
          ? (tabId === currentGameId
              ? liveFactionImages?.[faction]
              : undefined) ??
            factionImageCache.games[tabId]?.factionImages[faction]
          : undefined;

        return {
          id: tabId,
          faction,
          factionColor:
            gameData?.color === "null" ? null : gameData?.color || null,
          // Empty strings are an explicit default-image override. Nullish values
          // would fall through to the currently viewed game's faction map.
          factionImage: imageData?.image ?? "",
          factionImageType: imageData?.type ?? "",
          isManaged,
        };
      })
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [
    activeTabs,
    currentGameId,
    factionImageCache,
    liveFactionImages,
    playerGamesData,
  ]);

  return { activeTabs: enrichedTabs, changeTab, removeTab };
}
