import { abilities } from "../data/abilities";
import { Ability } from "../data/types";

/**
 * Get ability data by ID
 */
export function getAbility(abilityId: string): Ability | undefined {
  return abilities.find((ability) => ability.id === abilityId);
}
