import { explorations } from "@/entities/data/explorations";
import { indexBy } from "@/entities/lookup/indexBy";
import type { Exploration } from "@/entities/data/types";

const explorationsMap = indexBy(explorations, (card) => card.id);

export function getExploration(explorationId: string): Exploration | undefined {
  return explorationsMap.get(explorationId);
}
