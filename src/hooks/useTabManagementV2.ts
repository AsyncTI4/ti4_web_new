import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";

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
  const { user } = useUser();
  const apiUrl = import.meta.env.DEV
    ? `/bot/api/my-games`
    : `https://bot.asyncti4.com/api/my-games`;

  return useQuery<PlayerGamesResponse>({
    queryKey: ["playerGames"],
    queryFn: () =>
      fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }).then((res) => res.json()),
    retry: false,
  });
}

export function useTabManagementV2() {
  const navigate = useNavigate();
  const params = useParams<{ mapid: string }>();
  const [activeTabs, setActiveTabs] = useState<string[]>([]);
  const { data: playerGamesData } = usePlayerGames();
  useEffect(() => {
    const storedTabs = JSON.parse(localStorage.getItem("activeTabs") || "[]");
    const currentGame = params.mapid;
    if (currentGame && !storedTabs.includes(currentGame)) {
      storedTabs.push(currentGame);
    }

    setActiveTabs(storedTabs.filter((tab: string) => !!tab));
  }, [params.mapid]);

  useEffect(() => {
    if (activeTabs.length === 0) return;
    localStorage.setItem("activeTabs", JSON.stringify(activeTabs));
  }, [activeTabs]);

  // Merge localStorage tabs with API data to create enriched tabs
  const allGameIds = new Set([
    ...activeTabs,
    ...(playerGamesData?.map((game) => game.gameId) || []),
  ]);

  const enrichedTabs: EnrichedTab[] = Array.from(allGameIds)
    .map((tabId) => {
      const gameData = playerGamesData?.find((game) => game.gameId === tabId);
      const isManaged = !!gameData; // Tab is managed if it exists in player games data
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

  const changeTab = (tab: string) => {
    if (tab === params.mapid) return;
    navigate(`/game/${tab}/newui`);
  };

  const removeTab = (tabValue: string) => {
    const remaining = activeTabs.filter((tab) => tab !== tabValue);
    setActiveTabs(remaining);
    localStorage.setItem("activeTabs", JSON.stringify(remaining));

    if (params.mapid !== tabValue) return;

    if (remaining.length > 0) {
      changeTab(remaining[0]);
    } else {
      navigate("/");
    }
  };

  return { activeTabs: enrichedTabs, changeTab, removeTab };
}
