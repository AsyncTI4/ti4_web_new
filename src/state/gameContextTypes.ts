import type { ReactNode } from "react";
import type { SocketReadyState } from "@/api/useGameSocket";
import type { MapReplayPlan } from "@/entities/replay/types";
import type { GameData, MapStatePreview } from "@/entities/game/types";

export type MapReplayState = MapReplayPlan & { active: boolean; key: number };

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
