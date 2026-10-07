import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch, getBotApiUrl } from "@/domains/auth/api";
import { getLocalUser } from "./useUser";

export class MapImageError extends Error {
  readonly status: number;
  readonly requiresAuth?: boolean;
  readonly notParticipant?: boolean;

  constructor(
    status: number,
    message: string,
    flags: { requiresAuth?: boolean; notParticipant?: boolean },
  ) {
    super(message);
    this.name = "MapImageError";
    this.status = status;
    this.requiresAuth = flags.requiresAuth;
    this.notParticipant = flags.notParticipant;
  }
}

async function fetchMapImageAttachmentUrl(gameId: string): Promise<string> {
  const apiUrl = getBotApiUrl(`/public/game/${gameId}/image/attachment-url`);
  const user = getLocalUser();

  // Auth is optional: only Fog of War games need it.
  const response = user?.token
    ? await authenticatedFetch(apiUrl)
    : await fetch(apiUrl, { method: "GET" });

  if (response.status === 401) {
    throw new MapImageError(401, await response.text(), { requiresAuth: true });
  }

  if (response.status === 403) {
    throw new MapImageError(403, await response.text(), {
      notParticipant: true,
    });
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch map image attachment: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

export function useMapImage(gameId?: string | null) {
  return useQuery({
    queryKey: ["mapImage", gameId],
    queryFn: () => {
      if (!gameId) throw new Error("gameId is required");
      return fetchMapImageAttachmentUrl(gameId);
    },
    enabled: !!gameId,
    retry: false,
  });
}
