import { TilePlanet } from "@/entities/game/types";
import { useGameData } from "@/state/useGameContext";

export function usePlanet(planetId: string): TilePlanet | undefined {
  const game = useGameData();
  return game?.planetIdToPlanetTile?.[planetId];
}
