import type {
  CombatReplayEvent,
  RetreatSubEvent,
} from "@/app/providers/context/types";
import type { EntityStack } from "@/utils/unitPositioning";

export type StateCounts = [number, number, number, number];

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
  damageAtMs?: number;
  delayedDamageStates?: StateCounts;
  startRotationDeg?: number;
  parkRotationDeg?: number;
  holdRotationDeg?: number;
  hideAfterMs?: number;
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
  delayedDamage: Map<string, { damageAtMs: number; states: StateCounts }>;
  baseUnitStates: Map<string, StateCounts>;
  finalRevealLocations: Set<string>;
  tacticalTargetPosition?: string;
  focusPosition?: string;
  showTacticalActivation: boolean;
  changedPositions: Set<string>;
  durationMs: number;
};

export type LocatedStack = {
  position: string;
  stack: EntityStack;
  worldX: number;
  worldY: number;
};

export type UnitLocation = {
  position: string;
  holder: string;
  faction: string;
  unitId: string;
};

export type AuthoritativeTransitionOptions = {
  movementState?: string | null;
  retreats?: RetreatSubEvent[];
  combats?: CombatReplayEvent[];
  activeFaction?: string | null;
  tacticalPosition?: string | null;
  alwaysShowControlTokens?: boolean;
  changedPositions?: Set<string>;
};

export type PlannedMovement = {
  transition: MapUnitTransition;
  source: UnitLocation;
  sourceKey: string;
  destinationKey: string;
  target: UnitLocation;
  finalDestination?: LocatedStack;
  arrival: LocatedStack;
  staged: boolean;
};

export type ReplayInventory = {
  expectedTotals: Map<string, number>;
  finalTotals: Map<string, number>;
  locations: Map<string, UnitLocation>;
};
