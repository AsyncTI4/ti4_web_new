import { useCallback, useState } from "react";
import type { PlayerData } from "@/data/types";
import { usePlayerHand } from "./usePlayerHand";
import { useSecretHandAccess } from "./useSecretHandAccess";

export type UseSecretHandPanelOptions = {
  gameId: string;
  playerData?: PlayerData[] | null;
};

export function useSecretHandPanel({
  gameId,
  playerData,
}: UseSecretHandPanelOptions) {
  const [isSecretHandCollapsed, setIsSecretHandCollapsed] = useState(false);
  const { data: handData, isLoading: isHandLoading, error: handError } =
    usePlayerHand(gameId);
  const { canViewSecretHand, userDiscordId } = useSecretHandAccess(playerData);

  const toggleSecretHandCollapsed = useCallback(() => {
    setIsSecretHandCollapsed((prev) => !prev);
  }, []);

  return {
    handData,
    isHandLoading,
    handError,
    canViewSecretHand,
    userDiscordId,
    isSecretHandCollapsed,
    toggleSecretHandCollapsed,
  };
}
