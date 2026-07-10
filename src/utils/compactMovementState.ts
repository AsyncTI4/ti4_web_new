import type { StateCounts } from "@/utils/historicalMapTransitions";

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
