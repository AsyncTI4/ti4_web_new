import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch, getBotApiUrl } from "../api";

async function fetchMapImageUrl(gameId: string): Promise<string> {
  const apiUrl = getBotApiUrl(`/public/game/${gameId}/image`);

  const response = await authenticatedFetch(apiUrl, {
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
