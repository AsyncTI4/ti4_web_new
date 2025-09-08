import { units } from "../data/units";
import { PlayerData, Unit } from "../data/types";

// Create efficient lookup maps
const unitsMap = new Map(units.map((unit) => [unit.id, unit]));

// For asyncId map, we need to handle multiple units with same asyncId
// Include ALL units (both generic and faction-specific)
const unitsAsyncIdMap = new Map<string, Unit[]>();
units.forEach((unit) => {
  const existingUnits = unitsAsyncIdMap.get(unit.asyncId) || [];
  unitsAsyncIdMap.set(unit.asyncId, [...existingUnits, unit]);
});

export const getUnitAsyncId = (unitId: string) => {
  const unit = unitsMap.get(unitId);
  return unit?.asyncId;
};

export const getUnitData = (unitId: string) => {
  return unitsMap.get(unitId);
};

export const getUnitDataByAsyncId = (asyncId: string) => {
  const unitsWithAsyncId = unitsAsyncIdMap.get(asyncId);
  return unitsWithAsyncId?.[0]; // Return first match for backwards compatibility
};

// Build a map from requiredTechId -> units for quick lookup
const unitsByRequiredTechIdMap = new Map<string, Unit[]>();
units.forEach((unit) => {
  if (!unit.requiredTechId) return;
  const existing = unitsByRequiredTechIdMap.get(unit.requiredTechId) || [];
  unitsByRequiredTechIdMap.set(unit.requiredTechId, [...existing, unit]);
});

// Prefer generic (non-faction) unit for a given requiredTechId
export const getGenericUnitDataByRequiredTechId = (requiredTechId: string) => {
  const candidates = unitsByRequiredTechIdMap.get(requiredTechId) || [];
  if (candidates.length === 0) return undefined;

  const nonFaction = candidates.find((u) => !u.faction);
  if (nonFaction) return nonFaction;
  return candidates[0];
};

// Prefer generic (non-faction) unit data for labels when multiple units share the same asyncId
export const getGenericUnitDataByAsyncId = (asyncId: string) => {
  const unitsWithAsyncId = unitsAsyncIdMap.get(asyncId) || [];
  if (unitsWithAsyncId.length === 0) return undefined;
  // Prefer base (non-upgraded) entries
  const baseUnits = unitsWithAsyncId.filter((u) => !u.upgradesFromUnitId);
  // Among base, prefer generic (non-faction) first
  const genericBase = baseUnits.find((u) => !u.faction);
  if (genericBase) return genericBase;
  if (baseUnits.length > 0) return baseUnits[0];
  // Fallbacks if no base found
  const genericAny = unitsWithAsyncId.find((u) => !u.faction);
  return genericAny || unitsWithAsyncId[0];
};

export const isUnitUpgraded = (unitId: string) => {
  const unitData = unitsMap.get(unitId);
  return unitData?.upgradesFromUnitId !== undefined;
};

export const isUnitUpgradedOrWarSun = (unitId: string) => {
  const unitData = unitsMap.get(unitId);
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
  const unitsWithAsyncId = unitsAsyncIdMap.get(asyncId);

  if (!unitsWithAsyncId) return null;

  // First, if the player owns any unit with this asyncId, prefer that regardless of faction
  if (ownedUnits && ownedUnits.length > 0) {
    const ownedMatches = unitsWithAsyncId.filter((unit) =>
      ownedUnits.includes(unit.id)
    );
    if (ownedMatches.length > 0) {
      return preferUpgradedUnit(ownedMatches);
    }
  }

  // Try faction-specific units first
  const factionUnits = filterUnitsFromList(
    unitsWithAsyncId,
    faction,
    ownedUnits
  );
  if (factionUnits.length > 0) {
    return preferUpgradedUnit(factionUnits);
  }

  // Fall back to generic units
  const genericUnits = filterUnitsFromList(
    unitsWithAsyncId,
    undefined,
    ownedUnits
  );
  if (genericUnits.length > 0) {
    return preferUpgradedUnit(genericUnits);
  }

  return null;
}

function preferUpgradedUnit(unitsList: Unit[]) {
  const upgradedUnit = unitsList.find((unit) => unit.upgradesFromUnitId);
  return upgradedUnit || unitsList[0];
}

function filterUnitsFromList(
  unitsList: Unit[],
  faction?: string,
  ownedUnits?: string[]
) {
  return unitsList.filter((unit) => {
    if (ownedUnits && !ownedUnits.includes(unit.id)) return false;

    // Check faction match
    if (faction) {
      return unit.faction?.toLowerCase() === faction.toLowerCase();
    } else {
      return !unit.faction; // Generic units
    }
  });
}
