import { units } from "@/entities/data/units";
import { groupBy, indexBy } from "@/entities/lookup/indexBy";
import type { PlayerData, Unit } from "@/entities/data/types";

const unitsMap = indexBy(units, (unit) => unit.id);

const unitsAsyncIdMap = groupBy(units, (unit) => unit.asyncId);

const unitsByRequiredTechIdMap = groupBy(
  units,
  (unit) => unit.requiredTechId || undefined
);

export const getUnitData = (unitId: string) => {
  return unitsMap.get(unitId);
};

export const getOwnedTwilightsFallUnitByAsyncId = (
  asyncId: string,
  ownedUnits?: string[]
) => {
  if (!ownedUnits || ownedUnits.length === 0) return undefined;

  const unitsWithAsyncId = unitsAsyncIdMap.get(asyncId) || [];
  return unitsWithAsyncId.find(
    (unit) =>
      unit.source === "twilights_fall" &&
      unit.id.startsWith("tf-") &&
      ownedUnits.includes(unit.id)
  );
};

/** Prefers the generic (non-faction) unit for a given requiredTechId. */
export const getGenericUnitDataByRequiredTechId = (requiredTechId: string) => {
  const candidates = unitsByRequiredTechIdMap.get(requiredTechId) || [];
  return candidates.find((u) => !u.faction) ?? candidates[0];
};

/** Prefers base, then generic, unit data for labels when several units share an asyncId. */
export const getGenericUnitDataByAsyncId = (asyncId: string) => {
  const unitsWithAsyncId = unitsAsyncIdMap.get(asyncId) || [];
  if (unitsWithAsyncId.length === 0) return undefined;
  const baseUnits = unitsWithAsyncId.filter((u) => !u.upgradesFromUnitId);
  const genericBase = baseUnits.find((u) => !u.faction);
  if (genericBase) return genericBase;
  if (baseUnits.length > 0) return baseUnits[0];
  const genericAny = unitsWithAsyncId.find((u) => !u.faction);
  return genericAny || unitsWithAsyncId[0];
};

export function lookupUnit(
  asyncId: string,
  faction: string,
  playerData?: PlayerData,
  gameVariant?: string
) {
  const ownedUnits = playerData?.unitsOwned;
  const unitsWithAsyncId = unitsAsyncIdMap.get(asyncId);

  if (!unitsWithAsyncId) return null;

  if (faction.toLowerCase() === "neutral") {
    const variant = gameVariant?.toLowerCase() ?? "base";
    const variantUnits = unitsWithAsyncId.filter(
      (unit) => !unit.faction && unit.source === variant
    );
    return variantUnits.length > 0 ? preferUpgradedUnit(variantUnits) : null;
  }

  // First, if the player owns any unit with this asyncId, prefer that regardless of faction
  if (ownedUnits && ownedUnits.length > 0) {
    const ownedMatches = unitsWithAsyncId.filter((unit) =>
      ownedUnits.includes(unit.id)
    );
    if (ownedMatches.length > 0) {
      return preferUpgradedUnit(ownedMatches);
    }
  }

  const factionUnits = filterUnitsFromList(
    unitsWithAsyncId,
    faction,
    ownedUnits
  );
  if (factionUnits.length > 0) {
    return preferUpgradedUnit(factionUnits);
  }

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

    if (!faction) return !unit.faction;
    return unit.faction?.toLowerCase() === faction.toLowerCase();
  });
}

const NEKRO_FLAGSHIP_IDS = new Set([
  "nekro_flagship",
  "sigma_nekro_flagship_1",
  "sigma_nekro_flagship_2",
]);

export const isNekroFlagship = (unitId: string): boolean =>
  NEKRO_FLAGSHIP_IDS.has(unitId);
