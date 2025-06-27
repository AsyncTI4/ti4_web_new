import { units } from "../data/units";
import { PlayerData } from "../data/types";

export const getUnitAsyncId = (unitId: string) => {
  return units.find((u) => u.id === unitId)?.asyncId;
};

export const getUnitData = (unitId: string) => {
  return units.find((unit) => unit.id === unitId);
};

export const getUnitDataByAsyncId = (asyncId: string) => {
  return units.find((unit) => unit.asyncId === asyncId);
};

export const isUnitUpgraded = (unitId: string) => {
  const unitData = getUnitData(unitId);
  return unitData?.upgradesFromUnitId !== undefined;
};

export const isUnitUpgradedOrWarSun = (unitId: string) => {
  const unitData = getUnitData(unitId);
  return (
    unitData?.upgradesFromUnitId !== undefined ||
    unitData?.baseType === "warsun"
  );
};

export function lookupUnit(
  asyncId: string,
  faction: string,
  playerData?: PlayerData
) {
  const ownedUnits = playerData?.unitsOwned;

  // Try faction-specific units first
  const factionUnits = filterUnits(asyncId, faction, ownedUnits);
  if (factionUnits.length > 0) {
    return preferUpgradedUnit(factionUnits);
  }

  // Fall back to generic units
  const genericUnits = filterUnits(asyncId, undefined, ownedUnits);
  if (genericUnits.length > 0) {
    return preferUpgradedUnit(genericUnits);
  }

  return null;
}

function preferUpgradedUnit(unitsList: Array<any>) {
  const upgradedUnit = unitsList.find((unit) => unit.upgradesFromUnitId);
  return upgradedUnit || unitsList[0];
}

// Helper function to filter units by criteria
function filterUnits(asyncId: string, faction?: string, ownedUnits?: string[]) {
  return units.filter((unit) => {
    if (unit.asyncId !== asyncId) return false;
    if (ownedUnits && !ownedUnits.includes(unit.id)) return false;

    // Check faction match
    if (faction) {
      return unit.faction?.toLowerCase() === faction.toLowerCase();
    } else {
      return !unit.faction; // Generic units
    }
  });
}
