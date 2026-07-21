import { getPlanetData } from "@/entities/lookup/planets";
import { getAttachmentData } from "@/entities/lookup/attachments";

export function isOceanPlanet(planetId: string): boolean {
  return planetId.startsWith("ocean");
}

export function filterPlanetsByOcean(
  planets: string[]
): { regularPlanets: string[]; oceanPlanets: string[] } {
  const regularPlanets = planets.filter((id) => !isOceanPlanet(id));
  const oceanPlanets = planets.filter(isOceanPlanet);
  return { regularPlanets, oceanPlanets };
}

export function getTechSpecialties(
  planetName: string,
  attachments: string[]
): string[] {
  const techSpecialties: string[] =
    getPlanetData(planetName)?.techSpecialties ?? [];
  if (attachments.length > 0) {
    attachments.forEach((attachment) => {
      const attachmentData = getAttachmentData(attachment);
      if (attachmentData?.techSpeciality) {
        techSpecialties.push(...attachmentData.techSpeciality);
      }
    });
  }
  return techSpecialties;
}

