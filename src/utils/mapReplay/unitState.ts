import type { GameData } from "@/app/providers/context/types";
import type { EntityStack } from "@/utils/unitPositioning";
import type {
  LocatedStack,
  ReplayInventory,
  StateCounts,
  UnitLocation,
} from "./types";

export function unitStates(stack: EntityStack): StateCounts {
  if (stack.unitStates) return [...stack.unitStates];
  const sustained = stack.sustained ?? 0;
  return [stack.count - sustained, sustained, 0, 0];
}

export function stateCount(states: StateCounts): number {
  return states.reduce((total, value) => total + value, 0);
}

export function mapUnitLocationKey(
  position: string,
  stack: EntityStack,
): string {
  return `${position}\u0000${stack.planetName ?? "space"}\u0000${stack.faction}\u0000${stack.entityType}\u0000${stack.entityId}`;
}

export function rawLocationKey(location: UnitLocation): string {
  return [
    location.position,
    location.holder,
    location.faction,
    location.unitId,
  ].join("\u0000");
}

export function locatedLocation(located: LocatedStack): UnitLocation {
  return {
    position: located.position,
    holder: located.stack.planetName ?? "space",
    faction: located.stack.faction,
    unitId: located.stack.entityId,
  };
}

export function allPlacedStacks(data: GameData): LocatedStack[] {
  return Object.entries(data.tiles)
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([position, tile]) =>
      tile.entityPlacements.map((stack) => ({
        position,
        stack,
        worldX: tile.properties.x + stack.x,
        worldY: tile.properties.y + stack.y,
      })),
    );
}

export function allUnitStacks(data: GameData): LocatedStack[] {
  return allPlacedStacks(data).filter(
    ({ stack }) => stack.entityType === "unit",
  );
}

export function findLocated(
  stacks: LocatedStack[],
  location: UnitLocation,
): LocatedStack | undefined {
  const key = rawLocationKey(location);
  return stacks.find(
    (candidate) => rawLocationKey(locatedLocation(candidate)) === key,
  );
}

export function stackWithStates(
  located: LocatedStack,
  states: StateCounts,
): EntityStack {
  return {
    ...located.stack,
    x: located.worldX,
    y: located.worldY,
    count: stateCount(states),
    sustained: states[1] + states[3],
    unitStates: states,
  };
}

export function stackAtWorld(located: LocatedStack): EntityStack {
  return {
    ...located.stack,
    x: located.worldX,
    y: located.worldY,
  };
}

export function statesForCount(
  source: StateCounts,
  requested: number,
): StateCounts {
  let remaining = requested;
  const selected: StateCounts = [0, 0, 0, 0];
  for (let index = 0; index < source.length && remaining > 0; index += 1) {
    selected[index] = Math.min(source[index], remaining);
    remaining -= selected[index];
  }
  selected[0] += remaining;
  return selected;
}

export function subtractStates(
  source: StateCounts,
  removed: StateCounts,
): StateCounts {
  return source.map((value, index) =>
    Math.max(0, value - removed[index]),
  ) as StateCounts;
}

export function addStates(target: StateCounts, added: StateCounts): void {
  for (let index = 0; index < target.length; index += 1) {
    target[index] += added[index];
  }
}

export function addTotal(
  totals: Map<string, number>,
  key: string,
  amount: number,
): void {
  totals.set(key, Math.max(0, (totals.get(key) ?? 0) + amount));
}

export function createReplayInventory(
  previousStacks: LocatedStack[],
  currentStacks: LocatedStack[],
): ReplayInventory {
  const inventory: ReplayInventory = {
    expectedTotals: new Map(),
    finalTotals: new Map(),
    locations: new Map(),
  };

  for (const located of previousStacks) {
    const location = locatedLocation(located);
    const key = rawLocationKey(location);
    inventory.expectedTotals.set(key, stateCount(unitStates(located.stack)));
    inventory.locations.set(key, location);
  }
  for (const located of currentStacks) {
    const location = locatedLocation(located);
    const key = rawLocationKey(location);
    inventory.finalTotals.set(key, stateCount(unitStates(located.stack)));
    inventory.locations.set(key, location);
  }

  return inventory;
}
