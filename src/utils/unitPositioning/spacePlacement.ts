import { CapacityUsage, EntityData, FactionUnits } from "@/entities/data/types";
import {
  SPACE_HEAT_CONFIG,
  FIGHTER_OFFSET_COLUMNS,
  SPACE_PLANET_NAME_HEAT_STRENGTH,
} from "./constants";
import { initializeSpaceCostMap } from "./costMap";
import { getEntityStackSize } from "./entitySorting";
import { updateCostMap } from "./heatMap";
import { placeEntitiesWithCostMap } from "./placement";
import {
  PlaceSpaceEntitiesOptions,
  EntityStack,
  GridSquare,
  HeatSource,
} from "./types";
import { parsePlanetsFromCoords } from "./coordinateUtils";
import {
  calculateSystemIndicatorLayout,
  createPlanetInfoHeatSources,
  GridDimensions,
  createHeatSourceFromSquare,
  createHeatSourceFromCoords,
  createPlacementFromSquare,
  tokenToEntityStack,
  findEdgeSquare,
  IndicatorPlacement,
} from "./placementHelpers";

const FIGHTER_ID = "ff";
const THUNDERS_EDGE_TOKEN = "thundersedge";
/** Heat-source stack sizes reserving room around fixed system furniture. */
const PRODUCTION_INDICATOR_HEAT = 0.5;
const CAPACITY_INDICATOR_HEAT = 2;
const COMMAND_COUNTER_HEAT = 0.5;

type FighterStack = {
  faction: string;
  fighterStack: EntityData;
};

const extractFighterStacks = (
  factionEntities: FactionUnits,
): FighterStack[] => {
  return Object.entries(factionEntities).flatMap(([faction, entities]) => {
    const fighterStack = entities.find((e) => e.entityId === FIGHTER_ID);
    return fighterStack && fighterStack.count > 0
      ? [{ faction, fighterStack }]
      : [];
  });
};

const placeFighterAt = (
  fighter: FighterStack,
  position: "rightmost" | "leftmost",
  costMap: number[][],
  rimSquares: GridSquare[],
  grid: GridDimensions,
): { placement: EntityStack; heatSource: HeatSource } | null => {
  const square = findEdgeSquare(
    costMap,
    rimSquares,
    grid.gridSize,
    position,
    FIGHTER_OFFSET_COLUMNS,
  );
  if (!square) return null;

  const stackSize = getEntityStackSize(
    fighter.fighterStack.entityId,
    fighter.fighterStack.count,
  );

  return {
    placement: createPlacementFromSquare(
      square,
      grid,
      fighter.fighterStack,
      fighter.faction,
    ),
    heatSource: createHeatSourceFromSquare(
      square,
      grid,
      stackSize,
      fighter.faction,
    ),
  };
};

const removeFightersFromEntities = (
  factionEntities: FactionUnits,
  placedFighterFactions: string[],
): FactionUnits => {
  return Object.fromEntries(
    Object.entries(factionEntities).map(([faction, entities]) => [
      faction,
      placedFighterFactions.includes(faction)
        ? entities.filter((e) => e.entityId !== FIGHTER_ID)
        : [...entities],
    ]),
  );
};

const preplaceFighters = (
  factionEntities: FactionUnits,
  costMap: number[][],
  rimSquares: GridSquare[],
  grid: GridDimensions,
): {
  placements: EntityStack[];
  heatSources: HeatSource[];
  remainingEntities: FactionUnits;
} => {
  const fighters = extractFighterStacks(factionEntities);
  const positions = ["rightmost", "leftmost"] as const;

  const results = fighters
    .slice(0, 2)
    .map((fighter, index) =>
      placeFighterAt(fighter, positions[index], costMap, rimSquares, grid),
    )
    .filter((result): result is NonNullable<typeof result> => result !== null);

  const placements = results.map((r) => r.placement);
  const heatSources = results.map((r) => r.heatSource);
  const placedFactions = placements.map((p) => p.faction);

  return {
    placements,
    heatSources,
    remainingEntities: removeFightersFromEntities(
      factionEntities,
      placedFactions,
    ),
  };
};

const createIndicatorHeatSource = (
  placement: IndicatorPlacement,
  stackSize: number,
): HeatSource =>
  createHeatSourceFromCoords(
    placement.x + placement.width / 2,
    placement.y + placement.height / 2,
    stackSize,
  );

const preplaceSystemIndicatorHeatSources = (
  systemId: string | undefined,
  highestProduction: number | undefined,
  largestCapacity: CapacityUsage | undefined,
  hasCrowdedRim: boolean,
): HeatSource[] => {
  const hasProduction =
    highestProduction !== undefined && highestProduction > 0;
  const hasCapacity =
    largestCapacity !== undefined && largestCapacity.total > 0;
  if (!systemId || (!hasProduction && !hasCapacity)) return [];

  const layout = calculateSystemIndicatorLayout(
    parsePlanetsFromCoords(systemId),
    hasCrowdedRim,
  );
  const capacityPlacement = hasProduction
    ? layout.capacity.withProduction
    : layout.capacity.solo;

  return [
    ...(hasProduction
      ? [createIndicatorHeatSource(layout.production, PRODUCTION_INDICATOR_HEAT)]
      : []),
    ...(hasCapacity
      ? [createIndicatorHeatSource(capacityPlacement, CAPACITY_INDICATOR_HEAT)]
      : []),
  ];
};

