import { explorations } from "../data/exploration";
import { Exploration } from "../data/types";

/**
 * Get exploration card data by ID
 */
export function getExploration(explorationId: string): Exploration | undefined {
  return explorations.find((explorationCard) => explorationCard.alias === explorationId);
}
