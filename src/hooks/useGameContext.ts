import { useContext } from "react";
import { EnhancedDataContext } from "@/context/GameContextProvider";
import type { buildGameContext } from "@/context/GameContextProvider";
import type { GameDataState } from "@/context/GameContextProvider";

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
