import type { Tile } from "@/entities/game/types";

export function useTilesList(
  tilesMap: Record<string, Tile> | undefined
): Tile[] {
  return Object.values(tilesMap || {});
}
