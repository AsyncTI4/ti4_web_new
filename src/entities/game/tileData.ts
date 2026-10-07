import type { TilePdsEntry, TilePlanet } from "@/entities/game/types";
import type { FactionUnits, PlayerDataResponse } from "@/entities/data/types";

export function getTileController(
  planets: Record<string, TilePlanet>,
  unitsByFaction: FactionUnits,
): string | undefined {
  const uniquePlanetFactions = new Set(
    Object.values(planets).map((planet) => planet.controlledBy),
  );
  const uniqueFactions = new Set(Object.keys(unitsByFaction));

  if (uniquePlanetFactions.size === 1) {
    return uniquePlanetFactions.values().next().value ?? undefined;
  }
  if (uniqueFactions.size === 1) {
    return uniqueFactions.values().next().value;
  }
  return undefined;
}

export function hasTechSkips(planets: Record<string, TilePlanet>): boolean {
  return Object.values(planets).some(
    (planet) => planet.techSpecialties.length > 0,
  );
}

export function hasAttachments(planets: Record<string, TilePlanet>): boolean {
  return Object.values(planets).some(
    (planet) => planet.attachments.length > 0,
  );
}

export function computePdsData(
  data: PlayerDataResponse,
  factionToColor: Record<string, string>,
) {
  const tilesWithPds = new Set<string>();
  const pdsByTile: Record<string, TilePdsEntry[]> = {};

  if (!data.tileUnitData) {
    return { tilesWithPds, pdsByTile };
  }

  Object.entries(data.tileUnitData).forEach(([position, tileData]) => {
    if (!tileData.pds || Object.keys(tileData.pds).length === 0) return;

    tilesWithPds.add(position);

    const allForTile = Object.entries(tileData.pds)
      .filter(([faction]) => factionToColor[faction])
      .map(([faction, pdsData]) => ({
        faction,
        color: factionToColor[faction],
        count: pdsData.count,
        expected: pdsData.expected,
      }));
    if (allForTile.length === 0) return;

    allForTile.sort((a, b) =>
      b.expected !== a.expected ? b.expected - a.expected : b.count - a.count,
    );
    pdsByTile[position] = allForTile;
  });

  return { tilesWithPds, pdsByTile };
}
