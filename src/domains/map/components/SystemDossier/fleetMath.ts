import { lookupUnit } from "@/entities/lookup/units";
import type { EntityData, PlayerData, Unit } from "@/entities/data/types";
import {
  getUnitModifiers,
  modifiedCombatValue,
  type UnitModifiers,
} from "@/entities/game/unitModifiers";

export type UnitRow = {
  asyncId: string;
  unit: Unit;
  count: number;
  sustained: number;
  /** What its owner's upgrades and its surroundings do to its printed numbers. */
  modifiers: UnitModifiers;
};

export type ForceSummary = {
  /** Total build cost of everything present, in resources. */
  cost: number;
  /** Hits the force can absorb: one per unit, two with Sustain Damage, minus damage already taken. */
  hitPoints: number;
  /** Expected hits per combat round: Σ dice × P(hit). */
  expectedHits: number;
};

/**
 * The three numbers a player actually compares: what the force cost, how many
 * hits it soaks, and how many hits a round of combat is expected to produce.
 */
function summarizeRows(rows: UnitRow[]): ForceSummary {
  let cost = 0;
  let hitPoints = 0;
  let expectedHits = 0;
  for (const { unit, count, sustained, modifiers } of rows) {
    cost += Math.max(0, (unit.cost ?? 0) + (modifiers.costModifier ?? 0)) * count;
    hitPoints += count * (unit.sustainDamage ? 2 : 1) - sustained;
    if (!unit.combatHitsOn) continue;
    const dice = (unit.combatDieCount || 1) + (modifiers.bonusCombatDice ?? 0);
    const hitsOn = modifiedCombatValue(
      unit.combatHitsOn,
      modifiers.combatValueModifier,
    );
    const hitChance = Math.min(Math.max((11 - hitsOn) / 10, 0), 1);
    expectedHits += count * dice * hitChance;
  }

  return { cost, hitPoints, expectedHits };
}

/**
 * Reads a zone's entity list into unit rows. Uses `lookupUnit` so faction
 * variants and researched upgrades report their real stats.
 */
function collectUnitRows(
  entities: EntityData[],
  faction: string,
  playerData?: PlayerData,
  anomaliesNearby?: number,
): UnitRow[] {
  const rows: UnitRow[] = [];
  for (const entity of entities) {
    if (entity.entityType !== "unit" || entity.count <= 0) continue;
    const unit = lookupUnit(entity.entityId, faction, playerData);
    if (!unit) continue;
    rows.push({
      asyncId: entity.entityId,
      unit,
      count: entity.count,
      sustained: entity.sustained ?? 0,
      modifiers: getUnitModifiers(unit, playerData?.unitsOwned, anomaliesNearby),
    });
  }
  return rows;
}

/** "3" for whole numbers, "3.5" otherwise — the mono readouts stay compact. */
export function formatStat(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/**
 * Summarizes every faction in a zone. Racks show everything present, but only
 * units matching `countsInCombat` feed the combat math. `anomaliesNearby`
 * counts the anomalies the zone's system is in or next to, for the units
 * whose numbers depend on them.
 */
export function summarizeZone(
  unitsByFaction: Record<string, EntityData[]> | undefined,
  playerFor: (faction: string) => PlayerData | undefined,
  countsInCombat: (unit: Unit) => boolean | undefined,
  anomaliesNearby?: number,
) {
  return Object.entries(unitsByFaction ?? {})
    .map(([faction, entities]) => {
      const rows = collectUnitRows(
        entities,
        faction,
        playerFor(faction),
        anomaliesNearby,
      );
      const math = summarizeRows(
        rows.filter((row) => countsInCombat(row.unit)),
      );
      return { faction, rows, math };
    })
    .filter(({ rows }) => rows.length > 0);
}

export type Capacity = { used: number; total: number };

/**
 * Ship capacity in the space area: what the ships can carry against the
 * fighters and ground forces riding with them. Null when nothing carries.
 */
export function capacityOf(rows: UnitRow[]): Capacity | null {
  let total = 0;
  let used = 0;
  for (const { unit, count } of rows) {
    if (unit.isShip) total += (unit.capacityValue ?? 0) * count;
    if (unit.baseType === "fighter" || unit.isGroundForce) used += count;
  }
  return total > 0 ? { used, total } : null;
}
