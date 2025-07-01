import { relics } from "../data/relics";
import { Relic } from "../data/types";

// Create efficient lookup maps
const relicsMap = new Map(relics.map((relic) => [relic.alias, relic]));

// For source map, we need to handle multiple relics with same source
const relicsBySourceMap = new Map<string, Relic[]>();
relics.forEach((relic) => {
  const existingRelics = relicsBySourceMap.get(relic.source) || [];
  relicsBySourceMap.set(relic.source, [...existingRelics, relic]);
});

/**
 * Get relic data by alias
 */
export function getRelicData(relicAlias: string): Relic | undefined {
  return relicsMap.get(relicAlias);
}

/**
 * Get all relics from a specific source
 */
export function getRelicsBySource(source: string): Relic[] {
  return relicsBySourceMap.get(source) || [];
}

/**
 * Get all relics
 */
export function getAllRelics(): Relic[] {
  return relics;
}

/**
 * Search relics by name (case-insensitive partial match)
 */
export function searchRelicsByName(searchTerm: string): Relic[] {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return relics.filter(
    (relic) =>
      relic.name.toLowerCase().includes(lowerSearchTerm) ||
      (relic.shortName &&
        relic.shortName.toLowerCase().includes(lowerSearchTerm))
  );
}

/**
 * Get all available relic sources
 */
export function getRelicSources(): string[] {
  return Array.from(relicsBySourceMap.keys()).sort();
}
