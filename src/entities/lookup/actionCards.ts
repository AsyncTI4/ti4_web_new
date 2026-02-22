import { actionCards } from "@/entities/data/actionCards";

export const getActionCard = (alias: string) => {
  return actionCards.find((card) => card.alias === alias);
};
