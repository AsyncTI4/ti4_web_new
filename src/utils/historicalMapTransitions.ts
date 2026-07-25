import type { GameData } from "@/app/providers/context/types";
import { getPlanetCoordsBySystemId } from "@/entities/lookup/planets";
import type {
  AuthoritativeTransitionOptions,
  LocatedStack,
  MapCombatLaser,
  MapCommandTokenPlacement,
  MapControlTokenTransition,
  MapReplayPlan,
  MapUnitTransition,
  StateCounts,
} from "@/utils/mapReplay/types";
import {
  allPlacedStacks,
  allUnitStacks,
  createReplayInventory,
  mapUnitLocationKey,
  stackAtWorld,
  unitStates as states,
} from "@/utils/mapReplay/unitState";
import {
  allocateMovementOutcomes,
  applyMovementDamage,
  buildStationaryDamage,
} from "@/utils/mapReplay/movementOutcomes";
import {
  buildCombatLasers,
  buildSourceHoldPlan,
  planMovements,
} from "@/utils/mapReplay/movementPlanning";
import {
  planRetreats,
  reconcileInventory,
  sequenceMovements,
} from "@/utils/mapReplay/transitionPlanning";

export type {
  MapCombatLaser,
  MapCommandTokenPlacement,
  MapControlTokenTransition,
  MapReplayPlan,
  MapUnitTransition,
  StateCounts,
} from "@/utils/mapReplay/types";
export { mapUnitLocationKey };

const MAP_CHANGE_HIGHLIGHT_DURATION_MS = 1100;

function mapUnitTransitionDuration(transition: MapUnitTransition): number {
  if (transition.badgeCountChange) return 240;
  if (transition.sourceHold) return 0;
  if (transition.residualAsset && transition.kind === "removed") return 420;
  if (transition.kind === "removed") return 780;
  if (transition.kind === "added") return 760;
  return flightDuration(
    transition.toX - transition.stack.x,
    transition.toY - transition.stack.y,
  );
}

function mapUnitTransitionEnd(transition: MapUnitTransition): number {
  const firstEnd =
    (transition.delayMs ?? 0) + mapUnitTransitionDuration(transition);
  const continuation = transition.continuation;
  return continuation
    ? Math.max(
        firstEnd,
        continuation.delayMs +
          flightDuration(
            continuation.toX - transition.toX,
            continuation.toY - transition.toY,
          ),
      )
    : firstEnd;
}

function flightDuration(deltaX: number, deltaY: number): number {
  const distance = Math.hypot(deltaX, deltaY);
  return Math.min(1500, Math.max(780, 650 + distance * 0.35));
}

function finalizeReplayPlan({
  transitions,
  lasers,
  commandTokens = [],
  controlTokens = [],
  delayedDamage = new Map<
    string,
    { damageAtMs: number; states: StateCounts }
  >(),
  baseUnitStates = new Map<string, StateCounts>(),
  finalRevealLocations = new Set<string>(),
  tacticalTargetPosition,
  focusPosition,
  showTacticalActivation = false,
  changedPositions = new Set<string>(),
}: {
  transitions: MapUnitTransition[];
  lasers: MapCombatLaser[];
  commandTokens?: MapCommandTokenPlacement[];
  controlTokens?: MapControlTokenTransition[];
  delayedDamage?: Map<string, { damageAtMs: number; states: StateCounts }>;
  baseUnitStates?: Map<string, StateCounts>;
  finalRevealLocations?: Set<string>;
  tacticalTargetPosition?: string;
  focusPosition?: string;
  showTacticalActivation?: boolean;
  changedPositions?: Set<string>;
}): MapReplayPlan {
  const arrivalLocations = new Set<string>();
  for (const transition of transitions) {
    if (transition.kind !== "removed")
      arrivalLocations.add(transition.locationKey);
  }
  return {
    transitions,
    lasers,
    commandTokens,
    controlTokens,
    arrivalLocations,
    baseUnitStates,
    delayedDamage,
    finalRevealLocations,
    tacticalTargetPosition,
    focusPosition,
    showTacticalActivation,
    changedPositions,
    durationMs: Math.max(
      0,
      changedPositions.size > 0 ? MAP_CHANGE_HIGHLIGHT_DURATION_MS : 0,
      ...transitions.map(mapUnitTransitionEnd),
      ...lasers.map((laser) => laser.delayMs + laser.durationMs),
      ...commandTokens.map((token) => token.delayMs + token.durationMs),
      ...controlTokens.map((token) => token.delayMs + token.durationMs),
    ),
  };
}

