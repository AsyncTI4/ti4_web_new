import type { GameData, RetreatSubEvent } from "@/entities/game/types";
import {
  BADGE_UNITS,
  syntheticDestination,
  VISUAL_HANDOFF_OVERLAP_MS,
} from "./movementPlanning";
import { splitOutgoing, type MovementOutcome } from "./movementOutcomes";
import type {
  LocatedStack,
  MapUnitTransition,
  PlannedMovement,
  ReplayInventory,
  UnitLocation,
} from "./types";
import {
  addTotal,
  appendToGroup,
  findLocated,
  rawLocationKey,
  stackWithStates,
  stateCount,
  statesForCount,
  transitionAt,
  unitStates,
  withUnitStates,
} from "./unitState";

type RetreatPhase = {
  transitions: MapUnitTransition[];
  transitionsBySource: Map<string, MapUnitTransition[]>;
  stagedTransitions: Set<MapUnitTransition>;
  totalsBySource: Map<string, number>;
};

type InventoryReconciliation = {
  removedTransitions: MapUnitTransition[];
  stagedRemovedTransitions: Set<MapUnitTransition>;
  lossCounts: Map<string, number>;
  increasedBadgeTransitions: MapUnitTransition[];
  addedTransitions: MapUnitTransition[];
};

type SequencedMovements = {
  movementTransitions: MapUnitTransition[];
  settleTransitions: MapUnitTransition[];
  mergedRetreatTransitions: Set<MapUnitTransition>;
};

export function planRetreats({
  retreats,
  current,
  previousStacks,
  currentStacks,
  movementArrivals,
  stagedRotations,
  inventory,
  movementEnd,
}: {
  retreats: RetreatSubEvent[];
  current: GameData;
  previousStacks: LocatedStack[];
  currentStacks: LocatedStack[];
  movementArrivals: ReadonlyMap<string, LocatedStack>;
  stagedRotations: ReadonlyMap<string, number>;
  inventory: ReplayInventory;
  movementEnd: number;
}): RetreatPhase {
  const transitions: MapUnitTransition[] = [];
  const transitionsBySource = new Map<string, MapUnitTransition[]>();
  const stagedTransitions = new Set<MapUnitTransition>();
  const totalsBySource = new Map<string, number>();

  for (const retreat of retreats) {
    for (const [unitId, states] of Object.entries(retreat.units)) {
      if (stateCount(states) === 0) continue;
      const from: UnitLocation = {
        position: retreat.fromTile,
        holder: retreat.fromHolder,
        faction: retreat.faction,
        unitId,
      };
      const to: UnitLocation = {
        position: retreat.toTile,
        holder: retreat.toHolder,
        faction: retreat.faction,
        unitId,
      };
      const fromKey = rawLocationKey(from);
      const toKey = rawLocationKey(to);
      const source =
        movementArrivals.get(fromKey) ??
        findLocated(previousStacks, from) ??
        findLocated(currentStacks, from);
      if (!source) continue;
      const finalDestination = findLocated(currentStacks, to);
      const destination =
        finalDestination ??
        syntheticDestination(source, current, to.position, to.holder);
      if (!destination) continue;

      const retreatCount = stateCount(states);
      addTotal(inventory.expectedTotals, fromKey, -retreatCount);
      addTotal(inventory.expectedTotals, toKey, retreatCount);
      inventory.locations.set(fromKey, from);
      inventory.locations.set(toKey, to);
      addTotal(totalsBySource, fromKey, retreatCount);
      const combatRotation = stagedRotations.get(fromKey);
      const transition: MapUnitTransition = {
        ...transitionAt("retreated", destination, stackWithStates(source, states)),
        layoutUnitStates: finalDestination
          ? unitStates(finalDestination.stack)
          : states,
        holdFromMs: movementArrivals.has(fromKey) ? movementEnd : 0,
        startRotationDeg: combatRotation,
        holdRotationDeg: combatRotation,
      };
      transitions.push(transition);
      appendToGroup(transitionsBySource, fromKey, transition);
      if (stagedRotations.has(fromKey)) stagedTransitions.add(transition);
    }
  }

  return {
    transitions,
    transitionsBySource,
    stagedTransitions,
    totalsBySource,
  };
}

