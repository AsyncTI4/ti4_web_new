import { systems } from "@/entities/data/systems";
import type { TileData } from "@/entities/data/types";

const tilesById = new Map<string, TileData>();
for (const tile of systems) {
  if (!tilesById.has(tile.id)) tilesById.set(tile.id, tile);
}

export function getTileById(tileId: string): TileData | undefined {
  return tilesById.get(tileId);
}
