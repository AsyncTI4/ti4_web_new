import { calculateSingleTilePosition } from "../mapgen/tilePositioning";
import { optimizeFactionColors, RGBColor } from "../utils/colorOptimization";
import { getColorValues } from "../lookup/colors";
import { createContext, ReactNode } from "react";
import { usePlayerData } from "@/hooks/usePlayerData";
import { useParams } from "react-router-dom";
import { colors } from "@/data/colors";
import { MapTile, Planet, Unit } from "@/types/global";
import {
  PlanetEntityData,
  PlayerDataResponse,
  TileUnitData,
} from "@/data/types";

export type FactionColorMap = {
  [key: string]: FactionColorData;
};

export type FactionColorData = {
  faction: string;
  color: string;
  optimizedColor: RGBColor;
};

type EnhancedGame = {
  planetAttachments: Record<string, string[]>;
  mapTiles: MapTile[];
  tilePositions: any;
  allExhaustedPlanets: string[];
  systemIdToPosition: Record<string, string>;
  factionColorMap: FactionColorMap;
  tilesWithPds: Set<string>;
  dominantPdsFaction: Record<
    string,
    {
      faction: string;
      color: string;
      count: number;
      expected: number;
    }
  >;
};

type Props = {
  children: ReactNode;
};

const RADIUS = 172.5; // Width = 345px
const CENTER_X_OFFSET = 172.5;
const CENTER_Y_OFFSET = 149.5;

export function GameContextProvider({ children }: Props) {
  const params = useParams<{ mapid: string }>();
  const { data } = usePlayerData(params.mapid!);
  const enhancedData = data ? enhanceData(data) : undefined;

  return (
    <EnhancedDataContext.Provider value={enhancedData}>
      {children}
    </EnhancedDataContext.Provider>
  );
}

export const EnhancedDataContext = createContext<EnhancedGame | undefined>(
  undefined
);

export function enhanceData(data: PlayerDataResponse): EnhancedGame {
  const systemIdToPosition = generateSystemIdToPosition(data);
  const factionToColor = buildFactionToColor(data);
  const optimizedColors = computeOptimizedColors(factionToColor);
  const factionColorMap = buildFactionColorMap(data, optimizedColors);
  const allExhaustedPlanets = computeAllExhaustedPlanets(data);
  const { tilesWithPds, dominantPdsFaction } = computePdsData(
    data,
    factionToColor
  );
  const { mapTiles, planetAttachments } = buildMapTiles(data);

  return {
    planetAttachments,
    mapTiles,
    tilePositions: data.tilePositions,
    systemIdToPosition,
    factionColorMap,
    allExhaustedPlanets,
    tilesWithPds,
    dominantPdsFaction,
  };
}

function buildMapTiles(data: PlayerDataResponse): {
  mapTiles: MapTile[];
  planetAttachments: Record<string, string[]>;
} {
  if (!data.tileUnitData)
    return {
      mapTiles: [],
      planetAttachments: {},
    };

  const planetAttachments: Record<string, string[]> = {};
  const mapTiles = Object.entries(data.tileUnitData).map(
    ([position, tileData]) => {
      const coordinates = calculateSingleTilePosition(position, data.ringCount);
      const planets: Planet[] = buildTilePlanetData(tileData);
      const { space, tokens } = buildTileSpaceData(tileData);

      const points = generateHexagonPoints(
        coordinates.x + CENTER_X_OFFSET,
        coordinates.y + CENTER_Y_OFFSET,
        RADIUS
      );

      planets
        .filter((planet) => planet.attachments.length > 0)
        .forEach(
          (planet) => (planetAttachments[planet.name] = planet.attachments)
        );

      return {
        position: position,
        systemId: data.tilePositions
          .filter((pos) => pos.split(":")[0] === position)
          .slice(-2)[1],
        planets: planets,
        space: space,
        anomaly: (tileData as any).anomaly,
        wormholes: [],
        commandCounters: (tileData as any).ccs,
        productionCapacity: 0,
        tokens: tokens,
        controller: getTileController(planets, space),
        properties: {
          x: coordinates.x,
          y: coordinates.y,
          hexOutline: {
            points: points,
            sides: generateHexagonSides(points),
          },
          width: 0,
          height: 0,
        },
      } as MapTile;
    }
  );

  return {
    mapTiles,
    planetAttachments,
  };
}

// Check planets, then check space area, otherwise no one faction has control
function getTileController(planets: Planet[], space: Unit[]) {
  const uniquePlanetFactions = [
    ...new Set(planets.map((planet) => planet.controller)),
  ];
  const uniqueFactions = [...new Set(space.map((unit) => unit.owner))];

  if (uniquePlanetFactions.length === 1) {
    return uniquePlanetFactions[0];
  } else if (uniqueFactions.length === 1) {
    return uniqueFactions[0];
  } else {
    return "";
  }
}

function buildTileSpaceData(tileData: TileUnitData) {
  const space: Unit[] = [];
  const tokens: string[] = [];

  Object.entries(tileData.space).forEach(
    ([faction, entities]: [string, any]) => {
      entities.forEach((entity: any) => {
        if (entity.entityType === "unit") {
          space.push({
            type: entity.entityType,
            amount: entity.count,
            amountSustained: entity.sustained ?? 0,
            owner: faction,
          });
        }

        if (entity.entityType === "token") tokens.push(entity.entityId);
      });
    }
  );

  return {
    space,
    tokens,
  };
}

