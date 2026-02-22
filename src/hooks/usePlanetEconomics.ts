import { useMemo } from "react";
import type { PlayerData } from "@/entities/data/types";
import { hasXxchaFlexSpendAbility } from "@/utils/xxchaFlexSpend";

export function usePlanetEconomics(playerData: PlayerData) {
  return useMemo(() => {
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
  }, [
    playerData.resources,
    playerData.totResources,
    playerData.influence,
    playerData.totInfluence,
    playerData.optimalResources,
    playerData.totOptimalResources,
    playerData.optimalInfluence,
    playerData.totOptimalInfluence,
    playerData.flexValue,
    playerData.totFlexValue,
    playerData.faction,
    playerData.breakthrough,
    playerData.leaders,
  ]);
}

