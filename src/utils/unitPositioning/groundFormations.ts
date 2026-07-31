import {
  centerOf,
  createBounds,
  distance,
  unionBounds,
} from "./groundLayoutGeometry";
import {
  combineLayoutScores,
  compareLayoutScores,
  scoreFormationBalance,
  scoreLayout,
} from "./groundLayoutScoring";
import type {
  Bounds,
  GroundGroup,
  LayoutCandidate,
  PlanetLayout,
  Point,
  PositionedGroup,
} from "./groundLayoutTypes";
import type { Planet } from "./types";

type FormationPosition = {
  group: GroundGroup;
  offset: Point;
};

type Formation = {
  positions: FormationPosition[];
  balancePenalty: number;
};

const FORMATION_GAP = 5;
const ANCHOR_STEP = 10;
const ANCHOR_RANGE = 60;
const NUDGE_STEP = 5;
const MAX_NUDGE = 20;
const NUDGE_PASSES = MAX_NUDGE / NUDGE_STEP;
const CANDIDATES_PER_REGION = 2;
const REGION_INSET = 20;
const ANCHOR_OFFSETS = createSearchOffsets(ANCHOR_RANGE, ANCHOR_STEP);
const NUDGE_OFFSETS = createNudgeOffsets();

export function findPlanetCandidates(
  layout: PlanetLayout,
  fixedBounds: Bounds[],
  reservedBounds: Bounds[],
): LayoutCandidate[] {
  if (layout.groups.length === 0) {
    return [createCandidate([], fixedBounds, reservedBounds, 0)];
  }

  const candidatesByRegion = new Map<string, LayoutCandidate[]>();
  const anchors = createAnchorPoints(layout.planet);

  for (const formation of createFormations(layout.groups)) {
    for (const anchor of anchors) {
      const groups = formation.positions.map(({ group, offset }) =>
        positionGroup(layout, group, {
          x: anchor.x + offset.x,
          y: anchor.y + offset.y,
        }),
      );
      keepRegionalCandidate(
        candidatesByRegion,
        createCandidate(
          groups,
          fixedBounds,
          reservedBounds,
          formation.balancePenalty,
        ),
        layout.planet,
      );
    }
  }

  for (const candidate of flattenCandidates(candidatesByRegion)) {
    keepRegionalCandidate(
      candidatesByRegion,
      nudgeCandidate(candidate, fixedBounds, reservedBounds),
      layout.planet,
    );
  }
  return flattenCandidates(candidatesByRegion).sort((first, second) =>
    compareLayoutScores(first.score, second.score),
  );
}

export function chooseCompatibleTileLayout(
  candidateSets: LayoutCandidate[][],
): LayoutCandidate | undefined {
  let best: LayoutCandidate | undefined;
  const groups: PositionedGroup[] = [];

  const visit = (index: number, score: LayoutCandidate["score"]) => {
    // Combining candidates only adds nonnegative penalties (or takes a max),
    // so a partial score that has already lost cannot recover later.
    if (best && compareLayoutScores(score, best.score) >= 0) return;

    if (index === candidateSets.length) {
      best = { groups: [...groups], score };
      return;
    }

    for (const candidate of candidateSets[index]) {
      const combinedScore = combineLayoutScores(
        score,
        candidate.score,
        groups,
        candidate.groups,
      );
      if (best && compareLayoutScores(combinedScore, best.score) >= 0) continue;

      groups.push(...candidate.groups);
      visit(index + 1, combinedScore);
      groups.length -= candidate.groups.length;
    }
  };

  for (const candidate of candidateSets[0] ?? []) {
    groups.push(...candidate.groups);
    visit(1, candidate.score);
    groups.length -= candidate.groups.length;
  }
  return best;
}

function createFormations(groups: GroundGroup[]): Formation[] {
  const formations: Formation[] = [];

  for (const ordering of createGroupOrderings(groups)) {
    for (const rows of createRowPatterns(groups.length)) {
      formations.push({
        positions: packRows(ordering, rows),
        balancePenalty: scoreFormationBalance(rows, groups.length),
      });
    }

    if (groups.length >= 2) {
      formations.push(staggerColumn(ordering, -1), staggerColumn(ordering, 1));
    }
  }

  return formations;
}

function createRowPatterns(groupCount: number): number[][] {
  const patterns = new Map<string, number[]>();
  const add = (rows: number[]) => patterns.set(rows.join("-"), rows);

  add([groupCount]);
  add(Array.from({ length: groupCount }, () => 1));

  for (let columns = 2; columns <= Math.min(3, groupCount - 1); columns++) {
    const rows: number[] = [];
    let remaining = groupCount;
    while (remaining > 0) {
      rows.push(Math.min(columns, remaining));
      remaining -= columns;
    }
    add(rows);
    add([...rows].reverse());
  }

  if (groupCount === 4) add([1, 2, 1]);
  return [...patterns.values()];
}

function createGroupOrderings(groups: GroundGroup[]): GroundGroup[][] {
  if (groups.length <= 4) return permutations(groups);

  const orderings: GroundGroup[][] = [];
  for (let offset = 0; offset < groups.length; offset++) {
    orderings.push([...groups.slice(offset), ...groups.slice(0, offset)]);
  }
  orderings.push([...groups].reverse());
  return orderings;
}

function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [[...items]];

  return items.flatMap((item, index) =>
    permutations([...items.slice(0, index), ...items.slice(index + 1)]).map(
      (rest) => [item, ...rest],
    ),
  );
}

