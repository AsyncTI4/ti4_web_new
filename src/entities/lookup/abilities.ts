import { abilities } from "@/entities/data/abilities";
import { indexBy } from "@/entities/lookup/indexBy";
import type { Ability } from "@/entities/data/types";

const abilitiesMap = indexBy(abilities, (ability) => ability.id);

export function getAbility(abilityId: string): Ability | undefined {
  return abilitiesMap.get(abilityId);
}
