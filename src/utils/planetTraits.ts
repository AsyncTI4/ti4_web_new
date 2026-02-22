import { cdnImage } from "@/entities/data/cdnImage";

export type PlanetTrait = "cultural" | "hazardous" | "industrial";

const VALID_TRAITS = new Set<PlanetTrait>(["cultural", "hazardous", "industrial"]);

function normalizeTrait(value?: string | null): PlanetTrait | null {
  if (!value) return null;
  const normalized = value.toLowerCase() as PlanetTrait;
  return VALID_TRAITS.has(normalized) ? normalized : null;
}

export function mergePlanetTraits(
  ...traitGroups: Array<ReadonlyArray<string> | undefined | null>
): PlanetTrait[] {
  const seen = new Set<PlanetTrait>();
  const result: PlanetTrait[] = [];

  for (const group of traitGroups) {
    if (!group) continue;
    for (const trait of group) {
      const normalized = normalizeTrait(trait);
      if (normalized && !seen.has(normalized)) {
        seen.add(normalized);
        result.push(normalized);
      }
    }
  }

  return result;
}

export function getPlanetTraitIconSrc(traits: PlanetTrait[]): string | null {
  if (traits.length === 0) return null;
  if (traits.length === 1) {
    return `/planet_attributes/pc_attribute_${traits[0]}.png`;
  }

  const hasC = traits.includes("cultural");
  const hasH = traits.includes("hazardous");
  const hasI = traits.includes("industrial");

  const suffix = hasC && hasH && hasI
    ? "CHI"
    : `${hasC ? "C" : ""}${hasH ? "H" : ""}${hasI ? "I" : ""}`;

  return cdnImage(`/planet_cards/pc_attribute_combo_${suffix}.png`);
}
