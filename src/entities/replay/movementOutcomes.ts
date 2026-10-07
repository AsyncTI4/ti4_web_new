import type { RetreatSubEvent } from "@/entities/game/types";
import type {
  DelayedDamage,
  LocatedStack,
  PlannedMovement,
  StateCounts,
} from "./types";
import {
  accumulateStates,
  emptyStates,
  findLocated,
  locatedLocation,
  mapUnitLocationKey,
  rawLocationKey,
  stateCount,
  statesForCount,
  subtractStates,
  sustainedIncrease,
  unitStates,
} from "./unitState";

export type MovementOutcome = {
  retreating: number;
  dying: number;
};

/** Takes up to `wanted` from the budget under `key`, returning what was taken. */
function takeFromBudget(
  budgets: Map<string, number>,
  key: string,
  wanted: number,
): number {
  const available = budgets.get(key) ?? 0;
  const taken = Math.min(wanted, available);
  budgets.set(key, Math.max(0, available - taken));
  return taken;
}

/** The moved units that leave the destination again, then those that remain. */
export function splitOutgoing(
  movedStates: StateCounts,
  outcome: MovementOutcome,
): { outgoingStates: StateCounts; survivingStates: StateCounts } {
  const outgoingStates = statesForCount(
    movedStates,
    outcome.retreating + outcome.dying,
  );
  return {
    outgoingStates,
    survivingStates: subtractStates(movedStates, outgoingStates),
  };
}

export function allocateMovementOutcomes(
  movements: PlannedMovement[],
  retreatTotals: ReadonlyMap<string, number>,
  lossTotals: ReadonlyMap<string, number>,
): Map<PlannedMovement, MovementOutcome> {
  const retreatBudgets = new Map(retreatTotals);
  const lossBudgets = new Map(lossTotals);
  const outcomes = new Map<PlannedMovement, MovementOutcome>();

  for (const movement of movements) {
    const movedCount = stateCount(unitStates(movement.transition.stack));
    const destination = movement.destinationKey;
    const retreating = takeFromBudget(retreatBudgets, destination, movedCount);
    const dying = takeFromBudget(
      lossBudgets,
      destination,
      movedCount - retreating,
    );
    outcomes.set(movement, { retreating, dying });
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
    accumulateStates(
      arrivalsByDestination,
      movement.destinationKey,
      unitStates(movement.transition.stack),
    );
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
    )?.units[movement.target.unitId];
    const finalStates = movement.finalDestination
      ? unitStates(movement.finalDestination.stack)
      : undefined;
    const afterStates = retreatStates ?? finalStates;
    if (!afterStates) continue;
    const before = findLocated(previousStacks, movement.target);
    const beforeStates =
      !retreatStates && before ? unitStates(before.stack) : emptyStates();
    const arrivalStates = arrivalsByDestination.get(key) ?? emptyStates();
    damageBudgets.set(
      key,
      sustainedIncrease(afterStates, beforeStates, arrivalStates),
    );
  }

  for (const movement of movements) {
    if (!movement.staged) continue;
    const budget = damageBudgets.get(movement.destinationKey);
    const outcome = outcomes.get(movement);
    if (!budget || !outcome) continue;
    const transitionStates = unitStates(movement.transition.stack);
    const { survivingStates } = splitOutgoing(transitionStates, outcome);
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
}): Map<string, DelayedDamage> {
  const delayedDamage = new Map<string, DelayedDamage>();
  if (damageAtMs === undefined) return delayedDamage;

  for (const currentLocated of currentStacks) {
    const location = locatedLocation(currentLocated);
    if (stagedDestinations.has(rawLocationKey(location))) continue;
    const previousLocated = findLocated(previousStacks, location);
    if (!previousLocated) continue;
    const delayedStates = sustainedIncrease(
      unitStates(currentLocated.stack),
      unitStates(previousLocated.stack),
    );
    if (delayedStates[1] + delayedStates[3] === 0) continue;
    delayedDamage.set(
      mapUnitLocationKey(currentLocated.position, currentLocated.stack),
      { damageAtMs, states: delayedStates },
    );
  }
  return delayedDamage;
}
