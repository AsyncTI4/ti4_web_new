import { lookupUnit } from "@/entities/lookup/units";
import type { EntityData, PlayerData, Unit } from "@/entities/data/types";

export type UnitRow = {
  asyncId: string;
  unit: Unit;
  count: number;
  sustained: number;
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
  for (const { unit, count, sustained } of rows) {
    cost += (unit.cost ?? 0) * count;
    hitPoints += count * (unit.sustainDamage ? 2 : 1) - sustained;
    if (!unit.combatHitsOn) continue;
    const dice = unit.combatDieCount || 1;
    const hitChance = Math.min(Math.max((11 - unit.combatHitsOn) / 10, 0), 1);
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
 * units matching `countsInCombat` feed the combat math.
 */
export function summarizeZone(
  unitsByFaction: Record<string, EntityData[]> | undefined,
  playerFor: (faction: string) => PlayerData | undefined,
  countsInCombat: (unit: Unit) => boolean | undefined,
) {
  return Object.entries(unitsByFaction ?? {})
    .map(([faction, entities]) => {
      const rows = collectUnitRows(entities, faction, playerFor(faction));
      const math = summarizeRows(
        rows.filter((row) => countsInCombat(row.unit)),
      );
      return { faction, rows, math };
    })
    .filter(({ rows }) => rows.length > 0);
}
