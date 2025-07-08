import { useMemo } from "react";
import { getExploration } from "@/lookup/explorations";
import { processCardData, createCardSections } from "@/utils/cardDataProcessor";
import { CardDetailsModal } from "@/components/shared/CardDetailsModal";

type Props = {
  type: string;
  deck: string[];
  discard: string[];
};

export function ExplorationDeckDetailsCard({ type, deck, discard }: Props) {
  // Memoized data processing using the generic utility
  const sections = useMemo(() => {
    const deckData = processCardData(deck, getExploration);
    const discardData = processCardData(discard, getExploration);

    return createCardSections(
      deckData,
      discardData,
      deck,
      discard,
      "Deck",
      "Discard"
    );
  }, [deck, discard]);

  return <CardDetailsModal sections={sections} />;
}
