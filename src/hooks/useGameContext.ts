import { useContext } from "react";
import { EnhancedDataContext } from "@/app/providers/context/GameContextProvider";
import type { buildGameContext } from "@/app/providers/context/utils/buildGameContext";
import type { GameDataState } from "@/app/providers/context/types";

export function useGameContext():
  | ReturnType<typeof buildGameContext>
  | undefined {
  const contextValue = useContext(EnhancedDataContext);
  return contextValue?.data;
}

export function useGameDataState(): GameDataState | undefined {
  const contextValue = useContext(EnhancedDataContext);
  return contextValue?.dataState;
}

// Simple alias for clarity in components
export function useGameData(): ReturnType<typeof useGameContext> {
  return useGameContext();
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
