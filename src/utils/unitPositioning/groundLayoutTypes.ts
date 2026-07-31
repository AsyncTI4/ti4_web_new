import type { FactionUnits } from "@/entities/data/types";
import type { RenderedFootprint } from "@/entities/renderedStackGeometry";
import type { EntityStack, EntityStackBase, Planet } from "./types";

export type Point = {
  x: number;
  y: number;
};

export type Bounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type GroundGroupKind = "infantry" | "mech" | "structure" | "other";

export type GroundMember = {
  stack: EntityStackBase;
  offset: Point;
};

export type GroundGroup = {
  id: string;
  kind: GroundGroupKind;
  members: GroundMember[];
  footprint: RenderedFootprint;
};

export type GroundPlanetRequest = {
  planet: Planet;
  factionEntities: FactionUnits;
  fixedPlacements: EntityStack[];
  controller?: string;
};

export type PlanetLayout = {
  planet: Planet;
  groups: GroundGroup[];
  neighbors: Planet[];
};

export type PositionedGroup = {
  layout: PlanetLayout;
  group: GroundGroup;
  point: Point;
  idealPoint: Point;
  bounds: Bounds;
};

export type LayoutScore = {
  infoOverlap: number;
  ambiguousGroups: number;
  ambiguity: number;
  associationOverflow: number;
  visibleBleed: number;
  maxOccludedFraction: number;
  overlapArea: number;
  formationBalance: number;
  formationDistortion: number;
  compactness: number;
  alignment: number;
  labelSidePenalty: number;
  centerDistance: number;
};

export type LayoutCandidate = {
  groups: PositionedGroup[];
  score: LayoutScore;
  bounds?: Bounds;
};

export type FallbackGroundGroup = {
  planetName: string;
  kind: GroundGroupKind;
  stacks: EntityStackBase[];
};

export type GroundPlacementResult = {
  placements: EntityStack[];
  fallbackGroups: FallbackGroundGroup[];
};
