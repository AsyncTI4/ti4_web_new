import { useQuery } from "@tanstack/react-query";
import { config } from "../config";

type MapSummary = {
  MapName: string;
};

export function useMaps() {
  const apiUrl = import.meta.env.DEV ? config.api.proxyMapsUrl : config.api.mapsUrl;

  return useQuery({
    queryKey: ["maps"],
    queryFn: async () => (await fetch(apiUrl).then((res) => res.json())) as MapSummary[],
  });
}
