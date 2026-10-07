import {
  createContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useSettingsStore } from "@/state/appStore";
import { usePlayerDataSocket } from "@/api/usePlayerData";
import { buildGameContext } from "@/entities/game/buildGameContext";
import type { GameData, MapStatePreview, CombatReplayEvent, RetreatSubEvent } from "@/entities/game/types";
import type { GameContext, Props } from "@/state/gameContextTypes";
import type { TileUnitData } from "@/entities/data/types";
import { deserializeCompactMapState } from "@/entities/replay/compactMapState";
import { buildMapReplayPlan } from "@/entities/replay/historicalMapTransitions";
import type { MapReplayPlan } from "@/entities/replay/types";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { storeFactionImagesForGame } from "@/entities/game/factionImageCache";

const MAX_CACHED_MAP_PREVIEWS = 16;

/* Map insertion order doubles as recency: a hit is re-inserted at the end. */
function lruGet<V>(cache: Map<string, V>, key: string): V | undefined {
  const cached = cache.get(key);
  if (cached === undefined) return undefined;
  cache.delete(key);
  cache.set(key, cached);
  return cached;
}

function lruSet<V>(cache: Map<string, V>, key: string, value: V) {
  cache.set(key, value);
  if (cache.size <= MAX_CACHED_MAP_PREVIEWS) return;
  const oldest = cache.keys().next().value;
  if (oldest !== undefined) cache.delete(oldest);
}

function withOverride(
  prev: Record<string, string>,
  faction: string,
  value: string | null,
): Record<string, string> {
  if (value !== null) return { ...prev, [faction]: value };
  const updated = { ...prev };
  delete updated[faction];
  return updated;
}
const EMPTY_MAP_REPLAY_PLAN: MapReplayPlan = {
  transitions: [],
  lasers: [],
  commandTokens: [],
  controlTokens: [],
  arrivalLocations: new Set(),
  baseUnitStates: new Map(),
  delayedDamage: new Map(),
  finalRevealLocations: new Set(),
  showTacticalActivation: false,
  changedPositions: new Set(),
  durationMs: 0,
};
const EMPTY_MAP_REPLAY_STATE = {
  ...EMPTY_MAP_REPLAY_PLAN,
  active: false,
  key: 0,
};

type DecodedMapState = Record<string, TileUnitData>;

type DecodedMapStatePreview = Omit<MapStatePreview, "retreats" | "combats"> & {
  current: DecodedMapState;
  previous?: DecodedMapState;
  retreats: RetreatSubEvent[];
  combats: CombatReplayEvent[];
  replayKey: number;
  replayActive: boolean;
};

/** Board positions whose serialized contents differ between two map states. */
function changedMapPositions(
  previous: DecodedMapState,
  current: DecodedMapState,
): Set<string> {
  const positions = new Set([
    ...Object.keys(previous),
    ...Object.keys(current),
  ]);
  return new Set(
    [...positions].filter(
      (position) =>
        position !== "special" &&
        JSON.stringify(previous[position]) !==
          JSON.stringify(current[position]),
    ),
  );
}

