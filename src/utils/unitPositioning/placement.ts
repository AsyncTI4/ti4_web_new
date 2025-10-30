import { gridToPixel } from "./coordinateUtils";
import { findOptimalSquareGreedy } from "./costMap";
import { createSortedEntityStacks, createHeatSource } from "./entitySorting";
import { updateCostMap } from "./heatMap";
import { PlaceEntitiesOptions, EntityStack, HeatSource } from "./types";

export const placeEntitiesWithCostMap = ({
  gridSize,
  squareWidth,
  squareHeight,
  initialCostMap,
  rimSquares,
  repellantPlanets,
  factionEntities,
  heatConfig,
  initialHeatSources = [],
  controller,
}: PlaceEntitiesOptions) => {
  const heatSources: HeatSource[] = [...initialHeatSources];
  const entityPlacements: EntityStack[] = [];
  const sortedStacks = createSortedEntityStacks(factionEntities, controller);

  for (const stack of sortedStacks) {
    const currentCostMap = updateCostMap({
      gridSize,
      squareWidth,
      squareHeight,
      repellantPlanets,
      factionEntities,
      existingCostMap: initialCostMap,
      rimSquares,
      heatSources: heatSources,
      currentFaction: stack.faction,
      heatConfig,
    });
    const optimalResult = findOptimalSquareGreedy(currentCostMap, gridSize);
    if (!optimalResult) continue;

    const { x, y } = gridToPixel(
      optimalResult.square,
      squareWidth,
      squareHeight
    );

    entityPlacements.push({
      ...stack,
      x,
      y,
    });

    heatSources.push(
      createHeatSource(optimalResult, stack, squareWidth, squareHeight)
    );
  }

  const finalCostMap = updateCostMap({
    gridSize,
    squareWidth,
    squareHeight,
    repellantPlanets,
    factionEntities,
    existingCostMap: initialCostMap,
    rimSquares,
    heatSources: heatSources,
    currentFaction: undefined,
    heatConfig,
  });

  return { entityPlacements, finalCostMap };
};
