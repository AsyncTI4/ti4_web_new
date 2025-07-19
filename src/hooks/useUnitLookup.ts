import { PlayerData } from "@/data/types";
import { lookupUnit } from "@/lookup/units";
import { useMemo } from "react";

export const useUnitLookup = (
  unit: any,
  player?: PlayerData | null
) => {
    return useMemo(() => {
        if (!unit || !unit.unitId || !unit.faction)
        return null;

        // const activePlayer = player?.find(
        // (player) => player.faction === unit.faction
        // );
        if (!player) return null;


        return lookupUnit(unit.unitId, player.faction, player)?.id || unit.unitId;
    }, [unit, player]);
};
