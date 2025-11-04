import {
  calculateSingleTilePosition,
  calculateTilePositions,
  isFractureInPlay,
} from "../mapgen/tilePositioning";
import { optimizeFactionColors, RGBColor } from "../utils/colorOptimization";
import { getColorValues } from "../lookup/colors";
import { createContext, ReactNode, useMemo, useState, useCallback } from "react";
import { useSettingsStore } from "@/utils/appStore";
import { usePlayerDataSocket } from "@/hooks/usePlayerData";
import { colors } from "@/data/colors";
import {
  MapTileType,
  PlanetEntityData,
  PlanetMapTile,
  PlayerDataResponse,
  TileUnitData,
  UnitMapTile,
  PlayerData,
  WebScoreBreakdown,
} from "@/data/types";
import {
  getPlanetsByTileId,
  getPlanetCoordsBySystemId,
} from "@/lookup/planets";
import { getAttachmentData } from "@/lookup/attachments";
import { getAllEntityPlacementsForTile } from "@/utils/unitPositioning";
import { useMovementStore } from "@/utils/movementStore";
import { applyDisplacementToPlayerData } from "@/utils/displacement";
import { SocketReadyState } from "@/hooks/useGameSocket";

export type FactionImageMap = Record<string, { image: string; type: string }>;

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
  decalOverrides: Record<string, string>;
  setDecalOverride: (faction: string, decalId: string | null) => void;
  clearDecalOverride: (faction: string) => void;
  colorOverrides: Record<string, string>;
  setColorOverride: (faction: string, colorAlias: string | null) => void;
  clearColorOverride: (faction: string) => void;
};

type GameData = {
  mapTiles: MapTileType[];
  tilePositions: string[];
  factionColorMap: FactionColorMap;
  originalFactionColorMap: FactionColorMap;
  factionImageMap: FactionImageMap;
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
  pdsByTile: Record<
    string,
    { faction: string; color: string; count: number; expected: number }[]
  >;
  planetIdToPlanetTile: Record<string, PlanetMapTile>;
  armyRankings: Record<string, number>;

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
  tableTalkJumpLink?: PlayerDataResponse["tableTalkJumpLink"];
  actionsJumpLink?: PlayerDataResponse["actionsJumpLink"];
  playerScoreBreakdowns?: Record<string, WebScoreBreakdown>;
  expeditions: PlayerDataResponse["expeditions"];
};

export type GameDataState = {
  isLoading: boolean;
  isError: boolean;
  readyState: SocketReadyState;
  reconnect: () => void;
  isReconnecting: boolean;
};

type Props = {
  children: ReactNode;
  gameId: string;
};

const RADIUS = 172.5; // Width = 345px
const CENTER_X_OFFSET = 172.5;
const CENTER_Y_OFFSET = 149.5;

export function GameContextProvider({ children, gameId }: Props) {
  const { data, isLoading, isError, isReconnecting, readyState, reconnect } =
    usePlayerDataSocket(gameId);
  const accessibleColors = useSettingsStore((s) => s.settings.accessibleColors);

  const draft = useMovementStore((s) => s.draft);

  const [decalOverrides, setDecalOverrides] = useState<Record<string, string>>(
    {}
  );

  const [colorOverrides, setColorOverrides] = useState<Record<string, string>>(
    {}
  );

  const setDecalOverride = useCallback(
    (faction: string, decalId: string | null) => {
      setDecalOverrides((prev) => {
        if (decalId === null) {
          const updated = { ...prev };
          delete updated[faction];
          return updated;
        }
        return { ...prev, [faction]: decalId };
      });
    },
    []
  );

  const clearDecalOverride = useCallback((faction: string) => {
    setDecalOverride(faction, null);
  }, [setDecalOverride]);

  const setColorOverride = useCallback(
    (faction: string, colorAlias: string | null) => {
      setColorOverrides((prev) => {
        if (colorAlias === null) {
          const updated = { ...prev };
          delete updated[faction];
          return updated;
        }
        return { ...prev, [faction]: colorAlias };
      });
    },
    []
  );

  const clearColorOverride = useCallback((faction: string) => {
    setColorOverride(faction, null);
  }, [setColorOverride]);

  const adjustedData = useMemo(() => {
    if (!data) return undefined;
    return applyDisplacementToPlayerData(data, draft);
  }, [data, draft]);

  const enhancedData = adjustedData
    ? buildGameContext(adjustedData, accessibleColors, decalOverrides)
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
    decalOverrides,
    setDecalOverride,
    clearDecalOverride,
    colorOverrides,
    setColorOverride,
    clearColorOverride,
  };

  return (
    <EnhancedDataContext.Provider value={gameContext}>
      {children}
    </EnhancedDataContext.Provider>
  );
}

export const EnhancedDataContext = createContext<GameContext | undefined>(
  undefined
);

function calculateArmyRankings(
  playerData: PlayerData[]
): Record<string, number> {
  const armyValues = playerData.map((player) => {
    const totalValue =
      (player.spaceArmyHealth ?? 0) +
      (player.groundArmyHealth ?? 0) +
      (player.spaceArmyCombat ?? 0) * 2 +
      (player.groundArmyCombat ?? 0) * 2;
    return {
      faction: player.faction,
      totalValue,
    };
  });

  armyValues.sort((a, b) => b.totalValue - a.totalValue);

  const rankings: Record<string, number> = {};
  armyValues.forEach((item, index) => {
    rankings[item.faction] = index + 1;
  });

  return rankings;
}

