import type { RetreatSubEvent } from "@/app/providers/context/types";
import type { LocatedStack, PlannedMovement, StateCounts } from "./types";
import {
  findLocated,
  locatedLocation,
  mapUnitLocationKey,
  rawLocationKey,
  stateCount,
  statesForCount,
  subtractStates,
  unitStates,
} from "./unitState";

export type MovementOutcome = {
  retreating: number;
  dying: number;
};

export function allocateMovementOutcomes(
  movements: PlannedMovement[],
  retreatTotals: ReadonlyMap<string, number>,
  lossTotals: ReadonlyMap<string, number>,
): Map<PlannedMovement, MovementOutcome> {
  const retreatBudgets = new Map(retreatTotals);
  const lossBudgets = new Map(lossTotals);
  const outcomes = new Map<PlannedMovement, MovementOutcome>();

  for (const movement of movements) {
    const movedStates = unitStates(movement.transition.stack);
    const movedCount = stateCount(movedStates);
    const destination = movement.destinationKey;
    const retreating = Math.min(
      movedCount,
      retreatBudgets.get(destination) ?? 0,
    );
    retreatBudgets.set(
      destination,
      Math.max(0, (retreatBudgets.get(destination) ?? 0) - retreating),
    );
    const dying = Math.min(
      movedCount - retreating,
      lossBudgets.get(destination) ?? 0,
    );
    lossBudgets.set(
      destination,
      Math.max(0, (lossBudgets.get(destination) ?? 0) - dying),
    );
    outcomes.set(movement, {
      retreating,
      dying,
    });
  }

  return outcomes;
}

export function applyMovementDamage({
  movements,
  outcomes,
  previousStacks,
  retreats,
  damageAtMs,
}: {
  movements: PlannedMovement[];
  outcomes: ReadonlyMap<PlannedMovement, MovementOutcome>;
  previousStacks: LocatedStack[];
  retreats: RetreatSubEvent[];
  damageAtMs: number | undefined;
}): void {
  if (damageAtMs === undefined) return;

  const damageBudgets = new Map<string, StateCounts>();
  const arrivalsByDestination = new Map<string, StateCounts>();
  for (const movement of movements) {
    const arrivals = arrivalsByDestination.get(movement.destinationKey) ?? [
      0, 0, 0, 0,
    ];
    const movementStates = unitStates(movement.transition.stack);
    for (let index = 0; index < arrivals.length; index += 1) {
      arrivals[index] += movementStates[index];
    }
    arrivalsByDestination.set(movement.destinationKey, arrivals);
  }

  for (const movement of movements) {
    if (!movement.staged) continue;
    const key = rawLocationKey(movement.target);
    if (damageBudgets.has(key)) continue;
    const retreatStates = retreats.find(
      (retreat) =>
        retreat.faction === movement.target.faction &&
        retreat.fromTile === movement.target.position &&
        retreat.fromHolder === movement.target.holder,
    )?.units[movement.target.unitId] as StateCounts | undefined;
    const finalStates = movement.finalDestination
      ? unitStates(movement.finalDestination.stack)
      : undefined;
    const afterStates = retreatStates ?? finalStates;
    if (!afterStates) continue;
    const before = findLocated(previousStacks, movement.target);
    const beforeStates = retreatStates
      ? ([0, 0, 0, 0] as StateCounts)
      : before
        ? unitStates(before.stack)
        : ([0, 0, 0, 0] as StateCounts);
    const arrivalStates = arrivalsByDestination.get(key) ?? [0, 0, 0, 0];
    damageBudgets.set(key, [
      0,
      Math.max(0, afterStates[1] - beforeStates[1] - arrivalStates[1]),
      0,
      Math.max(0, afterStates[3] - beforeStates[3] - arrivalStates[3]),
    ]);
  }

  for (const movement of movements) {
    if (!movement.staged) continue;
    const budget = damageBudgets.get(movement.destinationKey);
    const outcome = outcomes.get(movement);
    if (!budget || !outcome) continue;
    const transitionStates = unitStates(movement.transition.stack);
    const outgoingStates = statesForCount(
      transitionStates,
      outcome.retreating + outcome.dying,
    );
    const survivingStates = subtractStates(transitionStates, outgoingStates);
    const normalDamage = Math.min(survivingStates[0], budget[1]);
    const galvanizedDamage = Math.min(survivingStates[2], budget[3]);
    if (normalDamage + galvanizedDamage === 0) continue;
    transitionStates[0] -= normalDamage;
    transitionStates[1] += normalDamage;
    transitionStates[2] -= galvanizedDamage;
    transitionStates[3] += galvanizedDamage;
    budget[1] -= normalDamage;
    budget[3] -= galvanizedDamage;
    movement.transition.stack = {
      ...movement.transition.stack,
      sustained: transitionStates[1] + transitionStates[3],
      unitStates: transitionStates,
    };
    movement.transition.damageAtMs = damageAtMs;
    movement.transition.delayedDamageStates = [
      0,
      normalDamage,
      0,
      galvanizedDamage,
    ];
  }
}

export function buildStationaryDamage({
  currentStacks,
  previousStacks,
  stagedDestinations,
  damageAtMs,
}: {
  currentStacks: LocatedStack[];
  previousStacks: LocatedStack[];
  stagedDestinations: ReadonlySet<string>;
  damageAtMs: number | undefined;
}): Map<string, { damageAtMs: number; states: StateCounts }> {
  const delayedDamage = new Map<
    string,
    { damageAtMs: number; states: StateCounts }
  >();
  if (damageAtMs === undefined) return delayedDamage;

  for (const currentLocated of currentStacks) {
    const location = locatedLocation(currentLocated);
    if (stagedDestinations.has(rawLocationKey(location))) continue;
    const previousLocated = findLocated(previousStacks, location);
    if (!previousLocated) continue;
    const before = unitStates(previousLocated.stack);
    const after = unitStates(currentLocated.stack);
    const delayedStates: StateCounts = [
      0,
      Math.max(0, after[1] - before[1]),
      0,
      Math.max(0, after[3] - before[3]),
    ];
    if (delayedStates[1] + delayedStates[3] === 0) continue;
    delayedDamage.set(
      mapUnitLocationKey(currentLocated.position, currentLocated.stack),
      { damageAtMs, states: delayedStates },
    );
  }
  return delayedDamage;
}
