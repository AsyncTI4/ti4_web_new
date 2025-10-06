import type { ReactNode } from "react";
import { Tech } from "./Tech";
import { PhantomTech } from "./PhantomTech";
import { getTechData, getTechTier } from "@/lookup/tech";

export type TechCategory = "PROPULSION" | "CYBERNETIC" | "BIOTIC" | "WARFARE";

export const techCategories: TechCategory[] = [
  "PROPULSION",
  "CYBERNETIC",
  "BIOTIC",
  "WARFARE",
];

export function buildTechElementsForType(
  techType: string,
  techIds: string[] = [],
  exhaustedTechs: string[] = [],
  minSlotsPerColor?: number
): ReactNode[] {
  const filteredTechs = techIds.filter((techId) => {
    const techData = getTechData(techId);
    return techData?.types[0] === techType;
  });

  const sortedTechs = filteredTechs.sort((a, b) => {
    const techDataA = getTechData(a);
    const techDataB = getTechData(b);
    const tierA = techDataA ? getTechTier(techDataA.requirements) : 999;
    const tierB = techDataB ? getTechTier(techDataB.requirements) : 999;
    return tierA - tierB;
  });

  const techElements: ReactNode[] = sortedTechs.map((techId, index) => (
    <Tech
      key={`tech-${techId}-${index}`}
      techId={techId}
      isExhausted={exhaustedTechs.includes(techId)}
    />
  ));

  if (!minSlotsPerColor || techElements.length >= minSlotsPerColor) {
    return techElements;
  }

  const placeholders: ReactNode[] = [];
  for (let i = techElements.length; i < minSlotsPerColor; i++) {
    placeholders.push(
      <PhantomTech key={`phantom-${techType}-${i}`} techType={techType} />
    );
  }

  return [...techElements, ...placeholders];
}

export function buildCategoriesWithTechs(
  techIds: string[] = [],
  exhaustedTechs: string[] = [],
  minSlotsPerColor?: number
): { type: TechCategory; techs: ReactNode[] }[] {
  return techCategories.map((techType) => ({
    type: techType,
    techs: buildTechElementsForType(
      techType,
      techIds,
      exhaustedTechs,
      minSlotsPerColor
    ),
  }));
}

export function chunkInto<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items];
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
