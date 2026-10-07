import type {
  CombatReplayEvent,
  GameData,
} from "@/app/providers/context/types";
import type { Point } from "@/entities/data/types";
import { getGenericUnitDataByAsyncId } from "@/entities/lookup/units";
import {
  deserializeCompactMovementState,
  resolveCompactMovementFaction,
} from "@/utils/compactMovementState";
import type { EntityStack } from "@/utils/unitPositioning";
import type {
  AuthoritativeTransitionOptions,
  LocatedStack,
  MapCombatLaser,
  MapUnitTransition,
  PlannedMovement,
  ReplayInventory,
  StateCounts,
  UnitLocation,
} from "./types";
import {
  accumulateStates,
  addTotal,
  allPlacedStacks,
  findLocated,
  indexByLocation,
  locatedKey,
  locatedLocation,
  mapUnitLocationKey,
  rawLocationKey,
  stackAtWorld,
  stackHolder,
  stackWithStates,
  stateCount,
  subtractStates,
  transitionAt,
  unitStates,
} from "./unitState";

const GROUND_DESTINATION_UNITS = new Set(["gf", "mf", "pd", "sd"]);
export const BADGE_UNITS = new Set(["ff", "gf"]);
const NATIVE_NORTHWEST_ANGLE = -135;
const FORMATION_BUFFER_PX = 34;
const FORMATION_SEARCH_SLOTS = 18;
/** Fallback distance from tile center to a hex edge when no midpoints exist. */
const HEX_EDGE_FALLBACK_RADIUS = 145;
const MAX_LASER_ENDPOINTS = 4;
const MAX_COMBAT_LASERS = 12;
const LASER_LEAD_MS = 110;
const LASER_STAGGER_MS = 95;
const LASER_DURATION_MS = 210;
export const VISUAL_HANDOFF_OVERLAP_MS = 50;

type FormationKind = "ship" | "infantry" | "ground";
type FormationObstacle = { x: number; y: number; radius: number };

/** Infantry arrive in repeating triangles of six, offset across/into the hex. */
const INFANTRY_TRIANGLE = [
  { across: -44, depth: 0 },
  { across: 0, depth: 0 },
  { across: 44, depth: 0 },
  { across: -22, depth: 36 },
  { across: 22, depth: 36 },
  { across: 0, depth: 72 },
];
const INFANTRY_BLOCK_DEPTH = 108;
const FORMATION_BASE_DEPTH: Record<FormationKind, number> = {
  infantry: 106,
  ground: 164,
  ship: 92,
};
const GRID_SPACING: Record<"ship" | "ground", { across: number; depth: number }> =
  {
    ship: { across: 96, depth: 82 },
    ground: { across: 50, depth: 46 },
  };
const SHIP_CENTER_COLUMN_LEAD = 28;

type MovementPhase = {
  movements: PlannedMovement[];
  movementArrivals: Map<string, LocatedStack>;
  stagedRotations: Map<string, number>;
};

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

function isCombatDefender(combat: CombatReplayEvent) {
  const holder = combat.kind === "ground" ? combat.planet : "space";
  return (located: LocatedStack) => {
    const location = locatedLocation(located);
    return (
      location.position === combat.tile &&
      location.holder === holder &&
      location.faction === combat.vsFaction
    );
  };
}

function averagePoint(stacks: LocatedStack[]): Point {
  return {
    x:
      stacks.reduce((total, located) => total + located.worldX, 0) /
      stacks.length,
    y:
      stacks.reduce((total, located) => total + located.worldY, 0) /
      stacks.length,
  };
}

function stackInHolder(source: LocatedStack, holder: string): EntityStack {
  return {
    ...source.stack,
    planetName: holder === "space" ? undefined : holder,
  };
}

function combatFacingPoint(
  combat: CombatReplayEvent,
  previousStacks: LocatedStack[],
  currentStacks: LocatedStack[],
  fallback: Point,
): Point {
  const isDefender = isCombatDefender(combat);
  const defenders = previousStacks.filter(isDefender);
  const visibleDefenders =
    defenders.length > 0 ? defenders : currentStacks.filter(isDefender);
  if (visibleDefenders.length === 0) return fallback;
  return averagePoint(visibleDefenders);
}

