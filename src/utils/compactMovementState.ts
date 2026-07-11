import type { StateCounts } from "@/utils/historicalMapTransitions";
import { deserializeCompactMapState } from "@/utils/compactMapState";

export type CompactMovementUnit = {
  colorId: string;
  unitId: string;
  states: StateCounts;
  ownerFaction?: "neutral";
};

export type CompactMovementSource = {
  position: string;
  holder: string;
  units: CompactMovementUnit[];
};

export type CompactMovementState = {
  targetPosition: string;
  targetHolder: string;
  sources: CompactMovementSource[];
};

function array(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`Invalid movement ${label}`);
  return value;
}

function string(value: unknown, label: string): string {
  if (typeof value !== "string") throw new Error(`Invalid movement ${label}`);
  return value;
}

function count(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid movement ${label}`);
  }
  return value;
}

export function deserializeCompactMovementState(
  serialized: string,
): CompactMovementState {
  const root = array(JSON.parse(serialized), "root");
  if (root[0] !== 2) {
    throw new Error(`Unsupported compact movement version: ${String(root[0])}`);
  }
  return {
    targetPosition: string(root[1], "target position"),
    targetHolder: string(root[2], "target holder"),
    sources: array(root[3], "sources").map((rawSource) => {
      const source = array(rawSource, "source");
      return {
        position: string(source[0], "source position"),
        holder: string(source[1], "source holder"),
        units: array(source[2], "source units").map((rawUnit) => {
          const unit = array(rawUnit, "unit");
          if (unit[6] !== undefined && unit[6] !== 1) {
            throw new Error("Invalid movement neutral owner marker");
          }
          return {
            colorId: string(unit[0], "unit color"),
            unitId: string(unit[1], "unit id"),
            states: [
              count(unit[2], "healthy count"),
              count(unit[3], "damaged count"),
              count(unit[4], "galvanized count"),
              count(unit[5], "damaged galvanized count"),
            ],
            ownerFaction: unit[6] === 1 ? "neutral" : undefined,
          };
        }),
      };
    }),
  };
}

function stateCount(states: StateCounts): number {
  return states.reduce((total, value) => total + value, 0);
}

/**
 * A tactical event can be preceded by map snapshots captured while its move is
 * only partially applied. Find the newest snapshot that can actually supply
 * every unit declared by the movement payload.
 */
export function findMovementBaseline(
  serializedCandidates: readonly string[],
  serializedMovement: string,
  movingFaction: string,
): string | undefined {
  let movement: CompactMovementState;
  try {
    movement = deserializeCompactMovementState(serializedMovement);
  } catch {
    return undefined;
  }

  for (let index = serializedCandidates.length - 1; index >= 0; index -= 1) {
    const serializedMap = serializedCandidates[index];
    try {
      const map = deserializeCompactMapState(serializedMap);
      const required = new Map<string, number>();

      for (const source of movement.sources) {
        for (const unit of source.units) {
          const faction = unit.ownerFaction ?? movingFaction;
          const key = `${source.position}\u0000${source.holder}\u0000${faction}\u0000${unit.unitId}`;
          required.set(
            key,
            (required.get(key) ?? 0) + stateCount(unit.states),
          );
        }
      }

      const satisfiesMovement = [...required].every(([key, needed]) => {
        const [position, holder, faction, unitId] = key.split("\u0000");
        const tile = map[position];
        const entities =
          holder === "space"
            ? tile?.space[faction]
            : tile?.planets[holder]?.entities[faction];
        const available =
          entities?.find(
            (entity) =>
              entity.entityType === "unit" && entity.entityId === unitId,
          )?.count ?? 0;
        return available >= needed;
      });

      if (satisfiesMovement) return serializedMap;
    } catch {
      // A malformed historical snapshot should not prevent older valid
      // snapshots from being considered.
    }
  }

  return undefined;
}
