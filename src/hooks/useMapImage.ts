import { useQuery } from "@tanstack/react-query";
import { config } from "../config";

async function fetchMapImageAttachmentUrl(gameId: string): Promise<string> {
  const apiUrl = `${config.api.botApiUrl}/public/game/${gameId}/image/attachment-url`;

  const response = await fetch(apiUrl, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch map image attachment: ${response.status} ${response.statusText}`
    );
  }

  return await response.text();
}

export function useMapImage(gameId?: string | null) {
  const gameIdStr = gameId ? String(gameId) : null;

  return useQuery({
    queryKey: ["mapImage", gameId],
    queryFn: () => {
      if (!gameIdStr) {
        throw new Error("gameId is required");
      }
      return fetchMapImageAttachmentUrl(gameIdStr);
    },
    enabled: !!gameId,
    retry: false,
  });
}
