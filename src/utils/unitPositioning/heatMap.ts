import { gridToPixel, calculateDistance } from "./coordinateUtils";
import { Planet, HeatSource, UpdateCostMapOptions } from "./types";

export const calculatePlanetHeat = (
  squareX: number,
  squareY: number,
  planets: Planet[],
  decayRate: number,
  maxHeat: number
): number => {
  if (planets.length === 0) return 0;

  let totalHeat = 0;
  for (const planet of planets) {
    const distance = calculateDistance(squareX, squareY, planet.x, planet.y);
    totalHeat += maxHeat * Math.exp(-decayRate * distance);
  }
  return totalHeat;
};

export const calculateRimHeat = (
  squareX: number,
  squareY: number,
  rimSquares: { row: number; col: number }[],
  squareWidth: number,
  squareHeight: number,
  decayRate: number,
  rimMaxHeat: number
): number => {
  if (rimSquares.length === 0) return 0;

  let minRimDistance = Infinity;
  for (const rimSquare of rimSquares) {
    const { x: rimX, y: rimY } = gridToPixel(
      rimSquare,
      squareWidth,
      squareHeight
    );
    const distance = calculateDistance(squareX, squareY, rimX, rimY);
    minRimDistance = Math.min(minRimDistance, distance);
  }

  return minRimDistance < Infinity
    ? rimMaxHeat * Math.exp(-decayRate * minRimDistance)
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
  stackSizeMultiplier: number
): number => {
  if (heatSources.length === 0) return 0;

  let totalHeat = 0;
  for (const unitSource of heatSources) {
    const distance = calculateDistance(
      squareX,
      squareY,
      unitSource.x,
      unitSource.y
    );

    const stackHeatMultiplier = 1 + stackSizeMultiplier * unitSource.stackSize;

    const isOpposingFaction =
      hasMultipleFactions &&
      currentFaction &&
      unitSource.faction !== currentFaction;

    const heat = isOpposingFaction
      ? factionRepulsionHeat *
        stackHeatMultiplier *
        Math.exp(-factionDecayRate * distance)
      : unitHeat * stackHeatMultiplier * Math.exp(-entityDecayRate * distance);

    totalHeat += heat;
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
      const planetHeat = calculatePlanetHeat(
        squareX,
        squareY,
        repellantPlanets,
        heatConfig.planetDecayRate,
        heatConfig.maxHeat
      );
      const rimHeat = calculateRimHeat(
        squareX,
        squareY,
        rimSquares,
        squareWidth,
        squareHeight,
        heatConfig.rimDecayRate,
        heatConfig.rimMaxHeat
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
        heatConfig.stackSizeMultiplier
      );

      const totalHeat = planetHeat + rimHeat + unitHeat;
      costMap[row][col] = totalHeat < 1 ? 0 : Math.round(totalHeat);
    }
  }

  return costMap;
};
