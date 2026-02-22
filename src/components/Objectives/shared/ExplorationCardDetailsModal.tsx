import { useMemo } from "react";
import { getExploration } from "@/lookup/explorations";
import { processCardData, createCardSections } from "@/utils/cardDataProcessor";
import { CardDetailsModal } from "@/components/shared/CardDetailsModal";

export type ExplorationCardDetailsModalProps = {
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
  const sections = useMemo(() => {
    const deckData = processCardData(deck, getExploration);
    const discardData = processCardData(discard, getExploration);

    return createCardSections(
      deckData,
      discardData,
      deck,
      discard,
      deckLabel,
      discardLabel,
    );
  }, [deck, discard, deckLabel, discardLabel]);

  return <CardDetailsModal sections={sections} />;
}