function residualAssetTransitions(
  previous: GameData,
  current: GameData,
  startMs: number,
): MapUnitTransition[] {
  const isResidualAsset = ({ stack }: LocatedStack) =>
    stack.entityType === "token" || stack.entityType === "attachment";
  const previousAssets = new Map(
    allPlacedStacks(previous)
      .filter(isResidualAsset)
      .map((located) => [
        mapUnitLocationKey(located.position, located.stack),
        located,
      ]),
  );
  const currentAssets = new Map(
    allPlacedStacks(current)
      .filter(isResidualAsset)
      .map((located) => [
        mapUnitLocationKey(located.position, located.stack),
        located,
      ]),
  );
  const transitions: MapUnitTransition[] = [];
  let changeIndex = 0;
  for (const key of [
    ...new Set([...previousAssets.keys(), ...currentAssets.keys()]),
  ].sort()) {
    const before = previousAssets.get(key);
    const after = currentAssets.get(key);
    if (before?.stack.count === after?.stack.count) continue;
    const delayMs = startMs + changeIndex * 90;
    if (before) {
      transitions.push({
        kind: "removed",
        stack: stackAtWorld(before),
        toX: before.worldX,
        toY: before.worldY,
        locationKey: key,
        delayMs,
        residualAsset: true,
      });
    }
    if (after) {
      transitions.push({
        kind: "added",
        stack: stackAtWorld(after),
        toX: after.worldX,
        toY: after.worldY,
        locationKey: key,
        delayMs: delayMs + (before ? 260 : 0),
        residualAsset: true,
      });
    }
    changeIndex += 1;
  }
  return transitions;
}

const COMMAND_TOKEN_DURATION = 560;
const COMMAND_TOKEN_OFFSET_X = 10;
const COMMAND_TOKEN_OFFSET_Y = 90;
const COMMAND_TOKEN_STACK_OFFSET = 16;

function compareSystemPositions(a: string, b: string): number {
  const aIsNumber = /^\d+$/.test(a);
  const bIsNumber = /^\d+$/.test(b);
  if (aIsNumber && bIsNumber)
    return Number(a) - Number(b) || a.localeCompare(b);
  if (aIsNumber !== bIsNumber) return aIsNumber ? -1 : 1;
  return a.localeCompare(b);
}

function chooseReplayFocusPosition(
  current: GameData,
  options: AuthoritativeTransitionOptions,
): string | undefined {
  if (options.tacticalPosition) return options.tacticalPosition;
  const positions = [...(options.changedPositions ?? [])].sort(
    compareSystemPositions,
  );
  if (!options.activeFaction) return positions[0];
  return (
    positions.find(
      (position) =>
        current.tiles[position]?.controlledBy === options.activeFaction,
    ) ?? positions[0]
  );
}

