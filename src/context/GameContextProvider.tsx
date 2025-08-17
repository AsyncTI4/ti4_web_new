import {
  calculateSingleTilePosition,
  calculateTilePositions,
} from "../mapgen/tilePositioning";
import { optimizeFactionColors, RGBColor } from "../utils/colorOptimization";
import { getColorValues } from "../lookup/colors";
import { createContext, ReactNode } from "react";
import { useSettingsStore } from "@/utils/appStore";
import { usePlayerDataSocket } from "@/hooks/usePlayerData";
import { colors } from "@/data/colors";
import {
  MapTileType,
  EntityData,
  PlanetEntityData,
  PlanetMapTile,
  PlayerDataResponse,
  TileUnitData,
  UnitMapTile,
} from "@/data/types";
import {
  getPlanetsByTileId,
  getPlanetCoordsBySystemId,
} from "@/lookup/planets";
import { getAttachmentData } from "@/lookup/attachments";
import { getAllEntityPlacementsForTile } from "@/utils/unitPositioning";

export type FactionColorMap = {
  [key: string]: FactionColorData;
};

export type FactionColorData = {
  faction: string;
  color: string;
  optimizedColor: RGBColor;
};

type GameContext = {
  data: GameData | undefined;
  dataState: GameDataState;
};

type GameData = {
  mapTiles: MapTileType[];
  tilePositions: any;
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
  planetIdToPlanetTile: Record<string, PlanetMapTile>;

  // Added properties migrated from old enhancedData
  // have not been massaged yet
  playerData: PlayerDataResponse["playerData"];
  objectives: PlayerDataResponse["objectives"];
  lawsInPlay: PlayerDataResponse["lawsInPlay"];
  strategyCards: PlayerDataResponse["strategyCards"];
  vpsToWin: PlayerDataResponse["vpsToWin"];
  cardPool: PlayerDataResponse["cardPool"];
  versionSchema?: PlayerDataResponse["versionSchema"];
  ringCount: PlayerDataResponse["ringCount"];
  gameRound: PlayerDataResponse["gameRound"];
  gameName: PlayerDataResponse["gameName"];
  gameCustomName?: PlayerDataResponse["gameCustomName"];
  statTilePositions: PlayerDataResponse["statTilePositions"];
  calculatedTilePositions: ReturnType<typeof calculateTilePositions>;
};

export type GameDataState = {
  isLoading: boolean;
  isError: boolean;
  readyState: any;
  reconnect: () => void;
  isReconnecting: any;
};

type Props = {
  children: ReactNode;
  gameId: string;
};

const RADIUS = 172.5; // Width = 345px
const CENTER_X_OFFSET = 172.5;
const CENTER_Y_OFFSET = 149.5;

export function GameContextProvider({ children, gameId }: Props) {
  //hook calls need to be at component level, cannot bring this out to a helper function
  const { data, isLoading, isError, isReconnecting, readyState, reconnect } =
    usePlayerDataSocket(gameId);
  const accessibleColors = useSettingsStore((s) => s.settings.accessibleColors);
  const enhancedData = data
    ? buildGameContext(data, accessibleColors)
    : undefined;

  const gameContext: GameContext = {
    data: enhancedData,
    dataState: {
      isLoading,
      isError,
      isReconnecting,
      readyState,
      reconnect,
    },
  } as GameContext;

  return (
    <EnhancedDataContext.Provider value={gameContext}>
      {children}
    </EnhancedDataContext.Provider>
  );
}

export const EnhancedDataContext = createContext<GameContext | undefined>(
  undefined
);

