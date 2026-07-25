import type {
  CombatReplayEvent,
  GameData,
} from "@/app/providers/context/types";
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
  addStates,
  addTotal,
  allPlacedStacks,
  findLocated,
  locatedLocation,
  mapUnitLocationKey,
  rawLocationKey,
  stackAtWorld,
  stackWithStates,
  stateCount,
  subtractStates,
  unitStates,
} from "./unitState";

const GROUND_DESTINATION_UNITS = new Set(["gf", "mf", "pd", "sd"]);
export const BADGE_UNITS = new Set(["ff", "gf"]);
const NATIVE_NORTHWEST_ANGLE = -135;
const FORMATION_BUFFER_PX = 34;
const FORMATION_SEARCH_SLOTS = 18;
const VISUAL_HANDOFF_OVERLAP_MS = 50;

type FormationKind = "ship" | "infantry" | "ground";
type FormationObstacle = { x: number; y: number; radius: number };

export type MovementPhase = {
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
  const midpoints = tile.properties.hexOutline.midpoints ?? [];
  const closest = [...midpoints].sort(
    (a, b) =>
      (a.x - approachSource.worldX) ** 2 +
      (a.y - approachSource.worldY) ** 2 -
      ((b.x - approachSource.worldX) ** 2 + (b.y - approachSource.worldY) ** 2),
  )[0];
  const sourceAngle = Math.atan2(
    approachSource.worldY - center.y,
    approachSource.worldX - center.x,
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
  let acrossOffset: number;
  let depthOffset: number;
  if (formationKind === "infantry") {
    const triangle = [
      { across: -44, depth: 0 },
      { across: 0, depth: 0 },
      { across: 44, depth: 0 },
      { across: -22, depth: 36 },
      { across: 22, depth: 36 },
      { across: 0, depth: 72 },
    ];
    const block = Math.floor(slot / triangle.length);
    const point = triangle[slot % triangle.length];
    acrossOffset = point.across;
    depthOffset = point.depth + block * 108;
  } else {
    const column = (slot % 3) - 1;
    const row = Math.floor(slot / 3);
    acrossOffset = column * (formationKind === "ground" ? 50 : 96);
    depthOffset = row * (formationKind === "ground" ? 46 : 82);
    if (formationKind === "ship" && column === 0) depthOffset -= 28;
  }
  const formationDepth =
    (formationKind === "infantry"
      ? 106
      : formationKind === "ground"
        ? 164
        : 92) + depthOffset;
  return {
    position,
    stack: {
      ...source.stack,
      planetName: holder === "space" ? undefined : holder,
    },
    worldX: edge.x + inwardX * formationDepth + acrossX * acrossOffset,
    worldY: edge.y + inwardY * formationDepth + acrossY * acrossOffset,
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

function initialFormationObstacles(
  previous: GameData,
  current: GameData,
  targetPosition: string | undefined,
  activeFaction: string | null | undefined,
): FormationObstacle[] {
  const previousPlacements = allPlacedStacks(previous).filter(
    ({ position, stack }) =>
      position === targetPosition && (stack.planetName ?? "space") === "space",
  );
  const previousKeys = new Set(
    previousPlacements.map((located) =>
      rawLocationKey(locatedLocation(located)),
    ),
  );
  const placementsByLocation = new Map(
    previousPlacements.map((located) => [
      rawLocationKey(locatedLocation(located)),
      located,
    ]),
  );
  for (const located of allPlacedStacks(current)) {
    if (
      located.position !== targetPosition ||
      (located.stack.planetName ?? "space") !== "space"
    ) {
      continue;
    }
    const key = rawLocationKey(locatedLocation(located));
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

  for (const source of movement.sources) {
    for (const unit of source.units) {
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
      const matchingCombat = (options.combats ?? []).find(
        (candidate) =>
          candidate.tile === movement.targetPosition &&
          (to.holder === "space"
            ? candidate.kind === "space"
            : candidate.kind === "ground" && candidate.planet === to.holder),
      );
      const combat =
        matchingCombat ??
        (isShipUnit(unit.unitId)
          ? (options.combats ?? []).find(
              (candidate) => candidate.tile === movement.targetPosition,
            )
          : undefined);
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
      const firstSlot = formationSlots.get(formationKey) ?? 0;
      let arrival: LocatedStack | undefined;
      if (combat) {
        const placement = chooseFormationArrival({
          source: sourceLocated,
          approachSource,
          current,
          targetPosition: movement.targetPosition,
          holder: to.holder,
          kind,
          firstSlot,
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
    const moved = movedBySource.get(movement.sourceKey) ?? [0, 0, 0, 0];
    addStates(moved, unitStates(movement.transition.stack));
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
      if (stateCount(leftoverStates) > 0) {
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

    if (
      !after ||
      (before.worldX === after.worldX && before.worldY === after.worldY)
    ) {
      continue;
    }
    transitions.push({
      kind: "removed",
      stack: stackAtWorld(before),
      toX: before.worldX,
      toY: before.worldY,
      locationKey: mapUnitLocationKey(before.position, before.stack),
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
      if (!attackerFires && !firingDefender) continue;
      lasers.push({
        fromX: attackerFires ? attacker.x : firingDefender!.x,
        fromY: attackerFires ? attacker.y : firingDefender!.y,
        toX: attackerFires ? defender.x : attacker.x,
        toY: attackerFires ? defender.y : attacker.y,
        delayMs: movementEnd + 110 + index * 95,
        durationMs: 210,
        color: attackerFires ? "attacker" : "defender",
      });
    }
    if (lasers.length >= 12) break;
  }
  return lasers.slice(0, 12);
}
