// Generic card data processor that works with any card type

export type CardDataItem = {
  name: string;
  text: string;
  alias: string;
};

export type ProcessedCardData = {
  name: string;
  aliases: string[];
  count: number;
  text: string;
};

export type CardSection = {
  title: string;
  count: number;
  items: Array<ProcessedCardData & { percentage?: number }>;
};

// Generic function to process card IDs into grouped data
export function processCardData<T extends CardDataItem>(
  cardIds: string[],
  lookupFunction: (id: string) => T | undefined
): ProcessedCardData[] {
  const cardMap = new Map<string, { aliases: string[]; text: string }>();

  cardIds?.forEach((cardId) => {
    const card = lookupFunction(cardId);
    if (!card) {
      console.warn(`Card with ID "${cardId}" not found`);
    } else {
      const existing = cardMap.get(card.name);
      cardMap.set(card.name, {
        aliases: existing ? existing.aliases.concat(card.alias) : [card.alias],
        text: card.text,
      });
    }
  });

  // Convert to array and sort by count (most common first)
  return Array.from(cardMap.entries())
    .map(([name, data]) => ({
      name,
      aliases: data.aliases,
      count: data.aliases.length,
      text: data.text,
    }))
    .sort((a, b) => b.count - a.count);
}

// Helper to create card sections with percentages
export function createCardSections(
  deckData: ProcessedCardData[],
  discardData: ProcessedCardData[],
  deckIds: string[],
  discardIds: string[],
  deckLabel = "Deck",
  discardLabel = "Discard"
): CardSection[] {
  return [
    {
      title: deckLabel,
      count: deckIds.length,
      items: deckData.map((item) => ({
        ...item,
        percentage: (item.count / deckIds.length) * 100,
      })),
    },
    {
      title: discardLabel,
      count: discardIds.length,
      items: discardData, // No percentages for discard
    },
  ];
}
