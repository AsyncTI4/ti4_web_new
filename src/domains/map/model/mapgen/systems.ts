import { systems } from "@/entities/data/systems";
import { TileData } from "@/entities/data/types";

export function getTileById(tileId: string): TileData | undefined {
  return systems.find((tile) => tile.id === tileId);
}

export function getTileID(tileID: string): string | null {
  const tile = getTileById(tileID);
  return tile ? tile.imagePath : null;
}

export function isValidTile(tileID: string): boolean {
  return getTileById(tileID) !== undefined;
}

export function getTilesBySource(source: string): TileData[] {
  return systems.filter((tile) => tile.source === source);
}

export function getSystemTiles(): TileData[] {
  return systems.filter((tile) => !tile.isHyperlane);
}

export function getHyperlaneTiles(): TileData[] {
  return systems.filter((tile) => tile.isHyperlane === true);
}
