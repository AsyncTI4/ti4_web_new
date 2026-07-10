import { createContext, useMemo, useState, useCallback } from "react";
import { useSettingsStore } from "@/utils/appStore";
import { usePlayerDataSocket } from "@/hooks/usePlayerData";
import { useMovementStore } from "@/utils/movementStore";
import { applyDisplacementToPlayerData } from "@/utils/displacement";
import { buildGameContext } from "./utils/buildGameContext";
import type { GameContext, Props } from "./types";
import { deserializeCompactMapState } from "@/utils/compactMapState";

export function GameContextProvider({ children, gameId }: Props) {
  const { data, isLoading, isError, isReconnecting, readyState, reconnect } =
    usePlayerDataSocket(gameId);
  const accessibleColors = useSettingsStore((s) => s.settings.accessibleColors);

  const draft = useMovementStore((s) => s.draft);

  const [decalOverrides, setDecalOverrides] = useState<Record<string, string>>(
    {},
  );

  const [colorOverrides, setColorOverrides] = useState<Record<string, string>>(
    {},
  );

  const [mapStatePreview, setMapStatePreviewData] = useState<
    ReturnType<typeof deserializeCompactMapState> | undefined
  >();

  const setMapStatePreview = useCallback((mapState: string | null) => {
    if (mapState === null) {
      setMapStatePreviewData(undefined);
      return;
    }
    try {
      setMapStatePreviewData(deserializeCompactMapState(mapState));
    } catch (error) {
      console.error("Unable to preview compact event map state", error);
      setMapStatePreviewData(undefined);
    }
  }, []);

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

  const adjustedData = useMemo(() => {
    if (!data) return undefined;
    const displacedData = applyDisplacementToPlayerData(data, draft);
    return mapStatePreview
      ? { ...displacedData, tileUnitData: mapStatePreview }
      : displacedData;
  }, [data, draft, mapStatePreview]);

  const enhancedData = useMemo(() => {
    if (!adjustedData) return undefined;
    return buildGameContext(adjustedData, accessibleColors, decalOverrides);
  }, [adjustedData, accessibleColors, decalOverrides]);

  const gameContext: GameContext = {
    data: enhancedData,
    dataState: {
      isLoading,
      isError,
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
  };

  return (
    <EnhancedDataContext.Provider value={gameContext}>
      {children}
    </EnhancedDataContext.Provider>
  );
}

export const EnhancedDataContext = createContext<GameContext | undefined>(
  undefined,
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
