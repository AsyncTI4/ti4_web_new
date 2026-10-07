import { secretObjectives } from "@/entities/data/secretObjectives";
import { indexBy } from "@/entities/lookup/indexBy";
import type { SecretObjective } from "@/entities/data/types";

const secretObjectivesMap = indexBy(secretObjectives, (obj) => obj.alias);

export function getSecretObjectiveData(
  objectiveAlias: string
): SecretObjective | undefined {
  return secretObjectivesMap.get(objectiveAlias);
}
