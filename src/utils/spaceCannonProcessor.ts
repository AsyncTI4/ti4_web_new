import { SpaceCannon, TileData } from "@/data/types";

// export function processSpaceCannon(
//     tileData: TileData[]

// ): Map<String, SpaceCannon[]> | undefined{
//     const spaceCannonMap

// }

export function processSpaceCannon(
    tileData: TileData
): Map<String, SpaceCannon[]> | undefined{
    const spaceCannonMap: Map<String, SpaceCannon[]> = new Map();
    
//   if (tileData.tileUnitData?.planets) {
//     for (const [_, planetData] of Object.entries(tileUnitData.planets)) {
//       if (planetData?.entities) {
//         for (const [faction, entities] of Object.entries(planetData.entities)) {
//           if (Array.isArray(entities)) {
//             return entities.filter((entity) => entity.entityType === "unit" && entity.entityId === "pds")
//           }
//         }
//       }
//     }
//   }

    return spaceCannonMap;
}