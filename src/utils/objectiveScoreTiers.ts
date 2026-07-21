import type { PlayerData } from "@/entities/data/types";
import { isAssignedFactionKey } from "@/utils/playerUtils";

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
   * Scorers the viewer can't identify - real faction string kept only as a stable per-objective
   * sort/react key, never rendered. Order is shuffled per-objective (see shuffleKey) so
   * position can't be used to correlate the same hidden player across different objective cards.
   */
  anonymousScorers: string[];
};

export function getOwnFaction(
  playerData: PlayerData[] | undefined,
  discordId: string | null | undefined
): string | null {
  if (!discordId) return null;
  return playerData?.find((p) => p.discordId === discordId)?.faction ?? null;
}

// Deterministic per-(objective, faction) shuffle key. Different objectives yield unrelated
// orderings for the same faction, so consistently-placed grey tokens can't be cross-referenced.
function shuffleKey(objectiveKey: string, faction: string): number {
  const s = `${objectiveKey}:${faction}`;
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return hash;
}

/**
 * @param hideScoreOrder drives render order, and only render order (see useHideScoreOrder):
 *
 * Normally players are listed in seat order, scored or not - that's what the objective card has
 * always shown, and it's what players expect to scan. That's also what the GM's unfiltered view
 * gets, since nothing is hidden from them.
 *
 * For a fogged viewer that ordering leaks. Anonymous scorers have to go somewhere, and any layout
 * that keeps a stable per-seat slot lets you locate a hidden player by which slot their token
 * lands in - and then correlate that slot across objectives to track them. So there the list is
 * grouped by state instead (own, then identified scorers, then identified non-scorers) and the
 * anonymous tokens are appended last, where their position carries no seat information. Their
 * order within that group is shuffled per-objective on top (see shuffleKey).
 */
export function computeScoreTier(
  objectiveKey: string,
  scoredFactions: string[],
  playerData: PlayerData[],
  ownFaction: string | null,
  hideScoreOrder: boolean
): ScoreTier {
  const identifiedFactions = new Set(playerData.map((p) => p.faction));
  const scoredSet = new Set(scoredFactions);

  let identified: IdentifiedEntry[];
  if (hideScoreOrder) {
    const scorers: IdentifiedEntry[] = [];
    const unscored: IdentifiedEntry[] = [];
    for (const player of playerData) {
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

  // isAssignedFactionKey keeps the neutral (Dicecord) player out: it's absent from playerData by
  // design, so without this it would read as an unidentified opponent rather than public forces.
  const anonymousScorers = scoredFactions
    .filter(
      (f) =>
        f !== ownFaction && !identifiedFactions.has(f) && isAssignedFactionKey(f)
    )
    .sort(
      (a, b) => shuffleKey(objectiveKey, a) - shuffleKey(objectiveKey, b)
    );

  return {
    // When order isn't hidden the viewer stays inline in seat order, so there's nothing to hoist.
    ownFaction: hideScoreOrder ? ownFaction : null,
    ownScored: ownFaction !== null && scoredSet.has(ownFaction),
    identified,
    anonymousScorers,
  };
}
