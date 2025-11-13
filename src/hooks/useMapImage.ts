import { useQuery } from "@tanstack/react-query";
import { config } from "../config";

interface LatestImageResponse {
  image: string;
}

async function fetchMapImageUrl(gameId: string): Promise<string> {
  const apiUrl = `${config.api.gameDataUrl}/${gameId}/latestImage.json`;

  const response = await fetch(apiUrl, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch map image: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as LatestImageResponse;
  return "https://asyncti4.com/map/" + gameId + "/" + data.image;
}

export function useMapImage(gameId?: string | null) {
  return useQuery({
    queryKey: ["mapImage", gameId],
    queryFn: () => fetchMapImageUrl(String(gameId)),
    enabled: !!gameId,
    retry: false,
  });
}
