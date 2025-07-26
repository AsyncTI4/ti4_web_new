import { PlayerData, SpaceCannon, SpaceCannonShotDetails, TileUnitData } from "@/data/types";
import { determineTileAdjacencies } from "./tileAdjacency";
import { lookupUnit } from "@/lookup/units";

// export function processSpaceCannon(
//     tileData: TileData[]

// ): Map<String, SpaceCannon[]> | undefined{
//     const spaceCannonMap

// }

export function processSystemSpaceCannon(
    systemId: string,
    position: string,
    tileUnitData: Record<string, TileUnitData>,
    playerData: PlayerData[] 
): {[factionName: string]: SpaceCannonShotDetails} | undefined {
    const systemSpaceCannons: {[factionName: string]: SpaceCannonShotDetails} = {};
    
    const targetTileData = (tileUnitData as any)[position] as TileUnitData
    const tileAdjacencies = determineTileAdjacencies(systemId, position, tileUnitData).filter((t) => !!t)

    let spaceCannons: {[factionName: string]: SpaceCannon[]} = {};
    
    // Get space cannons in target system
    if(targetTileData?.planets) {
        for (const [_, planetData] of Object.entries(targetTileData.planets)) {
            if (planetData?.entities) {
                for (const [faction, entities] of Object.entries(planetData.entities)) {
                    if (Array.isArray(entities)) {
                        for (const entity of entities) {
                            if (entity.entityType === "unit") {
                                const unitData = lookupUnit(entity.entityId, faction)
                                if (unitData?.spaceCannonDieCount && unitData?.spaceCannonHitsOn)
                                {
                                    if(spaceCannons[faction] === undefined) {
                                        spaceCannons[faction] = []
                                    }
                                    spaceCannons[faction].push({
                                        diceCount: unitData.spaceCannonDieCount,
                                        hitOn: unitData.spaceCannonHitsOn,
                                        deepSpace: unitData.deepSpaceCannon
                                    } as SpaceCannon)
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    for( const [_, value] of Object.entries(tileUnitData).filter(([key, _]) => tileAdjacencies.includes(key)))
        if(value?.planets) {
        for (const [_, planetData] of Object.entries(value.planets)) {
            if (planetData?.entities) {
                for (const [faction, entities] of Object.entries(planetData.entities)) {
                    if (Array.isArray(entities)) {
                        for (const entity of entities) {
                            if (entity.entityType === "unit") {
                                const unitData = lookupUnit(entity.entityId, faction)
                                if (unitData?.spaceCannonDieCount && unitData?.spaceCannonHitsOn && unitData.deepSpaceCannon)
                                {
                                    if(spaceCannons[faction] === undefined) {
                                        spaceCannons[faction] = []
                                    }
                                    spaceCannons[faction].push({
                                        diceCount: unitData.spaceCannonDieCount,
                                        hitOn: unitData.spaceCannonHitsOn,
                                        deepSpace: unitData.deepSpaceCannon
                                    } as SpaceCannon)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if(Object.entries(spaceCannons).length > 0) {
        for ( const [faction, sc] of Object.entries(spaceCannons)) {
            if(systemSpaceCannons[faction] === undefined) {
                systemSpaceCannons[faction] = {
                        spaceCannons: [],
                        plasmaScoring: false
                }
            }
            systemSpaceCannons[faction].spaceCannons.push(...sc);
            systemSpaceCannons[faction].plasmaScoring = playerData.find((p) => p.faction === faction)?.techs.some((t) => t === "ps")
        }
    }
    


    return systemSpaceCannons;
}

// export function processExpectedHits(
//     spaceCannons: SpaceCannon[]
// ): number {
//     let expectedHits: number = 0;
//     spaceCannons.forEach((spaceCannon) => {
//         expectedHits = expectedHits + (spaceCannon.diceCount * spaceCannon.hitOn / 10)
//     })
    
//     return expectedHits;
// }


export function processExpectedHits(
    spaceCannons: SpaceCannonShotDetails
): number {
    let expectedHits: number = 0;
    spaceCannons.spaceCannons.forEach((spaceCannon) => {
        expectedHits = expectedHits + (spaceCannon.diceCount * spaceCannon.hitOn / 10)
    })
    
    return expectedHits;
}