export function reconcileInventory({
  inventory,
  movementArrivals,
  previousStacks,
  currentStacks,
  stagedRotations,
  movementEnd,
}: {
  inventory: ReplayInventory;
  movementArrivals: ReadonlyMap<string, LocatedStack>;
  previousStacks: LocatedStack[];
  currentStacks: LocatedStack[];
  stagedRotations: ReadonlyMap<string, number>;
  movementEnd: number;
}): InventoryReconciliation {
  const removedTransitions: MapUnitTransition[] = [];
  const stagedRemovedTransitions = new Set<MapUnitTransition>();
  const lossCounts = new Map<string, number>();
  const increasedBadgeTransitions: MapUnitTransition[] = [];
  const addedTransitions: MapUnitTransition[] = [];

  for (const [key, location] of inventory.locations) {
    const expected = inventory.expectedTotals.get(key) ?? 0;
    const final = inventory.finalTotals.get(key) ?? 0;
    if (expected > final) {
      const located =
        movementArrivals.get(key) ??
        findLocated(previousStacks, location) ??
        findLocated(currentStacks, location);
      if (!located) continue;
      lossCounts.set(key, expected - final);
      const isBadge = BADGE_UNITS.has(location.unitId);
      const isStaged = stagedRotations.has(key);
      if (isBadge && isStaged) continue;
      const removedStates = isBadge
        ? unitStates(located.stack)
        : statesForCount(unitStates(located.stack), expected - final);
      const transition: MapUnitTransition = {
        ...transitionAt(
          "removed",
          located,
          stackWithStates(located, removedStates),
        ),
        appearAtMs: movementArrivals.has(key) ? movementEnd : 0,
        startRotationDeg: stagedRotations.get(key),
        badgeCountChange: isBadge,
      };
      removedTransitions.push(transition);
      if (isStaged) stagedRemovedTransitions.add(transition);
      continue;
    }
    if (final <= expected) continue;

    const located = findLocated(currentStacks, location);
    if (!located) continue;
    const before = findLocated(previousStacks, location);
    if (BADGE_UNITS.has(location.unitId) && before) {
      increasedBadgeTransitions.push({
        ...transitionAt(
          "removed",
          located,
          stackWithStates(located, unitStates(before.stack)),
        ),
        badgeCountChange: true,
      });
      continue;
    }
    const addedStates = statesForCount(
      unitStates(located.stack),
      final - expected,
    );
    addedTransitions.push({
      ...transitionAt("added", located, stackWithStates(located, addedStates)),
      layoutUnitStates: unitStates(located.stack),
    });
  }

  return {
    removedTransitions,
    stagedRemovedTransitions,
    lossCounts,
    increasedBadgeTransitions,
    addedTransitions,
  };
}

export function sequenceMovements({
  movements,
  outcomes,
  retreatTransitionsBySource,
  movementEnd,
  deathDelay,
  placementDelay,
}: {
  movements: PlannedMovement[];
  outcomes: ReadonlyMap<PlannedMovement, MovementOutcome>;
  retreatTransitionsBySource: ReadonlyMap<string, MapUnitTransition[]>;
  movementEnd: number;
  deathDelay: number;
  placementDelay: number;
}): SequencedMovements {
  const movementTransitions: MapUnitTransition[] = [];
  const settleTransitions: MapUnitTransition[] = [];
  const mergedRetreatTransitions = new Set<MapUnitTransition>();
  const movementCountsByDestination = new Map<string, number>();
  for (const movement of movements) {
    addTotal(movementCountsByDestination, movement.destinationKey, 1);
  }
  const continueTo = (
    transition: MapUnitTransition,
    target: { toX: number; toY: number },
  ): MapUnitTransition["continuation"] => ({
    toX: target.toX,
    toY: target.toY,
    delayMs: placementDelay,
    startRotationDeg: transition.parkRotationDeg,
    parkRotationDeg: 0,
  });

  for (const movement of movements) {
    const {
      transition,
      destinationKey: destination,
      finalDestination,
    } = movement;
    const movedStates = unitStates(transition.stack);
    const movedCount = stateCount(movedStates);
    const outcome = outcomes.get(movement)!;
    const { retreating, dying } = outcome;
    const { outgoingStates, survivingStates } = splitOutgoing(
      movedStates,
      outcome,
    );
    const fullStackRetreat =
      movement.staged &&
      retreating === movedCount &&
      dying === 0 &&
      movementCountsByDestination.get(destination) === 1
        ? retreatTransitionsBySource.get(destination)?.[0]
        : undefined;
    if (fullStackRetreat) {
      const retreatStates = unitStates(fullStackRetreat.stack);
      mergedRetreatTransitions.add(fullStackRetreat);
      movementTransitions.push({
        ...transition,
        stack: withUnitStates(transition.stack, retreatStates),
        locationKey: fullStackRetreat.locationKey,
        layoutUnitStates: fullStackRetreat.layoutUnitStates,
        continuation: continueTo(transition, fullStackRetreat),
      });
      continue;
    }
    if (
      movement.staged &&
      stateCount(outgoingStates) === 0 &&
      finalDestination
    ) {
      movementTransitions.push({
        ...transition,
        continuation: continueTo(transition, {
          toX: finalDestination.worldX,
          toY: finalDestination.worldY,
        }),
      });
      continue;
    }
    if (movement.staged) {
      movementTransitions.push({
        ...transition,
        hideAfterMs: deathDelay + VISUAL_HANDOFF_OVERLAP_MS,
      });
    } else if (stateCount(outgoingStates) > 0) {
      movementTransitions.push({
        ...transition,
        stack: withUnitStates(transition.stack, outgoingStates),
        hideAfterMs: movementEnd,
      });
      if (stateCount(survivingStates) > 0) {
        movementTransitions.push({
          ...transition,
          stack: withUnitStates(transition.stack, survivingStates),
        });
      }
    } else {
      movementTransitions.push(transition);
    }

    if (
      !movement.staged ||
      stateCount(survivingStates) === 0 ||
      !finalDestination
    ) {
      continue;
    }
    settleTransitions.push({
      ...transitionAt(
        "settled",
        finalDestination,
        stackWithStates(movement.arrival, survivingStates),
      ),
      layoutUnitStates: unitStates(finalDestination.stack),
      holdFromMs: deathDelay,
      delayMs: placementDelay,
      startRotationDeg: transition.parkRotationDeg,
      holdRotationDeg: transition.parkRotationDeg,
    });
  }

  return {
    movementTransitions,
    settleTransitions,
    mergedRetreatTransitions,
  };
}
