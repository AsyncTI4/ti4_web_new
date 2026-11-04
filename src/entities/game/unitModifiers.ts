import type { Unit } from "@/entities/data/types";

/** Why a printed stat is not what the unit rolls with, for the card's footnote. */
export type UnitModifierNote = {
  key: string;
  text: string;
  tone: "green" | "violet";
};

export type UnitModifiers = {
  costModifier?: number;
  /** Added to the printed COMBAT value: negative is better. */
  combatValueModifier?: number;
  bonusCombatDice?: number;
  moveModifier?: number;
  capacityModifier?: number;
  notes: UnitModifierNote[];
};

const EIDOLON_TERMINUS = "tf-eidolonterminus";
const EIDOLON_LANDWASTER = "tf-eidolonlandwaster";
const VALEFAR_PRIME = "tf-valefarprime";
const ECHO_OF_ASCENSION = "tf-echoofascension";
const STARLANCER_XI = "purpletf_mech";

/**
 * Twilight's Fall unit upgrades kept in the play area beside the normal unit
 * card: they change the owner's unit of that type instead of replacing it.
 */
export const PLAY_AREA_UNIT_UPGRADES: Record<string, string> = {
  [EIDOLON_TERMINUS]: "mech",
  [EIDOLON_LANDWASTER]: "mech",
  [VALEFAR_PRIME]: "mech",
  [ECHO_OF_ASCENSION]: "flagship",
};

export const isPlayAreaUnitUpgrade = (unitId: string) =>
  unitId in PLAY_AREA_UNIT_UPGRADES;

/** The play-area upgrades the player owns that change units of this type. */
export function ownedPlayAreaUpgrades(
  baseType: string,
  unitsOwned: string[] | undefined,
): string[] {
  return (unitsOwned ?? []).filter(
    (id) => PLAY_AREA_UNIT_UPGRADES[id] === baseType,
  );
}

function signed(value: number) {
  return `${value > 0 ? "+" : ""}${value}`;
}

/**
 * What changes a unit's printed numbers for its owner: the Twilight's Fall
 * mech upgrades kept beside the normal mech card (Eidolon Terminus −1 combat,
 * Eidolon Landwaster +1 die, Valefar Prime −1 cost), the flagship one kept
 * beside the normal flagship card (Echo of Ascension −1 combat, +1 die,
 * +1 move, +2 capacity) and, where the unit's
 * system is known, Starlancer XI's +1 to its rolls per anomaly it is in or
 * adjacent to.
 */
export function getUnitModifiers(
  unit: Unit,
  unitsOwned: string[] | undefined,
  anomaliesNearby?: number,
): UnitModifiers {
  const owns = (id: string) =>
    PLAY_AREA_UNIT_UPGRADES[id] === unit.baseType &&
    unit.id !== id &&
    !!unitsOwned?.includes(id);

  let combat = 0;
  let dice = 0;
  let cost = 0;
  let move = 0;
  let capacity = 0;
  const notes: UnitModifierNote[] = [];

  if (owns(VALEFAR_PRIME)) {
    cost -= 1;
    notes.push({ key: "cost", tone: "green", text: "−1 cost (Valefar Prime)" });
  }
  if (owns(EIDOLON_TERMINUS)) {
    combat -= 1;
    notes.push({
      key: "terminus",
      tone: "green",
      text: "−1 combat (Eidolon Terminus)",
    });
  }
  if (owns(ECHO_OF_ASCENSION)) {
    combat -= 1;
    dice += 1;
    move += 1;
    capacity += 2;
    notes.push({
      key: "echo",
      tone: "green",
      text: "−1 combat, +1 die, +1 move, +2 capacity (Echo of Ascension)",
    });
  }
  if (unit.id === STARLANCER_XI && anomaliesNearby) {
    combat -= anomaliesNearby;
    notes.push({
      key: "starlancer",
      tone: "green",
      text: `${signed(-anomaliesNearby)} combat (Starlancer XI, ${anomaliesNearby} ${anomaliesNearby === 1 ? "anomaly" : "anomalies"} in or adjacent)`,
    });
  }
  if (owns(EIDOLON_LANDWASTER)) {
    dice += 1;
    notes.push({
      key: "dice",
      tone: "violet",
      text: "+1 die (Eidolon Landwaster)",
    });
  }

  return {
    costModifier: cost || undefined,
    combatValueModifier: combat || undefined,
    bonusCombatDice: dice || undefined,
    moveModifier: move || undefined,
    capacityModifier: capacity || undefined,
    notes,
  };
}

/** Units that are not ships yet fight in space combat: Starlancer XI. */
export function fightsAsShip(unit: Unit): boolean {
  return unit.id === STARLANCER_XI;
}

/** The COMBAT value after modifiers; a roll of 10 always hits, so never below 1. */
export function modifiedCombatValue(
  hitsOn: number,
  modifier: number | undefined,
): number {
  return Math.max(1, hitsOn + (modifier ?? 0));
}