export function buildGameContext(
  data: PlayerDataResponse,
  accessibleColors: boolean
): GameData {
  const systemIdToPosition = generateSystemIdToPosition(data);
  const baseFactionToColor = buildFactionToColor(data);
  const accessibleOrder = [
    "blue",
    "green",
    "purple",
    "yellow",
    "red",
    "pink",
    "black",
    "lightgray",
  ];
  let factionToColor = baseFactionToColor;
  if (accessibleColors && data.playerData) {
    const mapping: Record<string, string> = {};
    let idx = 0;
    for (const player of data.playerData) {
      if (idx >= accessibleOrder.length) break;
      mapping[player.faction] = accessibleOrder[idx];
      idx += 1;
    }
    factionToColor = data.playerData.reduce(
      (acc, p) => {
        acc[p.faction] = mapping[p.faction] ?? p.color;
        return acc;
      },
      {} as Record<string, string>
    );
  }
  const optimizedColors = computeOptimizedColors(factionToColor);
  const factionColorMap = buildFactionColorMap(
    data,
    optimizedColors,
    accessibleColors
  );
  const { tilesWithPds, dominantPdsFaction } = computePdsData(
    data,
    factionToColor
  );
  const mapTiles = buildMapTiles(data);
  const planetIdToPlanetTile = buildPlanetIdToPlanetTileMap(mapTiles);
  const calculatedTilePositions = data.tilePositions
    ? calculateTilePositions(data.tilePositions, data.ringCount)
    : [];

  const overriddenPlayerData =
    accessibleColors && data.playerData
      ? data.playerData.map((p) => ({
          ...p,
          color: factionToColor[p.faction] ?? p.color,
        }))
      : data.playerData;

  return {
    mapTiles,
    tilePositions: data.tilePositions,
    systemIdToPosition,
    factionColorMap,
    tilesWithPds,
    dominantPdsFaction,
    planetIdToPlanetTile,
    playerData: overriddenPlayerData,
    objectives: data.objectives,
    lawsInPlay: data.lawsInPlay,
    strategyCards: data.strategyCards,
    vpsToWin: data.vpsToWin,
    cardPool: data.cardPool,
    versionSchema: data.versionSchema,
    ringCount: data.ringCount,
    gameRound: data.gameRound,
    gameName: data.gameName,
    gameCustomName: data.gameCustomName,
    statTilePositions: data.statTilePositions,
    calculatedTilePositions,
  };
}

function buildMapTiles(data: PlayerDataResponse): MapTileType[] {
  if (!data.tileUnitData) return [];

  const allExhaustedPlanets = new Set(computeAllExhaustedPlanets(data));
  const mapTiles = Object.entries(data.tileUnitData).map(
    ([position, tileData]) => {
      const coordinates = calculateSingleTilePosition(position, data.ringCount);
      const { space, tokens } = buildTileSpaceData(tileData);

      const systemId = data.tilePositions
        .filter((pos) => pos.split(":")[0] === position)[0]
        .split(":")[1];
      const planetCoords = getPlanetCoordsBySystemId(systemId);

      const planets: PlanetMapTile[] = Object.entries(tileData.planets).map(
        ([planetName, planetData]: [string, PlanetEntityData]) =>
          buildPlanetMapTile(
            planetName,
            planetData,
            allExhaustedPlanets,
            planetCoords
          )
      );

      const points = generateHexagonPoints(
        coordinates.x + CENTER_X_OFFSET,
        coordinates.y + CENTER_Y_OFFSET,
        RADIUS
      );

      const allEntityPlacements = getAllEntityPlacementsForTile(
        systemId,
        tileData
      );

      return {
        position: position,
        systemId: systemId,
        planets: planets,
        space: space,
        anomaly: tileData.anomaly,
        wormholes: [],
        hasTechSkips: systemHasTechSkips(systemId, planets),
        controller: getTileController(planets, space),
        commandCounters: tileData.ccs,
        production: tileData.production,
        highestProduction: Math.max(...Object.values(tileData.production)),
        capacity: {},
        tokens: tokens,
        entityPlacements: allEntityPlacements,
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
      } as MapTileType;
    }
  );

  return mapTiles;
}

function buildPlanetIdToPlanetTileMap(
  mapTiles: MapTileType[]
): Record<string, PlanetMapTile> {
  const map: Record<string, PlanetMapTile> = {};
  for (const tile of mapTiles) {
    if (!tile.planets) continue;
    for (const planet of tile.planets) {
      // Use the same object reference from mapTiles
      map[planet.name] = planet;
    }
  }
  return map;
}

