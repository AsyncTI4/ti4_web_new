import { getExploration } from "@/entities/lookup/explorations";
import { processCardData, createCardSections } from "@/domains/cards/model/cardDataProcessor";
import { CardDetailsModal } from "@/domains/cards/components/CardDetailsModal/CardDetailsModal";

type ExplorationCardDetailsModalProps = {
  deck: string[];
  discard: string[];
  deckLabel?: string;
  discardLabel?: string;
};

export function ExplorationCardDetailsModal({
  deck,
  discard,
  deckLabel = "Deck",
  discardLabel = "Discard",
}: ExplorationCardDetailsModalProps) {
  const sections = createCardSections(
    processCardData(deck, getExploration, "percentage"),
    processCardData(discard, getExploration, "alphanumeric"),
    deck,
    discard,
    deckLabel,
    discardLabel,
  );

  return <CardDetailsModal sections={sections} />;
}
