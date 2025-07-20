import { useQuery } from "@tanstack/react-query";
import { config } from "../config";

export function useFrogMap(discordId, mapId) {
  return useQuery({
    queryKey: ["froggame", discordId, mapId],
    queryFn: () =>
      fetch(
        `${config.api.frogMapUrl}/${discordId}/${mapId}`
      ).then((res) => res.text()),
  });
}
