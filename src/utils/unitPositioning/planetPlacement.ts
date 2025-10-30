import { EntityData, FactionUnits, PlanetEntityData } from "@/data/types";
import { getTokenData } from "@/lookup/tokens";
import {
  GROUND_HEAT_CONFIG,
  DEFAULT_PLANET_RADIUS,
  HEX_GRID_SIZE,
  HEX_SQUARE_WIDTH,
  HEX_SQUARE_HEIGHT,
  STATS_HEAT_OFFSET,
  STATS_HEAT_STACK_SIZE,
} from "./constants";
import { getResourcesLocationAngle } from "./coordinateUtils";
import { initializeGroundCostMap } from "./costMap";
import { placeEntitiesWithCostMap } from "./placement";
import {
  Planet,
  EntityStackBase,
  EntityStack,
  HeatSource,
  PlaceGroundEntitiesOptions,
} from "./types";

const calculateAttachmentAngle = (
  index: number,
  totalAttachments: number
): number => {
  const ATTACHMENT_ANGLE_STEP = 0.5;
  const startAngle = (-ATTACHMENT_ANGLE_STEP * (totalAttachments - 1)) / 2;
  return startAngle + index * ATTACHMENT_ANGLE_STEP;
};

export const placeAttachmentsOnRim = (
  planetX: number,
  planetY: number,
  planetRadius: number,
  attachmentEntities: EntityStackBase[]
): EntityStack[] => {
  if (attachmentEntities.length === 0) return [];

  if (attachmentEntities.length === 1) {
    return [
      {
        ...attachmentEntities[0],
        x: planetX + planetRadius,
        y: planetY,
      },
    ];
  }

  return attachmentEntities.map((attachment, index) => {
    const angle = calculateAttachmentAngle(
      index,
      attachmentEntities.length
    );
    const x = planetX + planetRadius * Math.cos(angle);
    const y = planetY + planetRadius * Math.sin(angle);

    return {
      ...attachment,
      x,
      y,
    };
  });
};

const separateEntityTypes = (planetEntityData: PlanetEntityData) => {
  const filteredPlanetEntities: FactionUnits = {};
  const attachmentEntities: EntityStackBase[] = [];
  const centerTokens: EntityStackBase[] = [];

  Object.entries(planetEntityData.entities).forEach(([faction, entities]) => {
    const regularEntities: EntityData[] = [];

    entities.forEach((entity) => {
      const entityStack: EntityStackBase = {
        faction,
        entityId: entity.entityId,
        entityType: entity.entityType,
        count: entity.count,
        sustained: entity.sustained,
      };

      if (entity.entityType === "attachment") {
        attachmentEntities.push(entityStack);
        return;
      }

      if (entity.entityType === "token") {
        const tokenData = getTokenData(entity.entityId);
        if (tokenData?.placement === "center") {
          centerTokens.push(entityStack);
          return;
        }
      }

      regularEntities.push(entity);
    });

    if (regularEntities.length > 0) {
      filteredPlanetEntities[faction] = regularEntities;
    }
  });

  return { filteredPlanetEntities, attachmentEntities, centerTokens };
};

const placeAttachmentsAndCreateHeatSources = (
  planet: Planet,
  attachmentEntities: EntityStackBase[]
): { placements: EntityStack[]; heatSources: HeatSource[] } => {
  if (attachmentEntities.length === 0) {
    return { placements: [], heatSources: [] };
  }

  const placements = placeAttachmentsOnRim(
    planet.x,
    planet.y,
    DEFAULT_PLANET_RADIUS,
    attachmentEntities
  );

  const heatSources = placements.map((attachment) => ({
    x: attachment.x,
    y: attachment.y,
    faction: attachment.faction,
    stackSize: attachment.count,
  }));

  return { placements, heatSources };
};

const createStatsHeatSource = (planet: Planet): HeatSource | null => {
  if (!planet.resourcesLocation) return null;

  const statsHeatDistance = planet.radius + STATS_HEAT_OFFSET;
  const statsAngle = getResourcesLocationAngle(planet.resourcesLocation);

  const statsX = planet.x + statsHeatDistance * Math.cos(statsAngle);
  const statsY = planet.y + statsHeatDistance * Math.sin(statsAngle);

  return {
    x: statsX,
    y: statsY,
    stackSize: STATS_HEAT_STACK_SIZE,
  };
};

export const placeGroundEntities = ({
  gridSize,
  squareWidth,
  squareHeight,
  planetX,
  planetY,
  planetRadius,
  factionEntities,
  heatSources = [],
  controller,
}: PlaceGroundEntitiesOptions) => {
  const { costMap: initialCostMap, rimSquares } = initializeGroundCostMap(
    gridSize,
    squareWidth,
    squareHeight,
    planetX,
    planetY,
    planetRadius
  );

  return placeEntitiesWithCostMap({
    gridSize,
    squareWidth,
    squareHeight,
    initialCostMap,
    rimSquares,
    repellantPlanets: [],
    factionEntities,
    heatConfig: GROUND_HEAT_CONFIG,
    initialHeatSources: heatSources,
    controller,
  });
};

const placeGroundEntitiesForPlanet = (
  planet: Planet,
  filteredPlanetEntities: FactionUnits,
  attachmentHeatSources: HeatSource[],
  controller?: string
): { entityPlacements: EntityStack[]; finalCostMap: number[][] } => {
  if (Object.keys(filteredPlanetEntities).length === 0) {
    return { entityPlacements: [], finalCostMap: [] };
  }

  const statsHeatSource = createStatsHeatSource(planet);
  const allHeatSources = statsHeatSource
    ? [...attachmentHeatSources, statsHeatSource]
    : attachmentHeatSources;

  const { entityPlacements, finalCostMap } = placeGroundEntities({
    gridSize: HEX_GRID_SIZE,
    squareWidth: HEX_SQUARE_WIDTH,
    squareHeight: HEX_SQUARE_HEIGHT,
    planetX: planet.x,
    planetY: planet.y,
    planetRadius: planet.radius,
    factionEntities: filteredPlanetEntities,
    heatSources: allHeatSources,
    controller,
  });

  return { entityPlacements, finalCostMap };
};

export const processPlanetEntities = (
  planet: Planet,
  planetEntityData: PlanetEntityData
): { entityPlacements: EntityStack[]; finalCostMap: number[][] } => {
  const { filteredPlanetEntities, attachmentEntities, centerTokens } =
    separateEntityTypes(planetEntityData);

  const {
    placements: attachmentPlacements,
    heatSources: attachmentHeatSources,
  } = placeAttachmentsAndCreateHeatSources(planet, attachmentEntities);

  const centerTokenPlacements: EntityStack[] = centerTokens.map((token) => ({
    ...token,
    x: planet.x,
    y: planet.y,
  }));

  const { entityPlacements: groundEntityPlacements, finalCostMap } =
    placeGroundEntitiesForPlanet(
      planet,
      filteredPlanetEntities,
      attachmentHeatSources,
      planetEntityData.controlledBy
    );

  const planetEntitiesWithPlanetName = [
    ...centerTokenPlacements,
    ...attachmentPlacements,
    ...groundEntityPlacements,
  ].map((entity) => ({
    ...entity,
    planetName: planet.name,
  }));

  return { entityPlacements: planetEntitiesWithPlanetName, finalCostMap };
};
