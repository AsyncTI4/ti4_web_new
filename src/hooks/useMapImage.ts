import { useQuery } from "@tanstack/react-query";

async function fetchMapImageUrl(gameId: string): Promise<string> {
  const apiUrl = import.meta.env.DEV
    ? `/bot/api/public/game/${gameId}/image`
    : `https://bot.asyncti4.com/api/public/game/${gameId}/image`;

  const response = await fetch(apiUrl, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch map image: ${response.status} ${response.statusText}`
    );
  }

  const text = await response.text();
  return "https://asyncti4.com/map/" + gameId + "/" + text.trim();
}

export function useMapImage(gameId?: string | null) {
  return useQuery({
    queryKey: ["mapImage", gameId],
    queryFn: () => fetchMapImageUrl(String(gameId)),
    enabled: !!gameId,
    retry: false,
  });
}
