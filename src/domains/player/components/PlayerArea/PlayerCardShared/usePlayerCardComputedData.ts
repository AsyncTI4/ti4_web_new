import { useMemo } from "react";
import { getFactionImage } from "@/entities/lookup/factions";
import { usePlanetEconomics } from "@/hooks/usePlanetEconomics";
import type { PlayerData } from "@/entities/data/types";
import { getPlayerCardTechData } from "./playerCardTechUtils";

export function usePlayerCardComputedData(playerData: PlayerData) {
  const planetEconomics = usePlanetEconomics(playerData);

  const { filteredTechs, allNotResearchedFactionTechs } =
    getPlayerCardTechData({
      techs: playerData.techs,
      notResearchedFactionTechs: playerData.notResearchedFactionTechs,
    });

  const factionImageUrl = useMemo(
    () =>
      getFactionImage(
        playerData.faction,
        playerData.factionImage,
        playerData.factionImageType,
      ),
    [playerData.faction, playerData.factionImage, playerData.factionImageType],
  );

  const armyStats = useMemo(
    () => ({
      spaceArmyRes: playerData.spaceArmyRes,
      groundArmyRes: playerData.groundArmyRes,
      spaceArmyHealth: playerData.spaceArmyHealth,
      groundArmyHealth: playerData.groundArmyHealth,
      spaceArmyCombat: playerData.spaceArmyCombat,
      groundArmyCombat: playerData.groundArmyCombat,
    }),
    [
      playerData.spaceArmyRes,
      playerData.groundArmyRes,
      playerData.spaceArmyHealth,
      playerData.groundArmyHealth,
      playerData.spaceArmyCombat,
      playerData.groundArmyCombat,
    ],
  );

  return {
    factionImageUrl,
    planetEconomics,
    filteredTechs,
    allNotResearchedFactionTechs,
    promissoryNotes: playerData.promissoryNotesInPlayArea || [],
    mahactEdict: playerData.mahactEdict || [],
    armyStats,
  } as const;
}
