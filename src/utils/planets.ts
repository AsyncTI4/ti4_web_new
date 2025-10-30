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

