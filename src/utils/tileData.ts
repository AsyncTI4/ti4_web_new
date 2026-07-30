import type { TilePlanet } from "@/app/providers/context/types";
import type {
  EntityData,
  PlayerDataResponse,
  TileUnitData,
} from "@/entities/data/types";

export function getTileController(
  planets: Record<string, TilePlanet>,
  unitsByFaction: Record<string, EntityData[]>,
): string | undefined {
  const uniquePlanetFactions = new Set(
    Object.values(planets).map((planet) => planet.controlledBy),
  );
  const uniqueFactions = new Set(Object.keys(unitsByFaction));

  if (uniquePlanetFactions.size === 1) {
    return uniquePlanetFactions.values().next().value;
  }
  if (uniqueFactions.size === 1) {
    return uniqueFactions.values().next().value;
  }
  return undefined;
}

export function hasTechSkips(planets: Record<string, TilePlanet>): boolean {
  return Object.values(planets).some(
    (planet) => planet.techSpecialties && planet.techSpecialties.length > 0,
  );
}

export function hasAttachments(planets: Record<string, TilePlanet>): boolean {
  return Object.values(planets).some(
    (planet) => planet.attachments && planet.attachments.length > 0,
  );
}

export function computePdsData(
  data: PlayerDataResponse,
  factionToColor: Record<string, string>,
) {
  const tilesWithPds = new Set<string>();
  const dominantPdsFaction: Record<
    string,
    { faction: string; color: string; count: number; expected: number }
  > = {};
  const pdsByTile: Record<
    string,
    { faction: string; color: string; count: number; expected: number }[]
  > = {};

  if (!data.tileUnitData) {
    return { tilesWithPds, dominantPdsFaction, pdsByTile };
  }

  Object.entries(data.tileUnitData).forEach(
    ([position, tileData]: [string, TileUnitData]) => {
      if (!(tileData.pds && Object.keys(tileData.pds).length > 0)) return;

      tilesWithPds.add(position);

      let highestExpected = -1;
      let dominantFaction = "";
      let dominantCount = 0;
      let dominantExpectedValue = 0;
      const allForTile: {
        faction: string;
        color: string;
        count: number;
        expected: number;
      }[] = [];

      Object.entries(tileData.pds).forEach(
        ([faction, pdsData]: [string, { count: number; expected: number }]) => {
          if (factionToColor[faction]) {
            allForTile.push({
              faction,
              color: factionToColor[faction],
              count: pdsData.count,
              expected: pdsData.expected,
            });
          }
          if (pdsData.expected > highestExpected) {
            highestExpected = pdsData.expected;
            dominantFaction = faction;
            dominantCount = pdsData.count;
            dominantExpectedValue = pdsData.expected;
          }
        },
      );

      if (allForTile.length > 0) {
        allForTile.sort((a, b) =>
          b.expected !== a.expected
            ? b.expected - a.expected
            : b.count - a.count,
        );
        pdsByTile[position] = allForTile;
      }

      if (dominantFaction && factionToColor[dominantFaction]) {
        dominantPdsFaction[position] = {
          faction: dominantFaction,
          color: factionToColor[dominantFaction],
          count: dominantCount,
          expected: dominantExpectedValue,
        };
      }
    },
  );

  return { tilesWithPds, dominantPdsFaction, pdsByTile };
}
