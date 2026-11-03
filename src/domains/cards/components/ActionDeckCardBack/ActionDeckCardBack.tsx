import { Text } from "@/ds";
import { cdnImage } from "@/entities/data/cdnImage";
import { getActionCard } from "@/entities/lookup/actionCards";
import { processCardData } from "@/domains/cards/model/cardDataProcessor";
import { notDiscardedActionCards } from "@/domains/cards/model/actionCardDeck";
import { CardDetailsModal } from "@/domains/cards/components/CardDetailsModal/CardDetailsModal";
import { CardbackModal } from "@/shared/ui/CardbackModal";

type Props = {
  count: number | string;
  discard: string[];
  /** Size of the game's whole action card deck, used to work out which deck it is. */
  fullDeckSize?: number;
};

/** Unknown aliases (homebrew sets not in our data) still list, under their alias. */
function toActionCard(alias: string) {
  const card = getActionCard(alias);
  if (!card) return { name: alias, text: "", id: alias };
  const text = [card.window, card.text].filter(Boolean).join(" ");
  return { name: card.name, text, id: card.alias };
}

/**
 * The action card deck; click it for the cards not discarded yet (in the deck or
 * in hands, never told apart) and the discard pile.
 */
export function ActionDeckCardBack({ count, discard, fullDeckSize }: Props) {
  const notDiscarded = notDiscardedActionCards(fullDeckSize, discard);
  const sections = [
    ...(notDiscarded
      ? [
          {
            title: "Not discarded · deck or hands",
            count: notDiscarded.length,
            items: processCardData(notDiscarded, toActionCard, "alphanumeric"),
          },
        ]
      : []),
    {
      title: "Discard",
      count: discard.length,
      items: processCardData(discard, toActionCard, "alphanumeric"),
    },
  ];

  return (
    <CardbackModal
      imageSrc={cdnImage("/player_area/cardback_action.jpg")}
      alt="action cards"
      title="Action Cards"
      count={count}
    >
      {!notDiscarded && discard.length === 0 ? (
        <Text size="sm" style={{ color: "var(--ds-ink-lo)" }}>No action cards discarded yet.</Text>
      ) : (
        <CardDetailsModal sections={sections} tone="var(--ds-sig-tg)" />
      )}
    </CardbackModal>
  );
}
