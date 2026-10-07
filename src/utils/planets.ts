import { PlayerDataResponse } from "@/entities/data/types";
import { getPlanetData } from "@/entities/lookup/planets";
import { getAttachmentData } from "@/entities/lookup/attachments";

function isOceanPlanet(planetId: string): boolean {
  return planetId.startsWith("ocean");
}

export function filterPlanetsByOcean(
  planets: string[]
): { regularPlanets: string[]; oceanPlanets: string[] } {
  const regularPlanets = planets.filter((id) => !isOceanPlanet(id));
  const oceanPlanets = planets.filter(isOceanPlanet);
  return { regularPlanets, oceanPlanets };
}

export function computeAllExhaustedPlanets(
  data: PlayerDataResponse
): string[] {
  if (!data.playerData) return [];
  return data.playerData.flatMap((player) =>
    player.exhaustedPlanets.filter((planet) => planet)
  );
}

export type AttachmentModifiers = {
  resources: number;
  influence: number;
  techSpecialties: string[];
  planetTypes: string[];
};

/** Summed resource/influence bonuses and granted skips/traits from a planet's attachments. */
export function getAttachmentModifiers(
  attachments: string[]
): AttachmentModifiers {
  const totals: AttachmentModifiers = {
    resources: 0,
    influence: 0,
    techSpecialties: [],
    planetTypes: [],
  };
  for (const attachmentId of attachments) {
    const data = getAttachmentData(attachmentId);
    if (!data) continue;
    totals.resources += data.resourcesModifier ?? 0;
    totals.influence += data.influenceModifier ?? 0;
    totals.techSpecialties.push(...(data.techSpeciality ?? []));
    totals.planetTypes.push(...(data.planetTypes ?? []));
  }
  return totals;
}

export function getTechSpecialties(
  planetName: string,
  attachments: string[]
): string[] {
  return [
    ...(getPlanetData(planetName)?.techSpecialties ?? []),
    ...getAttachmentModifiers(attachments).techSpecialties,
  ];
}
