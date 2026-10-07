import { useMutation } from "@tanstack/react-query";
import { authenticatedFetch, getBotApiUrl } from "@/domains/auth/api";
import { throwResponseError } from "@/utils/fetchJson";

async function requestMapRefresh(gameId: string): Promise<void> {
  const apiUrl = getBotApiUrl(`/public/game/${gameId}/image/refresh`);

  const res = await authenticatedFetch(apiUrl, { method: "POST" });
  if (!res.ok) await throwResponseError(res, `${res.status} ${res.statusText}`);
}

export function useRefreshMap(gameId: string) {
  return useMutation({
    mutationKey: ["refresh", gameId],
    mutationFn: () => requestMapRefresh(gameId),
  });
}
