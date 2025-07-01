import { techs } from "../data/tech";
import { Tech } from "../data/types";

// Create efficient lookup maps
const techsMap = new Map(techs.map((tech) => [tech.alias, tech]));

// For type map, we need to handle multiple techs with same type
const techsByTypeMap = new Map<string, Tech[]>();
techs.forEach((tech) => {
  tech.types.forEach((type) => {
    const existingTechs = techsByTypeMap.get(type) || [];
    techsByTypeMap.set(type, [...existingTechs, tech]);
  });
});

export const getTechData = (techId: string): Tech | undefined => {
  return techsMap.get(techId);
};

export const getTechsByType = (techType: string): Tech[] => {
  return techsByTypeMap.get(techType) || [];
};

export const getAllTechs = (): Tech[] => {
  return techs;
};

export const getTechTier = (requirements?: string): number => {
  if (!requirements) return 0;

  // Count the number of same letters (e.g., "BB" = 2, "BBB" = 3)
  const matches = requirements.match(/(.)\1*/g);
  if (matches && matches.length > 0) {
    return matches[0].length;
  }

  return 0;
};
