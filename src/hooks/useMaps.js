import { useQuery } from "@tanstack/react-query";


export function useMaps() {
  const apiUrl = import.meta.env.DEV
  ? "/proxy/maps.json"
  : "https://ti4.westaddisonheavyindustries.com/maps.json";


  return useQuery({
    queryKey: ["maps"],
    queryFn: () => fetch(apiUrl).then((res) => res.json()),
  });
}
