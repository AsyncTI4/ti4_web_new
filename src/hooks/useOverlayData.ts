import { useQuery } from "@tanstack/react-query";
import { config } from "../config";


export function useOverlayData(gameId: number) {
  const apiUrl = `${config.api.websiteBase}overlays/${gameId}/${gameId}.json`;

  return useQuery({
    queryKey: ["overlays", gameId],
    queryFn: () => fetch(apiUrl).then((res) => res.json()),
    retry: false,
  });
}
