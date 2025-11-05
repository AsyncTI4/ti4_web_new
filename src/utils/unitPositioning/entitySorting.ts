import { EntityData, FactionUnits } from "@/data/types";
import { entityIdPriority } from "./constants";
import { gridToPixel } from "./coordinateUtils";
import { EntityStackBase, HeatSource } from "./types";

export const getEntityStackSize = (entityId: string, count: number): number => {
  if (
    entityId === "gf" ||
    entityId === "ff" ||
    entityId === "sd" ||
    entityId === "mf"
  ) {
    return 2;
  }
  return count;
};

export const createHeatSource = (
  optimalResult: { square: { row: number; col: number }; cost: number },
  stack: EntityStackBase,
  squareWidth: number,
  squareHeight: number
): HeatSource => {
  const { x, y } = gridToPixel(optimalResult.square, squareWidth, squareHeight);
  return {
    x,
    y,
    faction: stack.faction,
    stackSize: getEntityStackSize(stack.entityId, stack.count),
  };
};

const buildPriorityMap = (): { [key: string]: number } => {
  const map: { [key: string]: number } = {};
  entityIdPriority.forEach((entityId, index) => {
    map[entityId] = index;
  });
  return map;
};

type QueueItem = EntityData & {
  priority: number;
};

const buildFactionQueues = (
  factionEntities: FactionUnits,
  priorityMap: { [key: string]: number }
): { [faction: string]: QueueItem[] } => {
  const factionQueues: { [faction: string]: QueueItem[] } = {};

  Object.entries(factionEntities).forEach(([faction, entities]) => {
    factionQueues[faction] = [];
    entities.forEach((entity) => {
      if (entity.count > 0) {
        const priority = priorityMap[entity.entityId] ?? 999;
        factionQueues[faction].push({
          ...entity,
          priority,
        });
      }
    });
    factionQueues[faction].sort((a, b) => a.priority - b.priority);
  });

  return factionQueues;
};

const interleaveQueues = (
  factionQueues: { [faction: string]: QueueItem[] },
  controller?: string
): EntityStackBase[] => {
  const sortedStacks: EntityStackBase[] = [];
  const factionNames = Object.keys(factionQueues);

  if (!factionNames.length) return sortedStacks;

  const orderedFactions: string[] = [];
  if (controller && factionNames.includes(controller)) {
    orderedFactions.push(controller);
    factionNames.forEach((faction) => {
      if (faction !== controller) {
        orderedFactions.push(faction);
      }
    });
  } else {
    orderedFactions.push(...factionNames);
  }

  while (orderedFactions.some((faction) => factionQueues[faction].length > 0)) {
    for (const faction of orderedFactions) {
      if (factionQueues[faction].length > 0) {
        const queueItem = factionQueues[faction].shift()!;
        sortedStacks.push({
          ...queueItem,
          faction,
        });
      }
    }
  }

  return sortedStacks;
};

export const createSortedEntityStacks = (
  factionEntities: FactionUnits,
  controller?: string
): EntityStackBase[] => {
  const priorityMap = buildPriorityMap();
  const factionQueues = buildFactionQueues(factionEntities, priorityMap);
  return interleaveQueues(factionQueues, controller);
};
