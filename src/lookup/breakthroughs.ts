import { breakthroughs } from "../data/breakthroughs";
import type { Breakthrough } from "../data/types";

const breakthroughMap = new Map(breakthroughs.map((b) => [b.alias, b]));

export function getBreakthroughData(id: string): Breakthrough | undefined {
  return breakthroughMap.get(id);
}

export function getAllBreakthroughs(): Breakthrough[] {
  return breakthroughs;
}




