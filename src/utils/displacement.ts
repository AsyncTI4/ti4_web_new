import type { PlayerDataResponse, EntityData } from "@/entities/data/types";
import type { DisplacementDraft, UnitCounts } from "@/utils/movementStore";

/**
 * Apply a displacement draft to a snapshot of PlayerDataResponse.
 * - Removes units from all origin areas (space + planets)
 * - Adds all removed units into the target system space
 */
export function applyDisplacementToPlayerData(
  source: PlayerDataResponse,
  draft: DisplacementDraft
): PlayerDataResponse {
  if (!draft?.targetPositionId) return source;
  if (!draft?.origins || Object.keys(draft.origins).length === 0) return source;
  if (!source?.tileUnitData) return source;

  // Deep-clone the full structure so we can safely mutate without affecting the original
  const next: PlayerDataResponse = structuredClone(source);

  // Remove from all origin tiles first
  Object.entries(draft.origins).forEach(([originPosition, originDraft]) => {
    if (!next.tileUnitData[originPosition]) return;
    const entry = next.tileUnitData[originPosition];

    // Space: subtract selected units from origin stacks
    Object.entries(originDraft.space).forEach(([faction, units]) => {
      subtractUnitsFromStack(entry.space[faction], units);
    });

    // Planets: subtract selected units from each planet's faction stack
    Object.entries(originDraft.planets).forEach(([planetName, area]) => {
      const ped = entry.planets[planetName];
      if (!ped) return;
      Object.entries(area).forEach(([faction, units]) => {
        subtractUnitsFromStack(ped.entities[faction], units);
      });
    });
  });

  // Add everything into target space
  const target = next.tileUnitData[draft.targetPositionId];
  if (!target) return next;

  // Add to target space from all origins (space plus planets)
  Object.values(draft.origins).forEach((originDraft) => {
    Object.entries(originDraft.space).forEach(([faction, units]) => {
      target.space[faction] = addUnitsToSpaceStack(
        target.space[faction],
        units
      );
    });
    Object.values(originDraft.planets).forEach((area) => {
      Object.entries(area).forEach(([faction, units]) => {
        target.space[faction] = addUnitsToSpaceStack(
          target.space[faction],
          units
        );
      });
    });
  });

  return next;
}

type UnitMap = Record<string, UnitCounts>;

function subtractUnitsFromStack(
  stack: EntityData[] | undefined,
  subtract: UnitMap
): void {
  if (!stack || stack.length === 0) return;
  Object.entries(subtract).forEach(([unitType, counts]) => {
    const idx = stack.findIndex(
      (e) => e.entityType === "unit" && e.entityId === unitType
    );
    if (idx < 0) return;
    const u = stack[idx] as EntityData;
    const total = counts.healthy + counts.sustained;
    u.count = Math.max(0, u.count - total);
    u.sustained = Math.max(0, (u.sustained ?? 0) - counts.sustained);
    if (u.count === 0) stack.splice(idx, 1);
  });
}

function addUnitsToSpaceStack(
  stack: EntityData[] | undefined,
  add: UnitMap
): EntityData[] {
  const out = stack ? [...stack] : [];
  Object.entries(add).forEach(([unitType, counts]) => {
    const idx = out.findIndex(
      (e) => e.entityType === "unit" && e.entityId === unitType
    );
    if (idx >= 0) {
      const current = out[idx] as EntityData;
      out[idx] = {
        ...current,
        count: current.count + counts.healthy + counts.sustained,
        sustained: (current.sustained ?? 0) + counts.sustained,
      } as EntityData;
    } else {
      out.push({
        entityId: unitType,
        entityType: "unit",
        count: counts.healthy + counts.sustained,
        sustained: counts.sustained,
      } as EntityData);
    }
  });
  return out;
}
