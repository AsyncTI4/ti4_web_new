import {
  area,
  calculateOverflow,
  centerOf,
  distance,
  intersectionArea,
  isTowardLabel,
  squaredDistance,
} from "./groundLayoutGeometry";
import type { Bounds, LayoutScore, PositionedGroup } from "./groundLayoutTypes";

const OWNER_MARGIN = 8;
const ALLOWED_EDGE_BLEED = 25;

export function scoreLayout(
  groups: PositionedGroup[],
  fixedBounds: Bounds[],
  reservedBounds: Bounds[],
  formationBalance: number,
  clusterBounds?: Bounds,
): LayoutScore {
  const groupBounds = groups.map(({ bounds }) => bounds);
  const infoOverlap = groupBounds.reduce(
    (total, bounds) =>
      total +
      reservedBounds.reduce(
        (reservedTotal, reserved) =>
          reservedTotal + intersectionArea(bounds, reserved),
        0,
      ),
    0,
  );
  const association = groups.reduce(
    (total, group) => {
      const result = scoreAssociation(group);
      return {
        ambiguousGroups: total.ambiguousGroups + result.ambiguousGroups,
        ambiguity: total.ambiguity + result.ambiguity,
        associationOverflow:
          total.associationOverflow + result.associationOverflow,
        visibleBleed: total.visibleBleed + result.visibleBleed,
      };
    },
    {
      ambiguousGroups: 0,
      ambiguity: 0,
      associationOverflow: 0,
      visibleBleed: 0,
    },
  );

  return {
    infoOverlap,
    ...association,
    ...scoreOverlap(groupBounds, fixedBounds),
    formationBalance,
    formationDistortion: groups.reduce(
      (total, group) => total + squaredDistance(group.point, group.idealPoint),
      0,
    ),
    compactness: clusterBounds ? area(clusterBounds) : 0,
    alignment: scoreAlignment(groups),
    labelSidePenalty: groups.reduce(
      (total, group) =>
        total + Number(isTowardLabel(group.point, group.layout.planet)),
      0,
    ),
    centerDistance: clusterBounds
      ? squaredDistance(centerOf(clusterBounds), groups[0].layout.planet)
      : 0,
  };
}

export function scoreFormationBalance(
  rows: number[],
  groupCount: number,
): number {
  if (groupCount <= 2) return 0;
  const targetRows = Math.round(Math.sqrt(groupCount));
  const rowCountPenalty = Math.abs(rows.length - targetRows) * groupCount;
  return rowCountPenalty + Math.max(...rows) - Math.min(...rows);
}

export function compareLayoutScores(
  first: LayoutScore,
  second: LayoutScore,
): number {
  return (
    first.infoOverlap - second.infoOverlap ||
    first.ambiguousGroups - second.ambiguousGroups ||
    first.ambiguity - second.ambiguity ||
    first.associationOverflow - second.associationOverflow ||
    first.maxOccludedFraction - second.maxOccludedFraction ||
    first.overlapArea - second.overlapArea ||
    first.formationBalance - second.formationBalance ||
    first.formationDistortion - second.formationDistortion ||
    first.visibleBleed - second.visibleBleed ||
    first.compactness - second.compactness ||
    first.alignment - second.alignment ||
    first.labelSidePenalty - second.labelSidePenalty ||
    first.centerDistance - second.centerDistance
  );
}

export function combineLayoutScores(
  first: LayoutScore,
  second: LayoutScore,
  firstGroups: PositionedGroup[],
  secondGroups: PositionedGroup[],
): LayoutScore {
  const crossOverlap = scoreCrossOverlap(firstGroups, secondGroups);
  return {
    infoOverlap: first.infoOverlap + second.infoOverlap,
    ambiguousGroups: first.ambiguousGroups + second.ambiguousGroups,
    ambiguity: first.ambiguity + second.ambiguity,
    associationOverflow: first.associationOverflow + second.associationOverflow,
    visibleBleed: first.visibleBleed + second.visibleBleed,
    maxOccludedFraction: Math.max(
      first.maxOccludedFraction,
      second.maxOccludedFraction,
      crossOverlap.maxOccludedFraction,
    ),
    overlapArea:
      first.overlapArea + second.overlapArea + crossOverlap.overlapArea,
    formationBalance: first.formationBalance + second.formationBalance,
    formationDistortion: first.formationDistortion + second.formationDistortion,
    compactness: first.compactness + second.compactness,
    alignment: first.alignment + second.alignment,
    labelSidePenalty: first.labelSidePenalty + second.labelSidePenalty,
    centerDistance: first.centerDistance + second.centerDistance,
  };
}

function scoreAssociation(group: PositionedGroup) {
  const { planet } = group.layout;
  const ownerDistance = distance(group.point, planet);
  let ambiguity = Math.max(0, ownerDistance - planet.radius);

  for (const neighbor of group.layout.neighbors) {
    ambiguity += Math.max(
      0,
      ownerDistance + OWNER_MARGIN - distance(group.point, neighbor),
    );
  }

  const visibleBleed = calculateOverflow(group.bounds, planet);
  return {
    ambiguousGroups: Number(ambiguity > 0),
    ambiguity,
    associationOverflow: Math.max(0, visibleBleed - ALLOWED_EDGE_BLEED),
    visibleBleed,
  };
}

function scoreOverlap(bounds: Bounds[], fixedBounds: Bounds[]) {
  let maxOccludedFraction = 0;
  let overlapArea = 0;
  const record = (first: Bounds, second: Bounds) => {
    const intersection = intersectionArea(first, second);
    if (intersection === 0) return;
    overlapArea += intersection;
    maxOccludedFraction = Math.max(
      maxOccludedFraction,
      intersection / Math.min(area(first), area(second)),
    );
  };

  for (let first = 0; first < bounds.length; first++) {
    for (let second = first + 1; second < bounds.length; second++) {
      record(bounds[first], bounds[second]);
    }
    for (const fixed of fixedBounds) record(bounds[first], fixed);
  }

  return { maxOccludedFraction, overlapArea };
}

function scoreAlignment(groups: PositionedGroup[]): number {
  let total = 0;
  for (let first = 0; first < groups.length; first++) {
    for (let second = first + 1; second < groups.length; second++) {
      const x = Math.abs(groups[first].point.x - groups[second].point.x);
      const y = Math.abs(groups[first].point.y - groups[second].point.y);
      total += Math.min(x, y, Math.abs(x - y));
    }
  }
  return total;
}

function scoreCrossOverlap(
  firstGroups: PositionedGroup[],
  secondGroups: PositionedGroup[],
) {
  let maxOccludedFraction = 0;
  let overlapArea = 0;

  for (const first of firstGroups) {
    for (const second of secondGroups) {
      const intersection = intersectionArea(first.bounds, second.bounds);
      if (intersection === 0) continue;
      overlapArea += intersection;
      maxOccludedFraction = Math.max(
        maxOccludedFraction,
        intersection / Math.min(area(first.bounds), area(second.bounds)),
      );
    }
  }

  return { maxOccludedFraction, overlapArea };
}
