import { useGameContext } from "./useGameContext";

export function useIsTwilightsFallMode(): boolean {
  const data = useGameContext();
  return data?.isTwilightsFallMode ?? false;
}
