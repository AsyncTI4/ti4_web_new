import { useGameData } from "./useGameContext";

export function useFactionImages() {
  const gameData = useGameData();
  return gameData?.factionImageMap ?? {};
}
