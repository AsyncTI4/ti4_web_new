import { lookupUnit } from "@/lookup/units";
import { useGameData } from "@/hooks/useGameContext";
import { getUnitDecalPath } from "@/lookup/decals";

/**
 * Hook that retrieves background and player decal paths for a unit
 */
export function useDecalPaths(
  unitType: string,
  faction: string,
  colorAlias: string
): { bgDecalPath?: string; decalPath?: string | null } {
  const unitData = lookupUnit(unitType, faction);
  const bgDecalPath = unitData?.bgDecalPath;

  const gameData = useGameData();
  const playerData = gameData?.playerData?.find((p) => p.faction === faction);
  const decalPath = getUnitDecalPath(playerData, unitType, colorAlias);

  return { bgDecalPath, decalPath };
}

