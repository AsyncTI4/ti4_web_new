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
import { optimizeFactionColors, RGBColor } from "../utils/colorOptimization";
import { getColorValues } from "../lookup/colors";
import { colors } from "./colors";

export type EnhancedPlayerData = {
  playerData: PlayerData[];
  tileUnitData: Record<string, any>;
  tilePositions: string[];
  statTilePositions: Record<string, string[]>;
  calculatedTilePositions: TilePosition[];
  systemIdToPosition: Record<string, string>;
  factionToColor: Record<string, string>;
  colorToFaction: Record<string, string>;
  optimizedColors: Record<string, RGBColor>;
  planetAttachments: Record<string, string[]>;
  objectives: Objectives;
  lawsInPlay: LawInPlay[];
  strategyCards: StrategyCard[];
  vpsToWin: number;
  cardPool: CardPoolData;
  versionSchema?: number;
  ringCount: number;
  gameRound: number;
  gameName: string;
  gameCustomName?: string;
};

export function enhancePlayerData(
  data: PlayerDataResponse
): EnhancedPlayerData {
  const calculatedTilePositions = data.tilePositions
    ? calculateTilePositions(data.tilePositions, data.ringCount)
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

  // Calculate optimized colors for faction overlays
  const optimizedColors: Record<string, RGBColor> = (() => {
    // Get unique colors that are actually in use by factions
    const colorsInUse = new Set(Object.values(factionToColor));

    // Transform only the colors that are actually being used
    const transformedColors = colors
      .filter((color) => colorsInUse.has(color.name))
      .map((color) => {
        // Use getColorValues to handle both primaryColor and primaryColorRef
        const primaryColorValues = getColorValues(
          (color as any).primaryColorRef,
          color.primaryColor
        );

        if (!primaryColorValues) return null;

        return {
          alias: color.name,
          primaryColor: primaryColorValues as RGBColor,
        };
      })
      .filter(
        (color): color is { alias: string; primaryColor: RGBColor } =>
          color !== null
      );

    return optimizeFactionColors(transformedColors);
  })();

  return {
    ...data,
    // extra computed properties
    calculatedTilePositions,
    systemIdToPosition,
    factionToColor,
    colorToFaction,
    optimizedColors,
    planetAttachments,
  };
}
