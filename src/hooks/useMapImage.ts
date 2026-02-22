import { useQuery } from "@tanstack/react-query";
import { config } from "../config";
import { authenticatedFetch } from "@/domains/auth/api";
import { getLocalUser } from "./useUser";

export type MapImageError = {
  status: number;
  message: string;
  requiresAuth?: boolean;
  notParticipant?: boolean;
};

async function fetchMapImageAttachmentUrl(gameId: string): Promise<string> {
  const apiUrl = `${config.api.botApiUrl}/public/game/${gameId}/image/attachment-url`;
  const user = getLocalUser();

  // Pass auth if available, but don't require it (for non-FoW games)
  const response = user?.token
    ? await authenticatedFetch(apiUrl)
    : await fetch(apiUrl, { method: "GET" });

  if (response.status === 401) {
    const error: MapImageError = {
      status: 401,
      message: await response.text(),
      requiresAuth: true,
    };
    throw error;
  }

  if (response.status === 403) {
    const error: MapImageError = {
      status: 403,
      message: await response.text(),
      notParticipant: true,
    };
    throw error;
  }

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