export function buildGameContext(
  data: PlayerDataResponse,
  accessibleColors: boolean,
  decalOverrides: Record<string, string> = {}
): GameData {
  const playerData = data.playerData.filter(
    (p) => p.faction !== "null" && p.faction !== "" && p.faction !== undefined
  );
  const baseFactionToColor = buildFactionToColor(playerData);
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
  if (accessibleColors && playerData) {
    const mapping: Record<string, string> = {};
    let idx = 0;
    for (const player of playerData) {
      if (idx >= accessibleOrder.length) break;
      mapping[player.faction] = accessibleOrder[idx];
      idx += 1;
    }
    factionToColor = playerData.reduce(
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

  const originalFactionColorMap = buildFactionColorMap(
    data,
    optimizedColors,
    false
  );

  const factionImageMap = buildFactionImageMap(playerData);

  const { tilesWithPds, dominantPdsFaction, pdsByTile } = computePdsData(
    data,
    factionToColor
  );
  const mapTiles = buildMapTiles(data);
  const planetIdToPlanetTile = buildPlanetIdToPlanetTileMap(mapTiles);
  const calculatedTilePositions = data.tilePositions
    ? calculateTilePositions(data.tilePositions, data.ringCount)
    : [];

  const armyRankings = calculateArmyRankings(playerData);

  // Apply decal overrides to playerData
  const playerDataWithOverrides = playerData.map((player) => {
    const overrideDecalId = decalOverrides[player.faction];
    if (overrideDecalId !== undefined) {
      return {
        ...player,
        decalId: overrideDecalId || player.decalId,
      };
    }
    return player;
  });

  return {
    mapTiles,
    tilePositions: data.tilePositions,
    factionColorMap,
    originalFactionColorMap,
    factionImageMap,
    tilesWithPds,
    dominantPdsFaction,
    pdsByTile,
    planetIdToPlanetTile,
    armyRankings,
    playerData: playerDataWithOverrides,
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
    tableTalkJumpLink: data.tableTalkJumpLink,
    actionsJumpLink: data.actionsJumpLink,
    playerScoreBreakdowns: data.scoreBreakdowns,
    expeditions: data.expeditions,
  };
}

function buildFactionImageMap(playerData: PlayerData[]): FactionImageMap {
  return playerData.reduce((acc, player) => {
    acc[player.faction] = {
      image: player.factionImage ?? "",
      type: player.factionImageType ?? "",
    };

    return acc;
  }, {} as FactionImageMap);
}

function buildMapTiles(data: PlayerDataResponse): MapTileType[] {
  if (!data.tileUnitData) return [];

  const allExhaustedPlanets = new Set(computeAllExhaustedPlanets(data));
  // Detect if fracture is in play and set fractureYbump accordingly
  const fractureYbump = data.tilePositions
    ? isFractureInPlay(data.tilePositions)
      ? 400
      : 0
    : 0;
  const mapTiles = Object.entries(data.tileUnitData).map(
    ([position, tileData]) => {
      const coordinates = calculateSingleTilePosition(
        position,
        data.ringCount,
        fractureYbump
      );
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
            midpoints: generateHexagonMidpoints(points),
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
  const hasAttachmentTechSkips = planets.some((planet) =>
    planet.attachments.some((attachment) => {
      const attachmentData = getAttachmentData(attachment);
      return (
        attachmentData?.techSpeciality &&
        attachmentData.techSpeciality.length > 0
      );
    })
  );

  return hasAttachmentTechSkips;
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
  const entries = Object.entries(tileData.space);

  const space: UnitMapTile[] = entries.flatMap(([faction, entities]) =>
    (entities || [])
      .filter((entity) => entity.entityType === "unit")
      .map((entity) => ({
        type: "unit",
        entityId: entity.entityId,
        amount: entity.count,
        amountSustained: entity.sustained ?? 0,
        owner: faction,
      }))
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
  const entityEntries = Object.entries(planetData.entities);

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
    planetaryShield: planetData.planetaryShield,
    properties: {
      x,
      y,
    },
  };
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

function generateHexagonMidpoints(points: { x: number; y: number }[]) {
  const midpoints = [];
  for (let i = 0; i < 6; i++) {
    const nextI = (i + 1) % 6;
    midpoints.push({
      x: (points[i].x + points[nextI].x) / 2,
      y: (points[i].y + points[nextI].y) / 2,
    });
  }
  return midpoints;
}

function buildFactionToColor(playerData: PlayerData[]): Record<string, string> {
  if (!playerData) return {};
  return playerData.reduce(
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
        color.primaryColorRef,
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
  const pdsByTile: Record<
    string,
    { faction: string; color: string; count: number; expected: number }[]
  > = {};

  if (!data.tileUnitData)
    return { tilesWithPds, dominantPdsFaction, pdsByTile };

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
        }
      );

      if (allForTile.length > 0) {
        // sort by expected desc, then count desc
        allForTile.sort((a, b) =>
          b.expected !== a.expected
            ? b.expected - a.expected
            : b.count - a.count
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
    }
  );

  return { tilesWithPds, dominantPdsFaction, pdsByTile };
}
