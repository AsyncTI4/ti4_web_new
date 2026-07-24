import { useContext } from "react";
import {
  EnhancedDataContext,
  GameDataContext,
  MapStatePreviewDispatchContext,
  MapReplayContext,
} from "@/app/providers/context/GameContextProvider";
import type { buildGameContext } from "@/app/providers/context/utils/buildGameContext";
import type {
  GameDataState,
  MapReplayState,
  MapStatePreview,
} from "@/app/providers/context/types";
import { useFowViewStore } from "@/utils/fowViewStore";
import { useUser } from "@/hooks/useUser";

export function useGameContext():
  | ReturnType<typeof buildGameContext>
  | undefined {
  return useContext(GameDataContext);
}

export function useGameDataState(): GameDataState | undefined {
  const contextValue = useContext(EnhancedDataContext);
  return contextValue?.dataState;
}

// Simple alias for clarity in components
export function useGameData(): ReturnType<typeof useGameContext> {
  return useGameContext();
}

/**
 * True only for the GM's own unfiltered view - not while previewing as a specific player.
 * The backend's X-Viewer-Is-Gm header stays true during preview too (so "view as" controls
 * keep showing), so gameData.viewerIsGm alone can't be used to gate FoW-hidden UI: it would
 * keep showing GM-only elements even while the GM is trying to see a player's actual view.
 */
export function useIsTrueGmView(): boolean {
  const gameData = useGameData();
  const viewAsPlayerId = useFowViewStore((state) => state.viewAsPlayerId);
  return Boolean(gameData?.viewerIsGm) && viewAsPlayerId === null;
}

/**
 * Whose view this is, for "is this me?" checks. In FoW the backend's viewingAsPlayerId is
 * authoritative - it's the player the payload was actually redacted for, which also follows a GM
 * previewing someone else's view. Falls back to the logged-in user outside FoW, where the backend
 * doesn't stamp a viewer.
 */
export function useViewerDiscordId(): string | null {
  const gameData = useGameData();
  const { user } = useUser();
  return gameData?.viewingAsPlayerId ?? user?.discord_id ?? null;
}

/**
 * Whether score/objective listings must hide seat order (see computeScoreTier). Only in FoW, and
 * not for the GM's own unfiltered view - the GM already sees every player, so ordering leaks
 * nothing there and they get the same seat-ordered layout as a normal game.
 */
export function useHideScoreOrder(): boolean {
  const gameData = useGameData();
  const isTrueGmView = useIsTrueGmView();
  return Boolean(gameData?.isFowMode) && !isTrueGmView;
}

export function useDecalOverrides(): {
  decalOverrides: Record<string, string>;
  setDecalOverride: (faction: string, decalId: string | null) => void;
  clearDecalOverride: (faction: string) => void;
} {
  const contextValue = useContext(EnhancedDataContext);
  return {
    decalOverrides: contextValue?.decalOverrides ?? {},
    setDecalOverride: contextValue?.setDecalOverride ?? (() => {}),
    clearDecalOverride: contextValue?.clearDecalOverride ?? (() => {}),
  };
}

export function useColorOverrides(): {
  colorOverrides: Record<string, string>;
  setColorOverride: (faction: string, colorAlias: string | null) => void;
  clearColorOverride: (faction: string) => void;
} {
  const contextValue = useContext(EnhancedDataContext);
  return {
    colorOverrides: contextValue?.colorOverrides ?? {},
    setColorOverride: contextValue?.setColorOverride ?? (() => {}),
    clearColorOverride: contextValue?.clearColorOverride ?? (() => {}),
  };
}

export function useMapStatePreview(): (
  preview: MapStatePreview | null,
) => void {
  return useContext(MapStatePreviewDispatchContext);
}

export function useMapReplay(): MapReplayState {
  return useContext(MapReplayContext);
}
