import { TilePlanet } from "@/app/providers/context/types";
import { useGameData } from "./useGameContext";

export function usePlanet(planetId: string): TilePlanet | undefined {
  const game = useGameData();
  return game?.planetIdToPlanetTile?.[planetId];
}
