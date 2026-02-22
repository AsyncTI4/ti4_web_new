import { partitionGenericTechs } from "@/lookup/tech";

export type PlayerCardTechInput = {
  techs?: string[];
  notResearchedFactionTechs?: string[] | null;
};

export type PlayerCardTechData = {
  filteredTechs: string[];
  allNotResearchedFactionTechs: string[];
};

export const getPlayerCardTechData = (
  { techs = [], notResearchedFactionTechs = [] }: PlayerCardTechInput,
): PlayerCardTechData => {
  const { genericTechs, standardTechs } = partitionGenericTechs(techs);

  return {
    filteredTechs: standardTechs,
    allNotResearchedFactionTechs: [...notResearchedFactionTechs, ...genericTechs],
  };
};
