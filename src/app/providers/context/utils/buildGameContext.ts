import {
  calculateSingleTilePosition,
  calculateTilePositions,
  isFractureInPlay,
} from "@/domains/map/model/mapgen/tilePositioning";
import {
  ACCESSIBLE_COLOR_ORDER,
  buildFactionToColor,
  computeOptimizedColors,
  buildFactionColorMap,
} from "@/utils/colorOptimization";
import { buildFactionImageMap } from "@/entities/lookup/factions";
import { lookupUnit } from "@/entities/lookup/units";
import {
  computeAllExhaustedPlanets,
  getTechSpecialties,
} from "@/utils/planets";
import {
  computePdsData,
  getTileController,
  hasTechSkips,
  hasAttachments,
} from "@/utils/tileData";
import {
  calculateArmyRankings,
  filterPlayersWithAssignedFaction,
} from "@/utils/playerUtils";
import {
  generateHexagonPoints,
  generateHexagonSides,
  generateHexagonMidpoints,
  RADIUS,
} from "@/utils/hexagonUtils";
import type {
  PlayerDataResponse,
  CapacityUsage,
  EntityData,
  BorderAnomalyInfo,
  FactionUnits,
  PlanetEntityData,
  PlayerData,
  TileUnitData,
} from "@/entities/data/types";
import { getAllEntityPlacementsForTile } from "@/utils/unitPositioning";
import { startPerformanceSpan } from "@/utils/performanceMarks";
import type {
  GameData,
  PrePlacementTile,
  Tile,
  TilePlanet,
} from "@/app/providers/context/types";

/** Vertical shift applied to every tile when the Fracture is on the map. */
const FRACTURE_Y_OFFSET = 400;

function splitEntitiesByType(entities: EntityData[]) {
  return {
    attachments: entities
      .filter((e) => e.entityType === "attachment")
      .map((e) => e.entityId),
    tokens: entities
      .filter((e) => e.entityType === "token")
      .map((e) => e.entityId),
    actionCards: entities
      .filter((e) => e.entityType === "actioncard")
      .flatMap((e) => Array.from({ length: e.count }, () => e.entityId)),
    units: entities.filter((e) => e.entityType === "unit"),
  };
}

function aggregateEntities(data: FactionUnits) {
  const allTokens: string[] = [];
  const allAttachments: string[] = [];
  const allActionCards: string[] = [];
  const allUnitsByFaction: FactionUnits = {};
  Object.entries(data).forEach(([faction, entities]) => {
    const { tokens, attachments, actionCards, units } =
      splitEntitiesByType(entities);

    allTokens.push(...tokens);
    allAttachments.push(...attachments);
    allActionCards.push(...actionCards);
    if (units.length > 0) {
      allUnitsByFaction[faction] = units;
    }
  });

  return {
    tokens: allTokens,
    attachments: allAttachments,
    actionCards: allActionCards,
    unitsByFaction: allUnitsByFaction,
  };
}

function getLargestCapacity(
  capacities: CapacityUsage[],
): CapacityUsage | undefined {
  return capacities.reduce<CapacityUsage | undefined>(
    (largest, capacity) =>
      !largest || capacity.total > largest.total ? capacity : largest,
    undefined,
  );
}

function calculateLargestCapacity(
  groundUnitsByFaction: FactionUnits,
  spaceUnitsByFaction: FactionUnits,
  players: PlayerDataResponse["playerData"],
): CapacityUsage | undefined {
  const factions = new Set([
    ...Object.keys(groundUnitsByFaction),
    ...Object.keys(spaceUnitsByFaction),
  ]);

  const capacityByFaction = [...factions].flatMap((faction) => {
    const player = players.find((candidate) => candidate.faction === faction);
    if (!player) return [];

    const groundEntities = groundUnitsByFaction[faction] ?? [];
    const spaceEntities = spaceUnitsByFaction[faction] ?? [];

    const capacity = [
      ...groundEntities,
      ...spaceEntities,
    ].reduce<CapacityUsage>(
      (total, entity) => {
        const unit = lookupUnit(entity.entityId, faction, player);
        const isGroundUnit = unit?.isGroundForce === true;
        const capacityValue = (unit?.capacityValue ?? 0) * entity.count;

        return {
          total: total.total + capacityValue,
          used:
            total.used +
            (!isGroundUnit && unit?.baseType === "fighter"
              ? (unit.capacityUsed ?? 0) * entity.count
              : 0),
          ignored:
            total.ignored +
            (unit?.baseType === "spacedock" ? capacityValue : 0),
        };
      },
      { total: 0, used: 0, ignored: 0 },
    );

    return capacity.total > 0 ? [capacity] : [];
  });

  return getLargestCapacity(capacityByFaction);
}

