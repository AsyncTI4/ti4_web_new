import type { FactionColorMap } from "@/app/providers/context/types";
import { findColorData } from "@/entities/lookup/colors";
import {
  compactDecoders,
  deserializeCompactMapState,
} from "@/utils/compactMapState";
import type { StateCounts, UnitLocation } from "@/utils/mapReplay/types";
import { rawLocationKey, stateCount } from "@/utils/mapReplay/unitState";

type CompactMovementUnit = {
  colorId: string;
  unitId: string;
  states: StateCounts;
  ownerFaction?: "neutral";
};

type CompactMovementSource = {
  position: string;
  holder: string;
  units: CompactMovementUnit[];
};

type CompactMovementState = {
  targetPosition: string;
  targetHolder: string;
  sources: CompactMovementSource[];
};

export function resolveCompactMovementFaction(
  unit: CompactMovementUnit,
  factionColors: FactionColorMap,
): string | undefined {
  if (unit.ownerFaction) return unit.ownerFaction;

  const entries = Object.values(factionColors);
  const exact = entries.find((entry) => entry.color === unit.colorId);
  if (exact) return exact.faction;

  const color = findColorData(unit.colorId);
  if (color) {
    const aliased = entries.find(
      (entry) => findColorData(entry.color)?.alias === color.alias,
    );
    if (aliased) return aliased.faction;
  }

  const normalize = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalizedId = normalize(unit.colorId);
  if (normalizedId.length < 3) return undefined;

  const prefixFactions = new Set(
    entries
      .filter(({ color: entryColor }) => {
        const normalizedColor = normalize(entryColor);
        return (
          normalizedColor.startsWith(normalizedId) ||
          normalizedId.startsWith(normalizedColor)
        );
      })
      .map(({ faction }) => faction),
  );
  return prefixFactions.size === 1 ? [...prefixFactions][0] : undefined;
}

const { array, string, count } = compactDecoders("movement");

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

  const required = new Map<string, RequiredUnits>();
  for (const source of movement.sources) {
    for (const unit of source.units) {
      const location: UnitLocation = {
        position: source.position,
        holder: source.holder,
        faction: unit.ownerFaction ?? movingFaction,
        unitId: unit.unitId,
      };
      const key = rawLocationKey(location);
      const needed = (required.get(key)?.needed ?? 0) + stateCount(unit.states);
      required.set(key, { location, needed });
    }
  }

  const requiredUnits = [...required.values()];
  for (let index = serializedCandidates.length - 1; index >= 0; index -= 1) {
    const serializedMap = serializedCandidates[index];
    if (snapshotSuppliesUnits(serializedMap, requiredUnits)) {
      return serializedMap;
    }
  }

  return undefined;
}

type RequiredUnits = { location: UnitLocation; needed: number };

/** A malformed historical snapshot is skipped so older valid ones are still considered. */
function snapshotSuppliesUnits(
  serializedMap: string,
  required: RequiredUnits[],
): boolean {
  let map: ReturnType<typeof deserializeCompactMapState>;
  try {
    map = deserializeCompactMapState(serializedMap);
  } catch {
    return false;
  }

  return required.every(({ location, needed }) => {
    const { position, holder, faction, unitId } = location;
    const tile = map[position];
    const entities =
      holder === "space"
        ? tile?.space[faction]
        : tile?.planets[holder]?.entities[faction];
    const available =
      entities?.find(
        (entity) => entity.entityType === "unit" && entity.entityId === unitId,
      )?.count ?? 0;
    return available >= needed;
  });
}
