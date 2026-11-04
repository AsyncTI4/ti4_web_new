import { tileAdjacencies } from "@/entities/data/tileAdjacencies";
import { getTileById } from "@/entities/lookup/systems";
import { getTokenData } from "@/entities/lookup/tokens";
import type { Tile } from "@/entities/game/types";

/** System-data flags paired with the anomaly each one marks. */
export const SYSTEM_ANOMALY_FLAGS = [
  ["isAsteroidField", "asteroidField"],
  ["isNebula", "nebula"],
  ["isSupernova", "supernova"],
  ["isGravityRift", "gravityRift"],
  ["isScar", "entropicScar"],
] as const;

/** Token-data flags that turn a token into an anomaly, in precedence order. */
export const TOKEN_ANOMALY_FLAGS = [
  ["isScar", "entropicScar"],
  ["isRift", "gravityRift"],
  ["isNebula", "nebula"],
] as const;

export type AnomalyId = (typeof SYSTEM_ANOMALY_FLAGS)[number][1];

/** The board's systems by map position, as the game context holds them. */
export type Tiles = Record<string, Tile>;

/**
 * The anomalies in force in a system, whether printed on the tile or brought
 * by a token placed on it.
 */
export function systemAnomalies(tile: Tile): AnomalyId[] {
  const tileData = getTileById(tile.systemId);
  const printed = SYSTEM_ANOMALY_FLAGS.filter(([flag]) => tileData?.[flag]);
  const fromTokens = tile.tokens.flatMap((tokenId) => {
    const tokenData = getTokenData(tokenId);
    return TOKEN_ANOMALY_FLAGS.filter(([flag]) => tokenData?.[flag]);
  });

  return [...new Set([...printed, ...fromTokens].map(([, id]) => id))];
}

/** The wormhole types in a system, printed or from tokens, upper-cased. */
export function wormholesOnTile(tile: Tile): string[] {
  const tileData = getTileById(tile.systemId);
  const printed = (tileData?.wormholes ?? []).filter(
    (w): w is string => w !== null,
  );
  const fromTokens = tile.tokens.flatMap(
    (tokenId) => getTokenData(tokenId)?.wormholes ?? [],
  );

  return [...new Set([...printed, ...fromTokens].map((w) => w.toUpperCase()))];
}

/**
 * The systems adjacent to this one: those beside it on the map and, since
 * matching wormholes make systems adjacent for all purposes, every other
 * system sharing one of its wormholes.
 */
export function neighbourTiles(tile: Tile, tiles: Tiles | undefined): Tile[] {
  if (!tiles) return [];
  const beside = (tileAdjacencies[tile.position] ?? [])
    .filter((position): position is string => !!position)
    .map((position) => tiles[position])
    .filter((neighbour): neighbour is Tile => !!neighbour);
  const wormholes = wormholesOnTile(tile);
  const linked =
    wormholes.length === 0
      ? []
      : Object.values(tiles).filter(
          (other) =>
            other.position !== tile.position &&
            wormholesOnTile(other).some((w) => wormholes.includes(w)),
        );

  const byPosition = new Map<string, Tile>();
  for (const neighbour of [...beside, ...linked]) {
    byPosition.set(neighbour.position, neighbour);
  }
  return [...byPosition.values()];
}

/**
 * Anomalies a unit in this system is in or adjacent to: those of the system
 * itself and of each system adjacent to it, printed or from a token.
 */
export function anomaliesInOrNextTo(
  tile: Tile,
  tiles: Tiles | undefined,
): number {
  return [tile, ...neighbourTiles(tile, tiles)].reduce(
    (sum, system) => sum + systemAnomalies(system).length,
    0,
  );
}
