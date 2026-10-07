import type { GameData } from "@/entities/game/types";
import type { EntityStack } from "@/entities/positioning";
import type {
  LocatedStack,
  MapUnitTransition,
  ReplayInventory,
  StateCounts,
  UnitLocation,
} from "./types";

export function emptyStates(): StateCounts {
  return [0, 0, 0, 0];
}

export function stackHolder(stack: EntityStack): string {
  return stack.planetName ?? "space";
}

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
  return `${position}\u0000${stackHolder(stack)}\u0000${stack.faction}\u0000${stack.entityType}\u0000${stack.entityId}`;
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
    holder: stackHolder(located.stack),
    faction: located.stack.faction,
    unitId: located.stack.entityId,
  };
}

export function locatedKey(located: LocatedStack): string {
  return rawLocationKey(locatedLocation(located));
}

/** Indexes stacks by location key; later stacks win on collisions. */
export function indexByLocation(
  stacks: LocatedStack[],
): Map<string, LocatedStack> {
  return new Map(stacks.map((located) => [locatedKey(located), located]));
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
    (candidate) => locatedKey(candidate) === key,
  );
}

/** The stack with its count and damage derived from `states`. */
export function withUnitStates(
  stack: EntityStack,
  states: StateCounts,
): EntityStack {
  return {
    ...stack,
    count: stateCount(states),
    sustained: states[1] + states[3],
    unitStates: states,
  };
}

export function stackWithStates(
  located: LocatedStack,
  states: StateCounts,
): EntityStack {
  return withUnitStates(stackAtWorld(located), states);
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
  const selected = emptyStates();
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

/** Adds `added` into the states stored under `key`, creating them if missing. */
export function accumulateStates(
  totals: Map<string, StateCounts>,
  key: string,
  added: StateCounts,
): void {
  const states = totals.get(key) ?? emptyStates();
  addStates(states, added);
  totals.set(key, states);
}

/** Sustained-damage increase (states 1 and 3) of `after` over the sum of `baselines`. */
export function sustainedIncrease(
  after: StateCounts,
  ...baselines: StateCounts[]
): StateCounts {
  const increase = (index: number) =>
    Math.max(
      0,
      baselines.reduce((remaining, base) => remaining - base[index], after[index]),
    );
  return [0, increase(1), 0, increase(3)];
}

export function appendToGroup<T>(
  groups: Map<string, T[]>,
  key: string,
  item: T,
): void {
  const group = groups.get(key) ?? [];
  group.push(item);
  groups.set(key, group);
}

/** A transition shown in place at `located`, keyed to its map location. */
export function transitionAt(
  kind: MapUnitTransition["kind"],
  located: LocatedStack,
  stack: EntityStack,
): Pick<MapUnitTransition, "kind" | "stack" | "toX" | "toY" | "locationKey"> {
  return {
    kind,
    stack,
    toX: located.worldX,
    toY: located.worldY,
    locationKey: mapUnitLocationKey(located.position, located.stack),
  };
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

  const record = (located: LocatedStack, totals: Map<string, number>) => {
    const location = locatedLocation(located);
    const key = rawLocationKey(location);
    totals.set(key, stateCount(unitStates(located.stack)));
    inventory.locations.set(key, location);
  };
  previousStacks.forEach((located) =>
    record(located, inventory.expectedTotals),
  );
  currentStacks.forEach((located) => record(located, inventory.finalTotals));

  return inventory;
}
