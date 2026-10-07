import { relics } from "@/entities/data/relics";
import { indexBy } from "@/entities/lookup/indexBy";
import type { Relic } from "@/entities/data/types";

const relicsMap = indexBy(relics, (relic) => relic.alias);

export function getRelicData(relicAlias: string): Relic | undefined {
  return relicsMap.get(relicAlias);
}
