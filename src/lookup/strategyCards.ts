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
