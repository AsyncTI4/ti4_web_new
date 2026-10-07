import type { GameData } from "@/entities/game/types";
import type { Point } from "@/entities/data/types";
import { getPlanetPositionsBySystemId } from "@/entities/lookup/planets";
import type {
  AuthoritativeTransitionOptions,
  DelayedDamage,
  LocatedStack,
  MapCombatLaser,
  MapCommandTokenPlacement,
  MapControlTokenTransition,
  MapReplayPlan,
  MapUnitTransition,
  StateCounts,
} from "@/entities/replay/types";
import {
  addStates,
  addTotal,
  allPlacedStacks,
  allUnitStacks,
  appendToGroup,
  createReplayInventory,
  emptyStates,
  mapUnitLocationKey,
  stackAtWorld,
  subtractStates,
  unitStates as states,
} from "@/entities/replay/unitState";
import {
  allocateMovementOutcomes,
  applyMovementDamage,
  buildStationaryDamage,
} from "@/entities/replay/movementOutcomes";
import {
  buildCombatLasers,
  buildSourceHoldPlan,
  planMovements,
} from "@/entities/replay/movementPlanning";
import {
  planRetreats,
  reconcileInventory,
  sequenceMovements,
} from "@/entities/replay/transitionPlanning";
import {
  shouldShowControlToken,
  type ControlTokenDisplayMode,
} from "@/entities/game/controlTokenDisplay";


const MAP_CHANGE_HIGHLIGHT_DURATION_MS = 1100;
/** Gap between consecutive staggered replay items. */
const STAGGER_MS = 90;
/** Delay before an added piece appears where one was just removed. */
const REPLACE_DELAY_MS = 260;
/** Pause between replay phases (combat, placement, deaths). */
const PHASE_GAP_MS = 100;
const TOKEN_ADDED_DURATION_MS = 520;
const TOKEN_REMOVED_DURATION_MS = 420;
/** Pause after the activation token lands before units start moving. */
const ACTIVATION_SETTLE_MS = 80;
const DEATH_DURATION_MS = 240;
/** Share of the laser volley elapsed before damage markers appear. */
const DAMAGE_LASER_FRACTION = 0.55;

type TimedEvent = { delayMs: number; durationMs: number };

function timedEventEnd(event: TimedEvent): number {
  return event.delayMs + event.durationMs;
}

function sortedUnion(a: Iterable<string>, b: Iterable<string>): string[] {
  return [...new Set([...a, ...b])].sort();
}

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

/** Shared with the map flight animation so replay timing matches what is drawn. */
export function flightDuration(deltaX: number, deltaY: number): number {
  const distance = Math.hypot(deltaX, deltaY);
  return Math.min(1500, Math.max(780, 650 + distance * 0.35));
}

function finalizeReplayPlan({
  transitions,
  lasers,
  commandTokens = [],
  controlTokens = [],
  delayedDamage = new Map<string, DelayedDamage>(),
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
  delayedDamage?: Map<string, DelayedDamage>;
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
      ...lasers.map(timedEventEnd),
      ...commandTokens.map(timedEventEnd),
      ...controlTokens.map(timedEventEnd),
    ),
  };
}

function residualAssetsByKey(data: GameData): Map<string, LocatedStack> {
  return new Map(
    allPlacedStacks(data)
      .filter(
        ({ stack }) =>
          stack.entityType === "token" || stack.entityType === "attachment",
      )
      .map((located) => [
        mapUnitLocationKey(located.position, located.stack),
        located,
      ]),
  );
}

