import { getFactionImage } from "@/entities/lookup/factions";
import { partitionGenericTechs } from "@/entities/lookup/tech";
import { usePlanetEconomics } from "@/hooks/usePlanetEconomics";
import type { PlayerData } from "@/entities/data/types";

export function usePlayerCardComputedData(playerData: PlayerData) {
  const planetEconomics = usePlanetEconomics(playerData);
  const { genericTechs, standardTechs } = partitionGenericTechs(
    playerData.techs ?? []
  );

  return {
    factionImageUrl: getFactionImage(
      playerData.faction,
      playerData.factionImage,
      playerData.factionImageType
    ),
    planetEconomics,
    filteredTechs: standardTechs,
    allNotResearchedFactionTechs: [
      ...(playerData.notResearchedFactionTechs ?? []),
      ...genericTechs,
    ],
    promissoryNotes: playerData.promissoryNotesInPlayArea || [],
    mahactEdict: playerData.mahactEdict || [],
    armyStats: {
      spaceArmyRes: playerData.spaceArmyRes,
      groundArmyRes: playerData.groundArmyRes,
      spaceArmyHealth: playerData.spaceArmyHealth,
      groundArmyHealth: playerData.groundArmyHealth,
      spaceArmyCombat: playerData.spaceArmyCombat,
      groundArmyCombat: playerData.groundArmyCombat,
    },
  };
}
