import type { PlayerData } from "@/data/types";
import { useUser } from "./useUser";
import { useGameData } from "./useGameContext";

/**
 * Centralizes the logic for determining if the current user can view secret-hand data.
 * Also exposes commonly needed identifiers for downstream components.
 */
export function useSecretHandAccess(playerDataOverride?: PlayerData[] | null) {
  const { user } = useUser();
  const gameData = useGameData();
  const playerData = playerDataOverride ?? gameData?.playerData;

  const userId = user?.id ?? null;
  const userDiscordId = user?.discord_id ?? null;
  const isUserAuthenticated = Boolean(user?.authenticated && user?.token);
  const isInGame = Boolean(
    playerData?.some((player) => player.discordId === userDiscordId),
  );
  const canViewSecretHand = isUserAuthenticated && isInGame;

  return {
    userId,
    userDiscordId,
    isUserAuthenticated,
    isInGame,
    canViewSecretHand,
  };
}