export function GameContextProvider({ children, gameId }: Props) {
  const replayAnimationsEnabled = !isMobileDevice();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isReconnecting,
    readyState,
    reconnect,
  } = usePlayerDataSocket(gameId);

  /* Consumers just want "try again"; the query's promise is not theirs to await. */
  const retryGameData = useCallback(() => {
    void refetch();
  }, [refetch]);
  const accessibleColors = useSettingsStore((s) => s.settings.accessibleColors);
  const controlTokenDisplayMode = useSettingsStore(
    (s) => s.settings.controlTokenDisplayMode,
  );

  const [decalOverrides, setDecalOverrides] = useState<Record<string, string>>(
    {},
  );

  const [colorOverrides, setColorOverrides] = useState<Record<string, string>>(
    {},
  );

  const [mapStatePreview, setMapStatePreviewData] =
    useState<DecodedMapStatePreview>();
  const decodedMapStateCache = useRef(new Map<string, DecodedMapState>());
  const nextReplayKey = useRef(0);
  const stopMapReplay = useCallback(
    () =>
      setMapStatePreviewData((preview) =>
        preview?.replayActive ? { ...preview, replayActive: false } : preview,
      ),
    [],
  );

  const decodeMapState = useCallback((serialized: string) => {
    const cached = lruGet(decodedMapStateCache.current, serialized);
    if (cached) return cached;

    const decoded = deserializeCompactMapState(serialized);
    lruSet(decodedMapStateCache.current, serialized, decoded);
    return decoded;
  }, []);

  const setMapStatePreview = useCallback(
    (preview: MapStatePreview | null) => {
      if (!replayAnimationsEnabled) return;
      if (preview === null) {
        setMapStatePreviewData(undefined);
        return;
      }
      try {
        setMapStatePreviewData({
          ...preview,
          current: decodeMapState(preview.mapState),
          previous: preview.previousMapState
            ? decodeMapState(preview.previousMapState)
            : undefined,
          retreats: preview.retreats ?? [],
          combats: preview.combats ?? [],
          replayKey: (nextReplayKey.current += 1),
          replayActive: Boolean(preview.previousMapState),
        });
      } catch (error) {
        console.error("Unable to preview compact event map state", error);
        setMapStatePreviewData(undefined);
      }
    },
    [decodeMapState, replayAnimationsEnabled],
  );

  useEffect(() => {
    decodedMapStateCache.current.clear();
  }, [gameId]);

  const setDecalOverride = useCallback(
    (faction: string, decalId: string | null) => {
      setDecalOverrides((prev) => withOverride(prev, faction, decalId));
    },
    [],
  );

  const clearDecalOverride = useCallback(
    (faction: string) => {
      setDecalOverride(faction, null);
    },
    [setDecalOverride],
  );

  const setColorOverride = useCallback(
    (faction: string, colorAlias: string | null) => {
      setColorOverrides((prev) => withOverride(prev, faction, colorAlias));
    },
    [],
  );

  const clearColorOverride = useCallback(
    (faction: string) => {
      setColorOverride(faction, null);
    },
    [setColorOverride],
  );

  // Keep the live map independently memoized while a historical preview is
  // active. Leaving an event row can then swap back to this already-built
  // context instead of rebuilding every tile and unit placement synchronously.
  const liveEnhancedData = useMemo(() => {
    if (!data) return undefined;
    return buildGameContext(data, accessibleColors, decalOverrides);
  }, [data, accessibleColors, decalOverrides]);

  useEffect(() => {
    if (!liveEnhancedData) return;
    storeFactionImagesForGame(gameId, liveEnhancedData.factionImageMap);
  }, [gameId, liveEnhancedData]);

  // Preview states are immutable and identified by their deterministic compact
  // string. Reusing their built contexts avoids repeating tile enrichment and
  // unit placement work when the pointer returns to a previously viewed frame.
  const previewContextCache = useMemo(
    () => new Map<string, GameData>(),
    [data, accessibleColors, decalOverrides],
  );

  const getPreviewContext = useCallback(
    (
      serialized: string,
      tileUnitData: DecodedMapState,
    ) => {
      const cached = lruGet(previewContextCache, serialized);
      if (cached) return cached;
      if (!data) return undefined;

      const context = buildGameContext(
        { ...data, tileUnitData },
        accessibleColors,
        decalOverrides,
      );
      lruSet(previewContextCache, serialized, context);
      return context;
    },
    [data, accessibleColors, decalOverrides, previewContextCache],
  );

  const previewEnhancedData = useMemo(() => {
    if (!mapStatePreview) return undefined;
    return getPreviewContext(mapStatePreview.mapState, mapStatePreview.current);
  }, [getPreviewContext, mapStatePreview?.mapState, mapStatePreview?.current]);

  const enhancedData = previewEnhancedData ?? liveEnhancedData;

  const previousEnhancedData = useMemo(() => {
    if (!replayAnimationsEnabled) return undefined;
    if (!mapStatePreview?.previous || !mapStatePreview.previousMapState)
      return undefined;
    return getPreviewContext(
      mapStatePreview.previousMapState,
      mapStatePreview.previous,
    );
  }, [
    getPreviewContext,
    replayAnimationsEnabled,
    mapStatePreview?.previousMapState,
    mapStatePreview?.previous,
  ]);

  const changedPositions = useMemo(() => {
    if (!replayAnimationsEnabled) return EMPTY_MAP_REPLAY_PLAN.changedPositions;
    const current = mapStatePreview?.current;
    const previous = mapStatePreview?.previous;
    if (!current || !previous) return new Set<string>();
    return changedMapPositions(previous, current);
  }, [
    replayAnimationsEnabled,
    mapStatePreview?.current,
    mapStatePreview?.previous,
  ]);

  const mapReplayPlan = useMemo(() => {
    if (!replayAnimationsEnabled) return EMPTY_MAP_REPLAY_PLAN;
    return buildMapReplayPlan(previousEnhancedData, enhancedData, {
      movementState: mapStatePreview?.movementState,
      retreats: mapStatePreview?.retreats,
      combats: mapStatePreview?.combats,
      activeFaction: mapStatePreview?.activeFaction,
      tacticalPosition: mapStatePreview?.tacticalPosition,
      controlTokenDisplayMode,
      changedPositions,
    });
  }, [
    replayAnimationsEnabled,
    previousEnhancedData,
    enhancedData,
    mapStatePreview?.movementState,
    mapStatePreview?.retreats,
    mapStatePreview?.combats,
    mapStatePreview?.activeFaction,
    mapStatePreview?.tacticalPosition,
    controlTokenDisplayMode,
    changedPositions,
  ]);

  useEffect(() => {
    if (!replayAnimationsEnabled) return;
    if (!mapStatePreview?.replayActive) return;
    if (
      mapReplayPlan.durationMs === 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      stopMapReplay();
      return;
    }
    const timeout = window.setTimeout(
      stopMapReplay,
      mapReplayPlan.durationMs + 40,
    );
    return () => window.clearTimeout(timeout);
  }, [
    replayAnimationsEnabled,
    mapStatePreview?.replayActive,
    mapReplayPlan,
    stopMapReplay,
  ]);

  const mapReplay = useMemo(
    () =>
      replayAnimationsEnabled
        ? {
            ...mapReplayPlan,
            active: mapStatePreview?.replayActive ?? false,
            key: mapStatePreview?.replayKey ?? 0,
          }
        : EMPTY_MAP_REPLAY_STATE,
    [
      replayAnimationsEnabled,
      mapReplayPlan,
      mapStatePreview?.replayActive,
      mapStatePreview?.replayKey,
    ],
  );

  const gameContext: GameContext = {
    data: enhancedData,
    dataState: {
      isLoading,
      isError,
      error: error ?? null,
      refetch: retryGameData,
      isReconnecting,
      readyState,
      reconnect,
    },
    decalOverrides,
    setDecalOverride,
    clearDecalOverride,
    colorOverrides,
    setColorOverride,
    clearColorOverride,
    setMapStatePreview,
    mapReplay,
  };

  return (
    <MapStatePreviewDispatchContext.Provider value={setMapStatePreview}>
      <GameDataContext.Provider value={enhancedData}>
        <MapReplayContext.Provider value={mapReplay}>
          <EnhancedDataContext.Provider value={gameContext}>
            {children}
          </EnhancedDataContext.Provider>
        </MapReplayContext.Provider>
      </GameDataContext.Provider>
    </MapStatePreviewDispatchContext.Provider>
  );
}

export const EnhancedDataContext = createContext<GameContext | undefined>(
  undefined,
);

export const MapStatePreviewDispatchContext = createContext<
  (preview: MapStatePreview | null) => void
>(() => {});

export const GameDataContext = createContext<GameContext["data"]>(undefined);

export const MapReplayContext = createContext<GameContext["mapReplay"]>(
  EMPTY_MAP_REPLAY_STATE,
);
