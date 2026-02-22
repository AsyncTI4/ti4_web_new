import { useQuery } from "@tanstack/react-query";
import { config } from "@/config";

export type OverlayData = {
  title?: string;
  text?: string;
  dataModel?: string;
  dataModelID?: string;
  boxXYWH: [number, number, number, number];
};

export function useOverlayData(gameId?: string) {
  const apiUrl = `${config.api.websiteBase}overlays/${gameId}/${gameId}.json`;

  return useQuery({
    queryKey: ["overlays", gameId],
    queryFn: async () =>
      (await fetch(apiUrl).then((res) => res.json())) as Record<string, OverlayData>,
    enabled: Boolean(gameId),
    retry: false,
  });
}
