import { useQuery } from "@tanstack/react-query";
import { config } from "@/config";

export type OverlayData = {
  title?: string;
  text?: string;
  dataModel?: string;
  dataModelID?: string;
  boxXYWH: [number, number, number, number];
};

export type MapOverlayResponse = {
  overlays: OverlayData[];
  updatedAtEpochMs: number;
};

async function fetchOverlays(gameId: string): Promise<OverlayData[]> {
  const apiUrl = `${config.api.gameDataUrl}/${gameId}/overlays`;
  const response = await fetch(apiUrl);
  if (response.status === 404) {
    return [];
  }
  if (!response.ok) {
    throw new Error(
      `Failed to fetch overlays: ${response.status} ${response.statusText}`,
    );
  }
  const data = (await response.json()) as MapOverlayResponse;
  return data.overlays;
}

export function useOverlayData(gameId?: string) {
  return useQuery({
    queryKey: ["overlays", gameId],
    queryFn: () => fetchOverlays(gameId!),
    enabled: Boolean(gameId),
    retry: false,
  });
}