function packRows(
  groups: GroundGroup[],
  rowSizes: number[],
): FormationPosition[] {
  const rows: GroundGroup[][] = [];
  let index = 0;
  for (const rowSize of rowSizes) {
    rows.push(groups.slice(index, index + rowSize));
    index += rowSize;
  }

  const rowHeights = rows.map((row) =>
    Math.max(...row.map(({ footprint }) => footprint.height)),
  );
  const totalHeight =
    rowHeights.reduce((total, height) => total + height, 0) +
    FORMATION_GAP * Math.max(rows.length - 1, 0);
  let top = -totalHeight / 2;

  return rows.flatMap((row, rowIndex) => {
    const rowWidth =
      row.reduce((total, group) => total + group.footprint.width, 0) +
      FORMATION_GAP * Math.max(row.length - 1, 0);
    let left = -rowWidth / 2;
    const y = top + rowHeights[rowIndex] / 2;
    top += rowHeights[rowIndex] + FORMATION_GAP;

    return row.map((group) => {
      const x = left + group.footprint.width / 2;
      left += group.footprint.width + FORMATION_GAP;
      return { group, offset: { x, y } };
    });
  });
}

function staggerColumn(groups: GroundGroup[], direction: -1 | 1): Formation {
  const positions = packRows(
    groups,
    Array.from({ length: groups.length }, () => 1),
  );
  const centerIndex = (positions.length - 1) / 2;

  return {
    positions: positions.map((position, index) => ({
      ...position,
      offset: {
        x: (index - centerIndex) * FORMATION_GAP * 2 * direction,
        y: position.offset.y,
      },
    })),
    balancePenalty: groups.length <= 2 ? 0 : groups.length,
  };
}

function createAnchorPoints(planet: Planet): Point[] {
  return ANCHOR_OFFSETS.map((offset) => ({
    x: planet.x + offset.x,
    y: planet.y + offset.y,
  }));
}

function positionGroup(
  layout: PlanetLayout,
  group: GroundGroup,
  point: Point,
): PositionedGroup {
  return {
    layout,
    group,
    point,
    idealPoint: point,
    bounds: createBounds(point, group.footprint),
  };
}

function createCandidate(
  groups: PositionedGroup[],
  fixedBounds: Bounds[],
  reservedBounds: Bounds[],
  formationBalance: number,
): LayoutCandidate {
  const bounds =
    groups.length > 0
      ? unionBounds(groups.map((group) => group.bounds))
      : undefined;
  return {
    groups,
    score: scoreLayout(
      groups,
      fixedBounds,
      reservedBounds,
      formationBalance,
      bounds,
    ),
    bounds,
  };
}

function keepRegionalCandidate(
  candidatesByRegion: Map<string, LayoutCandidate[]>,
  candidate: LayoutCandidate,
  planet: Planet,
): void {
  const region = candidateRegion(candidate, planet);
  const candidates = candidatesByRegion.get(region) ?? [];
  const insertionIndex = candidates.findIndex(
    (current) => compareLayoutScores(candidate.score, current.score) < 0,
  );

  if (insertionIndex < 0) {
    if (candidates.length >= CANDIDATES_PER_REGION) return;
    candidates.push(candidate);
  } else {
    candidates.splice(insertionIndex, 0, candidate);
    if (candidates.length > CANDIDATES_PER_REGION) candidates.pop();
  }
  candidatesByRegion.set(region, candidates);
}

function nudgeCandidate(
  candidate: LayoutCandidate,
  fixedBounds: Bounds[],
  reservedBounds: Bounds[],
): LayoutCandidate {
  let current = candidate;

  for (let pass = 0; pass < NUDGE_PASSES; pass++) {
    for (let index = 0; index < current.groups.length; index++) {
      let best = current;

      for (const offset of NUDGE_OFFSETS) {
        const group = current.groups[index];
        const point = {
          x: group.point.x + offset.x,
          y: group.point.y + offset.y,
        };
        if (distance(point, group.idealPoint) > MAX_NUDGE) continue;

        const groups = current.groups.map((item, groupIndex) =>
          groupIndex === index
            ? {
                ...item,
                point,
                bounds: createBounds(point, item.group.footprint),
              }
            : item,
        );
        const moved = createCandidate(
          groups,
          fixedBounds,
          reservedBounds,
          candidate.score.formationBalance,
        );
        if (compareLayoutScores(moved.score, best.score) < 0) best = moved;
      }

      current = best;
    }
  }

  return current;
}

function flattenCandidates(
  candidatesByRegion: Map<string, LayoutCandidate[]>,
): LayoutCandidate[] {
  return [...candidatesByRegion.values()].flat();
}

function candidateRegion(candidate: LayoutCandidate, planet: Planet): string {
  if (!candidate.bounds) return "0,0";
  const center = centerOf(candidate.bounds);
  return `${regionCoordinate(center.x - planet.x)},${regionCoordinate(
    center.y - planet.y,
  )}`;
}

function regionCoordinate(offset: number): -1 | 0 | 1 {
  if (offset < -REGION_INSET) return -1;
  if (offset > REGION_INSET) return 1;
  return 0;
}

function createSearchOffsets(range: number, step: number): Point[] {
  const offsets: Point[] = [{ x: 0, y: 0 }];
  for (let y = -range; y <= range; y += step) {
    for (let x = -range; x <= range; x += step) {
      if (x !== 0 || y !== 0) offsets.push({ x, y });
    }
  }
  return offsets;
}

function createNudgeOffsets(): Point[] {
  const offsets: Point[] = [];
  for (let y = -NUDGE_STEP; y <= NUDGE_STEP; y += NUDGE_STEP) {
    for (let x = -NUDGE_STEP; x <= NUDGE_STEP; x += NUDGE_STEP) {
      if (x !== 0 || y !== 0) offsets.push({ x, y });
    }
  }
  return offsets;
}
