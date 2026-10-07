import type { Tile } from "@/app/providers/context/types";

export function useTilesList(
  tilesMap: Record<string, Tile> | undefined
): Tile[] {
  return Object.values(tilesMap || {});
}
