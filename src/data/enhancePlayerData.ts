import {
  PlayerDataResponse,
  PlayerData,
  Objectives,
  LawInPlay,
  StrategyCard,
  CardPoolData,
} from "./types";
import {
  calculateTilePositions,
  TilePosition,
} from "../mapgen/tilePositioning";

export type EnhancedPlayerData = {
  playerData: PlayerData[];
  tileUnitData: Record<string, any>;
  tilePositions: string[];
  statTilePositions: Record<string, string[]>;
  calculatedTilePositions: TilePosition[];
  systemIdToPosition: Record<string, string>;
  factionToColor: Record<string, string>;
  colorToFaction: Record<string, string>;
  planetAttachments: Record<string, string[]>;
  objectives: Objectives;
  lawsInPlay: LawInPlay[];
  strategyCards: StrategyCard[];
  vpsToWin: number;
  cardPool: CardPoolData;
};

export function enhancePlayerData(
  data: PlayerDataResponse,
  ringCount: number = 6
): EnhancedPlayerData {
  const calculatedTilePositions = data.tilePositions
    ? calculateTilePositions(data.tilePositions, ringCount)
    : [];

  const systemIdToPosition: Record<string, string> = {};
  if (data.tilePositions) {
    data.tilePositions.forEach((entry: string) => {
      const [position, systemId] = entry.split(":");
      systemIdToPosition[systemId] = position;
    });
  }

  const factionToColor =
    data.playerData?.reduce(
      (acc, player) => {
        acc[player.faction] = player.color;
        return acc;
      },
      {} as Record<string, string>
    ) || {};

  const colorToFaction =
    data.playerData?.reduce(
      (acc, player) => {
        acc[player.color] = player.faction;
        return acc;
      },
      {} as Record<string, string>
    ) || {};

  const planetAttachments: Record<string, string[]> = {};
  if (data.tileUnitData) {
    Object.values(data.tileUnitData).forEach((tileData: any) => {
      if (tileData.planets) {
        Object.entries(tileData.planets).forEach(
          ([planetName, planetData]: [string, any]) => {
            if (planetData.entities) {
              const attachments: string[] = [];
              Object.entries(planetData.entities).forEach(
                ([_faction, entities]) => {
                  if (Array.isArray(entities)) {
                    entities.forEach((entity: any) => {
                      if (entity.entityType === "attachment") {
                        attachments.push(entity.entityId);
                      }
                    });
                  }
                }
              );
              if (attachments.length > 0) {
                planetAttachments[planetName] = attachments;
              }
            }
          }
        );
      }
    });
  }

  return {
    playerData: data.playerData,
    tileUnitData: data.tileUnitData,
    tilePositions: data.tilePositions,
    statTilePositions: data.statTilePositions,
    objectives: data.objectives,
    lawsInPlay: data.lawsInPlay,
    strategyCards: data.strategyCards,
    vpsToWin: data.vpsToWin,
    cardPool: data.cardPool,
    // extra computed properties
    calculatedTilePositions,
    systemIdToPosition,
    factionToColor,
    colorToFaction,
    planetAttachments,
  };
}
