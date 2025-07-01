import { abilities } from "../data/abilities";
import { Ability } from "../data/types";

const abilitiesMap = new Map(abilities.map((ability) => [ability.id, ability]));

const abilitiesByFactionMap = new Map<string, Ability[]>();
abilities.forEach((ability) => {
  if (ability.faction) {
    const existingAbilities = abilitiesByFactionMap.get(ability.faction) || [];
    abilitiesByFactionMap.set(ability.faction, [...existingAbilities, ability]);
  }
});

/**
 * Get ability data by ID
 */
export function getAbility(abilityId: string): Ability | undefined {
  return abilitiesMap.get(abilityId);
}

/**
 * Get all abilities for a specific faction
 */
export function getAbilitiesByFaction(faction: string): Ability[] {
  return abilitiesByFactionMap.get(faction) || [];
}

/**
 * Get all abilities
 */
export function getAllAbilities(): Ability[] {
  return abilities;
}
