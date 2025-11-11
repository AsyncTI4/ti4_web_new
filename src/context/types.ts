import { ReactNode } from "react";
import { RGBColor } from "@/utils/colorOptimization";
import { calculateTilePositions } from "@/mapgen/tilePositioning";
import { SocketReadyState } from "@/hooks/useGameSocket";
import {
  PlayerDataResponse,
  WebScoreBreakdown,
  EntityData,
} from "@/data/types";
import { EntityStack } from "@/utils/unitPositioning";

export type FactionImageMap = Record<string, { image: string; type: string }>;

export type FactionColorMap = {
  [key: string]: FactionColorData;
};

export type FactionColorData = {
  faction: string;
  color: string;
  optimizedColor: RGBColor;
};

export type GameContext = {
  data: GameData | undefined;
  dataState: GameDataState;
  decalOverrides: Record<string, string>;
  setDecalOverride: (faction: string, decalId: string | null) => void;
  clearDecalOverride: (faction: string) => void;
  colorOverrides: Record<string, string>;
  setColorOverride: (faction: string, colorAlias: string | null) => void;
  clearColorOverride: (faction: string) => void;
};

export type GameData = {
  tiles: Record<string, Tile>;
  tilePositions: string[];
  factionColorMap: FactionColorMap;
  originalFactionColorMap: FactionColorMap;
  factionImageMap: FactionImageMap;
  tilesWithPds: Set<string>;
  dominantPdsFaction: Record<
    string,
    {
      faction: string;
      color: string;
      count: number;
      expected: number;
    }
  >;
  pdsByTile: Record<
    string,
    { faction: string; color: string; count: number; expected: number }[]
  >;

  armyRankings: Record<string, number>;

  playerData: PlayerDataResponse["playerData"];
  objectives: PlayerDataResponse["objectives"];
  lawsInPlay: PlayerDataResponse["lawsInPlay"];
  strategyCards: PlayerDataResponse["strategyCards"];
  strategyCardIdMap?: PlayerDataResponse["strategyCardIdMap"];
  vpsToWin: PlayerDataResponse["vpsToWin"];
  cardPool: PlayerDataResponse["cardPool"];
  versionSchema?: PlayerDataResponse["versionSchema"];
  ringCount: PlayerDataResponse["ringCount"];
  gameRound: PlayerDataResponse["gameRound"];
  gameName: PlayerDataResponse["gameName"];
  gameCustomName?: PlayerDataResponse["gameCustomName"];
  statTilePositions: PlayerDataResponse["statTilePositions"];
  calculatedTilePositions: ReturnType<typeof calculateTilePositions>;
  tableTalkJumpLink?: PlayerDataResponse["tableTalkJumpLink"];
  actionsJumpLink?: PlayerDataResponse["actionsJumpLink"];
  playerScoreBreakdowns?: Record<string, WebScoreBreakdown>;
  expeditions: PlayerDataResponse["expeditions"];
};

export type GameDataState = {
  isLoading: boolean;
  isError: boolean;
  readyState: SocketReadyState;
  reconnect: () => void;
  isReconnecting: boolean;
};

export type Props = {
  children: ReactNode;
  gameId: string;
};

export type Tile = {
  controlledBy: string | undefined;
  position: string;
  systemId: string;
  tokens: string[];
  unitsByFaction: Record<string, EntityData[]>;
  planets: Record<string, TilePlanet>;
  hasAnomaly: boolean;
  hasTechSkips: boolean;
  properties: {
    x: number;
    y: number;
    hexOutline: {
      points: { x: number; y: number }[];
    };
  };
  highestProduction: number;
  commandCounters: string[];
  entityPlacements: EntityStack[];
};

export type PrePlacementTile = Omit<Tile, "entityPlacements">;

export type TilePlanet = {
  controlledBy: string | undefined;
  commodities: number | null;
  planetaryShield: boolean;
  tokens: string[];
  attachments: string[];
  unitsByFaction: Record<string, EntityData[]>;
  techSpecialties: string[];
  exhausted: boolean;
};

