import { useQuery } from "@tanstack/react-query";
import { PlayerHandData } from "@/shared/types/playerHand";
import { authenticatedFetch, getBotApiUrl } from "@/domains/auth/api";
import { fetchJson } from "@/utils/fetchJson";
import { useSecretHandAccess } from "./useSecretHandAccess";

const fetchPlayerHand = (gameId: string) =>
  fetchJson<PlayerHandData>(
    getBotApiUrl(`/game/${gameId}/hand`),
    "player hand",
    {
      fetcher: authenticatedFetch,
    },
  );

export const usePlayerHand = (gameId: string) => {
  const { userId, canViewSecretHand } = useSecretHandAccess();

  return useQuery({
    queryKey: ["playerHand", gameId, userId],
    queryFn: () => fetchPlayerHand(gameId),
    enabled: canViewSecretHand,
  });
};
