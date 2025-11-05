import { strategyCards } from "@/data/strategyCards";
import { StrategyCardDefinition } from "@/data/types";

const strategyCardsById = new Map<string, StrategyCardDefinition>(
  strategyCards.map((card) => [card.id, card])
);

const strategyCardsByInitiative = new Map<number, StrategyCardDefinition>(
  strategyCards.map((card) => [card.initiative, card])
);

const strategyCardsByName = new Map<string, StrategyCardDefinition>(
  strategyCards.map((card) => [card.name.toLowerCase(), card])
);

const defaultStrategyCardIdMap: Record<number, string> = {
  1: "pok1leadership",
  2: "pok2diplomacy",
  3: "pok3politics",
  4: "te4construction",
  5: "pok5trade",
  6: "te6warfare",
  7: "pok7technology",
  8: "pok8imperial",
};

export function getStrategyCardById(
  id: string
): StrategyCardDefinition | undefined {
  return strategyCardsById.get(id);
}

export function getStrategyCardByInitiative(
  initiative: number,
  strategyCardIdMap?: Record<number, string>
): StrategyCardDefinition | undefined {
  if (strategyCardIdMap && strategyCardIdMap[initiative]) {
    const cardId = strategyCardIdMap[initiative];
    return getStrategyCardById(cardId);
  }

  const defaultCardId = defaultStrategyCardIdMap[initiative];
  if (defaultCardId) {
    const card = getStrategyCardById(defaultCardId);
    if (card) return card;
  }

  return strategyCardsByInitiative.get(initiative);
}

export function getStrategyCardByName(
  name: string
): StrategyCardDefinition | undefined {
  return strategyCardsByName.get(name.toLowerCase());
}

export function getAllStrategyCards(): StrategyCardDefinition[] {
  return strategyCards;
}

export const SC_NAMES = {
  1: "LEADERSHIP",
  2: "DIPLOMACY",
  3: "POLITICS",
  4: "CONSTRUCTION",
  5: "TRADE",
  6: "WARFARE",
  7: "TECHNOLOGY",
  8: "IMPERIAL",
};

export const SC_COLORS = {
  1: "red",
  2: "orange",
  3: "yellow",
  4: "green",
  5: "teal",
  6: "cyan",
  7: "blue",
  8: "purple",
};
