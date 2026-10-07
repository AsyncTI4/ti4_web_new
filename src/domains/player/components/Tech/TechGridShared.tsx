import type { ReactNode } from "react";
import { Tech } from "./Tech";
import { PhantomTech } from "./PhantomTech";
import { getTechData, getTechTier } from "@/entities/lookup/tech";
import { getBreakthroughData } from "@/entities/lookup/breakthroughs";
import type { BreakthroughData } from "@/entities/data/types";

type TechCategory = "PROPULSION" | "CYBERNETIC" | "BIOTIC" | "WARFARE";

export const techCategories: TechCategory[] = [
  "PROPULSION",
  "CYBERNETIC",
  "BIOTIC",
  "WARFARE",
];

/** The breakthrough's synergy colors, and whether they currently apply. */
export function getBreakthroughSynergy(breakthrough?: BreakthroughData) {
  const breakthroughData = breakthrough?.breakthroughId
    ? getBreakthroughData(breakthrough.breakthroughId)
    : undefined;

  return {
    synergy: breakthroughData?.synergy,
    breakthroughUnlocked: breakthrough?.unlocked ?? false,
  };
}

export function buildTechElementsForType(
  techType: string,
  techIds: string[] = [],
  exhaustedTechs: string[] = [],
  minSlotsPerColor?: number,
  breakthrough?: BreakthroughData
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

  const { synergy, breakthroughUnlocked } = getBreakthroughSynergy(breakthrough);

  const techElements: ReactNode[] = sortedTechs.map((techId, index) => (
    <Tech
      key={`tech-${techId}-${index}`}
      techId={techId}
      isExhausted={exhaustedTechs.includes(techId)}
      synergy={synergy}
      breakthroughUnlocked={breakthroughUnlocked}
    />
  ));

  if (!minSlotsPerColor || techElements.length >= minSlotsPerColor) {
    return techElements;
  }

  const placeholders = Array.from(
    { length: minSlotsPerColor - techElements.length },
    (_, i) => (
      <PhantomTech
        key={`phantom-${techType}-${techElements.length + i}`}
        techType={techType}
      />
    )
  );

  return [...techElements, ...placeholders];
}

export function chunkInto<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items];
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
