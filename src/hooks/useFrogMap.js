import { useQuery } from "@tanstack/react-query";

export function useFrogMap(discordId, mapId) {
  return useQuery({
    queryKey: ["froggame", discordId, mapId],
    queryFn: () =>
      fetch(
        `https://bbg9uiqewd.execute-api.us-east-1.amazonaws.com/Prod/frog/${discordId}/${mapId}`
      ).then((res) => res.text()),
  });
}