export function syntheticDestination(
  source: LocatedStack,
  data: GameData,
  position: string,
  holder: string,
): LocatedStack | undefined {
  const tile = data.tiles[position];
  if (!tile) return undefined;
  return {
    position,
    stack: stackInHolder(source, holder),
    worldX: tile.properties.x + source.stack.x,
    worldY: tile.properties.y + source.stack.y,
  };
}

/** Across/depth offsets of a formation slot, relative to the entry edge. */
function formationSlotOffset(
  slot: number,
  formationKind: FormationKind,
): { across: number; depth: number } {
  if (formationKind === "infantry") {
    const block = Math.floor(slot / INFANTRY_TRIANGLE.length);
    const point = INFANTRY_TRIANGLE[slot % INFANTRY_TRIANGLE.length];
    return {
      across: point.across,
      depth: point.depth + block * INFANTRY_BLOCK_DEPTH,
    };
  }
  const column = (slot % 3) - 1;
  const row = Math.floor(slot / 3);
  const spacing = GRID_SPACING[formationKind];
  const lead =
    formationKind === "ship" && column === 0 ? SHIP_CENTER_COLUMN_LEAD : 0;
  return {
    across: column * spacing.across,
    depth: row * spacing.depth - lead,
  };
}

function closestPoint(points: Point[], target: LocatedStack): Point | undefined {
  const distance = (point: Point) =>
    (point.x - target.worldX) ** 2 + (point.y - target.worldY) ** 2;
  return [...points].sort((a, b) => distance(a) - distance(b))[0];
}

function formationDestination(
  source: LocatedStack,
  approachSource: LocatedStack,
  data: GameData,
  position: string,
  holder: string,
  slot: number,
  formationKind: FormationKind,
): LocatedStack | undefined {
  const tile = data.tiles[position];
  if (!tile) return undefined;
  const center = tile.properties;
  const closest = closestPoint(
    tile.properties.hexOutline.midpoints,
    approachSource,
  );
  const sourceAngle = Math.atan2(
    approachSource.worldY - center.y,
    approachSource.worldX - center.x,
  );
  const edge = closest ?? {
    x: center.x + Math.cos(sourceAngle) * HEX_EDGE_FALLBACK_RADIUS,
    y: center.y + Math.sin(sourceAngle) * HEX_EDGE_FALLBACK_RADIUS,
  };
  const towardCenterX = center.x - edge.x;
  const towardCenterY = center.y - edge.y;
  const inwardLength = Math.hypot(towardCenterX, towardCenterY) || 1;
  const inwardX = towardCenterX / inwardLength;
  const inwardY = towardCenterY / inwardLength;
  const acrossX = -inwardY;
  const acrossY = inwardX;
  const offset = formationSlotOffset(slot, formationKind);
  const formationDepth = FORMATION_BASE_DEPTH[formationKind] + offset.depth;
  return {
    position,
    stack: stackInHolder(source, holder),
    worldX: edge.x + inwardX * formationDepth + acrossX * offset.across,
    worldY: edge.y + inwardY * formationDepth + acrossY * offset.across,
  };
}

function isShipUnit(unitId: string): boolean {
  return getGenericUnitDataByAsyncId(unitId)?.isShip === true;
}

function formationRadius(stack: EntityStack): number {
  if (BADGE_UNITS.has(stack.entityId)) return 40;
  if (stack.entityType !== "unit") return 30;
  if (stack.entityId === "mf") return 48;
  return 38 + Math.min(5, Math.max(0, stack.count - 1)) * 7;
}

function formationOverlap(
  candidate: LocatedStack,
  obstacles: FormationObstacle[],
): number {
  const candidateRadius = formationRadius(candidate.stack);
  return obstacles.reduce((total, obstacle) => {
    const clearance = candidateRadius + obstacle.radius + FORMATION_BUFFER_PX;
    const overlap = Math.max(
      0,
      clearance -
        Math.hypot(
          candidate.worldX - obstacle.x,
          candidate.worldY - obstacle.y,
        ),
    );
    return total + overlap * overlap;
  }, 0);
}