function buildTilePlanetData(tileData: TileUnitData) {
  return Object.entries(tileData.planets).map(
    ([planetName, planetData]: [string, PlanetEntityData]) => {
      const attachments: string[] = [];
      const units: Unit[] = [];
      Object.entries(planetData.entities).forEach(
        ([faction, entities]: [string, any]) => {
          entities.forEach((entity: any) => {
            if (entity.entityType === "unit") {
              units.push({
                type: entity.entityType,
                amount: entity.count,
                amountSustained: entity.sustained ?? 0,
                owner: faction,
              });
            }

            if (entity.entityType === "attachment")
              attachments.push(entity.entityId);
          });
        }
      );

      return {
        name: planetName,
        attachments: attachments,
        tokens: [],
        units: units,
        controller: planetData.controlledBy,
        properties: {
          x: 0,
          y: 0,
        },
      };
    }
  );
}

function generateSystemIdToPosition(data: PlayerDataResponse | undefined) {
  const systemIdToPosition: Record<string, string> = {};

  if (!data || !data.tilePositions) return systemIdToPosition;

  data.tilePositions.forEach((entry: string) => {
    const [position, systemId] = entry.split(":");
    systemIdToPosition[systemId] = position;
  });

  return systemIdToPosition;
}

function generateHexagonPoints(cx: number, cy: number, radius: number) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = i * 60 * (Math.PI / 180); // Start at 0° for flat-top orientation
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push({ x, y });
  }
  return points;
}

function generateHexagonSides(points: { x: number; y: number }[]) {
  const sides = [];
  for (let i = 0; i < 6; i++) {
    const nextI = (i + 1) % 6;
    sides.push({
      x1: points[i].x,
      y1: points[i].y,
      x2: points[nextI].x,
      y2: points[nextI].y,
    });
  }
  return sides;
}

function buildFactionToColor(data: PlayerDataResponse): Record<string, string> {
  if (!data.playerData) return {};
  return data.playerData.reduce(
    (acc, player) => {
      acc[player.faction] = player.color;
      return acc;
    },
    {} as Record<string, string>
  );
}

function computeOptimizedColors(
  factionToColor: Record<string, string>
): Record<string, RGBColor> {
  const colorsInUse = new Set(Object.values(factionToColor));

  const transformedColors = colors
    .filter((color) => colorsInUse.has(color.name))
    .map((color) => {
      const primaryColorValues = getColorValues(
        (color as any).primaryColorRef,
        color.primaryColor
      );

      if (!primaryColorValues) return null;

      return {
        alias: color.name,
        primaryColor: primaryColorValues as RGBColor,
      };
    })
    .filter(
      (color): color is { alias: string; primaryColor: RGBColor } =>
        color !== null
    );

  return optimizeFactionColors(transformedColors);
}

function buildFactionColorMap(
  data: PlayerDataResponse,
  optimizedColors: Record<string, RGBColor>
): FactionColorMap {
  const factionColorMap: FactionColorMap = {};
  if (!data.playerData) return factionColorMap;

  data.playerData.forEach((player) => {
    const entry = {
      faction: player.faction,
      color: player.color,
      optimizedColor: optimizedColors[player.color],
    };

    factionColorMap[player.faction] = entry;
    factionColorMap[player.color] = entry;
  });

  return factionColorMap;
}

function computeAllExhaustedPlanets(data: PlayerDataResponse): string[] {
  if (!data.playerData) return [];
  return data.playerData.flatMap((player) =>
    player.exhaustedPlanets.filter((planet) => planet)
  );
}

function computePdsData(
  data: PlayerDataResponse,
  factionToColor: Record<string, string>
) {
  const tilesWithPds = new Set<string>();
  const dominantPdsFaction: Record<
    string,
    { faction: string; color: string; count: number; expected: number }
  > = {};

  if (!data.tileUnitData) return { tilesWithPds, dominantPdsFaction };

  Object.entries(data.tileUnitData).forEach(
    ([position, tileData]: [string, any]) => {
      if (!(tileData.pds && Object.keys(tileData.pds).length > 0)) return;

      tilesWithPds.add(position);

      let highestExpected = -1;
      let dominantFaction = "";
      let dominantCount = 0;
      let dominantExpectedValue = 0;

      Object.entries(tileData.pds).forEach(
        ([faction, pdsData]: [string, any]) => {
          if (pdsData.expected > highestExpected) {
            highestExpected = pdsData.expected;
            dominantFaction = faction;
            dominantCount = pdsData.count;
            dominantExpectedValue = pdsData.expected;
          }
        }
      );

      if (dominantFaction && factionToColor[dominantFaction]) {
        dominantPdsFaction[position] = {
          faction: dominantFaction,
          color: factionToColor[dominantFaction],
          count: dominantCount,
          expected: dominantExpectedValue,
        };
      }
    }
  );

  return { tilesWithPds, dominantPdsFaction };
}
