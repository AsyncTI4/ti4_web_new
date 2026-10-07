/** Legendary planets drawn at regular-planet size on their tile art. */
const REGULAR_SIZED_LEGENDARY_PLANETS = new Set([
  "mallice",
  "lockedmallice",
  "hexmallice",
  "hexlockedmallice",
  "ordinian",
  "industrex",
  "mirage",
]);

/** Legendary planets whose tile art is oversized, so their circles and overlays grow to match. */
export function isLargeLegendaryPlanet(
  planetId: string,
  planet:
    | {
        legendaryAbilityName?: string | null;
        legendaryAbilityText?: string | null;
      }
    | undefined,
): boolean {
  const isLegendary = !!(
    planet?.legendaryAbilityName || planet?.legendaryAbilityText
  );
  return isLegendary && !REGULAR_SIZED_LEGENDARY_PLANETS.has(planetId);
}
