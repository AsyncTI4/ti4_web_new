import { EntityData, FactionUnits } from "@/entities/data/types";
import { entityIdPriority, INFANTRY_BADGE_CLEARANCE } from "./constants";
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
  squareHeight: number,
): HeatSource => {
  const { x, y } = gridToPixel(optimalResult.square, squareWidth, squareHeight);
  return {
    x,
    y,
    faction: stack.faction,
    stackSize: getEntityStackSize(stack.entityId, stack.count),
    clearance: stack.entityId === "gf" ? INFANTRY_BADGE_CLEARANCE : undefined,
  };
};

const buildPriorityMap = (): Readonly<Record<string, number>> => {
  const map: { [key: string]: number } = {};
  entityIdPriority.forEach((entityId, index) => {
    map[entityId] = index;
  });
  return map;
};

const PRIORITY_BY_ENTITY_ID = buildPriorityMap();

type QueueItem = {
  entity: EntityData;
  priority: number;
};

const buildFactionQueues = (
  factionEntities: FactionUnits,
): { [faction: string]: QueueItem[] } => {
  const factionQueues: { [faction: string]: QueueItem[] } = {};

  Object.entries(factionEntities).forEach(([faction, entities]) => {
    factionQueues[faction] = [];
    entities.forEach((entity) => {
      if (entity.count > 0) {
        const priority = PRIORITY_BY_ENTITY_ID[entity.entityId] ?? 999;
        factionQueues[faction].push({
          entity,
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
  controller?: string,
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

  const indexes = Object.fromEntries(
    orderedFactions.map((faction) => [faction, 0]),
  );
  let remaining = orderedFactions.reduce(
    (total, faction) => total + factionQueues[faction].length,
    0,
  );

  while (remaining > 0) {
    for (const faction of orderedFactions) {
      const index = indexes[faction];
      const queueItem = factionQueues[faction][index];
      if (!queueItem) continue;

      indexes[faction] = index + 1;
      remaining--;
      sortedStacks.push({
        ...queueItem.entity,
        faction,
      });
    }
  }

  return sortedStacks;
};

export const createSortedEntityStacks = (
  factionEntities: FactionUnits,
  controller?: string,
): EntityStackBase[] => {
  const factionQueues = buildFactionQueues(factionEntities);
  return interleaveQueues(factionQueues, controller);
};
