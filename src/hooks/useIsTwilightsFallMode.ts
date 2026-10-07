import { useGameContext } from "@/state/useGameContext";

export function useIsTwilightsFallMode(): boolean {
  const data = useGameContext();
  return data?.isTwilightsFallMode ?? false;
}
