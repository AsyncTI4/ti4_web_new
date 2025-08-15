import { useGameData } from "./useGameContext";
import type { FactionColorMap } from "@/context/GameContextProvider";

export function useFactionColors(): FactionColorMap {
  const game = useGameData();
  return game?.factionColorMap ?? {};
}
