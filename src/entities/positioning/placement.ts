import { gridToPixel } from "./coordinateUtils";
import { createSortedEntityStacks, createHeatSource } from "./entitySorting";
import { createCostMapAccumulator } from "./heatMap";
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
  const costMaps = createCostMapAccumulator({
    gridSize,
    squareWidth,
    squareHeight,
    factionEntities,
    existingCostMap: initialCostMap,
    heatConfig,
    repellantPlanets,
    rimSquares,
    currentFactions: sortedStacks.map(({ faction }) => faction),
    initialHeatSources,
  });
  const endPlacementMeasure = startPerformanceSpan(
    "ti4.placeEntitiesWithCostMap",
    {
      gridSize,
      stackCount: sortedStacks.length,
      initialHeatSourceCount: initialHeatSources.length,
      repellantPlanetCount: repellantPlanets.length,
      rimSquareCount: rimSquares.length,
      controller,
    },
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
      },
    );
    const optimalResult = costMaps.findOptimalSquare(
      stack.faction,
      heatConfig.rimClearance[stack.entityType],
    );
    if (!optimalResult) {
      endStackMeasure({ placed: false });
      continue;
    }

    const { x, y } = gridToPixel(
      optimalResult.square,
      squareWidth,
      squareHeight,
    );

    entityPlacements.push({
      ...stack,
      x,
      y,
    });

    const heatSource = createHeatSource(
      optimalResult,
      stack,
      squareWidth,
      squareHeight,
    );
    heatSources.push(heatSource);
    costMaps.addHeatSource(heatSource);
    endStackMeasure({
      placed: true,
      finalHeatSourceCount: heatSources.length,
    });
  }

  const finalCostMap = costMaps.createCostMap();

  endPlacementMeasure({
    placementCount: entityPlacements.length,
    finalHeatSourceCount: heatSources.length,
  });

  return { entityPlacements, finalCostMap };
};
