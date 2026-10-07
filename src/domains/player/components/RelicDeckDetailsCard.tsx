import { getRelicData } from "@/entities/lookup/relics";
import { processCardData, createCardSections } from "@/utils/cardDataProcessor";
import { CardDetailsModal } from "@/shared/ui/CardDetailsModal";

type Props = {
  deck: string[];
  discard: string[];
};

function toRelicCard(alias: string) {
  const relic = getRelicData(alias);
  if (!relic) return undefined;
  return { name: relic.name, text: relic.text, id: relic.alias };
}

export function RelicDeckDetailsCard({ deck, discard }: Props) {
  const sections = createCardSections(
    processCardData(deck, toRelicCard, "alphanumeric"),
    processCardData(discard, toRelicCard, "alphanumeric"),
    deck,
    discard,
    "Deck",
    "Discard",
  );

  return <CardDetailsModal sections={sections} showCounts={false} />;
}
