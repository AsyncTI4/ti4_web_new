import {
  calculateSingleTilePosition,
  calculateTilePositions,
  isFractureInPlay,
} from "@/mapgen/tilePositioning";
import {
  buildFactionToColor,
  computeOptimizedColors,
  buildFactionColorMap,
} from "@/utils/colorOptimization";
import { buildFactionImageMap } from "@/lookup/factions";
import {
  computeAllExhaustedPlanets,
  getTechSpecialties,
} from "@/utils/planets";
import {
  computePdsData,
  getTileController,
  hasTechSkips,
} from "@/utils/tileDistances";
import { calculateArmyRankings } from "@/utils/playerUtils";
import {
  generateHexagonPoints,
  generateHexagonSides,
  generateHexagonMidpoints,
  RADIUS,
} from "@/utils/hexagonUtils";
import { PlayerDataResponse, EntityData, BorderAnomalyInfo } from "@/data/types";
import { getAllEntityPlacementsForTile } from "@/utils/unitPositioning";
import type { GameData, Tile, TilePlanet } from "@/context/types";

function splitEntitiesByType(entities: EntityData[]) {
  return {
    attachments: entities
      .filter((e) => e.entityType === "attachment")
      .map((e) => e.entityId),
    tokens: entities
      .filter((e) => e.entityType === "token")
      .map((e) => e.entityId),
    unitsByFaction: entities.filter((e) => e.entityType === "unit"),
  };
}

function aggregateEntities(data: Record<string, EntityData[]>) {
  const allTokens: string[] = [];
  const allAttachments: string[] = [];
  const allUnitsByFaction: Record<string, EntityData[]> = {};
  Object.entries(data).forEach(([faction, entities]) => {
    const { tokens, attachments, unitsByFaction } =
      splitEntitiesByType(entities);

    allTokens.push(...tokens);
    allAttachments.push(...attachments);
    if (unitsByFaction.length > 0) {
      allUnitsByFaction[faction] = unitsByFaction;
    }
  });

  return {
    tokens: allTokens,
    attachments: allAttachments,
    unitsByFaction: allUnitsByFaction,
  };
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
    const mapping = Object.fromEntries(
      playerData
        .slice(0, accessibleOrder.length)
        .map((player, idx) => [player.faction, accessibleOrder[idx]])
    );

    factionToColor = Object.fromEntries(
      playerData.map((p) => [p.faction, mapping[p.faction] ?? p.color])
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
  const allExhaustedPlanets = new Set(computeAllExhaustedPlanets(data));
  const calculatedTilePositions = data.tilePositions
    ? calculateTilePositions(data.tilePositions, data.ringCount)
    : [];

  const armyRankings = calculateArmyRankings(playerData);

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

  const posToSystemId = data.tilePositions?.reduce(
    (acc, pos) => {
      const [position, systemId] = pos.split(":");
      acc[position] = systemId;
      return acc;
    },
    {} as Record<string, string>
  );

  // Build map of border anomalies by tile position
  const borderAnomaliesByTile: Record<string, BorderAnomalyInfo[]> = {};
  if (data.borderAnomalies) {
    for (const anomaly of data.borderAnomalies) {
      if (!borderAnomaliesByTile[anomaly.tile]) {
        borderAnomaliesByTile[anomaly.tile] = [];
      }
      borderAnomaliesByTile[anomaly.tile].push(anomaly);
    }
  }

  const fractureYbump =
    data.tilePositions && isFractureInPlay(data.tilePositions) ? 400 : 0;

  const tiles: Record<string, Tile> = {};
  const planetIdToPlanetTile: Record<string, TilePlanet> = {};

  Object.entries(data.tileUnitData).forEach(([position, tileData]) => {
    // Process "special" tile separately - it contains off-tile planets (triad, custodiavigilia, etc.)
    if (position === "special") {
      Object.entries(tileData.planets).forEach(([planetName, planetData]) => {
        const { tokens, unitsByFaction, attachments } = aggregateEntities(
          planetData.entities
        );

        const exhausted = allExhaustedPlanets.has(planetName);
        const planetTile: TilePlanet = {
          tokens,
          unitsByFaction,
          attachments,
          controlledBy: planetData.controlledBy,
          commodities: planetData.commodities,
          planetaryShield: planetData.planetaryShield,
          techSpecialties: getTechSpecialties(planetName, attachments),
          exhausted,
          resources: planetData.resources,
          influence: planetData.influence,
        };

        // Add planets from special tile to the planet mapping
        planetIdToPlanetTile[planetName] = planetTile;
      });
      return;
    }

    const { tokens, unitsByFaction } = aggregateEntities(tileData.space);

    const planets: Record<string, TilePlanet> = {};
    Object.entries(tileData.planets).forEach(([planetName, planetData]) => {
      const { tokens, unitsByFaction, attachments } = aggregateEntities(
        planetData.entities
      );

      const exhausted = allExhaustedPlanets.has(planetName);
      planets[planetName] = {
        tokens,
        unitsByFaction,
        attachments,
        controlledBy: planetData.controlledBy,
        commodities: planetData.commodities,
        planetaryShield: planetData.planetaryShield,
        techSpecialties: getTechSpecialties(planetName, attachments),
        exhausted,
        resources: planetData.resources,
        influence: planetData.influence,
      };
    });

    const coordinates = calculateSingleTilePosition(
      position,
      data.ringCount,
      fractureYbump
    );
    const points = generateHexagonPoints(coordinates.x, coordinates.y, RADIUS);
    const properties = {
      x: coordinates.x,
      y: coordinates.y,
      hexOutline: {
        points: points,
        sides: generateHexagonSides(points),
        midpoints: generateHexagonMidpoints(points),
      },
      width: 0,
      height: 0,
    };

    const systemId = posToSystemId[position];

    const tile = {
      hasAnomaly: tileData.anomaly,
      properties,
      position,
      systemId,
      tokens,
      unitsByFaction,
      planets,
      commandCounters: tileData.ccs ?? [],
      highestProduction: Math.max(...Object.values(tileData.production)),
      hasTechSkips: hasTechSkips(planets),
      controlledBy: getTileController(planets, unitsByFaction),
      borderAnomalies: borderAnomaliesByTile[position],
    };

    const entityPlacements = getAllEntityPlacementsForTile(systemId, tile);

    tiles[position] = {
      ...tile,
      entityPlacements,
    };
  });

  // Add planets from regular tiles to the planet mapping
  Object.values(tiles).forEach((tile) => {
    Object.entries(tile.planets).forEach(([planetId, planet]) => {
      planetIdToPlanetTile[planetId] = planet;
    });
  });

  return {
    tiles,
    tilePositions: data.tilePositions,
    factionColorMap,
    originalFactionColorMap,
    factionImageMap,
    tilesWithPds,
    dominantPdsFaction,
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
  };
}