function buildTilePlanet(
  planetName: string,
  planetData: PlanetEntityData,
  exhausted: boolean,
): TilePlanet {
  const { tokens, unitsByFaction, attachments, actionCards } =
    aggregateEntities(planetData.entities);

  return {
    tokens,
    unitsByFaction,
    attachments,
    actionCards,
    controlledBy: planetData.controlledBy,
    commodities: planetData.commodities,
    planetaryShield: planetData.planetaryShield,
    techSpecialties: getTechSpecialties(planetName, attachments),
    exhausted,
    resources: planetData.resources,
    influence: planetData.influence,
  };
}

function resolveFactionToColor(
  playerData: PlayerData[],
  accessibleColors: boolean,
): Record<string, string> {
  const factionToColor = buildFactionToColor(playerData);
  if (!accessibleColors) return factionToColor;
  const mapping = Object.fromEntries(
    playerData
      .slice(0, ACCESSIBLE_COLOR_ORDER.length)
      .map((player, idx) => [player.faction, ACCESSIBLE_COLOR_ORDER[idx]]),
  );
  return Object.fromEntries(
    playerData.map((p) => [p.faction, mapping[p.faction] ?? p.color]),
  );
}

function mergeGroundUnits(planets: Record<string, TilePlanet>): FactionUnits {
  const groundUnitsByFaction: FactionUnits = {};
  for (const planet of Object.values(planets)) {
    for (const [faction, units] of Object.entries(planet.unitsByFaction)) {
      groundUnitsByFaction[faction] = [
        ...(groundUnitsByFaction[faction] ?? []),
        ...units,
      ];
    }
  }
  return groundUnitsByFaction;
}

function tileProperties(
  position: string,
  ringCount: number,
  fractureYOffset: number,
): Tile["properties"] {
  const coordinates = calculateSingleTilePosition(
    position,
    ringCount,
    fractureYOffset,
  );
  const points = generateHexagonPoints(coordinates.x, coordinates.y, RADIUS);
  return {
    x: coordinates.x,
    y: coordinates.y,
    hexOutline: {
      points,
      sides: generateHexagonSides(points),
      midpoints: generateHexagonMidpoints(points),
    },
  };
}

type TileBuildContext = {
  ringCount: number;
  fractureYOffset: number;
  playerData: PlayerData[];
  exhaustedPlanets: Set<string>;
  borderAnomaliesByTile: Record<string, BorderAnomalyInfo[]>;
};

function buildPlanets(
  planetData: TileUnitData["planets"],
  exhaustedPlanets: Set<string>,
): Record<string, TilePlanet> {
  return Object.fromEntries(
    Object.entries(planetData).map(([planetName, data]) => [
      planetName,
      buildTilePlanet(planetName, data, exhaustedPlanets.has(planetName)),
    ]),
  );
}

function buildPrePlacementTile(
  position: string,
  systemId: string,
  tileData: TileUnitData,
  context: TileBuildContext,
): PrePlacementTile {
  const { tokens, unitsByFaction: spaceUnitsByFaction } = aggregateEntities(
    tileData.space,
  );
  const planets = buildPlanets(tileData.planets, context.exhaustedPlanets);

  return {
    hasAnomaly: tileData.anomaly,
    properties: tileProperties(
      position,
      context.ringCount,
      context.fractureYOffset,
    ),
    position,
    systemId,
    tokens,
    unitsByFaction: spaceUnitsByFaction,
    planets,
    commandCounters: tileData.ccs ?? [],
    highestProduction: Math.max(...Object.values(tileData.production)),
    largestCapacity:
      getLargestCapacity(Object.values(tileData.capacity ?? {})) ??
      calculateLargestCapacity(
        mergeGroundUnits(planets),
        spaceUnitsByFaction,
        context.playerData,
      ),
    hasTechSkips: hasTechSkips(planets),
    hasAttachments: hasAttachments(planets),
    controlledBy: getTileController(planets, spaceUnitsByFaction),
    borderAnomalies: context.borderAnomaliesByTile[position],
  };
}

