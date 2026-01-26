import { useQuery } from "@tanstack/react-query";
import { config } from "../config";

interface LatestImageResponse {
  image: string;
}

// Remove this list once it's confirmed to work for these games
const DISCORD_CDN_GAME_IDS: string[] = [
    'pbd18068',
    'pbd18069',
    'pbd18070',
    'pbd18071',
    'pbd18072',
    'pbd18073',
    'pbd18074',
    'pbd18075',
    'pbd18076',
    'pbd18077',
    'pbd18078',
];

function shouldUseDiscordCdn(gameId: string): boolean {
  return DISCORD_CDN_GAME_IDS.includes(gameId);
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
  const useDiscordCdn = gameIdStr ? shouldUseDiscordCdn(gameIdStr) : false;

  return useQuery({
    queryKey: ["mapImage", gameId],
    queryFn: () => {
      if (!gameIdStr) {
        throw new Error("gameId is required");
      }
      return useDiscordCdn
        ? fetchMapImageAttachmentUrl(String(gameId))
        : fetchMapImageUrl(String(gameId));
    },
    enabled: !!gameId,
    retry: false,
  });
}
