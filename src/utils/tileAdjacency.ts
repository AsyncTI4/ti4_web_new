import { TileUnitData } from "@/data/types";
import { tileAdjacencies } from "../data/tileAdjacencies";
import { systems } from "@/data/systems";
import { translateWormholeChannel, wormHoleEntities } from "./wormholeUtil";

/**
 * Core logic: Determine which hex sides should be "open" (sparse borders) vs "closed" (solid borders)
 *
 * For each stat tile:
 * - Check each of its 6 adjacent directions (0-5)
 * - If the adjacent tile in that direction is also a stat tile, mark that side as "open"
 * - "Open" sides get sparse/dotted borders (internal connections)
 * - "Closed" sides get solid borders (outer edges)
 */
export function determineOpenSides(statTiles: string[]): OpenSidesResult {
  const result: OpenSidesResult = {};

  for (const tilePos of statTiles) {
    const openSides: number[] = [];
    const adjacentPositions = tileAdjacencies[tilePos];

    if (!adjacentPositions) continue; // Skip if no adjacency data found

    // Check each of the 6 directions (0=N, 1=NE, 2=SE, 3=S, 4=SW, 5=NW)
    for (let direction = 0; direction < 6; direction++) {
      const adjacentPos = adjacentPositions[direction];

      // If the adjacent position exists and is also in our statTiles array,
      // then this side should be "open" (sparse border)
      if (adjacentPos && statTiles.includes(adjacentPos)) {
        openSides.push(direction);
      }
    }

    result[tilePos] = openSides;
  }

  return result;
}

export function determineTileAdjacencies(systemId: string, position: string, tileData: Record<string, TileUnitData>): (string | null)[] {
  const targetSystem = systems.find((s) => s.id === systemId);
  const targetTileUnitData = tileData[position];

  if (!targetTileUnitData || !targetSystem) {
    return [];
  }

  //Grab tile positional adjacencies
  const resultAdjacentTiles = tileAdjacencies[position];

  //Grab wormhole adjacencies. 
  //Step 1: Start by finding wormholes in target system tile. This gets wormholes tied to the system.
  let targetTileWormholes: string[] = [];
  const systemWormholes = targetSystem.wormholes;
  if(systemWormholes) {
    targetTileWormholes.push(...systemWormholes);
  }

  //Step 2: find wormhole tokens on tile.
  const tileWormholes = targetTileUnitData.space["neutral"].filter((e) => e.entityType === "token" && wormHoleEntities.includes(e.entityId)).map((e) => e.entityId)
  if(tileWormholes) {
    targetTileWormholes.push(...tileWormholes);
  }
  
  //Step 3: Merge different wormhole entities to similar wormhole channel (ALPHA, BETA, GAMMA)
  const tileWormholeChannels = new Set(targetTileWormholes.map((wormholeId) => translateWormholeChannel(wormholeId)).filter(channel => !!channel))

  //Step 4: Get tile IDs that have similar wormhole channels
  if(tileWormholeChannels.size > 0) {
    const wormholeAdjacents = Object.entries(tileData)
    .filter(([_, t]) => t.space["neutral"]?.filter((e) => {
      e.entityType === "token" 
        && wormHoleEntities.includes(e.entityId)
        const wormholeChannel = translateWormholeChannel(e.entityId)
        if(wormholeChannel && tileWormholeChannels.has(wormholeChannel)) {
          return true;
        }
    }))

    //Step 5: Push any wormhole adjacents into the result
    if(wormholeAdjacents) {
      wormholeAdjacents.forEach(([k, _]) => {
        resultAdjacentTiles.push(k)
      })
    }
  }

  return resultAdjacentTiles;
}

type OpenSidesResult = {
  [tilePosition: string]: number[]; // Array of direction indices (0-5) that should be "open"
};
