import { useQuery } from "@tanstack/react-query";
import { PlayerHandData } from "../types/playerHand";
import { authenticatedFetch, getBotApiUrl } from "../api";
import { useSecretHandAccess } from "./useSecretHandAccess";

const fetchPlayerHand = async (gameId: string): Promise<PlayerHandData> => {
  const apiUrl = getBotApiUrl(`/game/${gameId}/hand`);

  const response = await authenticatedFetch(apiUrl, {
    method: "GET",
    headers: {
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
  const { userId, canViewSecretHand } = useSecretHandAccess();

  return useQuery({
    queryKey: ["playerHand", gameId, userId],
    queryFn: () => fetchPlayerHand(gameId),
    enabled: canViewSecretHand,
  });
};
