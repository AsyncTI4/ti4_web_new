import type { GameEvent } from "@/entities/data/types";

/** Recorded for stats and replay; they get no row in the log. */
const DATA_ONLY_ARCHETYPES = new Set([
  "GAME_STARTED",
  "DRAFT_STARTED",
  "DRAFT_PICK",
  "DRAFT_ENDED",
  "PUBLIC_OBJECTIVE_REVEALED",
  "CONTROL_ESTABLISHED",
  "COMBAT_ROLL",
  "COMBAT_OUTCOME",
  "INVASION_COMMITTED",
  "CARD_CANCELED",
  "CARD_DISCARDED",
  "CARD_STOLEN",
  "EXPLORE_RESOLVED",
]);

export function isDataOnlyEvent(event: Pick<GameEvent, "archetype">): boolean {
  return DATA_ONLY_ARCHETYPES.has(event.archetype);
}
