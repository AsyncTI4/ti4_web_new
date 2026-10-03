import { useQuery } from "@tanstack/react-query";
import { config } from "@/config";

export type OverlayData = {
  title?: string;
  text?: string;
  dataModel?: string;
  dataModelID?: string;
  boxXYWH: [number, number, number, number];
};

async function fetchOverlays(
  gameId: string,
): Promise<Record<string, OverlayData>> {
  const apiUrl = `${config.api.gameDataUrl}/${gameId}/overlays`;
  const response = await fetch(apiUrl);
  if (response.status === 404) {
    return {};
  }
  if (!response.ok) {
    throw new Error(
      `Failed to fetch overlays: ${response.status} ${response.statusText}`,
    );
  }
  return (await response.json()) as Record<string, OverlayData>;
}

export function useOverlayData(gameId?: string) {
  return useQuery({
    queryKey: ["overlays", gameId],
    queryFn: () => fetchOverlays(gameId!),
    enabled: Boolean(gameId),
    retry: false,
  });
}
