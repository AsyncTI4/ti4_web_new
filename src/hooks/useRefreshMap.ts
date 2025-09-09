import { useMutation } from "@tanstack/react-query";

async function requestMapRefresh(gameId: string): Promise<void> {
  const apiUrl = import.meta.env.DEV
    ? `/bot/api/public/game/${gameId}/refresh`
    : `https://bot.asyncti4.com/api/public/game/${gameId}/refresh`;

  const res = await fetch(apiUrl, { method: "POST" });
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
