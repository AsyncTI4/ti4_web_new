import { breakthroughs } from "@/entities/data/breakthroughs";
import { indexBy } from "@/entities/lookup/indexBy";
import type { Breakthrough } from "@/entities/data/types";

const breakthroughMap = indexBy(breakthroughs, (b) => b.alias);

export function getBreakthroughData(id: string): Breakthrough | undefined {
  return breakthroughMap.get(id);
}
