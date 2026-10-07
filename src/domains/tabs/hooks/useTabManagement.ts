import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { authenticatedFetch, getBotApiUrl } from "@/api/auth";
import { usePersistentGameTabs } from "./usePersistentGameTabs";
import { useFactionImageCache } from "./useFactionImageCache";
import { useGameData } from "@/state/useGameContext";
import { fetchJson } from "@/api/fetchJson";

export type EnrichedTab = {
  id: string;
  faction: string | null;
  factionColor: string | null;
  factionImage: string | null;
  factionImageType: string | null;
  isManaged: boolean;
};

type PlayerGame = {
  gameId: string;
  faction: string | null;
  color: string | null;
};

type PlayerGamesResponse = PlayerGame[];

async function fetchPlayerGames(apiUrl: string): Promise<PlayerGamesResponse> {
  const data = await fetchJson<unknown>(apiUrl, "player games", {
    fetcher: authenticatedFetch,
  });

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

export function useTabManagement() {
  const { activeTabs, changeTab, removeTab } = usePersistentGameTabs();
  const { data: playerGamesData } = usePlayerGames();
  const currentGameId = useParams<{ mapid?: string }>().mapid;
  const liveFactionImages = useGameData()?.factionImageMap;
  const factionImageCache = useFactionImageCache();

  const playerGames = playerGamesData ?? [];
  const playerGamesById = new Map<string, PlayerGame>();
  playerGames.forEach((game) => {
    if (!playerGamesById.has(game.gameId)) playerGamesById.set(game.gameId, game);
  });
  const allGameIds = new Set([...activeTabs, ...playerGamesById.keys()]);

  const enrichedTabs: EnrichedTab[] = Array.from(allGameIds)
    .map((tabId) => {
      const gameData = playerGamesById.get(tabId);
      const faction =
        gameData?.faction === "null" ? null : gameData?.faction || null;
      const imageData = faction
        ? ((tabId === currentGameId ? liveFactionImages?.[faction] : undefined) ??
          factionImageCache.games[tabId]?.factionImages[faction])
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
        isManaged: !!gameData,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  return { activeTabs: enrichedTabs, changeTab, removeTab };
}
