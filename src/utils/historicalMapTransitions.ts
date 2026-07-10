import type {
  CombatReplayEvent,
  GameData,
  RetreatSubEvent,
} from "@/app/providers/context/types";
import type { EntityStack } from "@/utils/unitPositioning";
import { findColorData } from "@/entities/lookup/colors";
import { deserializeCompactMovementState } from "@/utils/compactMovementState";
import { getPlanetCoordsBySystemId } from "@/entities/lookup/planets";

export type MapUnitTransition = {
  kind: "moved" | "removed" | "retreated" | "settled" | "added";
  stack: EntityStack;
  toX: number;
  toY: number;
  locationKey: string;
  delayMs?: number;
  layoutUnitStates?: StateCounts;
  layoutStateOffsets?: StateCounts;
  appearAtMs?: number;
  holdFromMs?: number;
  hideAfterMs?: number;
  startRotationDeg?: number;
  holdRotationDeg?: number;
  parkRotationDeg?: number;
  damageAtMs?: number;
  delayedDamageStates?: StateCounts;
  badgeCountChange?: boolean;
  residualAsset?: boolean;
  sourceHold?: boolean;
  continuation?: {
    toX: number;
    toY: number;
    delayMs: number;
    startRotationDeg?: number;
    parkRotationDeg?: number;
  };
};

export type MapCombatLaser = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  delayMs: number;
  durationMs: number;
  color: "attacker" | "defender";
};

export type MapCommandTokenPlacement = {
  kind: "activation" | "added" | "removed";
  position: string;
  faction: string;
  index: number;
  x: number;
  y: number;
  delayMs: number;
  durationMs: number;
};

export type MapControlTokenTransition = {
  kind: "added" | "removed";
  position: string;
  planet: string;
  faction: string;
  x: number;
  y: number;
  delayMs: number;
  durationMs: number;
};

export type MapReplayPlan = {
  transitions: MapUnitTransition[];
  lasers: MapCombatLaser[];
  commandTokens: MapCommandTokenPlacement[];
  controlTokens: MapControlTokenTransition[];
  arrivalLocations: Set<string>;
  baseUnitStates: Map<string, StateCounts>;
  delayedDamage: Map<string, { damageAtMs: number; states: StateCounts }>;
  finalRevealLocations: Set<string>;
  tacticalTargetPosition?: string;
  focusPosition?: string;
  showTacticalActivation: boolean;
  changedPositions: Set<string>;
  durationMs: number;
};

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

export type StateCounts = [number, number, number, number];

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
type LocatedStack = {
  position: string;
  stack: EntityStack;
  worldX: number;
  worldY: number;
};

function states(stack: EntityStack): StateCounts {
  if (stack.unitStates) return [...stack.unitStates];
  const sustained = stack.sustained ?? 0;
  return [stack.count - sustained, sustained, 0, 0];
}

export function mapUnitLocationKey(
  position: string,
  stack: EntityStack,
): string {
  return `${position}\u0000${stack.planetName ?? "space"}\u0000${stack.faction}\u0000${stack.entityType}\u0000${stack.entityId}`;
}

function count(states: StateCounts): number {
  return states.reduce((total, value) => total + value, 0);
}