function placeTileEntities(tile: PrePlacementTile): Tile {
  const endTilePlacementMeasure = startPerformanceSpan("ti4.tilePlacement", {
    position: tile.position,
    systemId: tile.systemId,
    spaceFactionCount: Object.keys(tile.unitsByFaction).length,
    planetCount: Object.keys(tile.planets).length,
    tokenCount: tile.tokens.length,
    commandCounterCount: tile.commandCounters.length,
  });
  const entityPlacements = getAllEntityPlacementsForTile(tile.systemId, tile);
  endTilePlacementMeasure({
    placementCount: entityPlacements.length,
  });
  return { ...tile, entityPlacements };
}

export function buildGameContext(
  data: PlayerDataResponse,
  accessibleColors: boolean,
  decalOverrides: Record<string, string> = {},
): GameData {
  const endBuildGameContextMeasure = startPerformanceSpan(
    "ti4.buildGameContext",
    {
      gameName: data.gameName,
      tileUnitDataCount: Object.keys(data.tileUnitData ?? {}).length,
      playerCount: data.playerData?.length ?? 0,
      accessibleColors,
      decalOverrideCount: Object.keys(decalOverrides).length,
    },
  );
  const playerData = filterPlayersWithAssignedFaction(data.playerData);

  const factionToColor = resolveFactionToColor(playerData, accessibleColors);
  const optimizedColors = computeOptimizedColors(factionToColor);
  const factionColorMap = buildFactionColorMap(
    data,
    optimizedColors,
    accessibleColors,
  );

  const originalFactionColorMap = buildFactionColorMap(
    data,
    optimizedColors,
    false,
  );

  const factionImageMap = buildFactionImageMap(playerData);

  const { tilesWithPds, pdsByTile } = computePdsData(data, factionToColor);
  const allExhaustedPlanets = new Set(computeAllExhaustedPlanets(data));
  const calculatedTilePositions = data.tilePositions
    ? calculateTilePositions(data.tilePositions, data.ringCount)
    : [];

  const armyRankings = calculateArmyRankings(playerData);

  const playerDataWithOverrides = playerData.map((player) => {
    const overrideDecalId = decalOverrides[player.faction];
    if (overrideDecalId === undefined) return player;
    return { ...player, decalId: overrideDecalId || player.decalId };
  });

  const posToSystemId = Object.fromEntries(
    data.tilePositions.map((pos) => {
      const [position, systemId] = pos.split(":");
      return [position, systemId];
    }),
  );

  const borderAnomaliesByTile: Record<string, BorderAnomalyInfo[]> = {};
  for (const anomaly of data.borderAnomalies ?? []) {
    (borderAnomaliesByTile[anomaly.tile] ??= []).push(anomaly);
  }

  const tileContext: TileBuildContext = {
    ringCount: data.ringCount,
    fractureYOffset:
      data.tilePositions && isFractureInPlay(data.tilePositions)
        ? FRACTURE_Y_OFFSET
        : 0,
    playerData,
    exhaustedPlanets: allExhaustedPlanets,
    borderAnomaliesByTile,
  };

  const tiles: Record<string, Tile> = {};
  const planetIdToPlanetTile: Record<string, TilePlanet> = {};

  Object.entries(data.tileUnitData).forEach(([position, tileData]) => {
    // The "special" tile holds off-map planets (triad, custodiavigilia, etc.).
    if (position === "special") {
      Object.assign(
        planetIdToPlanetTile,
        buildPlanets(tileData.planets, allExhaustedPlanets),
      );
      return;
    }
    tiles[position] = placeTileEntities(
      buildPrePlacementTile(
        position,
        posToSystemId[position],
        tileData,
        tileContext,
      ),
    );
  });

  Object.values(tiles).forEach((tile) => {
    Object.entries(tile.planets).forEach(([planetId, planet]) => {
      planetIdToPlanetTile[planetId] = planet;
    });
  });

  const gameContext = {
    tiles,
    tilePositions: data.tilePositions,
    factionColorMap,
    originalFactionColorMap,
    factionImageMap,
    tilesWithPds,
    pdsByTile,
    armyRankings,
    playerData: playerDataWithOverrides,
    objectives: data.objectives,
    lawsInPlay: data.lawsInPlay,
    strategyCards: data.strategyCards,
    strategyCardIdMap: data.strategyCardIdMap,
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
    planetIdToPlanetTile,
    isTwilightsFallMode: data.isTwilightsFallMode,
  };

  endBuildGameContextMeasure({
    tileCount: Object.keys(tiles).length,
    planetCount: Object.keys(planetIdToPlanetTile).length,
  });

  return gameContext;
}