function recenterRotatedSplay(
  located: LocatedStack,
  unitId: string,
  unitCount: number,
  rotationDeg: number,
): LocatedStack {
  if (BADGE_UNITS.has(unitId) || unitCount <= 1) return located;
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

function formationKind(unitId: string): FormationKind {
  if (isShipUnit(unitId)) return "ship";
  return unitId === "gf" ? "infantry" : "ground";
}

function isSpaceStackAt(located: LocatedStack, position: string | undefined) {
  return (
    located.position === position && stackHolder(located.stack) === "space"
  );
}

function initialFormationObstacles(
  previous: GameData,
  current: GameData,
  targetPosition: string | undefined,
  activeFaction: string | null | undefined,
): FormationObstacle[] {
  const previousPlacements = allPlacedStacks(previous).filter((located) =>
    isSpaceStackAt(located, targetPosition),
  );
  const previousKeys = new Set(previousPlacements.map(locatedKey));
  const placementsByLocation = indexByLocation(previousPlacements);
  for (const located of allPlacedStacks(current)) {
    if (!isSpaceStackAt(located, targetPosition)) continue;
    const key = locatedKey(located);
    if (located.stack.faction === activeFaction && !previousKeys.has(key)) {
      continue;
    }
    placementsByLocation.set(key, located);
  }
  return [...placementsByLocation.values()].map((located) => ({
    x: located.worldX,
    y: located.worldY,
    radius: formationRadius(located.stack),
  }));
}

function chooseFormationArrival({
  source,
  approachSource,
  current,
  targetPosition,
  holder,
  kind,
  firstSlot,
  obstacles,
}: {
  source: LocatedStack;
  approachSource: LocatedStack;
  current: GameData;
  targetPosition: string;
  holder: string;
  kind: FormationKind;
  firstSlot: number;
  obstacles: FormationObstacle[];
}): { arrival: LocatedStack | undefined; nextSlot: number } {
  if (kind !== "ship") {
    return {
      arrival: formationDestination(
        source,
        approachSource,
        current,
        targetPosition,
        holder,
        firstSlot,
        kind,
      ),
      nextSlot: firstSlot + 1,
    };
  }

  let bestCandidate: LocatedStack | undefined;
  let bestCandidateSlot = firstSlot;
  let bestOverlap = Number.POSITIVE_INFINITY;
  for (
    let candidateSlot = firstSlot;
    candidateSlot < firstSlot + FORMATION_SEARCH_SLOTS;
    candidateSlot += 1
  ) {
    const candidate = formationDestination(
      source,
      approachSource,
      current,
      targetPosition,
      holder,
      candidateSlot,
      kind,
    );
    if (!candidate) continue;
    const overlap = formationOverlap(candidate, obstacles);
    if (overlap < bestOverlap) {
      bestCandidate = candidate;
      bestCandidateSlot = candidateSlot;
      bestOverlap = overlap;
    }
    if (overlap === 0) break;
  }
  return {
    arrival: bestCandidate,
    nextSlot: bestCandidateSlot + 1,
  };
}

type MovementTarget = { targetPosition: string; targetHolder: string };

/** Ground forces head for the contested planet unless they retreat off it. */
function preferredHolder(
  target: MovementTarget,
  options: AuthoritativeTransitionOptions,
  faction: string,
  unitId: string,
): string {
  const retreatsFromTarget = (options.retreats ?? []).some(
    (retreat) =>
      retreat.faction === faction &&
      retreat.fromTile === target.targetPosition &&
      retreat.fromHolder === target.targetHolder &&
      retreat.units[unitId] !== undefined,
  );
  const groundCombat = (options.combats ?? []).find(
    (combat) =>
      combat.kind === "ground" &&
      combat.tile === target.targetPosition &&
      combat.planet,
  );
  return !retreatsFromTarget &&
    groundCombat?.planet &&
    GROUND_DESTINATION_UNITS.has(unitId)
    ? groundCombat.planet
    : target.targetHolder;
}

/** The combat a unit arriving at `holder` joins; ships join any combat in the system. */
function combatAtDestination(
  combats: CombatReplayEvent[],
  targetPosition: string,
  holder: string,
  unitId: string,
): CombatReplayEvent | undefined {
  const matchingCombat = combats.find(
    (candidate) =>
      candidate.tile === targetPosition &&
      (holder === "space"
        ? candidate.kind === "space"
        : candidate.kind === "ground" && candidate.planet === holder),
  );
  if (matchingCombat || !isShipUnit(unitId)) return matchingCombat;
  return combats.find((candidate) => candidate.tile === targetPosition);
}

/** Turns a parked stack toward `facingPoint`, recentering its rotated splay. */
function parkFacing(
  arrival: LocatedStack,
  unitId: string,
  movedCount: number,
  facingPoint: Point,
): { arrival: LocatedStack; rotation: number } {
  const initialRotation = rotationToward(
    arrival.worldX,
    arrival.worldY,
    facingPoint.x,
    facingPoint.y,
  );
  const recentered = recenterRotatedSplay(
    arrival,
    unitId,
    movedCount,
    initialRotation,
  );
  return {
    arrival: recentered,
    rotation: rotationToward(
      recentered.worldX,
      recentered.worldY,
      facingPoint.x,
      facingPoint.y,
    ),
  };
}

export function planMovements({
  previous,
  current,
  options,
  previousStacks,
  currentStacks,
  inventory,
  movementStart,
}: {
  previous: GameData;
  current: GameData;
  options: AuthoritativeTransitionOptions;
  previousStacks: LocatedStack[];
  currentStacks: LocatedStack[];
  inventory: ReplayInventory;
  movementStart: number;
}): MovementPhase {
  const movements: PlannedMovement[] = [];
  const stagedRotations = new Map<string, number>();
  const movementArrivals = new Map<string, LocatedStack>();
  const formationSlots = new Map<string, number>();
  const formationApproaches = new Map<string, LocatedStack>();
  const movement = options.movementState
    ? deserializeCompactMovementState(options.movementState)
    : undefined;
  const obstacles = initialFormationObstacles(
    previous,
    current,
    movement?.targetPosition,
    options.activeFaction,
  );
  if (!movement) {
    return { movements, movementArrivals, stagedRotations };
  }

  const movedUnits = movement.sources.flatMap((source) =>
    source.units.map((unit) => ({ source, unit })),
  );
  for (const { source, unit } of movedUnits) {
    const faction = resolveCompactMovementFaction(
      unit,
      previous.originalFactionColorMap,
    );
    if (!faction || stateCount(unit.states) === 0) continue;
    const from: UnitLocation = {
      position: source.position,
      holder: source.holder,
      faction,
      unitId: unit.unitId,
    };
    const preferredDestination: UnitLocation = {
      position: movement.targetPosition,
      holder: preferredHolder(movement, options, faction, unit.unitId),
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
    const combat = combatAtDestination(
      options.combats ?? [],
      movement.targetPosition,
      to.holder,
      unit.unitId,
    );
    const kind = formationKind(unit.unitId);
    const formationKey = [
      movement.targetPosition,
      to.holder,
      faction,
      kind,
    ].join("\u0000");
    const approachSource =
      formationApproaches.get(formationKey) ?? sourceLocated;
    formationApproaches.set(formationKey, approachSource);
    let arrival: LocatedStack | undefined;
    if (combat) {
      const placement = chooseFormationArrival({
        source: sourceLocated,
        approachSource,
        current,
        targetPosition: movement.targetPosition,
        holder: to.holder,
        kind,
        firstSlot: formationSlots.get(formationKey) ?? 0,
        obstacles,
      });
      arrival = placement.arrival;
      formationSlots.set(formationKey, placement.nextSlot);
    } else {
      arrival =
        finalDestination ??
        syntheticDestination(
          sourceLocated,
          current,
          movement.targetPosition,
          to.holder,
        );
    }
    if (!arrival) continue;

    const movedCount = stateCount(unit.states);
    let combatRotation: number | undefined;
    if (combat) {
      const parked = parkFacing(
        arrival,
        unit.unitId,
        movedCount,
        combatFacingPoint(
          combat,
          previousStacks,
          currentStacks,
          current.tiles[movement.targetPosition].properties,
        ),
      );
      arrival = parked.arrival;
      combatRotation = parked.rotation;
    }
    if (combat && kind === "ship") {
      obstacles.push({
        x: arrival.worldX,
        y: arrival.worldY,
        radius: formationRadius(arrival.stack),
      });
    }

    const fromKey = rawLocationKey(from);
    const toKey = rawLocationKey(to);
    addTotal(inventory.expectedTotals, fromKey, -movedCount);
    addTotal(inventory.expectedTotals, toKey, movedCount);
    inventory.locations.set(fromKey, from);
    inventory.locations.set(toKey, to);
    if (!movementArrivals.has(toKey)) movementArrivals.set(toKey, arrival);
    const landing = finalDestination ?? arrival;
    const transition: MapUnitTransition = {
      kind: "moved",
      stack: stackWithStates(sourceLocated, unit.states),
      toX: arrival.worldX,
      toY: arrival.worldY,
      locationKey: mapUnitLocationKey(landing.position, landing.stack),
      layoutUnitStates: finalDestination
        ? unitStates(finalDestination.stack)
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
      staged: combat !== undefined,
    });
    if (combatRotation !== undefined) {
      stagedRotations.set(toKey, combatRotation);
    }
  }

  return { movements, movementArrivals, stagedRotations };
}

function sourceAreaKey(position: string, holder: string): string {
  return `${position}\u0000${holder}`;
}

export function buildSourceHoldPlan(
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
    accumulateStates(
      movedBySource,
      movement.sourceKey,
      unitStates(movement.transition.stack),
    );
  }

  const currentByLocation = indexByLocation(currentStacks);
  const transitions: MapUnitTransition[] = [];
  const finalRevealLocations = new Set<string>();

  for (const before of previousStacks) {
    const location = locatedLocation(before);
    if (!affectedAreas.has(sourceAreaKey(location.position, location.holder))) {
      continue;
    }
    const locationKey = rawLocationKey(location);
    const movedStates = movedBySource.get(locationKey);
    const after = currentByLocation.get(locationKey);

    if (movedStates) {
      const beforeStates = unitStates(before.stack);
      const leftoverStates = subtractStates(beforeStates, movedStates);
      if (movementStart > 0) {
        const releaseAtMs = movementStart + VISUAL_HANDOFF_OVERLAP_MS;
        transitions.push({
          ...transitionAt(
            "removed",
            before,
            stackWithStates(before, beforeStates),
          ),
          layoutUnitStates: beforeStates,
          delayMs: releaseAtMs,
          hideAfterMs: releaseAtMs,
          sourceHold: true,
        });
      }
      if (stateCount(leftoverStates) > 0) {
        transitions.push({
          ...transitionAt(
            "removed",
            before,
            stackWithStates(before, leftoverStates),
          ),
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

    if (
      !after ||
      (before.worldX === after.worldX && before.worldY === after.worldY)
    ) {
      continue;
    }
    transitions.push({
      ...transitionAt("removed", before, stackAtWorld(before)),
      layoutUnitStates: unitStates(before.stack),
      sourceHold: true,
    });
    finalRevealLocations.add(mapUnitLocationKey(after.position, after.stack));
  }

  return { transitions, finalRevealLocations };
}

export function buildCombatLasers(
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
      .filter(
        (movement) =>
          movement.target.position === combat.tile &&
          isShipUnit(movement.target.unitId),
      )
      .slice(0, MAX_LASER_ENDPOINTS)
      .map(({ transition }) => ({ x: transition.toX, y: transition.toY }));
    const defenderCandidates = [...previousStacks, ...currentStacks].filter(
      isCombatDefender(combat),
    );
    const defenders = [...indexByLocation(defenderCandidates).values()]
      .slice(0, MAX_LASER_ENDPOINTS)
      .map((located) => ({
        x: located.worldX,
        y: located.worldY,
        isShip: isShipUnit(located.stack.entityId),
      }));
    if (attackers.length === 0 || defenders.length === 0) continue;
    const defenderShips = defenders.filter((defender) => defender.isShip);
    const volleyCount = Math.min(
      8,
      Math.max(4, attackers.length + defenders.length),
    );
    for (let index = 0; index < volleyCount; index += 1) {
      const attacker = attackers[index % attackers.length];
      const defender = defenders[(index * 3 + 1) % defenders.length];
      const attackerFires = combat.kind === "ground" || index % 3 !== 2;
      const firingDefender =
        defenderShips.length > 0
          ? defenderShips[(index * 3 + 1) % defenderShips.length]
          : undefined;
      const shooter = attackerFires ? attacker : firingDefender;
      if (!shooter) continue;
      lasers.push({
        fromX: shooter.x,
        fromY: shooter.y,
        toX: attackerFires ? defender.x : attacker.x,
        toY: attackerFires ? defender.y : attacker.y,
        delayMs: movementEnd + LASER_LEAD_MS + index * LASER_STAGGER_MS,
        durationMs: LASER_DURATION_MS,
        color: attackerFires ? "attacker" : "defender",
      });
    }
    if (lasers.length >= MAX_COMBAT_LASERS) break;
  }
  return lasers.slice(0, MAX_COMBAT_LASERS);
}
