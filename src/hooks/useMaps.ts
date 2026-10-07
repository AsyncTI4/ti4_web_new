import { useQuery } from "@tanstack/react-query";
import { config } from "../config";
import { fetchJson } from "@/utils/fetchJson";

type MapSummary = {
  MapName: string;
};

export function useMaps() {
  const apiUrl = import.meta.env.DEV
    ? config.api.proxyMapsUrl
    : config.api.mapsUrl;

  return useQuery({
    queryKey: ["maps"],
    queryFn: () => fetchJson<MapSummary[]>(apiUrl, "maps"),
  });
}