function allPlacedStacks(data: GameData): LocatedStack[] {
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

function allUnitStacks(data: GameData): LocatedStack[] {
  return allPlacedStacks(data).filter(
    ({ stack }) => stack.entityType === "unit",
  );
}

function stackWithStates(
  located: LocatedStack,
  unitStates: StateCounts,
): EntityStack {
  return {
    ...located.stack,
    x: located.worldX,
    y: located.worldY,
    count: count(unitStates),
    sustained: unitStates[1] + unitStates[3],
    unitStates,
  };
}

function stackAtWorld(located: LocatedStack): EntityStack {
  return {
    ...located.stack,
    x: located.worldX,
    y: located.worldY,
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

type UnitLocation = {
  position: string;
  holder: string;
  faction: string;
  unitId: string;
};

type AuthoritativeTransitionOptions = {
  movementState?: string | null;
  retreats?: RetreatSubEvent[];
  combats?: CombatReplayEvent[];
  activeFaction?: string | null;
  tacticalPosition?: string | null;
  alwaysShowControlTokens?: boolean;
  changedPositions?: Set<string>;
};

const GROUND_DESTINATION_UNITS = new Set(["gf", "mf", "pd", "sd"]);
const BADGE_UNITS = new Set(["ff", "gf"]);
const NATIVE_NORTHWEST_ANGLE = -135;
const COMMAND_TOKEN_DURATION = 560;
const COMMAND_TOKEN_OFFSET_X = 10;
const COMMAND_TOKEN_OFFSET_Y = 90;
const COMMAND_TOKEN_STACK_OFFSET = 16;
const VISUAL_HANDOFF_OVERLAP_MS = 50;

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

function rotationToward(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): number {
  return (
    (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI -
    NATIVE_NORTHWEST_ANGLE
  );
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

function combatFacingPoint(
  combat: CombatReplayEvent,
  previousStacks: LocatedStack[],
  currentStacks: LocatedStack[],
  fallback: { x: number; y: number },
): { x: number; y: number } {
  const holder = combat.kind === "ground" ? combat.planet : "space";
  const isDefender = (located: LocatedStack) => {
    const location = locatedLocation(located);
    return (
      location.position === combat.tile &&
      location.holder === holder &&
      location.faction === combat.vsFaction
    );
  };
  // The pre-event positions best represent where the defenders were when the
  // engagement began. Fall back to survivors when no pre-event stack exists.
  const defenders = previousStacks.filter(isDefender);
  const visibleDefenders =
    defenders.length > 0 ? defenders : currentStacks.filter(isDefender);
  if (visibleDefenders.length === 0) return fallback;
  return {
    x:
      visibleDefenders.reduce((total, located) => total + located.worldX, 0) /
      visibleDefenders.length,
    y:
      visibleDefenders.reduce((total, located) => total + located.worldY, 0) /
      visibleDefenders.length,
  };
}

function rawLocationKey(location: UnitLocation): string {
  return [
    location.position,
    location.holder,
    location.faction,
    location.unitId,
  ].join("\u0000");
}

function locatedLocation(located: LocatedStack): UnitLocation {
  return {
    position: located.position,
    holder: located.stack.planetName ?? "space",
    faction: located.stack.faction,
    unitId: located.stack.entityId,
  };
}

function findLocated(
  stacks: LocatedStack[],
  location: UnitLocation,
): LocatedStack | undefined {
  return stacks.find(
    (candidate) =>
      rawLocationKey(locatedLocation(candidate)) === rawLocationKey(location),
  );
}

function syntheticDestination(
  source: LocatedStack,
  data: GameData,
  position: string,
  holder: string,
): LocatedStack | undefined {
  const tile = data.tiles[position];
  if (!tile) return undefined;
  return {
    position,
    stack: {
      ...source.stack,
      planetName: holder === "space" ? undefined : holder,
    },
    worldX: tile.properties.x + source.stack.x,
    worldY: tile.properties.y + source.stack.y,
  };
}

function formationDestination(
  source: LocatedStack,
  data: GameData,
  position: string,
  holder: string,
  slot: number,
): LocatedStack | undefined {
  const tile = data.tiles[position];
  if (!tile) return undefined;
  const center = tile.properties;
  const midpoints = tile.properties.hexOutline.midpoints ?? [];
  const closest = [...midpoints].sort(
    (a, b) =>
      (a.x - source.worldX) ** 2 +
      (a.y - source.worldY) ** 2 -
      ((b.x - source.worldX) ** 2 + (b.y - source.worldY) ** 2),
  )[0];
  const sourceAngle = Math.atan2(
    source.worldY - center.y,
    source.worldX - center.x,
  );
  const edge = closest ?? {
    x: center.x + Math.cos(sourceAngle) * 145,
    y: center.y + Math.sin(sourceAngle) * 145,
  };
  const towardCenterX = center.x - edge.x;
  const towardCenterY = center.y - edge.y;
  const inwardLength = Math.hypot(towardCenterX, towardCenterY) || 1;
  const inwardX = towardCenterX / inwardLength;
  const inwardY = towardCenterY / inwardLength;
  const acrossX = -inwardY;
  const acrossY = inwardX;
  const column = (slot % 3) - 1;
  const row = Math.floor(slot / 3);
  // A loose, staggered hex packing gives rotated capital-ship silhouettes and
  // badges distinct footprints instead of treating every stack as a point.
  const formationDepth = 96 + row * 70 - (column === 0 ? 28 : 0);
  return {
    position,
    stack: {
      ...source.stack,
      planetName: holder === "space" ? undefined : holder,
    },
    worldX: edge.x + inwardX * formationDepth + acrossX * column * 84,
    worldY: edge.y + inwardY * formationDepth + acrossY * column * 84,
  };
}

function recenterRotatedSplay(
  located: LocatedStack,
  unitId: string,
  unitCount: number,
  rotationDeg: number,
): LocatedStack {
  if (BADGE_UNITS.has(unitId) || unitCount <= 1) return located;
  // Non-badge stacks splay each additional unit 10px left and 10px down.
  // Rotate that visual centroid with the wrapper, then offset the anchor so
  // the rotated artwork remains centered on its assigned formation slot.
  const centroidX = -((unitCount - 1) * 10) / 2;
  const centroidY = ((unitCount - 1) * 10) / 2;
  const radians = (rotationDeg * Math.PI) / 180;
  const rotatedCentroidX =
    centroidX * Math.cos(radians) - centroidY * Math.sin(radians);
  const rotatedCentroidY =
    centroidX * Math.sin(radians) + centroidY * Math.cos(radians);
  return {
    ...located,
    worldX: located.worldX - rotatedCentroidX,
    worldY: located.worldY - rotatedCentroidY,
  };
}

function resolveFactionForColor(
  data: GameData,
  colorId: string,
): string | undefined {
  const entries = Object.values(data.originalFactionColorMap);
  const exact = entries.find((entry) => entry.color === colorId);
  if (exact) return exact.faction;
  const color = findColorData(colorId);
  if (!color) return undefined;
  return entries.find(
    (entry) => findColorData(entry.color)?.alias === color.alias,
  )?.faction;
}

function addTotal(totals: Map<string, number>, key: string, amount: number) {
  totals.set(key, Math.max(0, (totals.get(key) ?? 0) + amount));
}

function statesForCount(source: StateCounts, requested: number): StateCounts {
  let remaining = requested;
  const selected: StateCounts = [0, 0, 0, 0];
  for (let i = 0; i < source.length && remaining > 0; i += 1) {
    selected[i] = Math.min(source[i], remaining);
    remaining -= selected[i];
  }
  selected[0] += remaining;
  return selected;
}

function subtractStates(
  source: StateCounts,
  removed: StateCounts,
): StateCounts {
  return source.map((value, index) =>
    Math.max(0, value - removed[index]),
  ) as StateCounts;
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

type PlannedMovement = {
  transition: MapUnitTransition;
  source: UnitLocation;
  sourceKey: string;
  destinationKey: string;
  target: UnitLocation;
  finalDestination?: LocatedStack;
  arrival: LocatedStack;
  staged: boolean;
};

function sourceAreaKey(position: string, holder: string): string {
  return `${position}\u0000${holder}`;
}

function addStates(target: StateCounts, added: StateCounts): void {
  for (let i = 0; i < target.length; i += 1) target[i] += added[i];
}

/**
 * The map snapshot already contains post-event heat-map coordinates. Keep the
 * source system on its pre-event coordinates for the full replay. React swaps
 * to the final heat-map layout in one commit after every animation completes.
 */
function buildSourceHoldPlan(
  movements: PlannedMovement[],
  previousStacks: LocatedStack[],
  currentStacks: LocatedStack[],
  movementStart: number,
): {
  transitions: MapUnitTransition[];
  finalRevealLocations: Set<string>;
} {
  const affectedAreas = new Set(
    movements.map(({ source }) =>
      sourceAreaKey(source.position, source.holder),
    ),
  );
  const movedBySource = new Map<string, StateCounts>();
  for (const movement of movements) {
    const moved = movedBySource.get(movement.sourceKey) ?? [0, 0, 0, 0];
    addStates(moved, states(movement.transition.stack));
    movedBySource.set(movement.sourceKey, moved);
  }

  const currentByLocation = new Map(
    currentStacks.map((located) => [
      rawLocationKey(locatedLocation(located)),
      located,
    ]),
  );
  const transitions: MapUnitTransition[] = [];
  const finalRevealLocations = new Set<string>();

  for (const before of previousStacks) {
    const location = locatedLocation(before);
    if (!affectedAreas.has(sourceAreaKey(location.position, location.holder)))
      continue;

    const locationKey = rawLocationKey(location);
    const movedStates = movedBySource.get(locationKey);
    const after = currentByLocation.get(locationKey);

    if (movedStates) {
      const beforeStates = states(before.stack);
      const leftoverStates = subtractStates(beforeStates, movedStates);

      // During command-token placement, one copy of the original stack paints
      // the exact pre-event frame. Keep it for a few frames after launch so the
      // browser can promote the flight layer without exposing a compositor gap.
      if (movementStart > 0) {
        const releaseAtMs = movementStart + VISUAL_HANDOFF_OVERLAP_MS;
        transitions.push({
          kind: "removed",
          stack: stackWithStates(before, beforeStates),
          toX: before.worldX,
          toY: before.worldY,
          locationKey: mapUnitLocationKey(before.position, before.stack),
          layoutUnitStates: beforeStates,
          delayMs: releaseAtMs,
          hideAfterMs: releaseAtMs,
          sourceHold: true,
        });
      }

      if (count(leftoverStates) > 0) {
        transitions.push({
          kind: "removed",
          stack: stackWithStates(before, leftoverStates),
          toX: before.worldX,
          toY: before.worldY,
          locationKey: mapUnitLocationKey(before.position, before.stack),
          layoutUnitStates: beforeStates,
          layoutStateOffsets: movedStates,
          appearAtMs: movementStart > 0 ? movementStart : undefined,
          sourceHold: true,
        });
        if (after) {
          finalRevealLocations.add(
            mapUnitLocationKey(after.position, after.stack),
          );
        }
      }
      continue;
    }

    // Other stacks can be reflowed when the departing stack changes the source
    // heat map. Hold only those whose anchor actually moved.
    if (
      !after ||
      (before.worldX === after.worldX && before.worldY === after.worldY)
    )
      continue;
    transitions.push({
      kind: "removed",
      stack: stackAtWorld(before),
      toX: before.worldX,
      toY: before.worldY,
      locationKey: mapUnitLocationKey(before.position, before.stack),
      layoutUnitStates: states(before.stack),
      sourceHold: true,
    });
    finalRevealLocations.add(mapUnitLocationKey(after.position, after.stack));
  }

  return { transitions, finalRevealLocations };
}

function buildCombatLasers(
  combats: CombatReplayEvent[],
  movements: PlannedMovement[],
  previousStacks: LocatedStack[],
  currentStacks: LocatedStack[],
  movementEnd: number,
): MapCombatLaser[] {
  const lasers: MapCombatLaser[] = [];
  for (const combat of combats) {
    if (!combat.tile || !combat.vsFaction) continue;
    const attackers = movements
      .filter((movement) => movement.target.position === combat.tile)
      .slice(0, 4)
      .map(({ transition }) => ({ x: transition.toX, y: transition.toY }));
    const holder = combat.kind === "ground" ? combat.planet : "space";
    const defenderCandidates = [...previousStacks, ...currentStacks].filter(
      (located) => {
        const location = locatedLocation(located);
        return (
          location.position === combat.tile &&
          location.holder === holder &&
          location.faction === combat.vsFaction
        );
      },
    );
    const defenders = [
      ...new Map(
        defenderCandidates.map((located) => [
          rawLocationKey(locatedLocation(located)),
          located,
        ]),
      ).values(),
    ]
      .slice(0, 4)
      .map((located) => ({ x: located.worldX, y: located.worldY }));
    if (attackers.length === 0 || defenders.length === 0) continue;

    const volleyCount = Math.min(
      8,
      Math.max(4, attackers.length + defenders.length),
    );
    for (let i = 0; i < volleyCount; i += 1) {
      const attacker = attackers[i % attackers.length];
      const defender = defenders[(i * 3 + 1) % defenders.length];
      const attackerFires = i % 3 !== 2;
      lasers.push({
        fromX: attackerFires ? attacker.x : defender.x,
        fromY: attackerFires ? attacker.y : defender.y,
        toX: attackerFires ? defender.x : attacker.x,
        toY: attackerFires ? defender.y : attacker.y,
        delayMs: movementEnd + 110 + i * 95,
        durationMs: 210,
        color: attackerFires ? "attacker" : "defender",
      });
    }
    if (lasers.length >= 12) break;
  }
  return lasers.slice(0, 12);
}

function buildAuthoritativeMapReplay(
  previous: GameData,
  current: GameData,
  options: AuthoritativeTransitionOptions,
): MapReplayPlan {
  const previousStacks = allUnitStacks(previous);
  const currentStacks = allUnitStacks(current);
  const expectedTotals = new Map<string, number>();
  const finalTotals = new Map<string, number>();
  const locations = new Map<string, UnitLocation>();

  for (const located of previousStacks) {
    const location = locatedLocation(located);
    const key = rawLocationKey(location);
    expectedTotals.set(key, count(states(located.stack)));
    locations.set(key, location);
  }
  for (const located of currentStacks) {
    const location = locatedLocation(located);
    const key = rawLocationKey(location);
    finalTotals.set(key, count(states(located.stack)));
    locations.set(key, location);
  }

  const movements: PlannedMovement[] = [];
  const stagedRotationByDestinationKey = new Map<string, number>();
  const movementArrivals = new Map<string, LocatedStack>();
  const formationSlots = new Map<string, number>();
  const movement = options.movementState
    ? deserializeCompactMovementState(options.movementState)
    : undefined;
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
  if (movement) {
    for (const source of movement.sources) {
      for (const unit of source.units) {
        const faction =
          unit.ownerFaction ?? resolveFactionForColor(previous, unit.colorId);
        if (!faction || count(unit.states) === 0) continue;
        const from: UnitLocation = {
          position: source.position,
          holder: source.holder,
          faction,
          unitId: unit.unitId,
        };
        const retreatsFromTarget = (options.retreats ?? []).some(
          (retreat) =>
            retreat.faction === faction &&
            retreat.fromTile === movement.targetPosition &&
            retreat.fromHolder === movement.targetHolder &&
            retreat.units[unit.unitId] !== undefined,
        );
        const groundCombat = (options.combats ?? []).find(
          (combat) =>
            combat.kind === "ground" &&
            combat.tile === movement.targetPosition &&
            combat.planet,
        );
        const preferredHolder =
          !retreatsFromTarget &&
          groundCombat?.planet &&
          GROUND_DESTINATION_UNITS.has(unit.unitId)
            ? groundCombat.planet
            : movement.targetHolder;
        const preferredDestination: UnitLocation = {
          position: movement.targetPosition,
          holder: preferredHolder,
          faction,
          unitId: unit.unitId,
        };
        const sourceLocated = findLocated(previousStacks, from);
        if (!sourceLocated) continue;
        const finalDestination =
          findLocated(currentStacks, preferredDestination) ??
          currentStacks.find(
            (candidate) =>
              candidate.position === movement.targetPosition &&
              candidate.stack.faction === faction &&
              candidate.stack.entityId === unit.unitId,
          );
        const to = finalDestination
          ? locatedLocation(finalDestination)
          : preferredDestination;
        const combat = (options.combats ?? []).find(
          (candidate) =>
            candidate.tile === movement.targetPosition &&
            (to.holder === "space"
              ? candidate.kind === "space"
              : candidate.kind === "ground" && candidate.planet === to.holder),
        );
        const hasCombat = combat !== undefined;
        const movedCount = count(unit.states);
        const formationKey = `${source.position}\u0000${movement.targetPosition}`;
        const formationSlot = formationSlots.get(formationKey) ?? 0;
        formationSlots.set(formationKey, formationSlot + 1);
        let arrival = hasCombat
          ? formationDestination(
              sourceLocated,
              current,
              movement.targetPosition,
              to.holder,
              formationSlot,
            )
          : (finalDestination ??
            syntheticDestination(
              sourceLocated,
              current,
              movement.targetPosition,
              to.holder,
            ));
        if (!arrival) continue;

        const fromKey = rawLocationKey(from);
        const toKey = rawLocationKey(to);
        const facingPoint = combat
          ? combatFacingPoint(
              combat,
              previousStacks,
              currentStacks,
              current.tiles[movement.targetPosition].properties,
            )
          : undefined;
        let combatRotation: number | undefined;
        if (facingPoint) {
          combatRotation = rotationToward(
            arrival.worldX,
            arrival.worldY,
            facingPoint.x,
            facingPoint.y,
          );
          arrival = recenterRotatedSplay(
            arrival,
            unit.unitId,
            movedCount,
            combatRotation,
          );
          combatRotation = rotationToward(
            arrival.worldX,
            arrival.worldY,
            facingPoint.x,
            facingPoint.y,
          );
        }
        addTotal(expectedTotals, fromKey, -movedCount);
        addTotal(expectedTotals, toKey, movedCount);
        locations.set(fromKey, from);
        locations.set(toKey, to);
        movementArrivals.set(toKey, arrival);
        const transition: MapUnitTransition = {
          kind: "moved",
          stack: stackWithStates(sourceLocated, unit.states),
          toX: arrival.worldX,
          toY: arrival.worldY,
          locationKey: mapUnitLocationKey(
            (finalDestination ?? arrival).position,
            (finalDestination ?? arrival).stack,
          ),
          layoutUnitStates: finalDestination
            ? states(finalDestination.stack)
            : unit.states,
          delayMs: movementStart,
          parkRotationDeg: combatRotation,
        };
        movements.push({
          transition,
          source: from,
          sourceKey: fromKey,
          destinationKey: toKey,
          target: to,
          finalDestination,
          arrival,
          staged: hasCombat,
        });
        if (hasCombat) {
          if (combatRotation !== undefined)
            stagedRotationByDestinationKey.set(toKey, combatRotation);
        }
      }
    }
  }

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

  // Allocate final-state sustain increases back onto the fleets that arrived
  // for this combat. Their sprites are sustained from a layout perspective,
  // but the marker itself remains hidden until the middle of the volley.
  if (damageAtMs !== undefined) {
    const damageBudgets = new Map<string, StateCounts>();
    for (const movement of movements) {
      if (!movement.staged) continue;
      const key = rawLocationKey(movement.target);
      if (damageBudgets.has(key)) continue;
      const retreatStates = options.retreats?.find(
        (retreat) =>
          retreat.faction === movement.target.faction &&
          retreat.fromTile === movement.target.position &&
          retreat.fromHolder === movement.target.holder,
      )?.units[movement.target.unitId] as StateCounts | undefined;
      const finalStates = movement.finalDestination
        ? states(movement.finalDestination.stack)
        : undefined;
      const afterStates = retreatStates ?? finalStates;
      if (!afterStates) continue;
      const before = findLocated(previousStacks, movement.target);
      const arrivalStates = movements
        .filter((candidate) => candidate.destinationKey === key)
        .reduce<StateCounts>(
          (total, candidate) => {
            const candidateStates = states(candidate.transition.stack);
            for (let i = 0; i < 4; i += 1) total[i] += candidateStates[i];
            return total;
          },
          [0, 0, 0, 0],
        );
      const beforeStates = retreatStates
        ? ([0, 0, 0, 0] as StateCounts)
        : before
          ? states(before.stack)
          : ([0, 0, 0, 0] as StateCounts);
      damageBudgets.set(key, [
        0,
        Math.max(0, afterStates[1] - beforeStates[1] - arrivalStates[1]),
        0,
        Math.max(0, afterStates[3] - beforeStates[3] - arrivalStates[3]),
      ]);
    }
    for (const movement of movements) {
      if (!movement.staged) continue;
      const { transition } = movement;
      const budget = damageBudgets.get(movement.destinationKey);
      if (!budget) continue;
      const transitionStates = states(transition.stack);
      const normalDamage = Math.min(transitionStates[0], budget[1]);
      const galvanizedDamage = Math.min(transitionStates[2], budget[3]);
      if (normalDamage + galvanizedDamage === 0) continue;
      transitionStates[0] -= normalDamage;
      transitionStates[1] += normalDamage;
      transitionStates[2] -= galvanizedDamage;
      transitionStates[3] += galvanizedDamage;
      budget[1] -= normalDamage;
      budget[3] -= galvanizedDamage;
      transition.stack = {
        ...transition.stack,
        sustained: transitionStates[1] + transitionStates[3],
        unitStates: transitionStates,
      };
      transition.damageAtMs = damageAtMs;
      transition.delayedDamageStates = [0, normalDamage, 0, galvanizedDamage];
    }
  }
  const retreatTransitions: MapUnitTransition[] = [];
  const retreatTransitionsBySource = new Map<string, MapUnitTransition[]>();
  const stagedRetreatTransitions = new Set<MapUnitTransition>();
  const retreatTotalsBySource = new Map<string, number>();
  for (const retreat of options.retreats ?? []) {
    for (const [unitId, retreatStates] of Object.entries(retreat.units)) {
      const unitStates = retreatStates as StateCounts;
      if (count(unitStates) === 0) continue;
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
      const sourceLocated =
        movementArrivals.get(fromKey) ??
        findLocated(previousStacks, from) ??
        findLocated(currentStacks, from);
      if (!sourceLocated) continue;
      const finalRetreatDestination = findLocated(currentStacks, to);
      const destinationLocated =
        finalRetreatDestination ??
        syntheticDestination(sourceLocated, current, to.position, to.holder);
      if (!destinationLocated) continue;

      const retreatCount = count(unitStates);
      addTotal(expectedTotals, fromKey, -retreatCount);
      addTotal(expectedTotals, toKey, retreatCount);
      locations.set(fromKey, from);
      locations.set(toKey, to);
      addTotal(retreatTotalsBySource, fromKey, retreatCount);
      const combatRotation = stagedRotationByDestinationKey.get(fromKey);
      const retreatTransition: MapUnitTransition = {
        kind: "retreated",
        stack: stackWithStates(sourceLocated, unitStates),
        toX: destinationLocated.worldX,
        toY: destinationLocated.worldY,
        locationKey: mapUnitLocationKey(
          destinationLocated.position,
          destinationLocated.stack,
        ),
        layoutUnitStates: finalRetreatDestination
          ? states(finalRetreatDestination.stack)
          : unitStates,
        holdFromMs: movementArrivals.has(fromKey) ? movementEnd : 0,
        startRotationDeg: combatRotation,
        holdRotationDeg: combatRotation,
      };
      retreatTransitions.push(retreatTransition);
      const sourceRetreats = retreatTransitionsBySource.get(fromKey) ?? [];
      sourceRetreats.push(retreatTransition);
      retreatTransitionsBySource.set(fromKey, sourceRetreats);
      if (stagedRotationByDestinationKey.has(fromKey))
        stagedRetreatTransitions.add(retreatTransition);
    }
  }

  const removedTransitions: MapUnitTransition[] = [];
  const stagedRemovedTransitions = new Set<MapUnitTransition>();
  const lossCounts = new Map<string, number>();
  const increasedBadgeTransitions: MapUnitTransition[] = [];
  const addedTransitions: MapUnitTransition[] = [];
  for (const [key, location] of locations) {
    const expected = expectedTotals.get(key) ?? 0;
    const final = finalTotals.get(key) ?? 0;
    if (expected > final) {
      const located =
        movementArrivals.get(key) ??
        findLocated(previousStacks, location) ??
        findLocated(currentStacks, location);
      if (!located) continue;
      lossCounts.set(key, expected - final);
      const isBadge = BADGE_UNITS.has(location.unitId);
      const isStaged = stagedRotationByDestinationKey.has(key);
      // A moved badge already hands its full count to the surviving settlement
      // badge. Rendering the numerical loss as another badge produces the
      // misleading "3 plus a spinning 1" composition.
      if (isBadge && isStaged) continue;
      const removedStates = isBadge
        ? states(located.stack)
        : statesForCount(states(located.stack), expected - final);
      const removedTransition: MapUnitTransition = {
        kind: "removed",
        stack: stackWithStates(located, removedStates),
        toX: located.worldX,
        toY: located.worldY,
        locationKey: mapUnitLocationKey(located.position, located.stack),
        appearAtMs: movementArrivals.has(key) ? movementEnd : 0,
        startRotationDeg: stagedRotationByDestinationKey.get(key),
        badgeCountChange: isBadge,
      };
      removedTransitions.push(removedTransition);
      if (stagedRotationByDestinationKey.has(key))
        stagedRemovedTransitions.add(removedTransition);
    } else if (final > expected) {
      const located = findLocated(currentStacks, location);
      if (!located) continue;
      const before = findLocated(previousStacks, location);
      if (BADGE_UNITS.has(location.unitId) && before) {
        // Fighter and infantry stacks are one composite badge. Preserve the
        // complete prior badge until the final count is ready; animating only
        // the numerical increase would hide the stack and briefly show "1".
        increasedBadgeTransitions.push({
          kind: "removed",
          stack: stackWithStates(located, states(before.stack)),
          toX: located.worldX,
          toY: located.worldY,
          locationKey: mapUnitLocationKey(located.position, located.stack),
          badgeCountChange: true,
        });
        continue;
      }
      const addedStates = statesForCount(
        states(located.stack),
        final - expected,
      );
      addedTransitions.push({
        kind: "added",
        stack: stackWithStates(located, addedStates),
        toX: located.worldX,
        toY: located.worldY,
        locationKey: mapUnitLocationKey(located.position, located.stack),
        layoutUnitStates: states(located.stack),
      });
    }
  }

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

  const retreatBudgets = new Map(retreatTotalsBySource);
  const lossBudgets = new Map(lossCounts);
  const settleTransitions: MapUnitTransition[] = [];
  const sequencedMovementTransitions: MapUnitTransition[] = [];
  const mergedRetreatTransitions = new Set<MapUnitTransition>();
  for (const movement of movements) {
    const {
      transition,
      destinationKey: destination,
      finalDestination,
    } = movement;

    const movedStates = states(transition.stack);
    const movedCount = count(movedStates);
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
    const outgoingStates = statesForCount(movedStates, retreating + dying);
    const survivingStates = subtractStates(movedStates, outgoingStates);
    const fullStackRetreat =
      movement.staged &&
      retreating === movedCount &&
      dying === 0 &&
      movements.filter((candidate) => candidate.destinationKey === destination)
        .length === 1
        ? retreatTransitionsBySource.get(destination)?.[0]
        : undefined;
    if (fullStackRetreat) {
      const retreatStates = states(fullStackRetreat.stack);
      mergedRetreatTransitions.add(fullStackRetreat);
      sequencedMovementTransitions.push({
        ...transition,
        stack: {
          ...transition.stack,
          count: count(retreatStates),
          sustained: retreatStates[1] + retreatStates[3],
          unitStates: retreatStates,
        },
        locationKey: fullStackRetreat.locationKey,
        layoutUnitStates: fullStackRetreat.layoutUnitStates,
        continuation: {
          toX: fullStackRetreat.toX,
          toY: fullStackRetreat.toY,
          delayMs: placementDelay,
          startRotationDeg: transition.parkRotationDeg,
          parkRotationDeg: 0,
        },
      });
      continue;
    }
    if (movement.staged && count(outgoingStates) === 0 && finalDestination) {
      sequencedMovementTransitions.push({
        ...transition,
        continuation: {
          toX: finalDestination.worldX,
          toY: finalDestination.worldY,
          delayMs: placementDelay,
          startRotationDeg: transition.parkRotationDeg,
          parkRotationDeg: 0,
        },
      });
      continue;
    }
    if (movement.staged) {
      sequencedMovementTransitions.push({
        ...transition,
        // Successor death/retreat/settlement ghosts are already painted at
        // deathDelay. Keep this source ghost for a few extra frames so the
        // browser never exposes a one-frame gap during the handoff.
        hideAfterMs: deathDelay + VISUAL_HANDOFF_OVERLAP_MS,
      });
    } else if (count(outgoingStates) > 0) {
      sequencedMovementTransitions.push({
        ...transition,
        stack: {
          ...transition.stack,
          count: count(outgoingStates),
          sustained: outgoingStates[1] + outgoingStates[3],
          unitStates: outgoingStates,
        },
        hideAfterMs: movementEnd,
      });
      if (count(survivingStates) > 0) {
        sequencedMovementTransitions.push({
          ...transition,
          stack: {
            ...transition.stack,
            count: count(survivingStates),
            sustained: survivingStates[1] + survivingStates[3],
            unitStates: survivingStates,
          },
        });
      }
    } else {
      sequencedMovementTransitions.push(transition);
    }

    if (!movement.staged || count(survivingStates) === 0 || !finalDestination)
      continue;

    settleTransitions.push({
      kind: "settled",
      stack: stackWithStates(movement.arrival, survivingStates),
      toX: finalDestination.worldX,
      toY: finalDestination.worldY,
      locationKey: mapUnitLocationKey(
        finalDestination.position,
        finalDestination.stack,
      ),
      layoutUnitStates: states(finalDestination.stack),
      holdFromMs: deathDelay,
      delayMs: placementDelay,
      startRotationDeg: transition.parkRotationDeg,
      holdRotationDeg: transition.parkRotationDeg,
    });
  }

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
  const delayedDamage = new Map<
    string,
    { damageAtMs: number; states: StateCounts }
  >();
  if (damageAtMs !== undefined) {
    for (const currentLocated of currentStacks) {
      const location = locatedLocation(currentLocated);
      const key = rawLocationKey(location);
      if (stagedRotationByDestinationKey.has(key)) continue;
      const previousLocated = findLocated(previousStacks, location);
      if (!previousLocated) continue;
      const before = states(previousLocated.stack);
      const after = states(currentLocated.stack);
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
  }
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
