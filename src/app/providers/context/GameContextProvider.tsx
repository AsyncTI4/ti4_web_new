import {
  createContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useSettingsStore } from "@/utils/appStore";
import { usePlayerDataSocket } from "@/hooks/usePlayerData";
import { useMovementStore } from "@/utils/movementStore";
import { applyDisplacementToPlayerData } from "@/utils/displacement";
import { buildGameContext } from "./utils/buildGameContext";
import type {
  GameContext,
  MapStatePreview,
  Props,
  CombatReplayEvent,
  RetreatSubEvent,
} from "./types";
import { deserializeCompactMapState } from "@/utils/compactMapState";
import {
  buildMapReplayPlan,
  type MapReplayPlan,
} from "@/utils/historicalMapTransitions";
import { isMobileDevice } from "@/utils/isTouchDevice";

const MAX_CACHED_MAP_PREVIEWS = 16;
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

type DecodedMapStatePreview = {
  mapState: string;
  previousMapState?: string;
  current: ReturnType<typeof deserializeCompactMapState>;
  previous?: ReturnType<typeof deserializeCompactMapState>;
  movementState?: string | null;
  retreats: RetreatSubEvent[];
  combats: CombatReplayEvent[];
  activeFaction?: string | null;
  tacticalPosition?: string | null;
  replayKey: number;
  replayActive: boolean;
};

export function GameContextProvider({ children, gameId }: Props) {
  const replayAnimationsEnabled = !isMobileDevice();
  const {
    data,
    isLoading,
    isError,
    error,
    isReconnecting,
    readyState,
    reconnect,
  } = usePlayerDataSocket(gameId);
  const accessibleColors = useSettingsStore((s) => s.settings.accessibleColors);
  const alwaysShowControlTokens = useSettingsStore(
    (s) => s.settings.showControlTokens,
  );

  const draft = useMovementStore((s) => s.draft);

  const [decalOverrides, setDecalOverrides] = useState<Record<string, string>>(
    {},
  );

  const [colorOverrides, setColorOverrides] = useState<Record<string, string>>(
    {},
  );

  const [mapStatePreview, setMapStatePreviewData] =
    useState<DecodedMapStatePreview>();
  const decodedMapStateCache = useRef(
    new Map<string, ReturnType<typeof deserializeCompactMapState>>(),
  );
  const nextReplayKey = useRef(0);
  const stopMapReplay = useCallback(
    () =>
      setMapStatePreviewData((preview) =>
        preview?.replayActive ? { ...preview, replayActive: false } : preview,
      ),
    [],
  );

  const decodeMapState = useCallback((serialized: string) => {
    const cached = decodedMapStateCache.current.get(serialized);
    if (cached) {
      decodedMapStateCache.current.delete(serialized);
      decodedMapStateCache.current.set(serialized, cached);
      return cached;
    }

    const decoded = deserializeCompactMapState(serialized);
    decodedMapStateCache.current.set(serialized, decoded);
    if (decodedMapStateCache.current.size > MAX_CACHED_MAP_PREVIEWS) {
      const oldest = decodedMapStateCache.current.keys().next().value;
      if (oldest !== undefined) decodedMapStateCache.current.delete(oldest);
    }
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
          mapState: preview.mapState,
          previousMapState: preview.previousMapState,
          current: decodeMapState(preview.mapState),
          previous: preview.previousMapState
            ? decodeMapState(preview.previousMapState)
            : undefined,
          movementState: preview.movementState,
          retreats: preview.retreats ?? [],
          combats: preview.combats ?? [],
          activeFaction: preview.activeFaction,
          tacticalPosition: preview.tacticalPosition,
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
      setDecalOverrides((prev) => {
        if (decalId === null) {
          const updated = { ...prev };
          delete updated[faction];
          return updated;
        }
        return { ...prev, [faction]: decalId };
      });
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
      setColorOverrides((prev) => {
        if (colorAlias === null) {
          const updated = { ...prev };
          delete updated[faction];
          return updated;
        }
        return { ...prev, [faction]: colorAlias };
      });
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
  const displacedData = useMemo(() => {
    if (!data) return undefined;
    return applyDisplacementToPlayerData(data, draft);
  }, [data, draft]);

  const liveEnhancedData = useMemo(() => {
    if (!displacedData) return undefined;
    return buildGameContext(displacedData, accessibleColors, decalOverrides);
  }, [displacedData, accessibleColors, decalOverrides]);

  // Preview states are immutable and identified by their deterministic compact
  // string. Reusing their built contexts avoids repeating tile enrichment and
  // unit placement work when the pointer returns to a previously viewed frame.
  const previewContextCache = useMemo(
    () => new Map<string, ReturnType<typeof buildGameContext>>(),
    [displacedData, accessibleColors, decalOverrides],
  );

  const getPreviewContext = useCallback(
    (
      serialized: string,
      tileUnitData: ReturnType<typeof deserializeCompactMapState>,
    ) => {
      const cached = previewContextCache.get(serialized);
      if (cached) {
        previewContextCache.delete(serialized);
        previewContextCache.set(serialized, cached);
        return cached;
      }
      if (!displacedData) return undefined;

      const context = buildGameContext(
        { ...displacedData, tileUnitData },
        accessibleColors,
        decalOverrides,
      );
      previewContextCache.set(serialized, context);
      if (previewContextCache.size > MAX_CACHED_MAP_PREVIEWS) {
        const oldest = previewContextCache.keys().next().value;
        if (oldest !== undefined) previewContextCache.delete(oldest);
      }
      return context;
    },
    [
      displacedData,
      accessibleColors,
      decalOverrides,
      previewContextCache,
    ],
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
  }, [
    replayAnimationsEnabled,
    mapStatePreview?.current,
    mapStatePreview?.previous,
  ]);

  const mapReplayPlan = useMemo(
    () => {
      if (!replayAnimationsEnabled) return EMPTY_MAP_REPLAY_PLAN;
      return buildMapReplayPlan(previousEnhancedData, enhancedData, {
        movementState: mapStatePreview?.movementState,
        retreats: mapStatePreview?.retreats,
        combats: mapStatePreview?.combats,
        activeFaction: mapStatePreview?.activeFaction,
        tacticalPosition: mapStatePreview?.tacticalPosition,
        alwaysShowControlTokens,
        changedPositions,
      });
    },
    [
      replayAnimationsEnabled,
      previousEnhancedData,
      enhancedData,
      mapStatePreview?.movementState,
      mapStatePreview?.retreats,
      mapStatePreview?.combats,
      mapStatePreview?.activeFaction,
      mapStatePreview?.tacticalPosition,
      alwaysShowControlTokens,
      changedPositions,
    ],
  );

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
      error,
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

export type {
  FactionImageMap,
  FactionColorMap,
  FactionColorData,
  GameData,
  Tile,
  PrePlacementTile,
  TilePlanet,
} from "./types";

export { buildGameContext } from "./utils/buildGameContext";
export { hasTechSkips } from "@/utils/tileDistances";