function systemHasTechSkips(
  systemId: string,
  planets: PlanetMapTile[]
): boolean {
  const hasBaseTechSkips = getPlanetsByTileId(systemId).some(
    (planet) =>
      planet.techSpecialties &&
      planet.techSpecialties.length > 0 &&
      !planet.techSpecialties.includes("NONUNITSKIP")
  );

  if (hasBaseTechSkips) {
    return true;
  }

  // Check planet attachments for tech skips
  planets.forEach((planet) => {
    planet.attachments.forEach((attachment) => {
      const attachmentData = getAttachmentData(attachment);
      if (
        attachmentData?.techSpeciality &&
        attachmentData.techSpeciality.length > 0
      ) {
        return true;
      }
    });
  });

  return false;
}

// Check planets, then check space area, otherwise no one faction has control
function getTileController(planets: PlanetMapTile[], space: UnitMapTile[]) {
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
  const entries = Object.entries(tileData.space) as [string, EntityData[]][];

  const space: UnitMapTile[] = entries.flatMap(([faction, entities]) =>
    entries
      .filter(([, entities]) => entities)
      .flatMap(() =>
        entities
          .filter((entity) => entity.entityType === "unit")
          .map((entity) => ({
            type: "unit",
            entityId: entity.entityId,
            amount: entity.count,
            amountSustained: entity.sustained ?? 0,
            owner: faction,
          }))
      )
  );

  const tokens: string[] = entries.flatMap(([, entities]) =>
    entities
      .filter((entity) => entity.entityType === "token")
      .map((entity) => entity.entityId)
  );

  return { space, tokens };
}

function buildPlanetMapTile(
  planetName: string,
  planetData: PlanetEntityData,
  allExhaustedPlanets: Set<string>,
  planetCoords: Record<string, string>
): PlanetMapTile {
  const entityEntries = Object.entries(planetData.entities) as [
    string,
    EntityData[],
  ][];

  const attachments: string[] = entityEntries.flatMap(([, entities]) =>
    entities
      .filter((entity) => entity.entityType === "attachment")
      .map((entity) => entity.entityId)
  );

  const units: UnitMapTile[] = entityEntries.flatMap(([faction, entities]) =>
    entities
      .filter((entity) => entity.entityType === "unit")
      .map((entity) => ({
        type: "unit",
        entityId: entity.entityId,
        amount: entity.count,
        amountSustained: entity.sustained ?? 0,
        owner: faction,
      }))
  );

  let x = 0;
  let y = 0;
  const coord = planetCoords[planetName];
  if (coord) {
    [x, y] = coord.split(",").map(Number);
  }

  return {
    name: planetName,
    attachments,
    tokens: [],
    units,
    controller: planetData.controlledBy,
    exhausted: allExhaustedPlanets.has(planetName),
    commodities: planetData.commodities,
    properties: {
      x,
      y,
    },
  };
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
  optimizedColors: Record<string, RGBColor>,
  accessibleColors: boolean
): FactionColorMap {
  const factionColorMap: FactionColorMap = {};
  if (!data.playerData) return factionColorMap;

  const accessibleOrder = [
    "blue",
    "green",
    "purple",
    "yellow",
    "red",
    "pink",
    "black",
    "lightgray",
  ];

  const assignedByFaction: Record<string, string> = {};
  const usedAccessible = new Set<string>();

  data.playerData.forEach((player) => {
    let chosenColor = player.color;
    if (accessibleColors) {
      // If we already assigned one to this faction, reuse it
      if (assignedByFaction[player.faction]) {
        chosenColor = assignedByFaction[player.faction];
      } else {
        const next = accessibleOrder.find((c) => !usedAccessible.has(c));
        if (next) {
          chosenColor = next;
          usedAccessible.add(next);
          assignedByFaction[player.faction] = next;
        }
      }
    }

    const entry = {
      faction: player.faction,
      color: chosenColor,
      optimizedColor:
        optimizedColors[chosenColor] ?? optimizedColors[player.color],
    };

    factionColorMap[player.faction] = entry;
    factionColorMap[chosenColor] = entry;
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
