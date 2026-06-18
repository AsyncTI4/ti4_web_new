import { gridToPixel } from "./coordinateUtils";
import { findOptimalSquareGreedy } from "./costMap";
import { createSortedEntityStacks, createHeatSource } from "./entitySorting";
import { updateCostMap } from "./heatMap";
import { PlaceEntitiesOptions, EntityStack, HeatSource } from "./types";
import { startPerformanceSpan } from "@/utils/performanceMarks";

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
  const endPlacementMeasure = startPerformanceSpan(
    "ti4.placeEntitiesWithCostMap",
    {
      gridSize,
      stackCount: sortedStacks.length,
      initialHeatSourceCount: initialHeatSources.length,
      repellantPlanetCount: repellantPlanets.length,
      rimSquareCount: rimSquares.length,
      controller,
    }
  );

  for (const [stackIndex, stack] of sortedStacks.entries()) {
    const endStackMeasure = startPerformanceSpan(
      "ti4.placeEntitiesWithCostMap.stack",
      {
        stackIndex,
        entityId: stack.entityId,
        entityType: stack.entityType,
        faction: stack.faction,
        count: stack.count,
        heatSourceCount: heatSources.length,
      }
    );
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
    if (!optimalResult) {
      endStackMeasure({ placed: false });
      continue;
    }

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
    endStackMeasure({
      placed: true,
      finalHeatSourceCount: heatSources.length,
    });
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

  endPlacementMeasure({
    placementCount: entityPlacements.length,
    finalHeatSourceCount: heatSources.length,
  });

  return { entityPlacements, finalCostMap };
};
