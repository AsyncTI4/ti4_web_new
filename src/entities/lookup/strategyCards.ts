import { strategyCards } from "@/entities/data/strategyCards";
import { indexBy } from "@/entities/lookup/indexBy";
import type { StrategyCardDefinition } from "@/entities/data/types";

const strategyCardsById = indexBy(strategyCards, (card) => card.id);

const strategyCardsByInitiative = indexBy(
  strategyCards,
  (card) => card.initiative
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
  const mappedCardId = strategyCardIdMap?.[initiative];
  if (mappedCardId) return getStrategyCardById(mappedCardId);

  const defaultCardId = defaultStrategyCardIdMap[initiative];
  if (defaultCardId) {
    const card = getStrategyCardById(defaultCardId);
    if (card) return card;
  }

  return strategyCardsByInitiative.get(initiative);
}
