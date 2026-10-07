import { techs } from "@/entities/data/tech";
import { indexBy } from "@/entities/lookup/indexBy";
import type { Tech } from "@/entities/data/types";

const techsMap = indexBy(techs, (tech) => tech.alias);

export const getTechData = (techId: string): Tech | undefined => {
  return techsMap.get(techId);
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

const DEFAULT_GENERIC_TECH_TYPES = ["NONE", "GENERICTF"];

type PartitionedTechs = {
  genericTechs: string[];
  standardTechs: string[];
};

export const partitionGenericTechs = (
  techIds: string[],
  genericTypes: string[] = DEFAULT_GENERIC_TECH_TYPES,
): PartitionedTechs => {
  return techIds.reduce<PartitionedTechs>(
    (acc, techId) => {
      const techType = getTechData(techId)?.types[0] ?? "";
      if (genericTypes.includes(techType)) {
        acc.genericTechs.push(techId);
      } else {
        acc.standardTechs.push(techId);
      }
      return acc;
    },
    { genericTechs: [], standardTechs: [] },
  );
};

export type TechColor = "blue" | "green" | "red" | "yellow";

type TechSynergyPair =
  | "blueGreen"
  | "blueRed"
  | "blueYellow"
  | "greenRed"
  | "greenYellow"
  | "yellowRed";

export const TECH_TYPE_COLOR: Record<string, TechColor> = {
  PROPULSION: "blue",
  BIOTIC: "green",
  WARFARE: "red",
  CYBERNETIC: "yellow",
};

/** Prerequisite letter in a requirements string (e.g. "BBY") to its skip icon. */
export const TECH_PREREQ_ICON: Record<string, string> = {
  B: "/blue.png",
  G: "/green.png",
  R: "/red.png",
  Y: "/yellow.png",
};

const SYNERGY_PAIRS: Record<string, TechSynergyPair> = {
  "blue-green": "blueGreen",
  "blue-red": "blueRed",
  "blue-yellow": "blueYellow",
  "green-red": "greenRed",
  "green-yellow": "greenYellow",
  "red-yellow": "yellowRed",
};

/** The two-colour hybrid a pair of tech colours forms, in either order. */
export function getTechSynergyPair(
  colors: TechColor[]
): TechSynergyPair | undefined {
  return SYNERGY_PAIRS[[...colors].sort().join("-")];
}

const TECH_LETTERS: Record<string, string> = {
  Antimatter: "A",
  Wavelength: "W",
};

/** Techs without a color skip icon that are drawn with a letter instead. */
export const getTechLetter = (techName: string): string | undefined =>
  TECH_LETTERS[techName];
