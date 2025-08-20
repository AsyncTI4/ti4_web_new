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

export function getStrategyCardById(
  id: string
): StrategyCardDefinition | undefined {
  return strategyCardsById.get(id);
}

export function getStrategyCardByInitiative(
  initiative: number
): StrategyCardDefinition | undefined {
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
