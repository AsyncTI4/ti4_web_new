import { getGenericUnitDataByAsyncId } from "@/entities/lookup/units";
import {
  chooseCompatibleTileLayout,
  findPlanetCandidates,
} from "./groundFormations";
import {
  area,
  centeredFootprint,
  createBounds,
  createFixedBounds,
  createReservedBounds,
} from "./groundLayoutGeometry";
import type {
  GroundGroup,
  GroundGroupKind,
  GroundPlacementResult,
  GroundPlanetRequest,
  PlanetLayout,
  PositionedGroup,
} from "./groundLayoutTypes";
import { getRenderedStackFootprint } from "@/entities/renderedStackGeometry";
import type { EntityStack, EntityStackBase, Planet } from "./types";

export type {
  GroundGroupKind,
  GroundPlacementResult,
  GroundPlanetRequest,
  FallbackGroundGroup,
} from "./groundLayoutTypes";

const MEMBER_GAP = 4;

export function placeGroundEntityGroupsForTile(
  requests: GroundPlanetRequest[],
  planets: Planet[],
): GroundPlacementResult {
  if (requests.length === 0) {
    return { placements: [], fallbackGroups: [] };
  }

  const layouts = requests
    .map((request) => createPlanetLayout(request, planets))
    .sort(comparePlanetLayouts);
  const fixedBounds = requests.flatMap(createFixedBounds);
  const reservedBounds = planets.flatMap(createReservedBounds);
  const candidateSets = layouts.map((layout) =>
    findPlanetCandidates(layout, fixedBounds, reservedBounds),
  );

  const solution = chooseCompatibleTileLayout(candidateSets);
  const selectedGroups =
    solution?.groups ??
    candidateSets.flatMap((candidates) => candidates[0]?.groups ?? []);
  return finalizeGroundPlacement(layouts, selectedGroups);
}

function createPlanetLayout(
  request: GroundPlanetRequest,
  planets: Planet[],
): PlanetLayout {
  return {
    planet: request.planet,
    groups: buildGroundGroups(request),
    neighbors: planets.filter(({ name }) => name !== request.planet.name),
  };
}

function buildGroundGroups(request: GroundPlanetRequest): GroundGroup[] {
  const stacksByEntity = new Map<
    string,
    { kind: GroundGroupKind; stacks: EntityStackBase[] }
  >();

  for (const [faction, entities] of Object.entries(request.factionEntities)) {
    for (const entity of entities) {
      if (entity.count <= 0) continue;
      const entry = stacksByEntity.get(entity.entityId) ?? {
        kind: getGroundGroupKind(entity.entityId),
        stacks: [],
      };
      entry.stacks.push({ ...entity, faction });
      stacksByEntity.set(entity.entityId, entry);
    }
  }

  return [...stacksByEntity.entries()]
    .map(([id, { kind, stacks }]) =>
      createGroundGroup(id, kind, sortStacks(stacks, request.controller)),
    )
    .sort(compareGroups);
}

function getGroundGroupKind(entityId: string): GroundGroupKind {
  if (entityId === "gf") return "infantry";
  if (entityId === "mf") return "mech";
  if (getGenericUnitDataByAsyncId(entityId)?.isStructure) return "structure";
  return "other";
}

function sortStacks(
  stacks: EntityStackBase[],
  controller?: string,
): EntityStackBase[] {
  return [...stacks].sort(
    (first, second) =>
      Number(second.faction === controller) -
        Number(first.faction === controller) ||
      first.faction.localeCompare(second.faction),
  );
}

function createGroundGroup(
  id: string,
  kind: GroundGroupKind,
  stacks: EntityStackBase[],
): GroundGroup {
  const footprints = stacks.map(getRenderedStackFootprint);
  const width = Math.max(...footprints.map(({ width }) => width));
  const height =
    footprints.reduce((total, footprint) => total + footprint.height, 0) +
    MEMBER_GAP * Math.max(stacks.length - 1, 0);
  let nextTop = -height / 2;

  const members = stacks.map((stack, index) => {
    const footprint = footprints[index];
    const visualCenterX = (footprint.left + footprint.right) / 2;
    const offset = {
      x: -visualCenterX,
      y: nextTop - footprint.top,
    };
    nextTop += footprint.height + MEMBER_GAP;
    return { stack, offset };
  });

  return {
    id,
    kind,
    members,
    footprint: centeredFootprint(width, height),
  };
}

function compareGroups(first: GroundGroup, second: GroundGroup): number {
  return (
    area(second.footprint) - area(first.footprint) ||
    first.id.localeCompare(second.id)
  );
}

function comparePlanetLayouts(
  first: PlanetLayout,
  second: PlanetLayout,
): number {
  const totalArea = (layout: PlanetLayout) =>
    layout.groups.reduce((total, group) => total + area(group.footprint), 0);
  return (
    totalArea(second) - totalArea(first) ||
    first.planet.name.localeCompare(second.planet.name)
  );
}

function placeGroupMembers(group: PositionedGroup): EntityStack[] {
  return group.group.members.map(({ stack, offset }) => ({
    ...stack,
    x: group.point.x + offset.x,
    y: group.point.y + offset.y,
    planetName: group.layout.planet.name,
  }));
}

export function finalizeGroundPlacement(
  layouts: PlanetLayout[],
  selectedGroups: PositionedGroup[],
): GroundPlacementResult {
  const selected = new Set<GroundGroup>();
  const uniqueSelectedGroups = selectedGroups.filter(({ group }) => {
    if (selected.has(group)) return false;
    selected.add(group);
    return true;
  });
  const fallbackPositionedGroups = layouts.flatMap((layout) =>
    layout.groups
      .filter((group) => !selected.has(group))
      .map((group) => positionFallbackGroup(layout, group)),
  );

  return {
    placements: [...uniqueSelectedGroups, ...fallbackPositionedGroups].flatMap(
      placeGroupMembers,
    ),
    fallbackGroups: fallbackPositionedGroups.map(({ layout, group }) => ({
      planetName: layout.planet.name,
      kind: group.kind,
      stacks: group.members.map(({ stack }) => stack),
    })),
  };
}

function positionFallbackGroup(
  layout: PlanetLayout,
  group: GroundGroup,
): PositionedGroup {
  const point = { x: layout.planet.x, y: layout.planet.y };
  return {
    layout,
    group,
    point,
    idealPoint: point,
    bounds: createBounds(point, group.footprint),
  };
}
