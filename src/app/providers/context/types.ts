import { ReactNode } from "react";
import { calculateTilePositions } from "@/domains/map/model/mapgen/tilePositioning";
import { SocketReadyState } from "@/hooks/useGameSocket";
import type {
  PlayerDataResponse,
  WebScoreBreakdown,
  CapacityUsage,
  FactionUnits,
  BorderAnomalyInfo,
  Point,
  RGBColor,
} from "@/entities/data/types";
import type { HexSide } from "@/utils/hexagonUtils";
import { EntityStack } from "@/utils/unitPositioning";
import type { MapReplayPlan } from "@/utils/mapReplay/types";
import type { GameSubEvent } from "@/entities/data/types";

export type RetreatSubEvent = Extract<GameSubEvent, { type: "RETREAT" }>;
export type CombatReplayEvent = Extract<GameSubEvent, { type: "COMBAT" }>;
export type MapReplayState = MapReplayPlan & { active: boolean; key: number };

export type MapStatePreview = {
  mapState: string;
  previousMapState?: string;
  movementState?: string | null;
  retreats?: RetreatSubEvent[];
  combats?: CombatReplayEvent[];
  activeFaction?: string | null;
  tacticalPosition?: string | null;
};

export type FactionImageMap = Record<string, { image: string; type: string }>;

type FactionColorData = {
  faction: string;
  color: string;
  optimizedColor: RGBColor;
};

/** Keyed by both faction and color. */
export type FactionColorMap = Record<string, FactionColorData>;

export type GameContext = {
  data: GameData | undefined;
  dataState: GameDataState;
  decalOverrides: Record<string, string>;
  setDecalOverride: (faction: string, decalId: string | null) => void;
  clearDecalOverride: (faction: string) => void;
  colorOverrides: Record<string, string>;
  setColorOverride: (faction: string, colorAlias: string | null) => void;
  clearColorOverride: (faction: string) => void;
  setMapStatePreview: (preview: MapStatePreview | null) => void;
  mapReplay: MapReplayState;
};

export type TilePdsEntry = {
  faction: string;
  color: string;
  count: number;
  expected: number;
};

export type GameData = {
  tiles: Record<string, Tile>;
  tilePositions: string[];
  factionColorMap: FactionColorMap;
  originalFactionColorMap: FactionColorMap;
  factionImageMap: FactionImageMap;
  tilesWithPds: Set<string>;
  pdsByTile: Record<string, TilePdsEntry[]>;

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
  planetIdToPlanetTile: Record<string, TilePlanet>;
  isTwilightsFallMode?: boolean;
};

export type GameDataState = {
  isLoading: boolean;
  isError: boolean;
  /** The failed web-data fetch, for surfaces that report why the link is down. */
  error: Error | null;
  /** Retries the web-data fetch. Distinct from reconnect(), which is the socket. */
  refetch: () => void;
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
  unitsByFaction: FactionUnits;
  planets: Record<string, TilePlanet>;
  hasAnomaly: boolean;
  hasTechSkips: boolean;
  hasAttachments: boolean;
  properties: {
    x: number;
    y: number;
    hexOutline: {
      points: Point[];
      sides: HexSide[];
      midpoints: Point[];
    };
  };
  highestProduction: number;
  largestCapacity?: CapacityUsage;
  commandCounters: string[];
  entityPlacements: EntityStack[];
  borderAnomalies?: BorderAnomalyInfo[];
};

export type PrePlacementTile = Omit<Tile, "entityPlacements">;

export type TilePlanet = {
  controlledBy: string | null | undefined;
  commodities: number | null;
  planetaryShield: boolean;
  tokens: string[];
  attachments: string[];
  actionCards: string[];
  unitsByFaction: FactionUnits;
  techSpecialties: string[];
  exhausted: boolean;
  resources?: number | null;
  influence?: number | null;
};

export type EnrichedTab = {
  id: string;
  faction: string | null;
  factionColor: string | null;
  factionImage: string | null;
  factionImageType: string | null;
  isManaged: boolean;
};
