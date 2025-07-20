import { useQuery } from "@tanstack/react-query";
import { config } from "../config";


export function useMaps() {
  const apiUrl = import.meta.env.DEV
  ? config.api.proxyMapsUrl
  : config.api.mapsUrl;


  return useQuery({
    queryKey: ["maps"],
    queryFn: () => fetch(apiUrl).then((res) => res.json()),
  });
}
