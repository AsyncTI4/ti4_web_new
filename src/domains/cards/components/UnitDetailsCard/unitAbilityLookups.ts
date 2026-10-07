import { getUnitData } from "@/entities/lookup/units";
import { getTechData } from "@/entities/lookup/tech";
import type { PlayerData, Unit } from "@/entities/data/types";

export const DICE_ABILITIES = [
  {
    label: "Anti-Fighter Barrage",
    hitsOn: "afbHitsOn",
    dieCount: "afbDieCount",
  },
  {
    label: "Bombardment",
    hitsOn: "bombardHitsOn",
    dieCount: "bombardDieCount",
  },
  {
    label: "Space Cannon",
    hitsOn: "spaceCannonHitsOn",
    dieCount: "spaceCannonDieCount",
  },
] as const;

type DiceStats = Partial<
  Pick<
    Unit,
    | (typeof DICE_ABILITIES)[number]["hitsOn"]
    | (typeof DICE_ABILITIES)[number]["dieCount"]
  >
>;

export type NamedAbility = { unitName: string; ability: string };

export type InheritedAbilities = DiceStats & {
  abilities: NamedAbility[];
  sustainDamage?: boolean;
};

export type AssimilatedAbility = {
  faction: string;
  flagshipName: string;
  ability: string;
};

const INHERITABLE_BASE_TYPES = ["destroyer", "cruiser", "dreadnought"];

/** Classic upgrades (destroyer2) plus Twilight's Fall "tf-" unit upgrade techs. */
function isUnitUpgradeTechnology(unitId: string, unit: Unit): boolean {
  return !!unit.upgradesFromUnitId || unitId.startsWith("tf-");
}

function inheritableUnit(unitId: string): Unit | undefined {
  const unit = getUnitData(unitId);
  if (!unit || !isUnitUpgradeTechnology(unitId, unit)) return undefined;
  return INHERITABLE_BASE_TYPES.includes(unit.baseType) ? unit : undefined;
}

/** The pinktf flagship gains the abilities of its owner's upgraded ships. */
export function getInheritedAbilitiesForPinktfFlagship(
  playerUnitsOwned?: string[],
): InheritedAbilities | null {
  if (!playerUnitsOwned) return null;

  const inherited: InheritedAbilities = { abilities: [] };
  for (const ownedUnitId of playerUnitsOwned) {
    const ownedUnit = inheritableUnit(ownedUnitId);
    if (!ownedUnit) continue;

    if (ownedUnit.ability) {
      inherited.abilities.push({
        unitName: ownedUnit.name,
        ability: ownedUnit.ability,
      });
    }
    for (const { hitsOn, dieCount } of DICE_ABILITIES) {
      if (!ownedUnit[hitsOn]) continue;
      inherited[hitsOn] = ownedUnit[hitsOn];
      inherited[dieCount] = ownedUnit[dieCount];
    }
    if (ownedUnit.sustainDamage) inherited.sustainDamage = true;
  }

  const hasAny =
    inherited.abilities.length > 0 ||
    inherited.sustainDamage ||
    DICE_ABILITIES.some(({ hitsOn }) => inherited[hitsOn]);
  return hasAny ? inherited : null;
}

export function getUpgradeInfo(upgradesToUnitId: string) {
  const upgradeUnit = getUnitData(upgradesToUnitId);
  if (!upgradeUnit?.requiredTechId) return null;

  const upgradeTech = getTechData(upgradeUnit.requiredTechId);
  if (!upgradeTech) return null;

  return { upgradeUnit, upgradeTech };
}

function flagshipAbilityFor(
  targetFaction: string,
  allPlayerData: PlayerData[],
): AssimilatedAbility | null {
  const targetPlayer = allPlayerData.find(
    (p) => p.faction.toLowerCase() === targetFaction.toLowerCase(),
  );
  const flagshipUnitId = targetPlayer?.unitsOwned.find(
    (unitId) => getUnitData(unitId)?.baseType === "flagship",
  );
  if (!flagshipUnitId) return null;

  const flagshipData = getUnitData(flagshipUnitId);
  if (!flagshipData?.ability) return null;

  return {
    faction: targetFaction,
    flagshipName: flagshipData.name,
    ability: flagshipData.ability,
  };
}

/** The Nekro flagship copies the flagship abilities of Valefar Z targets. */
export function getAssimilatedAbilitiesForNekroFlagship(
  valefarZTargets?: string[],
  allPlayerData?: PlayerData[],
): AssimilatedAbility[] {
  if (!valefarZTargets?.length || !allPlayerData?.length) return [];
  return valefarZTargets
    .map((faction) => flagshipAbilityFor(faction, allPlayerData))
    .filter((ability): ability is AssimilatedAbility => ability !== null);
}
