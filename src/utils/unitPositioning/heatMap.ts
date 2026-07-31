import { gridToPixel, calculateDistance } from "./coordinateUtils";
import { Planet, HeatSource, UpdateCostMapOptions } from "./types";

type CostMapAccumulatorOptions = Omit<
  UpdateCostMapOptions,
  "currentFaction" | "heatSources" | "rimClearance"
> & {
  currentFactions: string[];
  initialHeatSources: HeatSource[];
};

export type CostMapAccumulator = {
  addHeatSource: (source: HeatSource) => void;
  findOptimalSquare: (
    currentFaction: string,
    rimClearance: number,
  ) => { square: { row: number; col: number }; cost: number } | null;
  createCostMap: () => number[][];
};

type GridGeometry = {
  validCells: Uint8Array;
  squareXs: Float64Array;
  squareYs: Float64Array;
  rimDistances: Float64Array;
};

const MAX_CACHED_GRID_GEOMETRIES = 8;
const gridGeometryCache = new Map<string, GridGeometry>();

export const calculatePlanetHeat = (
  squareX: number,
  squareY: number,
  planets: Planet[],
  decayRate: number,
  maxHeat: number,
): number => {
  if (planets.length === 0) return 0;

  let totalHeat = 0;
  for (const planet of planets) {
    const distance = calculateDistance(squareX, squareY, planet.x, planet.y);
    totalHeat += maxHeat * Math.exp(-decayRate * distance);
  }
  return totalHeat;
};

const calculateRimDistance = (
  squareX: number,
  squareY: number,
  rimSquares: { row: number; col: number }[],
  squareWidth: number,
  squareHeight: number,
): number => {
  if (rimSquares.length === 0) return Infinity;

  let minRimDistance = Infinity;
  for (const rimSquare of rimSquares) {
    const { x: rimX, y: rimY } = gridToPixel(
      rimSquare,
      squareWidth,
      squareHeight,
    );
    const distance = calculateDistance(squareX, squareY, rimX, rimY);
    minRimDistance = Math.min(minRimDistance, distance);
  }

  return minRimDistance;
};

const calculateRimHeat = (
  rimDistance: number,
  decayRate: number,
  rimMaxHeat: number,
): number => {
  return rimDistance < Infinity
    ? rimMaxHeat * Math.exp(-decayRate * rimDistance)
    : 0;
};

export const calculateUnitHeat = (
  squareX: number,
  squareY: number,
  heatSources: HeatSource[],
  hasMultipleFactions: boolean,
  currentFaction: string | undefined,
  entityDecayRate: number,
  factionDecayRate: number,
  unitHeat: number,
  factionRepulsionHeat: number,
  stackSizeMultiplier: number,
): number => {
  if (heatSources.length === 0) return 0;

  let totalHeat = 0;
  for (const unitSource of heatSources) {
    const distance = Math.max(
      0,
      calculateDistance(squareX, squareY, unitSource.x, unitSource.y) -
        (unitSource.clearance ?? 0),
    );

    const stackHeatMultiplier = 1 + stackSizeMultiplier * unitSource.stackSize;

    const isOpposingFaction =
      hasMultipleFactions &&
      currentFaction &&
      unitSource.faction !== undefined &&
      unitSource.faction !== currentFaction;

    const baseHeat = isOpposingFaction
      ? factionRepulsionHeat *
        stackHeatMultiplier *
        Math.exp(-factionDecayRate * distance)
      : unitHeat * stackHeatMultiplier * Math.exp(-entityDecayRate * distance);

    totalHeat += baseHeat * (unitSource.strength ?? 1);
  }
  return totalHeat;
};

export const updateCostMap = ({
  gridSize,
  squareWidth,
  squareHeight,
  factionEntities,
  existingCostMap,
  heatConfig,
  repellantPlanets = [],
  rimSquares = [],
  heatSources = [],
  currentFaction,
  rimClearance,
}: UpdateCostMapOptions): number[][] => {
  const costMap = existingCostMap.map((row) => [...row]);
  const hasHeatSources =
    repellantPlanets.length > 0 ||
    rimSquares.length > 0 ||
    heatSources.length > 0;
  if (!hasHeatSources) return costMap;

  const hasMultipleFactions = Object.keys(factionEntities).length > 1;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (costMap[row][col] === -1) continue;
      const squareX = col * squareWidth + squareWidth / 2;
      const squareY = row * squareHeight + squareHeight / 2;
      const rimDistance = calculateRimDistance(
        squareX,
        squareY,
        rimSquares,
        squareWidth,
        squareHeight,
      );
      if (rimDistance < rimClearance) {
        costMap[row][col] = -1;
        continue;
      }
      const planetHeat = calculatePlanetHeat(
        squareX,
        squareY,
        repellantPlanets,
        heatConfig.planetDecayRate,
        heatConfig.maxHeat,
      );
      const rimHeat = calculateRimHeat(
        rimDistance,
        heatConfig.rimDecayRate,
        heatConfig.rimMaxHeat,
      );
      const unitHeat = calculateUnitHeat(
        squareX,
        squareY,
        heatSources,
        hasMultipleFactions,
        currentFaction,
        heatConfig.unitDecayRate,
        heatConfig.factionDecayRate,
        heatConfig.unitHeat,
        heatConfig.factionRepulsionHeat,
        heatConfig.stackSizeMultiplier,
      );

      const totalHeat = planetHeat + rimHeat + unitHeat;
      costMap[row][col] = totalHeat < 1 ? 0 : Math.round(totalHeat);
    }
  }

  return costMap;
};