function valueCounts(values: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

function commandTokenCoordinates(
  tile: GameData["tiles"][string],
  index: number,
): { x: number; y: number } {
  return {
    x:
      tile.properties.x +
      COMMAND_TOKEN_OFFSET_X +
      index * COMMAND_TOKEN_STACK_OFFSET,
    y:
      tile.properties.y +
      COMMAND_TOKEN_OFFSET_Y +
      index * COMMAND_TOKEN_STACK_OFFSET,
  };
}

function commandTokenPlacements(
  previous: GameData,
  current: GameData,
  position: string,
  activeFaction: string,
): MapCommandTokenPlacement[] {
  const tile = current.tiles[position];
  if (!tile) return [];
  let previousCount = (previous.tiles[position]?.commandCounters ?? []).filter(
    (faction) => faction === activeFaction,
  ).length;
  const additions: MapCommandTokenPlacement[] = [];
  tile.commandCounters.forEach((faction, index) => {
    if (faction !== activeFaction) return;
    if (previousCount > 0) {
      previousCount -= 1;
      return;
    }
    additions.push({
      kind: "activation",
      position,
      faction,
      index,
      ...commandTokenCoordinates(tile, index),
      delayMs: additions.length * 90,
      durationMs: COMMAND_TOKEN_DURATION,
    });
  });
  return additions;
}

function residualCommandTokenTransitions(
  previous: GameData,
  current: GameData,
  startMs: number,
  activations: MapCommandTokenPlacement[],
): MapCommandTokenPlacement[] {
  const activationKeys = new Set(
    activations.map(
      (token) => `${token.position}\u0000${token.faction}\u0000${token.index}`,
    ),
  );
  const transitions: MapCommandTokenPlacement[] = [];
  const positions = [
    ...new Set([...Object.keys(previous.tiles), ...Object.keys(current.tiles)]),
  ].sort();
  for (const position of positions) {
    const before = previous.tiles[position]?.commandCounters ?? [];
    const after = current.tiles[position]?.commandCounters ?? [];
    const remainingBefore = valueCounts(before);
    const remainingAfter = valueCounts(after);
    const currentTile = current.tiles[position];
    after.forEach((faction, index) => {
      const countBefore = remainingBefore.get(faction) ?? 0;
      if (countBefore > 0) {
        remainingBefore.set(faction, countBefore - 1);
        return;
      }
      const key = `${position}\u0000${faction}\u0000${index}`;
      if (!currentTile || activationKeys.has(key)) return;
      transitions.push({
        kind: "added",
        position,
        faction,
        index,
        ...commandTokenCoordinates(currentTile, index),
        delayMs: startMs + transitions.length * 90,
        durationMs: 520,
      });
    });
    const previousTile = previous.tiles[position];
    before.forEach((faction, index) => {
      const countAfter = remainingAfter.get(faction) ?? 0;
      if (countAfter > 0) {
        remainingAfter.set(faction, countAfter - 1);
        return;
      }
      if (!previousTile) return;
      transitions.push({
        kind: "removed",
        position,
        faction,
        index,
        ...commandTokenCoordinates(previousTile, index),
        delayMs: startMs + transitions.length * 90,
        durationMs: 420,
      });
    });
  }
  return transitions;
}

function controlTokenCoordinates(
  data: GameData,
  position: string,
  planet: string,
): { x: number; y: number } | undefined {
  const tile = data.tiles[position];
  if (!tile) return undefined;
  const coordinate = getPlanetCoordsBySystemId(tile.systemId)[planet];
  const placement = coordinate
    ? undefined
    : tile.entityPlacements.find(({ entityId }) => entityId === planet);
  const [localX, localY] = coordinate
    ? coordinate.split(",").map(Number)
    : [placement?.x, placement?.y];
  if (!Number.isFinite(localX) || !Number.isFinite(localY)) return undefined;
  return {
    x: tile.properties.x + localX - 10,
    y: tile.properties.y + localY + 15,
  };
}

function residualControlTokenTransitions(
  previous: GameData,
  current: GameData,
  startMs: number,
  alwaysShowControlTokens: boolean,
): MapControlTokenTransition[] {
  const transitions: MapControlTokenTransition[] = [];
  const positions = [
    ...new Set([...Object.keys(previous.tiles), ...Object.keys(current.tiles)]),
  ].sort();
  for (const position of positions) {
    const planetIds = [
      ...new Set([
        ...Object.keys(previous.tiles[position]?.planets ?? {}),
        ...Object.keys(current.tiles[position]?.planets ?? {}),
      ]),
    ].sort();
    for (const planet of planetIds) {
      const before = previous.tiles[position]?.planets[planet]?.controlledBy;
      const after = current.tiles[position]?.planets[planet]?.controlledBy;
      if (before === after) continue;
      const delayMs = startMs + transitions.length * 90;
      const previousHasUnits = previous.tiles[position]?.entityPlacements.some(
        (placement) =>
          placement.planetName === planet && placement.entityType === "unit",
      );
      const currentHasUnits = current.tiles[position]?.entityPlacements.some(
        (placement) =>
          placement.planetName === planet && placement.entityType === "unit",
      );
      if (before && (alwaysShowControlTokens || !previousHasUnits)) {
        const coordinates = controlTokenCoordinates(previous, position, planet);
        if (coordinates)
          transitions.push({
            kind: "removed",
            position,
            planet,
            faction: before,
            ...coordinates,
            delayMs,
            durationMs: 420,
          });
      }
      if (after && (alwaysShowControlTokens || !currentHasUnits)) {
        const coordinates = controlTokenCoordinates(current, position, planet);
        if (coordinates)
          transitions.push({
            kind: "added",
            position,
            planet,
            faction: after,
            ...coordinates,
            delayMs: delayMs + (before ? 260 : 0),
            durationMs: 520,
          });
      }
    }
  }
  return transitions;
}

function assignReplayLayout(
  transitions: MapUnitTransition[],
): Map<string, StateCounts> {
  const baseUnitStates = new Map<string, StateCounts>();
  const arrivalsByLocation = new Map<string, MapUnitTransition[]>();
  for (const transition of transitions) {
    if (transition.kind === "removed") continue;
    const arrivals = arrivalsByLocation.get(transition.locationKey) ?? [];
    arrivals.push(transition);
    arrivalsByLocation.set(transition.locationKey, arrivals);
  }
  for (const arrivals of arrivalsByLocation.values()) {
    const finalStates = arrivals[0].layoutUnitStates ?? [0, 0, 0, 0];
    const arrivingStates: StateCounts = [0, 0, 0, 0];
    for (const arrival of arrivals) {
      if (arrival.hideAfterMs !== undefined) continue;
      const arrivalStates = states(arrival.stack);
      for (let i = 0; i < 4; i += 1) arrivingStates[i] += arrivalStates[i];
    }
    const baseStates = finalStates.map((value, i) =>
      Math.max(0, value - arrivingStates[i]),
    ) as StateCounts;
    baseUnitStates.set(arrivals[0].locationKey, baseStates);
    const offsets: StateCounts = [...baseStates];
    for (const arrival of arrivals) {
      if (arrival.hideAfterMs !== undefined) {
        arrival.layoutStateOffsets = [0, 0, 0, 0];
        continue;
      }
      arrival.layoutStateOffsets = [...offsets];
      const arrivalStates = states(arrival.stack);
      for (let i = 0; i < 4; i += 1) offsets[i] += arrivalStates[i];
    }
  }
  return baseUnitStates;
}

function buildAuthoritativeMapReplay(
  previous: GameData,
  current: GameData,
  options: AuthoritativeTransitionOptions,
): MapReplayPlan {
  const previousStacks = allUnitStacks(previous);
  const currentStacks = allUnitStacks(current);
  const { expectedTotals, finalTotals, locations } = createReplayInventory(
    previousStacks,
    currentStacks,
  );

  // Tactical metadata identifies where to look, but never creates a token by
  // itself. The pre-phase exists only when the serialized map snapshots prove
  // that this faction's counter count increased in that system.
  const activationCommandTokens =
    options.tacticalPosition && options.activeFaction
      ? commandTokenPlacements(
          previous,
          current,
          options.tacticalPosition,
          options.activeFaction,
        )
      : [];
  const movementStart = Math.max(
    0,
    ...activationCommandTokens.map(
      (token) => token.delayMs + token.durationMs + 80,
    ),
  );
  const inventory = { expectedTotals, finalTotals, locations };
  const {
    movements,
    movementArrivals,
    stagedRotations: stagedRotationByDestinationKey,
  } = planMovements({
    previous,
    current,
    options,
    previousStacks,
    currentStacks,
    inventory,
    movementStart,
  });

  const movementTransitions = movements.map(({ transition }) => transition);

  const movementEnd = Math.max(
    movementStart,
    ...movementTransitions.map(mapUnitTransitionEnd),
  );
  const sourceHoldPlan = buildSourceHoldPlan(
    movements,
    previousStacks,
    currentStacks,
    movementStart,
  );
  const combatLasers = buildCombatLasers(
    options.combats ?? [],
    movements,
    previousStacks,
    currentStacks,
    movementEnd,
  );
  const laserEnd = Math.max(
    movementEnd,
    ...combatLasers.map((laser) => laser.delayMs + laser.durationMs),
  );
  const damageAtMs =
    combatLasers.length > 0
      ? Math.round(movementEnd + (laserEnd - movementEnd) * 0.55)
      : undefined;

  const retreatPhase = planRetreats({
    retreats: options.retreats ?? [],
    current,
    previousStacks,
    currentStacks,
    movementArrivals,
    stagedRotations: stagedRotationByDestinationKey,
    inventory,
    movementEnd,
  });
  const reconciliation = reconcileInventory({
    inventory,
    movementArrivals,
    previousStacks,
    currentStacks,
    stagedRotations: stagedRotationByDestinationKey,
    movementEnd,
  });
  const {
    transitions: retreatTransitions,
    transitionsBySource: retreatTransitionsBySource,
    stagedTransitions: stagedRetreatTransitions,
    totalsBySource: retreatTotalsBySource,
  } = retreatPhase;
  const {
    removedTransitions,
    stagedRemovedTransitions,
    lossCounts,
    increasedBadgeTransitions,
    addedTransitions,
  } = reconciliation;

  const movementOutcomes = allocateMovementOutcomes(
    movements,
    retreatTotalsBySource,
    lossCounts,
  );
  applyMovementDamage({
    movements,
    outcomes: movementOutcomes,
    previousStacks,
    retreats: options.retreats ?? [],
    damageAtMs,
  });

  const deathDelay = laserEnd + (lossCounts.size > 0 ? 100 : 0);
  for (const transition of removedTransitions) {
    transition.delayMs = deathDelay;
    if (stagedRemovedTransitions.has(transition))
      transition.appearAtMs = deathDelay;
  }
  const combatEnd = Math.max(
    laserEnd,
    lossCounts.size > 0 ? deathDelay + 240 : 0,
    ...removedTransitions.map(mapUnitTransitionEnd),
  );
  const placementDelay =
    combatEnd +
    (retreatTransitions.length > 0 || movementTransitions.length > 0 ? 100 : 0);
  for (const transition of retreatTransitions)
    transition.delayMs = placementDelay;
  for (const transition of stagedRetreatTransitions)
    transition.holdFromMs = deathDelay;
  for (const transition of increasedBadgeTransitions)
    transition.delayMs = placementDelay;

  const {
    movementTransitions: sequencedMovementTransitions,
    settleTransitions,
    mergedRetreatTransitions,
  } = sequenceMovements({
    movements,
    outcomes: movementOutcomes,
    retreatTransitionsBySource,
    movementEnd,
    deathDelay,
    placementDelay,
  });

  const placementEnd = Math.max(
    combatEnd,
    ...sequencedMovementTransitions.map(mapUnitTransitionEnd),
    ...[
      ...retreatTransitions.filter(
        (transition) => !mergedRetreatTransitions.has(transition),
      ),
      ...settleTransitions,
    ].map(mapUnitTransitionEnd),
  );
  addedTransitions.forEach((transition, index) => {
    transition.delayMs =
      placementEnd + (placementEnd > 0 ? 90 : 0) + index * 90;
  });

  const unitTransitions = [
    ...sourceHoldPlan.transitions,
    ...sequencedMovementTransitions,
    ...removedTransitions,
    ...increasedBadgeTransitions,
    ...retreatTransitions.filter(
      (transition) => !mergedRetreatTransitions.has(transition),
    ),
    ...settleTransitions,
    ...addedTransitions,
  ];
  const unitReplayEnd = Math.max(
    movementStart,
    ...unitTransitions.map(mapUnitTransitionEnd),
    ...combatLasers.map((laser) => laser.delayMs + laser.durationMs),
  );
  const residualTransitions = residualAssetTransitions(
    previous,
    current,
    unitReplayEnd + 90,
  );
  const transitions = [...unitTransitions, ...residualTransitions];
  const commandTokens = [
    ...activationCommandTokens,
    ...residualCommandTokenTransitions(
      previous,
      current,
      unitReplayEnd + 90,
      activationCommandTokens,
    ),
  ];
  const controlTokens = residualControlTokenTransitions(
    previous,
    current,
    unitReplayEnd + 90,
    options.alwaysShowControlTokens ?? true,
  );
  const baseUnitStates = assignReplayLayout(transitions);
  const delayedDamage = buildStationaryDamage({
    currentStacks,
    previousStacks,
    stagedDestinations: new Set(stagedRotationByDestinationKey.keys()),
    damageAtMs,
  });
  return finalizeReplayPlan({
    transitions,
    lasers: combatLasers,
    commandTokens,
    controlTokens,
    delayedDamage,
    baseUnitStates,
    finalRevealLocations: sourceHoldPlan.finalRevealLocations,
    tacticalTargetPosition: options.tacticalPosition ?? undefined,
    focusPosition: chooseReplayFocusPosition(current, options),
    showTacticalActivation: activationCommandTokens.length > 0,
    changedPositions: options.changedPositions,
  });
}

export function buildMapReplayPlan(
  previous: GameData | undefined,
  current: GameData | undefined,
  options: AuthoritativeTransitionOptions = {},
): MapReplayPlan {
  if (!previous || !current)
    return finalizeReplayPlan({ transitions: [], lasers: [] });
  try {
    return buildAuthoritativeMapReplay(previous, current, options);
  } catch (error) {
    console.error("Unable to build authoritative map replay", error);
    return finalizeReplayPlan({ transitions: [], lasers: [] });
  }
}
