import type { PlayerData } from "@/entities/data/types";

export type IdentifiedEntry = { player: PlayerData; scored: boolean };

export type ScoreTier = {
  /**
   * The viewer's own faction, pulled out of {@link identified} to render ahead of everyone else.
   * Only set in FoW - in a normal game the viewer is just another player in seat order.
   */
  ownFaction: string | null;
  ownScored: boolean;
  /** Players the viewer can identify, already in render order (see computeScoreTier). */
  identified: IdentifiedEntry[];
  /**
   * How many scorers the viewer can't identify, rendered as that many anonymous tokens. The
   * backend never sends their factions (see WebObjectives#redactScorers), so there is no identity
   * here to leak, and nothing that could be correlated across objective cards.
   */
  anonymousScorerCount: number;
};

/**
 * Sorts by color rather than leaving playerData in its natural seat order. Seat order is hidden
 * information under fog, so any fogged listing has to be ordered by something the viewer can
 * already see - color is visible on every token and reveals nothing extra.
 */
export function byColor(playerData: PlayerData[]): PlayerData[] {
  return [...playerData].sort((a, b) => (a.color ?? "").localeCompare(b.color ?? ""));
}

export function getOwnFaction(
  playerData: PlayerData[] | undefined,
  discordId: string | null | undefined
): string | null {
  if (!discordId) return null;
  return playerData?.find((p) => p.discordId === discordId)?.faction ?? null;
}

/**
 * @param hideScoreOrder drives render order, and only render order (see useHideScoreOrder):
 *
 * Normally players are listed in seat order, scored or not - that's what the objective card has
 * always shown, and it's what players expect to scan. That's also what the GM's unfiltered view
 * gets, since nothing is hidden from them.
 *
 * Seat order is itself hidden under fog, so a fogged viewer must not get it: identified players
 * are sorted by color instead, which is already visible to them and reveals nothing about seating.
 * The list is also grouped by state (own, then identified scorers, then identified non-scorers)
 * with anonymous tokens appended last, so no slot is tied to a seat that could be tracked.
 */
export function computeScoreTier(
  scoredFactions: string[],
  unidentifiedScorerCount: number,
  playerData: PlayerData[],
  ownFaction: string | null,
  hideScoreOrder: boolean
): ScoreTier {
  const scoredSet = new Set(scoredFactions);

  let identified: IdentifiedEntry[];
  if (hideScoreOrder) {
    const scorers: IdentifiedEntry[] = [];
    const unscored: IdentifiedEntry[] = [];
    for (const player of byColor(playerData)) {
      if (player.faction === ownFaction) continue;
      const entry = { player, scored: scoredSet.has(player.faction) };
      (entry.scored ? scorers : unscored).push(entry);
    }
    identified = [...scorers, ...unscored];
  } else {
    identified = playerData.map((player) => ({
      player,
      scored: scoredSet.has(player.faction),
    }));
  }

  return {
    // When order isn't hidden the viewer stays inline in seat order, so there's nothing to hoist.
    ownFaction: hideScoreOrder ? ownFaction : null,
    ownScored: ownFaction !== null && scoredSet.has(ownFaction),
    identified,
    anonymousScorerCount: unidentifiedScorerCount,
  };
}
