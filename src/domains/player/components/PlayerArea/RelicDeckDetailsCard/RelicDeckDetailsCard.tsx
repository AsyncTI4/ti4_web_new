import { useMemo } from "react";
import { getRelicData } from "@/entities/lookup/relics";
import { processCardData, createCardSections } from "@/utils/cardDataProcessor";
import { CardDetailsModal } from "@/shared/ui/CardDetailsModal";

type Props = {
  deck: string[];
  discard: string[];
};

export function RelicDeckDetailsCard({ deck, discard }: Props) {
  // Memoized data processing using the generic utility
  const sections = useMemo(() => {
    const deckData = processCardData(deck, getRelicData);
    const discardData = processCardData(discard, getRelicData);

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
