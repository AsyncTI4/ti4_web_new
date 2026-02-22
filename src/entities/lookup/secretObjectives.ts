import { secretObjectives } from "@/entities/data/secretObjectives";
import { SecretObjective } from "@/entities/data/types";

// Create efficient lookup maps
const secretObjectivesMap = new Map(
  secretObjectives.map((obj) => [obj.alias, obj])
);

// For source map, we need to handle multiple objectives with same source
const secretObjectivesBySourceMap = new Map<string, SecretObjective[]>();
secretObjectives.forEach((obj) => {
  const existingObjectives = secretObjectivesBySourceMap.get(obj.source) || [];
  secretObjectivesBySourceMap.set(obj.source, [...existingObjectives, obj]);
});

// For phase map, we need to handle multiple objectives with same phase
const secretObjectivesByPhaseMap = new Map<string, SecretObjective[]>();
secretObjectives.forEach((obj) => {
  const phase = obj.phase?.toLowerCase() || "unknown";
  const existingObjectives = secretObjectivesByPhaseMap.get(phase) || [];
  secretObjectivesByPhaseMap.set(phase, [...existingObjectives, obj]);
});

// For points map, we need to handle multiple objectives with same points
const secretObjectivesByPointsMap = new Map<number, SecretObjective[]>();
secretObjectives.forEach((obj) => {
  const existingObjectives = secretObjectivesByPointsMap.get(obj.points) || [];
  secretObjectivesByPointsMap.set(obj.points, [...existingObjectives, obj]);
});

/**
 * Get secret objective data by alias
 */
export function getSecretObjectiveData(
  objectiveAlias: string
): SecretObjective | undefined {
  return secretObjectivesMap.get(objectiveAlias);
}

/**
 * Get all secret objectives from a specific source
 */
export function getSecretObjectivesBySource(source: string): SecretObjective[] {
  return secretObjectivesBySourceMap.get(source) || [];
}

/**
 * Get all secret objectives for a specific phase
 */
export function getSecretObjectivesByPhase(phase: string): SecretObjective[] {
  return secretObjectivesByPhaseMap.get(phase.toLowerCase()) || [];
}

/**
 * Get all secret objectives with specific point value
 */
export function getSecretObjectivesByPoints(points: number): SecretObjective[] {
  return secretObjectivesByPointsMap.get(points) || [];
}

/**
 * Get all secret objectives
 */
export function getAllSecretObjectives(): SecretObjective[] {
  return secretObjectives;
}

/**
 * Search secret objectives by name (case-insensitive partial match)
 */
export function searchSecretObjectivesByName(
  searchTerm: string
): SecretObjective[] {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return secretObjectives.filter((obj) =>
    obj.name.toLowerCase().includes(lowerSearchTerm)
  );
}

/**
 * Get all available secret objective sources
 */
export function getSecretObjectiveSources(): string[] {
  return Array.from(secretObjectivesBySourceMap.keys()).sort();
}

/**
 * Get all available secret objective phases
 */
export function getSecretObjectivePhases(): string[] {
  return Array.from(secretObjectivesByPhaseMap.keys()).sort();
}

/**
 * Get all available secret objective point values
 */
export function getSecretObjectivePointValues(): number[] {
  return Array.from(secretObjectivesByPointsMap.keys()).sort((a, b) => a - b);
}