const preplaceCommandCounterHeatSource = (
  costMap: number[][],
  rimSquares: GridSquare[],
  grid: GridDimensions,
  hasCommandCounters: boolean,
): HeatSource | null => {
  if (!hasCommandCounters) return null;

  const square = findEdgeSquare(costMap, rimSquares, grid.gridSize, "leftmost");
  if (!square) return null;

  return createHeatSourceFromSquare(square, grid, COMMAND_COUNTER_HEAT);
};

const preplaceThundersEdge = (
  tokens: string[],
  grid: GridDimensions,
): {
  placement: EntityStack | null;
  heatSource: HeatSource | null;
} => {
  if (!tokens.includes(THUNDERS_EDGE_TOKEN)) {
    return { placement: null, heatSource: null };
  }

  const center = Math.floor(grid.gridSize / 2);
  const square = { row: center, col: center };
  const entityData: EntityData = {
    entityId: THUNDERS_EDGE_TOKEN,
    entityType: "token",
    count: 1,
  };
  const stackSize = getEntityStackSize(THUNDERS_EDGE_TOKEN, 1);

  return {
    placement: createPlacementFromSquare(square, grid, entityData, "neutral"),
    heatSource: createHeatSourceFromSquare(square, grid, stackSize, "neutral"),
  };
};

export const placeSpaceEntities = ({
  gridSize,
  squareWidth,
  squareHeight,
  hexagonVertices,
  planets,
  tokens,
  factionEntities,
  initialHeatSources = [],
  commandCounters = [],
  systemId,
  highestProduction,
  largestCapacity,
  hasCrowdedRim = false,
}: PlaceSpaceEntitiesOptions) => {
  const grid: GridDimensions = { gridSize, squareWidth, squareHeight };

  const { costMap: initialCostMap, rimSquares } = initializeSpaceCostMap(
    gridSize,
    squareWidth,
    squareHeight,
    hexagonVertices,
  );

  const commandCounterHeatSource = preplaceCommandCounterHeatSource(
    initialCostMap,
    rimSquares,
    grid,
    commandCounters.length > 0,
  );

  const indicatorHeatSources = preplaceSystemIndicatorHeatSources(
    systemId,
    highestProduction,
    largestCapacity,
    hasCrowdedRim,
  );

  const {
    placement: thundersEdgePlacement,
    heatSource: thundersEdgeHeatSource,
  } = preplaceThundersEdge(tokens, grid);

  const planetInfoHeatSources = planets.flatMap((planet) =>
    createPlanetInfoHeatSources(planet, SPACE_PLANET_NAME_HEAT_STRENGTH),
  );
  const fixedHeatSources = [
    ...initialHeatSources,
    ...planetInfoHeatSources,
    ...(commandCounterHeatSource ? [commandCounterHeatSource] : []),
    ...indicatorHeatSources,
    ...(thundersEdgeHeatSource ? [thundersEdgeHeatSource] : []),
  ];
  const fighterCostMap = updateCostMap({
    gridSize,
    squareWidth,
    squareHeight,
    factionEntities,
    existingCostMap: initialCostMap,
    heatConfig: SPACE_HEAT_CONFIG,
    repellantPlanets: [],
    rimSquares: [],
    heatSources: [...indicatorHeatSources, ...planetInfoHeatSources],
    currentFaction: undefined,
    rimClearance: 0,
  });

  const {
    placements: fighterPlacements,
    heatSources: fighterHeatSources,
    remainingEntities,
  } = preplaceFighters(factionEntities, fighterCostMap, rimSquares, grid);

  const allHeatSources = [...fixedHeatSources, ...fighterHeatSources];

  const tokenEntities = tokens
    .filter((t) => t !== THUNDERS_EDGE_TOKEN)
    .map((token) => tokenToEntityStack(token, "neutral"));

  const { entityPlacements: heatMapPlacements, finalCostMap } =
    placeEntitiesWithCostMap({
      gridSize,
      squareWidth,
      squareHeight,
      initialCostMap,
      rimSquares,
      repellantPlanets: planets,
      factionEntities: {
        ...remainingEntities,
        neutral: [...(remainingEntities.neutral ?? []), ...tokenEntities],
      },
      heatConfig: SPACE_HEAT_CONFIG,
      initialHeatSources: allHeatSources,
    });

  const allPlacements = [
    ...(thundersEdgePlacement ? [thundersEdgePlacement] : []),
    ...fighterPlacements,
    ...heatMapPlacements,
  ];

  return {
    entityPlacements: allPlacements,
    finalCostMap,
  };
};
