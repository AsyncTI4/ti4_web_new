import type { PlayerData } from "@/entities/data/types";
import { hasXxchaFlexSpendAbility } from "@/entities/game/xxchaFlexSpend";

export function usePlanetEconomics(playerData: PlayerData) {
  const flexSpendOnly = hasXxchaFlexSpendAbility(
    playerData.faction,
    playerData.breakthrough,
    playerData.leaders
  );

  return {
    total: {
      currentResources: playerData.resources,
      totalResources: playerData.totResources,
      currentInfluence: playerData.influence,
      totalInfluence: playerData.totInfluence,
    },
    optimal: {
      currentResources: playerData.optimalResources,
      totalResources: playerData.totOptimalResources,
      currentInfluence: playerData.optimalInfluence,
      totalInfluence: playerData.totOptimalInfluence,
    },
    flex: {
      currentFlex: playerData.flexValue,
      totalFlex: playerData.totFlexValue,
    },
    flexSpendOnly,
  };
}
