import { actionCardDecks, type ActionCardDeck } from "@/entities/data/actionCardDecks";

/** Several decks share a size (PoK, Pi, TE + Base… are all 120), so ties go to the common ones. */
const PREFERRED_DECKS = [
  "action_cards_pok",
  "action_cards_te",
  "tf_action_deck",
  "action_cards_ds",
  "action_cards_basegame",
];

const deckSets = new Map<string, Set<string>>();
function cardSet(deck: ActionCardDeck) {
  let set = deckSets.get(deck.id);
  if (!set) {
    set = new Set(deck.cards);
    deckSets.set(deck.id, set);
  }
  return set;
}

/**
 * The bot doesn't say which action card deck a game uses, so it's worked out from
 * public data: a deck of the full size that holds every discarded card.
 * Undefined when nothing fits, or when several uncommon decks do.
 */
export function inferActionCardDeck(
  fullDeckSize: number | undefined,
  discard: string[],
): ActionCardDeck | undefined {
  if (!fullDeckSize || fullDeckSize < 0) return undefined;
  const candidates = actionCardDecks.filter(
    (deck) =>
      deck.cards.length === fullDeckSize &&
      discard.every((card) => cardSet(deck).has(card)),
  );
  if (candidates.length <= 1) return candidates[0];
  for (const id of PREFERRED_DECKS) {
    const preferred = candidates.find((deck) => deck.id === id);
    if (preferred) return preferred;
  }
  return undefined;
}

/**
 * Cards of the game's deck that are not in the discard: each one is in the deck,
 * in someone's hand, or purged. Deliberately not "the deck", which would reveal hands.
 */
export function notDiscardedActionCards(
  fullDeckSize: number | undefined,
  discard: string[],
): string[] | undefined {
  const deck = inferActionCardDeck(fullDeckSize, discard);
  if (!deck) return undefined;
  const discarded = new Set(discard);
  return deck.cards.filter((card) => !discarded.has(card));
}
