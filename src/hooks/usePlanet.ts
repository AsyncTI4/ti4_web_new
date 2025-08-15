import { useGameData } from "./useGameContext";
import type { PlanetMapTile } from "@/data/types";

export function usePlanet(planetId: string): PlanetMapTile | undefined {
  const game = useGameData();
  return game?.planetIdToPlanetTile?.[planetId];
}
