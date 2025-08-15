import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { useGameData } from "./useGameContext";
import { PlayerHandData } from "../types/playerHand";

const fetchPlayerHand = async (
  gameId: string,
  token: string
): Promise<PlayerHandData> => {
  const apiUrl = import.meta.env.DEV
    ? `/bot/api/game/${gameId}/hand`
    : `https://bot.asyncti4.com/api/game/${gameId}/hand`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch player hand: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const usePlayerHand = (gameId: string) => {
  const { user } = useUser();
  const gameData = useGameData();
  const playerData = gameData?.playerData;

  // Check if user is authenticated, has a token, and is in the active game
  const isUserAuthenticated = user?.authenticated && user?.token;
  const isInGame = playerData?.some((p) => p.discordId === user?.discord_id);
  const shouldFetch = isUserAuthenticated && isInGame;

  return useQuery({
    queryKey: ["playerHand", gameId, user?.id],
    queryFn: () => fetchPlayerHand(gameId, user!.token!),
    enabled: !!shouldFetch,
  });
};
