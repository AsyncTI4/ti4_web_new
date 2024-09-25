import { useQuery } from "@tanstack/react-query";

export function useMaps() {
  return useQuery({
    queryKey: ["maps"],
    queryFn: () =>
      fetch("https://ti4.westaddisonheavyindustries.com/maps.json").then(
        (res) => res.json()
      ),
  });
}
