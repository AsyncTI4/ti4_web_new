import { VersionBadge } from "@/shared/ui/VersionBadge";
import { useGameData, useGameDataState } from "@/state/useGameContext";
import { useGameState } from "@/api/useGameState";
import { usePlayerHand } from "@/domains/game-shell/components/SecretHand/usePlayerHand";
import { useSecretHandAccess } from "@/domains/game-shell/components/SecretHand/useSecretHandAccess";
import { buildGameDebugReport } from "@/domains/game-shell/debug/buildGameDebugReport";

/**
 * The version badge for the game page, pinned bottom-left (the hand docks
 * bottom-right). Clicking copies the whole game state, plus the viewer's own
 * hand when they are logged in and seated, as a readable debug report.
 */
export function GameVersionBadge({ gameId }: { gameId: string }) {
  const data = useGameData();
  const dataState = useGameDataState();
  const { data: gameState } = useGameState(gameId);
  const { canViewSecretHand, userDiscordId } = useSecretHandAccess();
  const hand = usePlayerHand(gameId);

  const getReport = () =>
    buildGameDebugReport({
      gameId,
      data,
      dataState,
      gameState,
      viewerDiscordId: userDiscordId,
      hand: {
        canView: canViewSecretHand,
        data: hand.data,
        isLoading: hand.isLoading,
        error: hand.error,
      },
    });

  return <VersionBadge floating getReport={getReport} />;
}