function residualAssetTransitions(
  previous: GameData,
  current: GameData,
  startMs: number,
): MapUnitTransition[] {
  const previousAssets = residualAssetsByKey(previous);
  const currentAssets = residualAssetsByKey(current);
  const transitions: MapUnitTransition[] = [];
  let changeIndex = 0;
  for (const key of sortedUnion(previousAssets.keys(), currentAssets.keys())) {
    const before = previousAssets.get(key);
    const after = currentAssets.get(key);
    if (before?.stack.count === after?.stack.count) continue;
    const delayMs = startMs + changeIndex * STAGGER_MS;
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
        delayMs: delayMs + (before ? REPLACE_DELAY_MS : 0),
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

function commandTokenKey(position: string, faction: string, index: number) {
  return `${position}\u0000${faction}\u0000${index}`;
}

/** Indices of `values` left over after pairing each with an equal value in `counterpart`. */
function unmatchedIndices(values: string[], counterpart: string[]): number[] {
  const remaining = new Map<string, number>();
  for (const value of counterpart) addTotal(remaining, value, 1);
  const unmatched: number[] = [];
  values.forEach((value, index) => {
    const count = remaining.get(value) ?? 0;
    if (count > 0) {
      remaining.set(value, count - 1);
      return;
    }
    unmatched.push(index);
  });
  return unmatched;
}

function commandTokenCoordinates(
  tile: GameData["tiles"][string],
  index: number,
): Point {
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
      delayMs: additions.length * STAGGER_MS,
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
    activations.map((token) =>
      commandTokenKey(token.position, token.faction, token.index),
    ),
  );
  const transitions: MapCommandTokenPlacement[] = [];
  const pushToken = (
    kind: "added" | "removed",
    position: string,
    tile: GameData["tiles"][string],
    faction: string,
    index: number,
  ) =>
    transitions.push({
      kind,
      position,
      faction,
      index,
      ...commandTokenCoordinates(tile, index),
      delayMs: startMs + transitions.length * STAGGER_MS,
      durationMs:
        kind === "added" ? TOKEN_ADDED_DURATION_MS : TOKEN_REMOVED_DURATION_MS,
    });
  const positions = sortedUnion(
    Object.keys(previous.tiles),
    Object.keys(current.tiles),
  );
  for (const position of positions) {
    const previousTile = previous.tiles[position];
    const currentTile = current.tiles[position];
    const before = previousTile?.commandCounters ?? [];
    const after = currentTile?.commandCounters ?? [];
    for (const index of unmatchedIndices(after, before)) {
      const faction = after[index];
      if (!currentTile) continue;
      if (activationKeys.has(commandTokenKey(position, faction, index))) {
        continue;
      }
      pushToken("added", position, currentTile, faction, index);
    }
    if (!previousTile) continue;
    for (const index of unmatchedIndices(before, after)) {
      pushToken("removed", position, previousTile, before[index], index);
    }
  }
  return transitions;
}

function controlTokenCoordinates(
  data: GameData,
  position: string,
  planet: string,
): Point | undefined {
  const tile = data.tiles[position];
  if (!tile) return undefined;
  const local =
    getPlanetPositionsBySystemId(tile.systemId)[planet] ??
    tile.entityPlacements.find(({ entityId }) => entityId === planet);
  if (!local || !Number.isFinite(local.x) || !Number.isFinite(local.y))
    return undefined;
  return {
    x: tile.properties.x + local.x - 10,
    y: tile.properties.y + local.y + 15,
  };
}

function controlTokenTransition(
  data: GameData,
  position: string,
  planet: string,
  timing: Pick<
    MapControlTokenTransition,
    "kind" | "faction" | "delayMs" | "durationMs"
  >,
): MapControlTokenTransition | undefined {
  const coordinates = controlTokenCoordinates(data, position, planet);
  if (!coordinates) return undefined;
  return { position, planet, ...timing, ...coordinates };
}

function residualControlTokenTransitions(
  previous: GameData,
  current: GameData,
  startMs: number,
  controlTokenDisplayMode: ControlTokenDisplayMode,
): MapControlTokenTransition[] {
  const transitions: MapControlTokenTransition[] = [];
  const planetChanges = sortedUnion(
    Object.keys(previous.tiles),
    Object.keys(current.tiles),
  ).flatMap((position) =>
    sortedUnion(
      Object.keys(previous.tiles[position]?.planets ?? {}),
      Object.keys(current.tiles[position]?.planets ?? {}),
    ).map((planet) => ({
      position,
      planet,
      before: previous.tiles[position]?.planets[planet],
      after: current.tiles[position]?.planets[planet],
    })),
  );
  for (const { position, planet, before, after } of planetChanges) {
    const beforeOwner = before?.controlledBy;
    const afterOwner = after?.controlledBy;
    if (beforeOwner === afterOwner) continue;
    const delayMs = startMs + transitions.length * STAGGER_MS;
    const removed =
      beforeOwner &&
      shouldShowControlToken(
        controlTokenDisplayMode,
        before?.unitsByFaction ?? {},
      )
        ? controlTokenTransition(previous, position, planet, {
            kind: "removed",
            faction: beforeOwner,
            delayMs,
            durationMs: TOKEN_REMOVED_DURATION_MS,
          })
        : undefined;
    const added =
      afterOwner &&
      shouldShowControlToken(controlTokenDisplayMode, after?.unitsByFaction ?? {})
        ? controlTokenTransition(current, position, planet, {
            kind: "added",
            faction: afterOwner,
            delayMs: delayMs + (beforeOwner ? REPLACE_DELAY_MS : 0),
            durationMs: TOKEN_ADDED_DURATION_MS,
          })
        : undefined;
    if (removed) transitions.push(removed);
    if (added) transitions.push(added);
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
    appendToGroup(arrivalsByLocation, transition.locationKey, transition);
  }
  for (const arrivals of arrivalsByLocation.values()) {
    const finalStates = arrivals[0].layoutUnitStates ?? emptyStates();
    const arrivingStates = emptyStates();
    for (const arrival of arrivals) {
      if (arrival.hideAfterMs !== undefined) continue;
      addStates(arrivingStates, states(arrival.stack));
    }
    const baseStates = subtractStates(finalStates, arrivingStates);
    baseUnitStates.set(arrivals[0].locationKey, baseStates);
    const offsets: StateCounts = [...baseStates];
    for (const arrival of arrivals) {
      if (arrival.hideAfterMs !== undefined) {
        arrival.layoutStateOffsets = emptyStates();
        continue;
      }
      arrival.layoutStateOffsets = [...offsets];
      addStates(offsets, states(arrival.stack));
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
  const inventory = createReplayInventory(previousStacks, currentStacks);

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
      (token) => timedEventEnd(token) + ACTIVATION_SETTLE_MS,
    ),
  );
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
  const laserEnd = Math.max(movementEnd, ...combatLasers.map(timedEventEnd));
  const damageAtMs =
    combatLasers.length > 0
      ? Math.round(
          movementEnd + (laserEnd - movementEnd) * DAMAGE_LASER_FRACTION,
        )
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

  const deathDelay = laserEnd + (lossCounts.size > 0 ? PHASE_GAP_MS : 0);
  for (const transition of removedTransitions) {
    transition.delayMs = deathDelay;
    if (stagedRemovedTransitions.has(transition))
      transition.appearAtMs = deathDelay;
  }
  const combatEnd = Math.max(
    laserEnd,
    lossCounts.size > 0 ? deathDelay + DEATH_DURATION_MS : 0,
    ...removedTransitions.map(mapUnitTransitionEnd),
  );
  const placementDelay =
    combatEnd +
    (retreatTransitions.length > 0 || movementTransitions.length > 0
      ? PHASE_GAP_MS
      : 0);
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

  const unmergedRetreatTransitions = retreatTransitions.filter(
    (transition) => !mergedRetreatTransitions.has(transition),
  );
  const placementEnd = Math.max(
    combatEnd,
    ...sequencedMovementTransitions.map(mapUnitTransitionEnd),
    ...[...unmergedRetreatTransitions, ...settleTransitions].map(
      mapUnitTransitionEnd,
    ),
  );
  addedTransitions.forEach((transition, index) => {
    transition.delayMs =
      placementEnd + (placementEnd > 0 ? STAGGER_MS : 0) + index * STAGGER_MS;
  });

  const unitTransitions = [
    ...sourceHoldPlan.transitions,
    ...sequencedMovementTransitions,
    ...removedTransitions,
    ...increasedBadgeTransitions,
    ...unmergedRetreatTransitions,
    ...settleTransitions,
    ...addedTransitions,
  ];
  const unitReplayEnd = Math.max(
    movementStart,
    ...unitTransitions.map(mapUnitTransitionEnd),
    ...combatLasers.map(timedEventEnd),
  );
  const residualStart = unitReplayEnd + STAGGER_MS;
  const transitions = [
    ...unitTransitions,
    ...residualAssetTransitions(previous, current, residualStart),
  ];
  const commandTokens = [
    ...activationCommandTokens,
    ...residualCommandTokenTransitions(
      previous,
      current,
      residualStart,
      activationCommandTokens,
    ),
  ];
  const controlTokens = residualControlTokenTransitions(
    previous,
    current,
    residualStart,
    options.controlTokenDisplayMode ?? "ambiguous",
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
