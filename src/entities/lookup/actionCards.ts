import { actionCards } from "@/entities/data/actionCards";
import { indexBy } from "@/entities/lookup/indexBy";

const actionCardsMap = indexBy(actionCards, (card) => card.alias);

export const getActionCard = (alias: string) => actionCardsMap.get(alias);
