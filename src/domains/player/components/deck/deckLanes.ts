import type { PlayerData } from "@/entities/data/types";

export type LaneKey =
  | "seat"
  | "stores"
  | "leaders"
  | "holdings"
  | "tech"
  | "units"
  | "economy"
  | "planets";

export type Lane = {
  key: LaneKey;
  /** Engraved header text. */
  name?: string;
  /** What "leading" this lane means, for the header's leader readout; omit for no readout. */
  leadLabel?: string;
  /** CSS grid-column for the header, so it sits over its lane. */
  column: string;
  metric?: (player: PlayerData) => number;
};

function unitsOnBoard(player: PlayerData) {
  return Object.values(player.unitCounts ?? {}).reduce(
    (sum, unit) => sum + (unit.deployedCount ?? 0),
    0,
  );
}

/** Optimal spend across every planet, exhausted or not. */
export function totalOptimalSpend(player: PlayerData) {
  return (
    (player.totOptimalResources ?? 0) +
    (player.totOptimalInfluence ?? 0) +
    (player.totFlexValue ?? 0)
  );
}

export const LANES: Lane[] = [
  { key: "seat", name: "VP", leadLabel: "Victory points", column: "1", metric: (p) => p.totalVps ?? 0 },
  { key: "stores", name: "Money", leadLabel: "Trade goods", column: "2", metric: (p) => p.tg ?? 0 },
  { key: "leaders", name: "Leaders", column: "3" },
  { key: "holdings", column: "4" },
  { key: "tech", name: "Tech", leadLabel: "Technologies", column: "5 / 7", metric: (p) => (p.techs ?? []).length },
  { key: "units", name: "Units", leadLabel: "Units on the board", column: "7", metric: unitsOnBoard },
  { key: "economy", name: "Economy", leadLabel: "Total optimal spend", column: "8", metric: totalOptimalSpend },
  { key: "planets", name: "Planets", leadLabel: "Planets controlled", column: "9", metric: (p) => (p.planets ?? []).length },
];

/** Which seat leads a lane, and by how much. Ties go to the earlier seat. */
export function getLaneLeader(lane: Lane, players: PlayerData[]) {
  const { metric } = lane;
  if (!metric) return undefined;
  return players.reduce<{ player: PlayerData; value: number } | undefined>(
    (best, player) => {
      const value = metric(player);
      if (!best || value > best.value) return { player, value };
      return best;
    },
    undefined,
  );
}
