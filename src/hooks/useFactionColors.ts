import { useGameData } from "@/state/useGameContext";
import type { FactionColorMap } from "@/entities/game/types";

export function useFactionColors(): FactionColorMap {
  const game = useGameData();
  return game?.factionColorMap ?? {};
}

export function useOriginalFactionColors(): FactionColorMap {
  const game = useGameData();
  return game?.originalFactionColorMap ?? {};
}