export function createCostMapAccumulator({
  gridSize,
  squareWidth,
  squareHeight,
  factionEntities,
  existingCostMap,
  heatConfig,
  repellantPlanets = [],
  rimSquares = [],
  currentFactions,
  initialHeatSources,
}: CostMapAccumulatorOptions): CostMapAccumulator {
  const cellCount = gridSize * gridSize;
  const { validCells, squareXs, squareYs, rimDistances } = getGridGeometry(
    gridSize,
    squareWidth,
    squareHeight,
    existingCostMap,
    rimSquares,
  );
  const staticHeat = new Float64Array(cellCount);
  const finalUnitHeat = new Float64Array(cellCount);
  const factions = [...new Set(currentFactions)];
  const factionFields = factions.map((faction) => ({
    faction,
    heat: new Float64Array(cellCount),
  }));
  const factionUnitHeat = new Map(
    factionFields.map(({ faction, heat }) => [faction, heat]),
  );
  const hasMultipleFactions = Object.keys(factionEntities).length > 1;

  for (let index = 0; index < cellCount; index++) {
    if (validCells[index] === 0) continue;
    staticHeat[index] =
      calculatePlanetHeat(
        squareXs[index],
        squareYs[index],
        repellantPlanets,
        heatConfig.planetDecayRate,
        heatConfig.maxHeat,
      ) +
      calculateRimHeat(
        rimDistances[index],
        heatConfig.rimDecayRate,
        heatConfig.rimMaxHeat,
      );
  }

  const addHeatSource = (source: HeatSource) => {
    const stackHeatMultiplier =
      1 + heatConfig.stackSizeMultiplier * source.stackSize;
    const strength = source.strength ?? 1;
    const hasOpponentHeat = hasMultipleFactions && source.faction !== undefined;

    for (let index = 0; index < cellCount; index++) {
      if (validCells[index] === 0) continue;

      const distance = Math.max(
        0,
        calculateDistance(
          squareXs[index],
          squareYs[index],
          source.x,
          source.y,
        ) - (source.clearance ?? 0),
      );
      const unitHeat =
        heatConfig.unitHeat *
        stackHeatMultiplier *
        Math.exp(-heatConfig.unitDecayRate * distance) *
        strength;
      const opponentHeat = hasOpponentHeat
        ? heatConfig.factionRepulsionHeat *
          stackHeatMultiplier *
          Math.exp(-heatConfig.factionDecayRate * distance) *
          strength
        : unitHeat;

      finalUnitHeat[index] += unitHeat;
      for (const field of factionFields) {
        field.heat[index] +=
          hasOpponentHeat && field.faction !== source.faction
            ? opponentHeat
            : unitHeat;
      }
    }
  };

  // Preserve source order so accumulated floating-point heat stays identical
  // to the full evaluator.
  for (const source of initialHeatSources) addHeatSource(source);

  const costAt = (
    index: number,
    unitHeat: Float64Array,
    rimClearance: number,
  ): number => {
    if (validCells[index] === 0 || rimDistances[index] < rimClearance) {
      return -1;
    }

    const totalHeat = staticHeat[index] + unitHeat[index];
    return totalHeat < 1 ? 0 : Math.round(totalHeat);
  };

  return {
    addHeatSource,
    findOptimalSquare(currentFaction, rimClearance) {
      const unitHeat = factionUnitHeat.get(currentFaction)!;
      let lowestCost = Infinity;
      let bestSquare: { row: number; col: number } | null = null;

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const cost = costAt(row * gridSize + col, unitHeat, rimClearance);
          if (cost === -1 || cost >= lowestCost) continue;
          lowestCost = cost;
          bestSquare = { row, col };
        }
      }

      return bestSquare ? { square: bestSquare, cost: lowestCost } : null;
    },
    createCostMap() {
      return Array.from({ length: gridSize }, (_, row) =>
        Array.from({ length: gridSize }, (_, col) =>
          costAt(row * gridSize + col, finalUnitHeat, 0),
        ),
      );
    },
  };
}

function getGridGeometry(
  gridSize: number,
  squareWidth: number,
  squareHeight: number,
  existingCostMap: number[][],
  rimSquares: { row: number; col: number }[],
): GridGeometry {
  const key = [
    gridSize,
    squareWidth,
    squareHeight,
    existingCostMap
      .map((row) => row.map((value) => Number(value !== -1)).join(""))
      .join(""),
    rimSquares.map(({ row, col }) => `${row},${col}`).join(";"),
  ].join("|");
  const cached = gridGeometryCache.get(key);
  if (cached) return cached;

  const cellCount = gridSize * gridSize;
  const geometry: GridGeometry = {
    validCells: new Uint8Array(cellCount),
    squareXs: new Float64Array(cellCount),
    squareYs: new Float64Array(cellCount),
    rimDistances: new Float64Array(cellCount),
  };

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (existingCostMap[row][col] === -1) continue;

      const index = row * gridSize + col;
      const squareX = col * squareWidth + squareWidth / 2;
      const squareY = row * squareHeight + squareHeight / 2;
      geometry.validCells[index] = 1;
      geometry.squareXs[index] = squareX;
      geometry.squareYs[index] = squareY;
      geometry.rimDistances[index] = calculateRimDistance(
        squareX,
        squareY,
        rimSquares,
        squareWidth,
        squareHeight,
      );
    }
  }

  if (gridGeometryCache.size >= MAX_CACHED_GRID_GEOMETRIES) {
    const oldestKey = gridGeometryCache.keys().next().value;
    if (oldestKey !== undefined) gridGeometryCache.delete(oldestKey);
  }
  gridGeometryCache.set(key, geometry);
  return geometry;
}
