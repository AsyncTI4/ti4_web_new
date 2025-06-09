import { PlayerDataResponse, PlayerData } from "./types";
import {
  calculateTilePositions,
  TilePosition,
} from "../mapgen/tilePositioning";

export type EnhancedPlayerData = {
  playerData: PlayerData[];
  factionCoordinates: Record<string, { x: number; y: number }>;
  tileUnitData: Record<string, any>;
  tilePositions: string[];
  statTilePositions: Record<string, string[]>;

  calculatedTilePositions: TilePosition[];
  systemIdToPosition: Record<string, string>;
  factionToColor: Record<string, string>;
  colorToFaction: Record<string, string>;
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

  return {
    playerData: data.playerData,
    factionCoordinates: data.factionCoordinates,
    tileUnitData: data.tileUnitData,
    tilePositions: data.tilePositions,
    statTilePositions: data.statTilePositions,

    calculatedTilePositions,
    systemIdToPosition,
    factionToColor,
    colorToFaction,
  };
}
