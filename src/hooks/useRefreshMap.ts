import { useMutation } from "@tanstack/react-query";
import { authenticatedFetch, getBotApiUrl } from "@/domains/auth/api";

async function requestMapRefresh(gameId: string): Promise<void> {
  const apiUrl = getBotApiUrl(`/public/game/${gameId}/refresh`);

  const res = await authenticatedFetch(apiUrl, { method: "POST" });
  if (!res.ok) {
    let body = "";
    try {
      body = await res.text();
    } catch {
      // ignore
    }
    throw new Error(body || `${res.status} ${res.statusText}`);
  }
}

export function useRefreshMap(gameId: string) {
  return useMutation({
    mutationKey: ["refresh", gameId],
    mutationFn: () => requestMapRefresh(gameId),
  });
}
